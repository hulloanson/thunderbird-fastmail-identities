import { getFastmailAccounts, getFastmailIdentities } from "./fastmail.mjs";
import { upsertIdentities } from "./local.mjs";

const fastmailToThunderbird = (remoteIdentities) =>
  remoteIdentities.map(({ email, name }) => ({
    email,
    name,
  }));

const main = async () => {
  const fastmailAccounts = await getFastmailAccounts();

  for (const account of fastmailAccounts) {
    const identities = await getFastmailIdentities();

    await upsertIdentities(account.id, fastmailToThunderbird(identities));

    // prototyping: controlled dev environment. there's only 1 fastmail account.
    // TODO: handle > 1 fastmail account
    break;
  }
};

main();
