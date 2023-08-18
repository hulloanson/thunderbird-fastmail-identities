const JMAP_SESSION_RES_URL = "https://api.fastmail.com/jmap/session";

export const JMAP_CAP_CORE = "urn:ietf:params:jmap:core";
export const JMAP_CAP_MAIL = "urn:ietf:params:jmap:mail";
export const JMAP_CAP_SUBMISSION = "urn:ietf:params:jmap:submission";

export const JMAP_CAPABILITIES = [
  JMAP_CAP_CORE,
  JMAP_CAP_MAIL,
  JMAP_CAP_SUBMISSION,
];

const findResponse = (responses, requestId) => {
  const match = responses.find(([_1, _2, id]) => id === requestId);
  if (!match) return null;
  const [_, response] = match;
  return response;
};

export class JmapSession {
  constructor(resourceUrl) {
    this.headers = {};
    this.resourceUrl = resourceUrl;
  }

  setReqHeaders(headers = {}) {
    this.headers = {
      ...this.headers,
      ...headers,
    };
  }

  getReqHeaders() {
    return this.headers;
  }

  req(url, fetchOptions = {}) {
    const { headers = {}, body, ...otherOptions } = fetchOptions;
    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...this.headers,
        ...headers,
      },
      ...otherOptions,

      body: JSON.stringify(body),
    });
  }

  async getResources() {
    return await (
      await this.req(JMAP_SESSION_RES_URL, { method: "GET" })
    ).json();
  }

  async callMethod(
    url,
    method,
    args,
    requestId = "request",
    fetchOptions = {}
  ) {
    const responseJson = await this.req(url, {
      ...fetchOptions,
      body: {
        using: JMAP_CAPABILITIES,
        methodCalls: [[method, args, requestId]],
      },
    });
    const methodResponses = (await responseJson.json()).methodResponses;
    const response = findResponse(methodResponses, requestId);
    if (!response)
      throw new Error(`Server gave no response for jmap method ${method}`);

    return response;
  }
}
