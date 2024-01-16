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
          <el-form-item label="禁忌名称" style="margin-bottom: 0px">
            <el-input v-model="paramJson.tabooName" size="mini" style="width: 120px;"></el-input>
          </el-form-item>
          <el-form-item label="岗位" :prop="'postId'" style="margin-bottom: 0px">
            <el-select filterable v-model="paramJson.postId" placeholder="请选择岗位" style="width: 100%" size="mini">
              <el-option v-for="item in postOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
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
      </el-row>
      <el-table ref="multipleTable" :data="tableData.listItem" :border="true" style="width: 100%" v-loading="tableloading" :height="Height">
        <el-table-column prop="no" label="序号" width="60" :align="'center'">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column prop="no" label="体检编号"></el-table-column>
        <el-table-column prop="userNo" label="用户编号"></el-table-column>
        <el-table-column prop="name" label="用户名称"></el-table-column>
        <el-table-column prop="sex" label="性别" width="60" :align="'center'"></el-table-column>
        <el-table-column prop="age" label="年龄" width="60" :align="'center'"></el-table-column>
        <!-- <el-table-column prop="companyNo" label="公司编号"></el-table-column>
        <el-table-column prop="companyName" label="公司名称"></el-table-column>-->
        <el-table-column prop="orgNo" label="机构编号"></el-table-column>
        <el-table-column prop="orgName" label="机构名称"></el-table-column>
        <el-table-column prop="postName" label="岗位名称"></el-table-column>
        <el-table-column prop="tabooContent" label="禁忌内容"></el-table-column>
        <el-table-column prop="harmAge" label="接害工龄"></el-table-column>
        <el-table-column prop="harm" label="接害因素"></el-table-column>
        <el-table-column prop="abnormal" label="异常指标"></el-table-column>
        <el-table-column prop="conclusion" label="结论"></el-table-column>
        <el-table-column prop="proposal" label="医学建议"></el-table-column>
      </el-table>
      <my-pagination :total="Number(tableData.total)" :current="tableInfo.current" :page-size="tableInfo.size" :page-sizes="[20, 50, 100, 200, 300]" @size-change="changeSize" @current-change="changePage" :layout="'total, sizes, prev, pager, next, jumper'"></my-pagination>
    </div>
  </div>
</template>

<script>
import { occupHealth, common } from "../../../api";
import { MyPagination } from "../../../components";
import { showMessage, tools } from "../../../utils";

export default {
  name: "occupTaboos",
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
        overdueTime: 0,
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
      for (var key in this.paramJson) {
        if (key === "postId") {
          this.paramJson[key] = null;
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
  },
};
</script>
