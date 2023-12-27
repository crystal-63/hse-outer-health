<template>
  <el-menu
    active-text-color="red"
    class="el-menu-vertical-demo"
    style="width: 100%"
    :default-active="active"
    @select="handleSelect"
    @open="handleOpen"
    @close="handleClose"
    :collapse-transition="false"
    :collapse="collapse"
  >
    <Menus :routerList="menuList"></Menus>
  </el-menu>
</template>

<script>
import { defaultStyle } from "./config";
import { mapState } from "vuex";
import { Menus } from "../../components";

export default {
  name: "LeftMenuComponent",
  props: {
    menuList: Array,
    active: String,
  },
  components: {
    Menus,
  },
  data() {
    return {
      defaultStyle,
    };
  },
  computed: mapState({
    collapse: (state) => state.collapse,
  }),
  methods: {
    handleSelect(value) {
      this.$emit("handleSelect", value);
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    parserConfig() {
      const result = [];
      const list = this.menuList;
      for (let i = 0; i < list.length; i++) {
        const menu = list[i];
        //内嵌网页url
        // menu.host = "http://10.13.239.151:8080/";
        const children = menu.children;
        if (children && children.length > 0) {
          result.push(
            <el-submenu index={`${menu.id}`}>
              <template slot="title">
                <i class={`${menu.icon}`}></i>
                <span>{menu.menuName}</span>
              </template>
              {this.parserConfig()}
            </el-submenu>
          );
        } else {
          result.push(
            <el-menu-item index={`${menu.url}`}>
              <i class={`${menu.icon}`}></i>
              <span slot="title">{menu.menuName}</span>
            </el-menu-item>
          );
        }
      }
      return result;
    },
  },
};
</script>