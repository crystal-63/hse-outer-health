<template>
  <div>
    <template v-for="item in routerList">
      <el-submenu
        v-if="
          item.hasOwnProperty('children') &&
          item.children &&
          item.children.length > 0
        "
        :key="item.id"
        :index="item.id"
      >
        <template slot="title">
          <i :class="item.icon"></i>
          <span slot="title">{{ item.menuName }}</span>
        </template>
        <!--  如果有子级数据使用递归组件 -->
        <MyMenus :routerList="item.children"></MyMenus>
      </el-submenu>
      <el-menu-item v-else :index="item.url" :key="item.url">
        <i :class="item.icon"></i>
        <span>{{ item.menuName }}</span>
      </el-menu-item>
    </template>
  </div>
</template>
 
<script>
export default {
  name: "MyMenus",
  props: {
    routerList: Array,
  },
};
</script>
