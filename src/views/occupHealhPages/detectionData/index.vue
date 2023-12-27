<template>
  <div class="viewBody">
    <div class="query-head">
      <div class="head-form">
        <el-form :inline="true" :model="paramJson" class="demo-form-inline">
          <el-form-item label="监测地点" style="margin-bottom: 0px">
            <el-input v-model="paramJson.location" size="mini"></el-input>
          </el-form-item>
          <el-form-item style="margin-bottom: 0px">
            <el-button type="primary" @click="onSubmit" size="mini"
              >查询</el-button
            >
            <el-button @click="reSubmit" size="mini">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="main-content" ref="maincontent">
      <el-row style="display: flex;">
        <el-button
          type="primary"
          style="margin-bottom: 10px"
          size="mini"
          @click="addApi('addApiForm')"
          >新增</el-button
        >
        <el-button
          type="primary"
          style="margin-bottom: 10px"
          size="mini"
          @click="handleExport"
          >导出模版</el-button
        >
        <el-upload
          class="upload-demo"
          ref="upload"
          action="upload"
          :http-request="(value) => handleImport(value)"
          :on-error="handleError"
          :on-success="handleSuccess"
          :show-file-list="false"
          style="margin-bottom: 10px; margin-left: 10px;"
        >
          <el-button  slot="trigger" size="mini" type="primary"
            >导入数据</el-button>
        </el-upload>
      </el-row>
      
      <el-table
        ref="multipleTable"
        :data="tableData.listItem"
        :border="true"
        style="width: 100%"
        v-loading="tableloading"
        :height="Height"
      >
        <el-table-column prop="no" label="序号" width="60">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="postName" label="岗位名称"></el-table-column>
        <el-table-column prop="location" label="监测地点"></el-table-column>
        <el-table-column prop="noise" label="噪声"></el-table-column>
        <el-table-column prop="temperature" label="温度"></el-table-column>
        <el-table-column prop="creatorName" label="创建者"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column prop="code" label="操作">
          <template slot-scope="scope">
            <el-button @click.stop="update(scope.row)" type="text" size="mini">编辑</el-button>
            <el-button @click.stop="delApi(scope.row)" type="text" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <my-pagination
        :total="Number(tableData.total)"
        :current="tableInfo.current"
        :page-size="tableInfo.size"
        :page-sizes="[20, 50, 100, 200, 300]"
        @size-change="changeSize"
        @current-change="changePage"
        :layout="'total, sizes, prev, pager, next, jumper'"
      ></my-pagination>
    </div>
    <!-- 新增模态框 -->
    <el-dialog :visible.sync="addDialogVisible" width="30%">
      <span slot="title">{{ isUpdate ? "修改" : "新增" }}</span>
      <el-form
        :model="addOrUpdateReq"
        status-icon
        ref="addApiForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="岗位" :prop="'postId'">
          <el-select v-model="addOrUpdateReq.postId" placeholder="请选择岗位" style="width: 100%">
            <el-option v-for="item in postOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="监测地点"
          :prop="'location'"
          :rules="[{ required: true, message: '请填写监测地点' }]"
        >
          <el-input v-model="addOrUpdateReq.location"></el-input>
        </el-form-item>
        <el-form-item
          label="噪音"
          :prop="'noise'"
          :rules="[{ required: true, message: '请填写噪音' }]"
        >
          <el-input v-model="addOrUpdateReq.noise"></el-input>
        </el-form-item>
        <el-form-item
          label="温度"
          :prop="'temperature'"
          :rules="[{ required: true, message: '请填写温度' }]"
        >
          <el-input v-model="addOrUpdateReq.temperature"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false" size="mini"
          >取 消</el-button
        >
        <el-button type="primary" @click="submitForm('addApiForm')" size="mini"
          >保 存</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  occupHealth,
  common
} from "../../../api";
import { MyPagination } from "../../../components";
import { showMessage, tools } from "../../../utils";

export default {
  name: "DetectionData",
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
        location: "",
        postId: "",
        endTime: 0,
      },
      tableInfo: {
        size: 20,
        current: 1,
      },
      addOrUpdateReq: {
        id: 0,
        location: "",
        noise: "",
        postId: null,
        temperature: '',
      },
      addDialogVisible: false,
      isUpdate: false,
      type: 'add',
      postOptions: []
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
      //获取浏览器高度并计算得到表格所用高度。
      this.$nextTick(() => {
        this.Height = document.documentElement.clientHeight - 250;
      });
      // 获取接口列表
    },
    // 获取岗位列表
    getPostDataFn() {
      common.GetPostSelectList()
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
    },
    getList() {
      this.tableloading = true;
      occupHealth.getTestDataList({
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
      this.tableInfo.type = 2;
      for (var key in this.paramJson) {
        if (key === "postId" || key === "id") {
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
      this.tableloading = true;
      const formData = new FormData();
      formData.append('file', value.file)
      occupHealth.importTestData(formData).then(res => {
        if(res.data) {
          this.getList();
        }
        this.tableloading = false;
      })
      .catch((e) => {
        this.tableloading = false;
        console.log("e", e);
      });
    },
    handleExport() {
      this.tableloading = true;
      occupHealth.exportTestDataTemp().then(res => {
        this.tableloading = false;
        if(res.data) {
          const result = tools.expenseloadFile(res.data);
          if(result) {
            this.tableloading = false;
            this.$message({
              message: showMessage.fileMessage.exportSuccess,
              type: "success",
            });
          }else {
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

    // 新增接口
    addApi(formName) {
      this.addDialogVisible = true;
      console.log("formName", formName);
      this.type = 'add';
      try {
        this.addOrUpdateReq.name = "";
        this.addOrUpdateReq.att = [];
      } catch (error) {
        console.log("error", error);
      }
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //  获取修改信息
    update(data) {
      this.addDialogVisible = true;
      this.isUpdate = true;
      this.type = 'edit';
      this.addOrUpdateReq = JSON.parse(JSON.stringify(data));
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(this.type === 'add') {
            occupHealth.setTestDataList(this.addOrUpdateReq)
            .then((res) => {
              if(res.data.code === 200) {
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
          } else {
            occupHealth.editTestDataList({...this.addOrUpdateReq})
            .then((res) => {
              if(res.data.code === 200) {
                this.$message.success(showMessage.apiMessage.updateSuccess);
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
        }
      });
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
          occupHealth.delTestData({ id: row.id })
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
  }
};
</script>
<style lang="scss" scoped>
.upload-demo {
    width: fit-content;
  }
</style>