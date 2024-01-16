<template>
  <div class="viewBody">
    <div class="query-head" id="header" style="width: 100%;display: flex;justify-content: space-between; padding: 10px 10px;margin-bottom: 0;">
      <div class="head-form" style="padding-left: 0;" @click="$router.go(-1)">
        <MyIcon class="el-icon-arrow-left" :color="'#409EFF'" :font="18"></MyIcon>
        <span style="margin-left: 0px;color: #409EFF;">返回</span>
      </div>
      <div style="text-align: center;">{{ $route.meta.title }}</div>
      <div class="head-form" style="padding-left: 0;" @click="drawer = true">
        <MyIcon class="el-icon-search" :color="'#409EFF'" :font="18"></MyIcon>
        <span style="color: #409EFF;">筛 选</span>
      </div>
    </div>
    <div class="main-content" ref="maincontent" style="padding: 0 3px;">
      <el-table ref="multipleTable" :data="tableData.listItem" :border="true" style="width: 100%" v-loading="tableloading" :height="Height">
        <af-table-column prop="no" label="序号" width="60" :align="'center'">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </af-table-column>
        <af-table-column prop="no" label="体检编号"></af-table-column>
        <af-table-column prop="no" label="体检时间"></af-table-column>
        <af-table-column prop="userNo" label="用户编号"></af-table-column>
        <af-table-column prop="name" label="用户名称"></af-table-column>
        <af-table-column prop="sex" label="性别" width="60" :align="'center'"></af-table-column>
        <af-table-column prop="age" label="年龄" width="60" :align="'center'"></af-table-column>
        <af-table-column prop="postName" label="工种"></af-table-column>
        <af-table-column prop="tabooContent" label="禁忌因素"></af-table-column>
        <af-table-column prop="harmAge" label="接害工龄"></af-table-column>
        <af-table-column prop="harm" label="接害因素"></af-table-column>
        <af-table-column prop="abnormal" label="异常指标"></af-table-column>
        <af-table-column prop="conclusion" label="结论"></af-table-column>
        <af-table-column prop="proposal" label="医学建议"></af-table-column>
        <af-table-column prop="isNotice" label="是否已通知">
          <template slot-scope="scope">
            <span v-if="scope.row.isNotice === '已通知'" style="color: #67C23A">{{ scope.row.isNotice }}</span>
            <span v-else style="color: #409eff">{{ scope.row.isNotice }}</span>
          </template>
        </af-table-column>

        <af-table-column prop="code" label="操作" width="80" :align="'center'">
          <template slot-scope="scope">
            <el-button @click.stop="delApi(scope.row)" type="text" size="mini">删除</el-button>
          </template>
        </af-table-column>
      </el-table>
      <my-pagination :total="Number(tableData.total)" :current="tableInfo.current" :page-size="tableInfo.size" :page-sizes="[20, 50, 100, 200, 300]" @size-change="changeSize" @current-change="changePage" :layout="'total, sizes, prev, pager, next'"></my-pagination>
    </div>
    <el-drawer ref="drawer" title="筛选" :size="'80%'" :with-header="false" :visible.sync="drawer" direction="btt" :before-close="handleClose">
      <div class="demo-drawer__content">
        <div class="drawer_top" @click="reSubmit">
          <MyIcon class="el-icon-delete" :color="'#409EFF'" :font="18"></MyIcon>
          <span style="margin-left: 10px;color: #409EFF;">清 空</span>
        </div>
        <el-form label-position="top" :model="paramJson" class="demo-form-inline">
          <el-form-item label="用户编号" style="margin-bottom: 0px">
            <el-input v-model="paramJson.userNo" size="medium"></el-input>
          </el-form-item>
        </el-form>
        <div class="demo-drawer__footer">
          <el-button style="width: 45%;height: 40px;font-size: 16px;" @click="drawer = false">取 消</el-button>
          <el-button style="width: 45%;height: 40px;font-size: 16px;" type="primary" @click="onSubmit">{{ '筛 选' }}</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { occupHealth } from "../../../../api";
import { MyPagination, MyIcon } from "../../../../components";
import { showMessage } from "../../../../utils";

export default {
  name: "hazardNotice",
  components: {
    MyPagination,
    MyIcon,
  },
  data() {
    return {
      drawer: false,
      tableloading: false,
      tableData: {
        listItem: [],
        total: 0,
      },
      Height: 250,
      paramJson: {
        userNo: "",
      },
      tableInfo: {
        size: 20,
        current: 1,
      },
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
        this.Height = document.documentElement.clientHeight - headerHeight - 50;
      });
      // 获取接口列表
    },
    getList() {
      this.tableloading = true;
      occupHealth
        .getHealthUserTabooList({
          ...this.paramJson,
          current: this.tableInfo.current,
          size: this.tableInfo.size,
        })
        .then((res) => {
          if (res.data) {
            const data = res.data;
            this.tableData.listItem = [];
            if (data.data.records && data.data.records.length > 0) {
              this.tableData.listItem = data.data.records;
            }
            this.tableData.total = data.data.total;
            // this.tableData.getNo(res.data.current, res.data.size);
            this.tableloading = false;
          }
        })
        .catch((e) => {
          this.tableloading = false;
          console.log("e", e);
        });
    },
    // 查询接口
    onSubmit() {
      this.getList();
    },

    // 重置查询
    reSubmit() {
      this.tableInfo.current = 1;
      this.tableInfo.size = 20;
      this.paramJson.userNo = "";
      this.getList();
    },
    // 分页
    changeSize(index) {
      this.tableInfo.size = index;
      this.getList();
    },
    changePage(index) {
      this.tableInfo.current = index;
      this.getList();
    },
    delApi(row) {
      this.$confirm(
        showMessage.apiMessage.deleteConfrimText,
        showMessage.apiMessage.title,
        {
          confirmButtonText: showMessage.apiMessage.confirmText,
          cancelButtonText: showMessage.apiMessage.cancelText,
          type: "warning",
          customClass: "my-dialog",
        }
      )
        .then(() => {
          occupHealth
            .delPhysicalReport({ id: row.id })
            .then(({ data }) => {
              if (data.code === 200) {
                this.$message.success(showMessage.apiMessage.deleteSuccess);
                this.getList();
              }
            })
            .catch(() => {
              this.$message.error(showMessage.apiMessage.deleteFail);
            });
        })
        .catch(() => {});
    },
    handleClose(done) {
      done();
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
::v-deep .el-table th > .cell {
  white-space: nowrap;
  width: fit-content !important;
}
</style>