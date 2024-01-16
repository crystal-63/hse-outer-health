<template>
  <div class="viewBody">
    <div class="query-head" id="header">
      <div class="head-form">
        <el-form :inline="true" :model="paramJson" class="demo-form-inline">
          <el-form-item label="员工姓名" style="margin-bottom: 0px">
            <el-input v-model="paramJson.userName" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="机构名称" style="margin-bottom: 0px">
            <el-select filterable v-model="paramJson.org" placeholder="请选择机构" style="width: 100%" size="mini">
              <el-option v-for="item in orgOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="超期时间" style="margin-bottom: 0px">
            <el-input type="number" v-model="paramJson.overdueTime" size="mini" placeholder="(单位：天)" style="width: 120px;"></el-input>
          </el-form-item>
          <el-form-item label="体检类别" :prop="'postId'" style="margin-bottom: 0px">
            <el-select v-model="paramJson.checkType" placeholder="请选择体检类别" style="width: 140px" size="mini">
              <el-option v-for="item in checkOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="岗位" :prop="'postId'" style="margin-bottom: 0px">
            <el-select filterable v-model="paramJson.postId" placeholder="请选择岗位" style="width: 100%" size="mini">
              <el-option v-for="item in postOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="体检时间" style="margin-bottom: 0px; margin-top: 10px;">
            <el-date-picker size="mini" style="width: 260px;" v-model="paramJson.checkTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="下次体检时间" style="margin-bottom: 0px; margin-top: 10px;">
            <el-date-picker size="mini" style="width: 260px;" v-model="paramJson.nextCheckTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </el-form-item>
          <el-form-item style="margin-bottom: 0px; margin-top: 10px;">
            <el-button type="primary" @click="onSubmit" size="mini">查询</el-button>
            <el-button @click="reSubmit" size="mini">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="main-content" ref="maincontent">
      <el-row style="display: flex" id="operate">
        <el-upload class="upload-demo" ref="upload" action="upload" :http-request="(value) => handleImport(value)" :on-error="handleError" :show-file-list="false" style="margin-bottom: 10px; margin-left: 10px">
          <el-button slot="trigger" size="mini" type="primary">导入数据</el-button>
        </el-upload>
      </el-row>
      <el-table ref="multipleTable" :data="tableData.listItem" :border="true" style="width: 100%" v-loading="tableloading" :height="Height">
        <el-table-column prop="no" label="序号" width="60" :align="'center'">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column prop="no" label="用户编号"></el-table-column>
        <el-table-column prop="name" label="用户名称"></el-table-column>
        <el-table-column prop="companyNo" label="公司编号"></el-table-column>
        <el-table-column prop="companyName" label="公司名称"></el-table-column>
        <el-table-column prop="orgNo" label="机构编号"></el-table-column>
        <el-table-column prop="orgName" label="机构名称"></el-table-column>
        <el-table-column prop="postName" label="岗位名称"></el-table-column>
        <el-table-column prop="hazardous" label="危害因素"></el-table-column>
        <el-table-column prop="overdueTime" label="超期时间"></el-table-column>
        <el-table-column prop="checkType" label="体检类别"></el-table-column>
        <el-table-column prop="checkTime" label="检查时间"></el-table-column>
        <el-table-column prop="nextCheckTime" label="下次体检"></el-table-column>

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
import { occupHealth, common } from "../../../api";
import { MyPagination } from "../../../components";
import { showMessage } from "../../../utils";

export default {
  name: "healthInformation",
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
        checkEndTime: 0,
        checkStartTime: 0,
        checkType: "",
        nextCheckEndTime: 0,
        nextCheckStartTime: 0,
        overdueTime: null,
        org: null,
        userName: "",
        postId: null,
        checkTime: [],
        nextCheckTime: [],
      },
      tableInfo: {
        size: 20,
        current: 1,
      },
      postOptions: [],
      orgOptions: [],
      checkOptions: [
        {
          label: "入职",
          value: 1,
        },
        {
          label: "在岗",
          value: 2,
        },
        {
          label: "离职",
          value: 3,
        },
      ],
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
    // 获取岗位列表
    getPostDataFn() {
      common
        .GetPostSelectList()
        .then((res) => {
          if (res.data) {
            const data = res.data;
            this.postOptions = [];
            this.postOptions = data.data;
          }
        })
        .catch((e) => {
          console.log("e", e);
        });
      common
        .GetOrgSelectList()
        .then((res) => {
          if (res.data) {
            const data = res.data;
            this.orgOptions = [];
            this.orgOptions = data.data;
          }
        })
        .catch((e) => {
          console.log("e", e);
        });
    },
    getList() {
      this.tableloading = true;
      if (this.paramJson.checkTime && this.paramJson.checkTime.length !== 0) {
        this.paramJson.checkStartTime = this.paramJson.checkTime[0].valueOf();
        this.paramJson.checkEndTime = this.paramJson.checkTime[1].valueOf();
      } else {
        delete this.paramJson.checkStartTime;
        delete this.paramJson.checkEndTime;
      }
      if (
        this.paramJson.nextCheckTime &&
        this.paramJson.nextCheckTime.length !== 0
      ) {
        this.paramJson.nextCheckStartTime =
          this.paramJson.nextCheckTime[0].valueOf();
        this.paramJson.nextCheckEndTime =
          this.paramJson.nextCheckTime[1].valueOf();
      } else {
        delete this.paramJson.nextCheckStartTime;
        delete this.paramJson.nextCheckEndTime;
      }
      occupHealth
        .getHealthUserList({
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
      for (var key in this.paramJson) {
        if (key === "postId" || key === "overdueTime") {
          this.paramJson[key] = null;
        } else if (key === "checkTime" || key === "nextCheckTime") {
          this.paramJson[key] = [];
        } else if (key === "startTime" || key === "endTime") {
          this.paramJson[key] = 0;
        } else {
          this.paramJson[key] = "";
        }
      }
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
            .delTestData({ id: row.id })
            .then(() => {
              this.$message.success(showMessage.apiMessage.deleteSuccess);
              this.getList();
            })
            .catch(() => {
              this.$message.error(showMessage.apiMessage.deleteFail);
            });
        })
        .catch(() => {});
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
        .importInformCard(formData)
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
