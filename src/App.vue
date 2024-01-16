<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { tools } from "./utils";
import { common } from "./api";

export default {
  name: "App",
  created() {
    const token = tools.getUrlQueryString("token");
    if (token) {
      this.getToken();
    }
  },
  methods: {
    async getToken() {
      const token =
        sessionStorage.getItem("token") || tools.getUrlQueryString("token");
      await common.loginResolveToken({ token }).then((res) => {
        if (res.data.data) {
          localStorage.setItem("userInfo", res.data.data);
          sessionStorage.setItem("currentUserId", res.data.data.id);
          this.$store.commit("SET_USER", res.data.data);
          localStorage.setItem("xfm_username", res.data.data.no);
          sessionStorage.removeItem("token");
          this.$router.push("/pages");
        } else {
          this.$router.push("/login");
        }
      });
    },
  },
};
</script>

<style lang="scss">
#app {
  height: 100%;
  width: 100%;
}
body {
  overflow: hidden;
}
/* 解决element-ui的table表格控件表头与内容列不对齐问题 */

.el-table th.gutter {
  display: table-cell !important;
}
</style>
