<template>
  <div class="viewBody">
    <div class="query-head" id="header">
      <div class="head-form">
        <el-form :inline="true" :model="paramJson" class="demo-form-inline">
          <el-form-item label="监测地点" style="margin-bottom: 0px">
            <el-input v-model="paramJson.location" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="机构名称" style="margin-bottom: 0px">
            <el-select filterable v-model="paramJson.orgNo" placeholder="请选择机构" style="width: 100%" size="mini">
              <el-option v-for="item in orgOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="岗位" :prop="'postId'" style="margin-bottom: 0px">
            <el-select filterable size="mini" v-model="paramJson.postId" placeholder="请选择岗位" style="width: 100%">
              <el-option v-for="item in postOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="上传人" style="margin-bottom: 0px">
            <el-input v-model="paramJson.creatorName" size="mini"></el-input>
          </el-form-item>-->
          <!-- <el-form-item label="上传时间" style="margin-bottom: 0px">
            <el-date-picker
              size="mini"
              v-model="paramJson.time"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </el-form-item>-->
          <el-form-item style="margin-bottom: 0px">
            <el-button type="primary" @click="onSubmit" size="mini">查询</el-button>
            <el-button @click="reSubmit" size="mini">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="main-content" ref="maincontent">
      <el-row id="operate">
        <el-button type="primary" style="margin-bottom: 10px" size="mini" @click="addApi('addApiForm')">新增</el-button>
      </el-row>
      <el-table ref="multipleTable" :data="tableData.listItem" :border="true" style="width: 100%" v-loading="tableloading" :height="Height">
        <el-table-column prop="no" label="序号" width="60" :align="'center'">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column prop="location" label="监测地点"></el-table-column>
        <el-table-column prop="orgName" label="机构名称"></el-table-column>
        <el-table-column prop="orgNo" label="机构编号"></el-table-column>
        <el-table-column prop="pic" label="图片">
          <template slot-scope="scope">
            <el-image style="width: 50px; height: 25px" :src="scope.row.pic[0]" :preview-src-list="scope.row.pic"></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="creatorName" label="上传者"></el-table-column>
        <el-table-column prop="createTime" label="上传时间"></el-table-column>
        <el-table-column prop="code" label="操作">
          <template slot-scope="scope">
            <el-button @click.stop="delApi(scope.row)" type="text" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <my-pagination :total="Number(tableData.total)" :current="tableInfo.current" :page-size="tableInfo.size" :page-sizes="[20, 50, 100, 200, 300]" @size-change="changeSize" @current-change="changePage" :layout="'total, sizes, prev, pager, next, jumper'"></my-pagination>
    </div>
    <!-- 新增模态框 -->
    <el-dialog :visible.sync="addDialogVisible" width="30%">
      <span slot="title">{{ isUpdate ? "修改" : "新增" }}</span>
      <el-form :model="addOrUpdateReq" status-icon ref="addApiForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="监测地点" :prop="'location'" :rules="[{ required: true, message: '请填写监测地点' }]">
          <el-input v-model="addOrUpdateReq.location"></el-input>
        </el-form-item>
        <el-form-item label="机构名称" :prop="'orgNo'" :rules="[{ required: true, message: '请选择机构' }]">
          <el-select filterable v-model="addOrUpdateReq.orgNo" placeholder="请选择机构" style="width: 100%" size="mini">
            <el-option v-for="item in orgOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="岗位" :prop="'postId'">
          <el-select filterable v-model="addOrUpdateReq.postId" placeholder="请选择岗位" style="width: 100%">
            <el-option v-for="item in postOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上传图片" :prop="'pic'" :rules="[{ required: true, message: '请上传图片' }]">
          <el-upload class="upload-demo" ref="upload" action="upload" :on-remove="(file, fileList) => handleRemove(file, fileList, 'pic')" :file-list="addOrUpdateReq.pic" :http-request="(value) => handleImport(value)" :on-error="handleError" :on-success="handleSuccess" list-type="picture">
            <el-button slot="trigger" size="mini" type="primary">上传图片</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="submitForm('addApiForm')" size="mini">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { occupHealth, common } from "../../../api";
import { MyPagination } from "../../../components";
import { showMessage, tools } from "../../../utils";

export default {
  name: "TestResults",
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
        creatorName: "",
        location: "",
        orgNo: "",
        postId: null,
        time: [],
        startTime: 0,
        endTime: 0,
      },
      tableInfo: {
        size: 20,
        current: 1,
      },
      addOrUpdateReq: {
        location: "",
        orgNo: "",
        postId: null,
        pic: [],
      },
      addDialogVisible: false,
      isUpdate: false,
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
      if (this.paramJson.time && this.paramJson.time.length !== 0) {
        this.paramJson.startTime = this.paramJson.time[0].valueOf();
        this.paramJson.endTime = this.paramJson.time[1].valueOf();
      } else {
        delete this.paramJson.startTime;
        delete this.paramJson.endTime;
      }

      occupHealth
        .getTestResultList({
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
        if (key === "time") {
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

    // 新增接口
    addApi(formName) {
      this.addDialogVisible = true;
      console.log("formName", formName);
      try {
        this.addOrUpdateReq.name = "";
        this.addOrUpdateReq.att = [];
      } catch (error) {
        console.log("error", error);
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          occupHealth
            .setTestResult(this.addOrUpdateReq)
            .then(({ data }) => {
              if (data.code === 200) {
                this.$message.success(showMessage.apiMessage.addSuccess);
                this.resetForm(formName);
                this.getList();
                this.addDialogVisible = false;
              }
            })
            .catch((e) => {
              console.log("e", e);
              if (this.isUpdate) {
                this.$message.error(showMessage.apiMessage.updateFail);
              } else {
                this.$message.error(showMessage.apiMessage.addFail);
              }
            });
        }
      });
    },

    // 导入成功回调
    handleSuccess() {
      // this.$message({
      //   message: showMessage.fileMessage.importSuccess,
      //   type: "success",
      // });
    },

    // 导入失败回调
    handleError() {
      this.$message({
        message: showMessage.fileMessage.importFail,
        type: "error",
      });
    },
    async handleImport(value) {
      const result = await tools.handleImport(value, 1);
      if (result) {
        // this.$message.success("上传成功");
        this.addOrUpdateReq.pic.push(result.path);
      } else {
        let uid = value.file.uid; // 关键作用代码，去除文件列表失败文件
        let idx = this.$refs.upload.uploadFiles.findIndex(
          (item) => item.uid === uid
        ); // 关键作用代码，去除文件列表失败文件（uploadFiles为el-upload中的ref值）
        this.$refs.upload.uploadFiles.splice(idx, 1); // 关键作用代码，去除文件列表失败文件
      }
    },
    handleRemove(file, fileList, type) {
      console.log(file, fileList);
      if (type === "file") {
        this.addOrUpdateReq.att = fileList;
      } else {
        this.addOrUpdateReq.pic = fileList;
      }
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
            .delTestResult({ id: row.id })
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
  },
};
</script>
