import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
// import Vconsole from "vconsole";
import AFTableColumn from "af-table-column";

// el-dialog 默认点击遮罩为不关闭
ElementUI.Dialog.props.closeOnClickModal.default = false;
Vue.use(ElementUI, { size: "mini" });
import "element-ui/lib/theme-chalk/index.css";
import "./assets/css/common.scss";
import "./assets/icon/iconfont.css";

// new Vconsole();

Vue.config.productionTip = false;
const fontRate = {
  CHAR_RATE: 1.1, // 汉字比率
  NUM_RATE: 0.65, // 数字
  OTHER_RATE: 10, // 除汉字和数字以外的字符的比率
};
const fontSize = 16;
Vue.use(AFTableColumn, { fontRate, fontSize });

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
