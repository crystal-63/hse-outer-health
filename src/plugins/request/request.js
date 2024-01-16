import axios from "axios";
import { Message } from "element-ui";
// import { baseUrl } from "./requestUrl";
//返回的状态码
// const isNode = process.env.NODE_ENV;

const instance = axios.create({
  // baseURL: "http://121.196.224.33:8060/api",
  baseURL: "http://192.168.129.31:8060/api",
  // isNode === "development" ? "http://121.196.224.33:8060/api" : baseUrl,
  timeout: 10000,
});

instance.interceptors.request.use(
  (config) => {
    console.log("222", config);
    if (config.url !== "/pc/login/pares") {
      //配置token
      let currentUserId = sessionStorage.getItem("currentUserId");
      if (currentUserId) {
        config.headers = {
          ...config.headers,
          currentUserId: currentUserId,
        };
      } else {
        // this.$router.push("/login");
      }
    }

    return config;
  },
  (error) => {
    // 错误抛到业务代码
    error.data = { msg: "" };
    error.data.msg = "服务器异常，请联系管理员！";
    return error;
  }
);

//请求返回之后的处理
instance.interceptors.response.use(
  (res) => {
    const { headers } = res;
    if (res && res.data) {
      const data = res.data;
      //后端接口会返回一些状态,code是根据后端定义的字段来写的
      if (
        headers["content-type"] == "application/octet-stream;charset=UTF-8" ||
        headers["content-type"] ==
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8" ||
        headers["content-type"] == "application/vnd.ms-excel"
      ) {
        const index = headers["content-disposition"].lastIndexOf("=");
        const filename = headers["content-disposition"].substr(index + 1);

        return { data: { filename: filename, data: res.data } };
      } else if (
        data.code == 200 ||
        res.config.responseType === "arraybuffer"
      ) {
        //返回成功
        return res;
      } else if (data.code === 10000) {
        Message.error(data.message);
        return res || null;
      } else {
        Message.error(data.message || "服务器出错!");
        return res || null;
      }
    } else {
      Message.error("请求接口出现异常了");
      // eslint-disable-next-line no-throw-literal
      return res.data || null;
    }
  },
  (error) => {
    if (error && error.response) {
      error.data = { msg: "" };
      switch (error.response.status) {
        case 400:
          error.data.msg = "错误请求";
          Message.error(error.data.msg);
          break;
        case 401:
          error.data.msg = "未授权，请重新登录";
          Message.error(error.data.msg);
          break;
        case 403:
          error.data.msg = "拒绝访问";
          Message.error(error.data.msg);
          break;
        case 404:
          error.data.msg = "请求错误,未找到该资源";
          Message.error(error.data.msg);
          break;
        case 405:
          error.data.msg = "请求方法未允许";
          Message.error(error.data.msg);
          break;
        case 408:
          error.data.msg = "请求超时";
          Message.error(error.data.msg);
          break;
        case 500:
          error.data.msg = "服务器端出错";
          Message.error(error.data.msg);
          break;
        case 501:
          error.data.msg = "网络未实现";
          Message.error(error.data.msg);
          break;
        case 502:
          error.data.msg = "网络错误";
          Message.error(error.data.msg);
          break;
        case 503:
          error.data.msg = "服务不可用";
          Message.error(error.data.msg);
          break;
        case 504:
          error.data.msg = "网络超时";
          Message.error(error.data.msg);
          break;
        case 505:
          error.data.msg = "http版本不支持该请求";
          Message.error(error.data.msg);
          break;
        case 10000:
          Message.error(error.data.msg);
          break;
        default:
          error.data.msg = `连接错误${error.response.status}`;
          Message.error(error.data.msg);
      }
    } else {
      error.data = { msg: "连接到服务器失败" };
      Message.error(error.data.msg);
    }
    return Promise.reject(error);
    // return error
  }
);

function getDownload(url, parms) {
  return new Promise((resolve, reject) => {
    instance
      .get(url, {
        params: parms,
        responseType: "blob",
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

//参数的处理
function getParms(parms) {
  let _parms = "";
  if (Object.is(parms, undefined || null)) {
    _parms = "";
  } else {
    for (const key in parms) {
      if (parms.hasOwnProperty.call(key) && parms[key]) {
        _parms += `${parms[key]}/`;
      }
    }
  }
  if (_parms) _parms = _parms.substr(0, _parms.length - 1);
  return _parms;
}

// {userId : 10,useName : 'test'}  ==>  10/test
//http:localhost:8080/api/getUserByid/10/test
//http:localhost:8080/api/getUserByid
function getRestApi(url, parms) {
  return new Promise((resolve, reject) => {
    instance
      .get(getParms(parms) ? `${url}/${getParms(parms)}` : url)
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export { getRestApi, getParms, getDownload, instance };

// export default instance;
