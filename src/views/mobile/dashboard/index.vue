<template>
  <div class="pageContainer">
    <div class="app-top">
      <el-avatar :size="40" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
      <div class="user_name">{{ userInfo.name }}</div>
      <MyIcon class="el-icon-arrow-right right_icon" :font="20"></MyIcon>
    </div>
    <div class="app-list">
      <!-- <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>审核</span>
        </div>
        <el-row>
          <el-col :span="6" v-for="item in mobileMenuList1" :key="item.id" class="item" @click.native="() => handleTurn(item.url)">
            <el-image style="width: 48px; height: 48px" :src="menuListIcon.get(item.icon)"></el-image>
            <span style="font-size: 14px;text-align: center; padding: 5px 0 0;">{{ item.menuName }}</span>
          </el-col>
        </el-row>
      </el-card>-->
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>职业健康</span>
        </div>
        <el-row>
          <el-col :span="6" v-for="item in mobileMenuList" :key="item.id" class="item" @click.native="() => handleTurn(item.url)">
            <el-image style="width: 48px; height: 48px" :src="menuListIcon.get(item.icon)"></el-image>
            <span style="font-size: 14px;text-align: center; padding: 5px 0 0;">{{ item.menuName }}</span>
          </el-col>
        </el-row>
      </el-card>
    </div>
    <!-- <div class="app-footer">
      <el-row>
        <el-col :span="12">
          <MyIcon :font="el-icon-arrow-right"></MyIcon>工作台
        </el-col>
        <el-col :span="12"></el-col>
      </el-row>
    </div>-->
  </div>
</template>

<script>
import { MyIcon } from "../../../components";
import { mapState } from "vuex";
import { mobileMenuList, menuListIcon, mobileMenuList1 } from "./data";

export default {
  name: "MenuHome",
  components: {
    MyIcon,
  },
  data() {
    return {
      mobileMenuList,
      menuListIcon,
      mobileMenuList1,
    };
  },
  computed: mapState({
    userInfo: (state) => state.userInfo,
  }),
  methods: {
    handleTurn(path) {
      console.log("patn", path);
      this.$router.push(path);
    },
  },
};
</script>

<style lang="scss" scoped>
.pageContainer {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #f5f6f8;
}
.app-top {
  width: 100%;
  height: 50px;
  padding: 5px 20px;
  display: flex;
  align-items: center;
  background: #fff;
  .user_name {
    margin-left: 10px;
    margin-top: 5px;
  }
  .right_icon {
    position: absolute;
    right: 15px;
  }
}
.app-list {
  width: 100%;
  height: calc(100% - 50px);
  .item {
    margin: 5px 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}
.app-footer {
  width: 100%;
  height: 50px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 95%;
  margin: 2.5%;
}
::v-deep .el-card__header {
  padding: 10px;
}
::v-deep .el-card__body,
.el-main {
  padding: 10px 10px;
}
</style>