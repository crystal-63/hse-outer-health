<template>
  <div class="page-content">
    <!-- <div class="head-back">
      <div class="head-left">
        <div class="page-logo"></div>
      </div>
      <div class="head-content">
        <el-menu default-active="1" class="el-menu-demo" mode="horizontal">
          <el-menu-item index="1">职业健康</el-menu-item>
        </el-menu>
      </div>
      <div class="head-right">
        <el-dropdown style="width: 100%; height: 100%">
          <span class="el-dropdown-link">
            <el-avatar style="margin-right: 10px" size="small" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
            {{ userInfo.name }}
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item style="width: 150px;padding: 10px" @click.native="loginOut()">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>-->
    <div class="bottom-back">
      <div class="left-query" :style="menuStyle">
        <div :style="iconStyle">
          <my-icon @click="iconClick(icon)" class="my-left-icon" v-for="(icon, i) in headerLeftIcons" :font="icon.font" :color="icon.color" :icon="icon.icon" padding="10px" :key="icon.icon + i"></my-icon>
          <left-menu @handleSelect="select" :menuList="childrenList" :active="name"></left-menu>
        </div>
      </div>
      <div class="right-port">
        <div class="view-port" style="overflow: auto" v-if="activeIndex == 1">
          <router-view></router-view>
        </div>
        <div class="view-port" v-else>
          <iframe v-if="isRouterAlive" :src="nowPathUrl" id="maincontent"></iframe>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LeftMenu from "./leftMenu/index.vue";
import { MENU_WIDTH, headerLeftIcons, headerRightIcons } from "./layout.config";
import { MyIcon } from "../components/index";
import { menuList } from "./leftMenu/config";

export default {
  name: "LayOutComponent",
  components: {
    LeftMenu,
    MyIcon,
  },

  data() {
    return {
      menuList: menuList,
      childrenList: [],
      headerLeftIcons,
      headerRightIcons,
      activeIndex: 1,
      nowPathUrl: "",
      loading: false,
      leftchange: false,
      rightchange: true,
      name: "",
      isRouterAlive: true,
      timer: null,
    };
  },

  computed: {
    userInfo: function () {
      return this.$store.getters.getUserInfo;
    },
    collapse: function () {
      return this.$store.getters.getCollapse;
    },
    menuStyle: function () {
      const style = {
        "overflow-y": "auto",
        width: "64px",
      };
      const status = this.collapse;
      !status && (style.width = MENU_WIDTH);
      return style;
    },
    iconStyle: function () {
      const style = {
        display: "flex",
        "justify-content": "center",
        width: "64px",
        flexDirection: "column",
      };
      const status = this.collapse;
      !status && (style.width = MENU_WIDTH);
      return style;
    },
  },

  created() {
    this.getLeftList();
  },

  methods: {
    destroyed() {
      clearInterval(this.timer);
    },

    reload() {
      this.isRouterAlive = false;
      this.$nextTick(() => {
        this.isRouterAlive = true;
      });
    },

    select(path) {
      // (document.getElementById("maincontent") as any).src = "";
      // return
      console.log("path", path);
      // const token = getToken();
      const path1 = sessionStorage.getItem("path");
      const token = sessionStorage.getItem("token");
      if (path1 && token) {
        this.name = path1;
        this.$router.push(path1);
        return;
      }
      if (this.activeIndex == 1) {
        const index = path.lastIndexOf("#");
        const url = path.substring(index + 1, path.length);
        this.$router.push(url);
      } else {
        // this.nowPathUrl = path + "?token=" + token;
        // this.reload();
      }
    },

    // 左侧菜单伸缩
    iconClick(icon) {
      console.log("icon", icon, this.$store.getters);
      if (icon.type == "collapse") {
        this.$store.commit("toggle", !this.collapse);
      }
    },

    getLeftList() {
      this.childrenList = menuList;
      this.name = this.childrenList[0].url;
      this.select(this.childrenList[0].url);
    },
    loginOut() {
      console.log(12312312);
      sessionStorage.removeItem("currentUserId");
      this.$router.push("/login");
    },
  },
};
</script>

<style lang="scss" scoped>
.page-content {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}
.head-content {
  width: 100%;
}
.el-menu-demo {
  width: fit-content;
  height: 100%;
}
.el-menu-item {
  height: 40px;
  line-height: 42px;
  color: #fff;
}
.el-menu--horizontal > .el-menu-item.is-active {
  color: red;
}

.head-back {
  height: 40px;
  width: 100%;
  background-color: #c54b3e;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.head-left {
  display: flex;
  align-items: center;
  padding: 0;
}

.header-content {
  display: flex;
}

.head-right {
  width: 150px;
  height: 100%;
  padding: 3px 10px;
  cursor: pointer;
  .el-dropdown-link {
    width: 100%;
    height: 100%;
    color: #fff;
    font-size: 16px;
    display: flex;
    align-items: center;
  }
}

.page-logo {
  width: 240px;
  height: 40px;
  display: flex;
  align-items: center;
  background: url("../assets/img/topleft.png");
  background-size: 100% 100%;
}

.bottom-back {
  display: flex;
  flex: 1 1 auto;
  height: 0;
}
.out-content {
  flex: 1 1 auto;
  height: 0;
}

.icon-title {
  font-family: cursive;
  font-size: 22px;
  color: #fff;
  user-select: none;
}
.span-font {
  color: white;
  font-size: 15px;
}

.left-query {
  overflow: auto;
  transition: width 0.5s;
}
.header-left-icon {
  display: flex;
  align-items: center;
  padding: 0 10px;
  cursor: pointer;
}
.right-port {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  width: 0;
  background-color: #e8edf7;
  .head-content {
    height: 50px;
    width: 100%;
    display: flex;
    align-items: center;
    font-size: 13px;
    color: #666;
  }
  .view-port {
    height: 100%;
    width: 100%;
    padding-left: 15px;
    padding-right: 15px;
    overflow: hidden;
  }
}

iframe {
  height: 100%;
  width: 100%;
  border: none;
}

.header-menu {
  height: 50px;
  position: absolute;
  padding-right: 80px;
  left: 240px;
  .menu-tools {
    position: absolute;
    right: 40px;
    top: 0;
    width: 24px;
    padding-top: 14px;
    white-space: nowrap;
  }
  .header-menu-wrap {
    width: 1026px;
    overflow: hidden;
  }
  ul {
    overflow: hidden;
    white-space: nowrap;
    width: 500%;
    transition-duration: 0.5s;
    transform: translate3d(0px, 0px, 0px);
  }
  li {
    margin-left: 37px;
    float: left;
    a {
      display: block;
      padding: 0 10px;
      line-height: 50px;
      height: 50px;
      text-align: center;
      color: #4a4a4a;
      border-bottom: 3px solid transparent;
      font-size: 14px;
      cursor: pointer;
    }
    a:hover {
      color: #d8462c;
      border-bottom-color: #d8462c;
      font-weight: bold;
    }
  }
}

.liactive {
  a {
    color: #d8462c !important;
    border-bottom-color: #d8462c !important;
    font-weight: bold !important;
  }
}

ul,
ol {
  padding: 0;
  margin: 0;
  list-style: none;
}

.iactive {
  color: #b4b4b4 !important;
}
</style>