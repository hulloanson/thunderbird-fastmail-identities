import { FastmailIdentities } from "./fastmail.mjs";
import { ThunderbirdIdentities } from "./thunderbird.mjs";
import { logWTime } from "./utils.mjs";
import { logResults } from "./outputs.mjs";

const importFastmailIdentities = async () => {
  logWTime(console.log, "Importing fastmail identities");
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
      logWTime(
        console.log,
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
      logWTime(
        console.error,
        `Failed to import identities for ${account.id} (name: ${account.name})`
      );
      failedAccounts.push(account);
    }
  }
  logResults(importedAccounts, skippedAccounts, failedAccounts);
  logWTime(console.log, "Imported fastmail identities");
};

// TODO: get interval from settings
const getInterval = async () => 5 * 60 * 1000;

const perodicImportIdentities = async () => {
  const interval = await getInterval();
  try {
    importFastmailIdentities();
  } catch (e) {
    logWTime(console.error, ": Periodic import identities: error thrown", e);
  }
  setTimeout(perodicImportIdentities, interval);
};

const main = async () => {
  perodicImportIdentities();
};

main();
