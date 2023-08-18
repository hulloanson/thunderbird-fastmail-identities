import { Identities } from "./identities.mjs";
import { sortNewAndExisting } from "./utils.mjs";

const messenger = window.messenger;

export class ThunderbirdIdentities extends Identities {
  constructor(accountId) {
    super();
    this.accountId = accountId;
  }

  async list() {
    return await messenger.identities.list(this.accountId);
  }

  async upsertMultiple(identities) {
    const accountId = this.accountId;
    const localIdentities = await this.list();
    const [newIdentities, existingIdentities] = sortNewAndExisting(
      localIdentities,
      identities,
      (a, b) => a.email === b.email
    );
    // turn identities into formats appropriate for identities.create and identities.update
    const toCreate = newIdentities.map(({ email, name }) => ({ email, name }));
    const toUpdate = existingIdentities.map(({ prev: local, curr: remote }) => [
      local.id,
      { name: remote.name, email: remote.email },
    ]);

    const insertedIdentities = await Promise.all(
      toCreate.map((identity) =>
        messenger.identities.create(accountId, identity)
      )
    );
    console.log("inserted identities", insertedIdentities);
    const updatedIdentities = await Promise.all(
      toUpdate.map((record) => messenger.identities.update(...record))
    );
    console.log("updated identities", updatedIdentities);
  }
}
