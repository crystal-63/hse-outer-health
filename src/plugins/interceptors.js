import Axios from "axios";
import { Message } from "element-ui";
import router from "../router/index";

const instance = Axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
  timeout: 10000,
});

instance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers["Token"] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截
this.instance.interceptors.response.use(
  (response) => {
    const { status, data } = response;
    if (status == 200) {
      const resop = {
        success: data.meta.success,
        message: data.meta.message,
        data: data.data,
      };
      if (!resop.success) {
        if (resop.message) {
          Message({
            type: "error",
            message: resop.message,
          });
        } else {
          Message({
            type: "error",
            message: "系统繁忙！",
          });
        }
        const { statusCode } = data.meta;
        if (statusCode == 0) {
          router.push("/login");
          return;
        }
      }
      return resop;
    } else {
      return response;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
