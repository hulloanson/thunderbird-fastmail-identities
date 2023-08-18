import { getToken } from "./token.mjs";

const JMAP_SESSION_RES_URL = "https://api.fastmail.com/jmap/session";

export const JMAP_CAP_CORE = "urn:ietf:params:jmap:core";
export const JMAP_CAP_MAIL = "urn:ietf:params:jmap:mail";
export const JMAP_CAP_SUBMISSION = "urn:ietf:params:jmap:submission";

export const JMAP_CAPABILITIES = [
  JMAP_CAP_CORE,
  JMAP_CAP_MAIL,
  JMAP_CAP_SUBMISSION,
];

export const jmapReq = async (url, fetchOptions = {}) => {
  const token = await getToken();
  const { headers = {}, body, ...otherOptions } = fetchOptions;
  return fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...headers,
    },
    ...otherOptions,

    body: JSON.stringify(body),
  });
};

export const findResponse = (responses, requestId) => {
  const match = responses.find(([_1, _2, id]) => id === requestId);
  if (!match) return null;
  const [_, response] = match;
  return response;
};

export const callJmapMethod = async (
  url,
  method,
  args,
  requestId = "request",
  fetchOptions = {}
) => {
  const responses = (
    await (
      await jmapReq(url, {
        ...fetchOptions,
        body: {
          using: JMAP_CAPABILITIES,
          methodCalls: [[method, args, requestId]],
        },
      })
    ).json()
  ).methodResponses;
  const response = findResponse(responses, requestId);
  if (!response)
    throw new Error(`Server gave no response for jmap method ${method}`);

  return response;
};

export const getSessionResources = async () => {
  return await (await jmapReq(JMAP_SESSION_RES_URL, { method: "GET" })).json();
};
