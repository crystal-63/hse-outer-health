<template>
  <div class="page-content">
    <div class="bottom-back">
      <div class="left-query" :style="menuStyle">
        <div :style="iconStyle">
          <my-icon
            @click="iconClick(icon)"
            class="my-left-icon"
            v-for="(icon, i) in headerLeftIcons"
            :font="icon.font"
            :color="icon.color"
            :icon="icon.icon"
            padding="10px"
            :key="icon.icon + i"
          ></my-icon>
          <left-menu
            @handleSelect="select"
            :menuList="childrenList"
            :active="name"
          ></left-menu>
        </div>
      </div>
      <div class="right-port">
        <div class="view-port" style="overflow: auto" v-if="activeIndex == 1">
          <router-view></router-view>
        </div>
        <div class="view-port" v-else>
          <iframe
            v-if="isRouterAlive"
            :src="nowPathUrl"
            id="maincontent"
          ></iframe>
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
  display: flex;
  align-items: center;
  cursor: pointer;
}

.page-logo {
  width: 220px;
  display: flex;
  align-items: center;
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