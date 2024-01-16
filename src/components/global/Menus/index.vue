<template>
  <el-submenu v-if="
          item.hasOwnProperty('children') &&
          item.children &&
          item.children.length > 0
        " :key="item.id" :index="item.id">
    <template slot="title">
      <i :class="item.icon"></i>
      <span slot="title">{{ item.menuName }}</span>
    </template>
    <!--  如果有子级数据使用递归组件 -->
    <MyMenus v-for="items in item.children" :key="items.id" :item="items"></MyMenus>
  </el-submenu>
  <el-menu-item v-else :index="item.url" :key="item.url">
    <i :class="item.icon"></i>
    <span slot="title">{{ item.menuName }}</span>
  </el-menu-item>
</template>
 
<script>
export default {
  name: "MyMenus",
  props: {
    item: Object,
  },
};
</script>
