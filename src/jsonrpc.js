const defaultConfig = {
  debug: false,
};

const defaultHeaders = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
};

export class JsonRpcClient {
  constructor({ endpoint = '/rpc', headers = {}, config }) {
    this.lastId = 0;
    this.endpoint = endpoint;
    this.config = Object.assign({}, defaultConfig, config);
    this.headers = Object.assign({}, defaultHeaders, headers);
  }

  request(method, params, headers) {
    const id = this.lastId++;

    const req = {
      method: 'POST',
      headers: Object.assign({}, this.headers, headers),
      body: JSON.stringify({
        jsonrpc: '2.0',
        id,
        method,
        params: params,
      }),
    };

    if (this.config.debug === true) {
      // eslint-disable-next-line no-console
      console.log('Executing request', this.lastId, 'to', this.endpoint, ':', req);
    }

    return fetch(this.endpoint, req)
      .then(res => checkStatus(res))
      .then(res => parseJSON(res))
      .then(res => checkError(res, req, this.config.debug))
      .then(res => logResponse(res, this.config.debug));
  }
}

function parseJSON(response) {
  return response.json();
}

function checkStatus(response) {
  // we assume 400 as valid code here because it's the default return code 