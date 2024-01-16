<template>
  <div class="viewBody">
    <div class="query-head" id="header" style="width: 100%;display: flex;justify-content: space-between; padding: 10px 10px;margin-bottom: 0;">
      <div class="head-form" style="padding-left: 0;" @click="$router.go(-1)">
        <MyIcon class="el-icon-arrow-left" :color="'#409EFF'" :font="18"></MyIcon>
        <span style="margin-left: 0px;color: #409EFF;">返回</span>
      </div>
      <div style="text-align: center;">{{ $route.meta.title }}</div>
      <div class="head-form"></div>
    </div>
    <div class="main-content" ref="maincontent">
      <el-table ref="multipleTable" :data="tableData.listItem" :border="true" style="width: 100%" v-loading="tableloading" :height="Height">
        <af-table-column prop="Nosort" label="序号" width="60" :align="'center'"></af-table-column>
        <af-table-column prop="activityName" label="活动名称"></af-table-column>
        <af-table-column prop="activityTypeName" label="活动类型"></af-table-column>
        <af-table-column prop="sendDate" label="活动描述"></af-table-column>
        <af-table-column prop="enterpriseName" label="审批人所在企业"></af-table-column>
        <af-table-column prop="unitName" label="审批人所在单位名称"></af-table-column>
        <af-table-column prop="deptName" label="审批人所在部门"></af-table-column>
        <af-table-column prop="executeDate" label="审批完成时间"></af-table-column>
        <af-table-column prop="executeResult" label="执行结果"></af-table-column>
        <af-table-column prop="executorName" label="审批人"></af-table-column>
        <af-table-column prop="message" label="审批意见"></af-table-column>
        <af-table-column prop="sendDate" label="待办发送时间"></af-table-column>
        <af-table-column prop="code" label="操作" width="80" :align="'center'">
          <template slot-scope="scope">
            <el-button @click.stop="handleTrun(scope.row)" type="text" size="mini">详情</el-button>
          </template>
        </af-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { occupHealth, common } from "../../../../api";
import { MyIcon } from "../../../../components";
import { tools } from "../../../../utils";

export default {
  name: "AuditList",
  components: {
    MyIcon,
  },
  data() {
    return {
      tableloading: false,
      tableData: {
        listItem: [],
        total: 0,
      },
      Height: 250,
      id: tools.getUrlQueryString("id"),
    };
  },
  created() {
    this.getList();
  },
  mounted() {
    this.getHeight();
    window.addEventListener("resize", this.getHeight, false);
  },
  methods: {
    getHeight() {
      const headerHeight = document.getElementById("header").clientHeight;
      //获取浏览器高度并计算得到表格所用高度。
      this.$nextTick(() => {
        this.Height = document.documentElement.clientHeight - headerHeight;
      });
      // 获取接口列表
    },
    getList() {
      this.tableloading = true;
      if (!this.id) {
        this.tableloading = false;
        return;
      }
      common.loginResolveToken({ token: "" }).then((res) => {
        console.log("res", res);
        if (res.data) {
          localStorage.setItem("userInfo", res.data.data);
          sessionStorage.setItem("currentUserId", res.data.data.id);
          this.$store.commit("SET_USER", res.data.data);
          localStorage.setItem("xfm_username", res.data.data.no);
        }
      });
      occupHealth
        .getAuditList({ id: this.id })
        .then((res) => {
          if (res.data) {
            const data = res.data;
            this.tableData.listItem = [];
            if (data.data && data.data.length > 0) {
              this.tableData.listItem = data.data;
            }
            this.tableloading = false;
          }
        })
        .catch((e) => {
          this.tableloading = false;
          console.log("e", e);
        });
    },
    handleTrun(row) {
      console.log("row", row);
      this.$route.push("/detailedList");
    },
  },
};
</script>
<style lang="scss" scoped>
.viewBody {
  margin-top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.el-table th > .cell {
  white-space: nowrap;
  width: fit-content;
}
.demo-form-inline {
  padding: 10px 10px 60px;
}

.demo-drawer__footer {
  width: 100%;
  position: fixed;
  bottom: 0;
  padding: 10px;
  display: flex;
  justify-content: center;
}
.head-form {
  display: flex;
  justify-content: end;
  align-items: center;
}
.drawer_top {
  width: 100%;
  padding: 10px;
  display: flex;
  justify-content: end;
  align-items: center;
  border-bottom: 1px solid #e6e6e6;
}
::v-deep .el-pagination__sizes {
  margin: 0;
}
::v-deep .el-pagination__total {
  margin: 0;
}
</style>