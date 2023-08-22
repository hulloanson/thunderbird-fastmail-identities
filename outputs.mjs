const describeAccount = (account) => {
  return `${account.name} (id: ${account.id})`;
};

export const describeAccounts = (accounts) => {
  return accounts.map(describeAccount).join("<br />");
};

export const summarizeResults = (
  imported,
  skipped,
  failed,
  { lineSeparator = "<br /><br />" } = {}
) => {
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
    .join(lineSeparator);
};

export const notifyResults = (imported, skipped, failed) => {
  browser.notifications.create("", {
    type: "basic",
    title:
      imported.length > 0 ? "Imported identities" : "No identities imported.",
    message: summarizeResults(imported, skipped, failed),
  });
};

export const logResults = (imported, skipped, failed) => {
  const message = summarizeResults(imported, skipped, failed, {
    lineSeparator: "\n",
  });
  console.log(message);
};
