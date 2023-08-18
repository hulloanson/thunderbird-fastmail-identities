import { FastmailIdentities } from "./fastmail.mjs";
import { ThunderbirdIdentities } from "./thunderbird.mjs";

const importFastmailIdentities = async () => {
  const localAccounts = await window.messenger.accounts.list();

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
      continue;
    }
    const identities = await fastmailIdentities.list();
    thunderbirdIdentities.upsertMultiple(identities);
  }
};

importFastmailIdentities();
