import { sortNewAndExisting } from "./utils.mjs";

const messenger = window.messenger;

export const getIdentities = async (accountId) => {
  return await messenger.identities.list(accountId);
};

export const upsertIdentities = async (accountId, incomingIdentities) => {
  const localIdentities = await getIdentities(accountId);
  const [newIdentities, existingIdentities] = sortNewAndExisting(
    localIdentities,
    incomingIdentities,
    (a, b) => a.email === b.email
  );
  // turn identities into formats appropriate for identities.create and identities.update
  const toCreate = newIdentities.map(({ email, name }) => ({ email, name }));
  const toUpdate = existingIdentities.map(({ prev: local, curr: remote }) => [
    local.id,
    { name: remote.name, email: remote.email },
  ]);

  const insertedIdentities = await Promise.all(
    toCreate.map((identity) => messenger.identities.create(accountId, identity))
  );
  console.log("inserted identities", insertedIdentities);
  const updatedIdentities = await Promise.all(
    toUpdate.map((record) => messenger.identities.update(...record))
  );
  console.log("updated identities", updatedIdentities);
};
