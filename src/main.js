import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "./assets/css/common.scss";
import "./assets/icon/iconfont.css";

// el-dialog 默认点击遮罩为不关闭
ElementUI.Dialog.props.closeOnClickModal.default = false;
Vue.use(ElementUI, { size: "mini" });

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
