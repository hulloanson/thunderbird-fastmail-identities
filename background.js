import { FastmailIdentities } from "./fastmail.mjs";
import { ThunderbirdIdentities } from "./thunderbird.mjs";
import { describeAccount } from "./utils.mjs";

const describeAccounts = (accounts) => {
  return accounts.map(describeAccount).join("<br />");
};

const summarizeResults = (imported, skipped, failed) => {
  return Object.entries({
    "Imported accounts": imported,
    "Skipped accounts": skipped,
    "Failed accounts": failed,
  })
    .reduce((acc, [desc, accounts]) => {
      if (accounts.length > 0) {
        acc.push(desc, describeAccounts(accounts));
      }
      return acc;
    }, [])
    .join("<br /><br />");
};

const notifyResults = (imported, skipped, failed) => {
  browser.notifications.create("", {
    type: "basic",
    title:
      imported.length > 0 ? "Imported identities" : "No identities imported.",
    message: summarizeResults(imported, skipped, failed),
  });
};

const importFastmailIdentities = async () => {
  const localAccounts = await window.messenger.accounts.list();

  const importedAccounts = [];
  const skippedAccounts = [];
  const failedAccounts = [];
  for (const account of localAccounts) {
    let fastmailIdentities = null,
      thunderbirdIdentities = null;

    try {
      fastmailIdentities = await FastmailIdentities.fromAccountName(
        account.name
      );
      thunderbirdIdentities = new ThunderbirdIdentities(account);
      console.log(
        `Found Fastmail account matching local account ${account.name}`
      );
    } catch (e) {
      console.info(
        `Did not find ${account.name} using the provided Fastmail api token. Skipping. Note Thunderbird account name must match Fastmail account name for this extension to associate them.`
      );
      skippedAccounts.push(account);
      continue;
    }
    try {
      const identities = await fastmailIdentities.list();
      thunderbirdIdentities.upsertMultiple(identities);
      importedAccounts.push(account);
    } catch (e) {
      console.error(
        `Failed to import identities for ${account.id} (name: ${account.name})`
      );
      failedAccounts.push(account);
    }
  }
  notifyResults(importedAccounts, skippedAccounts, failedAccounts);
};

importFastmailIdentities();
