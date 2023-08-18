import { Identities } from "./identities.mjs";
import { JMAP_CAP_SUBMISSION, JmapSession } from "./jmap.mjs";
import { getToken } from "./token.mjs";

const FASTMAIL_JMAP_SESSION_RES_URL = "https://api.fastmail.com/jmap/session";

export class FastmailSession extends JmapSession {
  constructor(apiToken) {
    super(FASTMAIL_JMAP_SESSION_RES_URL);
    this.setApiToken(apiToken);
  }

  setApiToken(token) {
    this.apiToken = token;
    this.setReqHeaders({
      Authorization: `Bearer ${this.apiToken}`,
    });
  }
}

const fastmailToThunderbird = (fastmailIdentities) =>
  fastmailIdentities.map(({ email, name }) => ({
    email,
    name,
  }));

export class FastmailIdentities extends Identities {
  static async fromAccountName(accountName) {
    const token = await getToken();
    const session = new FastmailSession(token);
    const resources = await session.getResources();
    const match = Object.entries(resources.accounts).find(
      ([_, account]) => accountName === account.name
    );
    if (!match) throw new Error(`Fastmail account ${accountName} not found`);

    const [accountId, account] = match;

    if (!Object.keys(account.accountCapabilities).includes(JMAP_CAP_SUBMISSION))
      throw new Error(
        `${JMAP_CAP_SUBMISSION} is needed to work with identities, but Fastmail account ${accountName} has none.`
      );

    return new FastmailIdentities(accountId, token);
  }
  constructor(accountId, apiToken) {
    super();
    this.accountId = accountId;
    this.session = new FastmailSession(apiToken);
  }

  async list() {
    const sessionResources = await this.session.getResources();

    const jmapApiBase = sessionResources.apiUrl;
    const { list: identities } = await this.session.callMethod(
      jmapApiBase,
      "Identity/get",
      {
        accountId: this.accountId,
      }
    );
    const fastmailIdentities = identities.map(({ email, id, name }) => ({
      email,
      id,
      name,
    }));
    return fastmailToThunderbird(fastmailIdentities);
  }
}

export const getFastmailAccountsIds = async () => {
  // TODO: get fastmail account ids as marked by user
  return ["account1"];
};

export const getThunderbirdFastmailAccounts = async () => {
  // TODO: get actual fastmail account using fastmail's jmap api
  const fastmailAccountIds = await getFastmailAccountsIds();
  return (await window.messenger.accounts.list()).filter((account) =>
    fastmailAccountIds.includes(account.id)
  );
};
