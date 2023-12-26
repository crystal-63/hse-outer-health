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
    <el-menu-item index="/pages/systemArchives">
      <i class="el-icon-menu"></i>
      <span slot="title">职业健康管理制度档案</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
import { defaultStyle } from "./config";
import { mapState } from "vuex";

export default {
  name: "LeftMenuComponent",
  props: {
    menuList: Array,
    active: String,
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
  },
};
</script>