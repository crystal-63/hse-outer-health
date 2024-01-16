export default {
  namespaced: true,
  state: {
    active: "", // 激活的router path
    collapse: false, // 菜单true为折叠
    nowPath: "",
    userInfo: JSON.parse(localStorage.getItem("userInfo")) || {},
    topMenuHeight: 0,
    token: "",
  },
  getters: {
    //get方法
    getActive: (state) => state.active,
    getCollapse: (state) => state.collapse,
    getNowPath: (state) => state.nowPath,
    getUserInfo: (state) => state.userInfo,
    getTopMenuHeight: (state) => state.topMenuHeight,
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

    SET_USER(state, user) {
      localStorage.setItem("userInfo", JSON.stringify(user));
      state.userInfo = user;
    },
    SET_TOPHEIGHT(state, value) {
      state.userInfo = value;
    },
  },
};
