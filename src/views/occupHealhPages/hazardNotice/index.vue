<template>
  <div class="viewBody">
    <div class="query-head" id="header">
      <div class="head-form">
        <el-form :inline="true" :model="paramJson" class="demo-form-inline">
          <el-form-item label="用户编号" style="margin-bottom: 0px">
            <el-input v-model="paramJson.userNo" size="mini"></el-input>
          </el-form-item>
          <el-form-item style="margin-bottom: 0px;">
            <el-button type="primary" @click="onSubmit" size="mini">查询</el-button>
            <el-button @click="reSubmit" size="mini">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="main-content" ref="maincontent">
      <el-row style="display: flex" id="operate">
        <el-button type="primary" style="margin-bottom: 10px" size="mini" @click="handleExport">导出模版</el-button>
        <el-upload class="upload-demo" ref="upload" action="upload" :http-request="(value) => handleImport(value)" :on-error="handleError" :on-success="handleSuccess" :show-file-list="false" style="margin-bottom: 10px; margin-left: 10px;">
          <el-button slot="trigger" size="mini" type="primary">导入数据</el-button>
        </el-upload>
      </el-row>
      <el-table ref="multipleTable" :data="tableData.listItem" :border="true" style="width: 100%" v-loading="tableloading" :height="Height">
        <el-table-column prop="no" label="序号" width="60" :align="'center'">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column prop="no" label="体检编号"></el-table-column>
        <el-table-column prop="no" label="体检时间"></el-table-column>
        <el-table-column prop="userNo" label="用户编号"></el-table-column>
        <el-table-column prop="name" label="用户名称"></el-table-column>
        <el-table-column prop="sex" label="性别" width="60" :align="'center'"></el-table-column>
        <el-table-column prop="age" label="年龄" width="60" :align="'center'"></el-table-column>
        <el-table-column prop="postName" label="工种"></el-table-column>
        <el-table-column prop="tabooContent" label="禁忌因素"></el-table-column>
        <el-table-column prop="harmAge" label="接害工龄"></el-table-column>
        <el-table-column prop="harm" label="接害因素"></el-table-column>
        <el-table-column prop="abnormal" label="异常指标"></el-table-column>
        <el-table-column prop="conclusion" label="结论"></el-table-column>
        <el-table-column prop="proposal" label="医学建议"></el-table-column>
        <el-table-column prop="isNotice" label="是否已通知">
          <template slot-scope="scope">
            <span v-if="scope.row.isNotice === '已通知'" style="color: #67C23A">{{ scope.row.isNotice }}</span>
            <span v-else style="color: #409eff">{{ scope.row.isNotice }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="code" label="操作">
          <template slot-scope="scope">
            <el-button @click.stop="delApi(scope.row)" type="text" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <my-pagination :total="Number(tableData.total)" :current="tableInfo.current" :page-size="tableInfo.size" :page-sizes="[20, 50, 100, 200, 300]" @size-change="changeSize" @current-change="changePage" :layout="'total, sizes, prev, pager, next, jumper'"></my-pagination>
    </div>
  </div>
</template>

<script>
import { occupHealth } from "../../../api";
import { MyPagination } from "../../../components";
import { showMessage, tools } from "../../../utils";

export default {
  name: "hazardNotice",
  components: {
    MyPagination,
  },
  data() {
    return {
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
    this.getPostDataFn();
  },
  mounted() {
    this.getHeight();
    window.addEventListener("resize", this.getHeight, false);
  },
  methods: {
    getHeight() {
      const headerHeight = document.getElementById("header").clientHeight;
      const operateHeight = document.getElementById("operate").clientHeight;
      //获取浏览器高度并计算得到表格所用高度。
      this.$nextTick(() => {
        this.Height =
          document.documentElement.clientHeight -
          headerHeight -
          operateHeight -
          110;
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
    handleExport() {
      this.tableloading = true;
      occupHealth
        .exportHealthUserList()
        .then((res) => {
          this.tableloading = false;
          if (res.data) {
            const result = tools.expenseloadFile(res.data);
            if (result) {
              this.tableloading = false;
              this.$message({
                message: showMessage.fileMessage.exportSuccess,
                type: "success",
              });
            } else {
              this.tableloading = false;
            }
          }
        })
        .catch((e) => {
          this.tableloading = false;
          console.log("e", e);
          this.$message({
            message: showMessage.fileMessage.exportFail,
            type: "error",
          });
        });
    },
    // 导入失败回调
    handleError() {
      this.$message({
        message: showMessage.fileMessage.importFail,
        type: "error",
      });
    },
    async handleImport(value) {
      this.tableloading = true;
      const formData = new FormData();
      formData.append("file", value.file);
      occupHealth
        .importPhysicalReport(formData)
        .then((res) => {
          if (res.data) {
            this.getList();
          }
          this.tableloading = false;
        })
        .catch((e) => {
          this.tableloading = false;
          console.log("e", e);
        });
    },
  },
};
</script>
