import instance from "./interceptors";
// 获取实例
const request = new instance();

const httpServer = (opts) => {
  let method = "",
    params,
    data,
    mainOptions = {};

  if (opts.method) {
    method = opts.method.toLocaleUpperCase();
    mainOptions["method"] = method;
  } else throw new Error("request method error !!!");
  if (opts.url) mainOptions["url"] = opts.url;
  else throw new Error("request url error !!!");
  if (opts.params) params = opts.params;
  else params = null;
  if (opts.data) data = opts.data;
  else data = null;
  if (opts.headers) mainOptions["headers"] = opts.headers;

  if (method == "GET") mainOptions["params"] = params;
  else if (method == "POST") {
    if (params) mainOptions["params"] = params;
    if (data) mainOptions["data"] = data;
  }
  return new Promise((resolve, reject) => {
    request(mainOptions)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        reject(e);
      });
  });
};

export default httpServer;
