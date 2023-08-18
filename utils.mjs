export const sortNewAndExisting = (oldSet, newSet, compareFn) =>
  newSet.reduce(
    ([newAcc, existingAcc], newItem) => {
      const match = oldSet.find((oldItem) => compareFn(oldItem, newItem));
      const acc = match ? existingAcc : newAcc;
      acc.push({ prev: match, curr: newItem });
      return [newAcc, existingAcc];
    },
    [[], []]
  );

export const describeAccount = (account) => {
  return `${account.name} (id: ${account.id})`;
};
