export const sortNewAndExisting = (oldSet, newSet, compareFn) =>
  newSet.reduce(
    ([newAcc, existingAcc], newItem) => {
      const match = oldSet.find((oldItem) => compareFn(oldItem, newItem));
      if (match) {
        existingAcc.push({ prev: match, curr: newItem });
      } else {
        newAcc.push(newItem);
      }
      return [newAcc, existingAcc];
    },
    [[], []]
  );

export const logWTime = (fn, ...args) =>
  fn(`${new Date().toISOString()}:`, ...args);
