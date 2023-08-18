import {
  JMAP_CAP_SUBMISSION,
  callJmapMethod,
  getSessionResources,
} from "./jmap.mjs";

export const getFastmailAccountsIds = async () => {
  // TODO: get actual fastmail account using fastmail's jmap api
  return ["account1"];
};

export const getFastmailAccounts = async () => {
  // TODO: get actual fastmail account using fastmail's jmap api
  const fastmailAccountIds = await getFastmailAccountsIds();
  return (await window.messenger.accounts.list()).filter((account) =>
    fastmailAccountIds.includes(account.id)
  );
};

export const getFastmailIdentities = async () => {
  const sessionResources = await getSessionResources();
  const accountId = sessionResources.primaryAccounts[JMAP_CAP_SUBMISSION];
  const jmapApiBase = sessionResources.apiUrl;
  const requestId = "identityGet";
  const { list: identities } = await callJmapMethod(
    jmapApiBase,
    "Identity/get",
    {
      accountId,
    },
    requestId
  );
  return identities.map(({ email, id, name }) => ({ email, id, name }));
};
