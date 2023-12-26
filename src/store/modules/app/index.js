export default {
  namespaced: true,
  state: {
    active: "", // 激活的router path
    collapse: false, // 菜单true为折叠
    nowPath: "",
  },
  getters: {
    //get方法
    getActive: (state) => state.active,
    getCollapse: (state) => state.collapse,
    getNowPath: (state) => state.nowPath,
  },
  mutations: {
    // 变更激活路由
    modifyUrl(state, active) {
      state.active = active;
    },
    // 收缩带单
    toggle(state, status) {
      if (typeof status === "boolean") {
        state.collapse = status;
      } else {
        state.collapse = !state.collapse;
      }
    },
    // 当前路径名称
    changeNowPath(state, path) {
      state.nowPath = path;
    },
  },
};
