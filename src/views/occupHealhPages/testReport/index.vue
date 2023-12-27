<template>
  <div class="viewBody">
    <div class="query-head">
      <div class="head-form">
        <el-form :inline="true" :model="paramJson" class="demo-form-inline">
          <el-form-item label="报告名称" style="margin-bottom: 0px">
            <el-input v-model="paramJson.name" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="上传人" style="margin-bottom: 0px">
            <el-input v-model="paramJson.creatorName" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="上传时间" style="margin-bottom: 0px">
            <el-date-picker
              size="mini"
              v-model="paramJson.time"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
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
      <el-button
        type="primary"
        style="margin-bottom: 10px"
        size="mini"
        @click="addApi('addApiForm')"
        >新增</el-button
      >
      <el-table
        :span-method="objectSpanMethod"
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
        <el-table-column prop="name" label="报告名称"></el-table-column>
        <el-table-column prop="content" label="报告内容"></el-table-column>
        <el-table-column prop="fileName" label="文件内容">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="handleTurn(scope.row)">{{
              scope.row.fileName
            }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="creatorName" label="上传者"></el-table-column>
        <el-table-column prop="createTime" label="上传时间"></el-table-column>
        <el-table-column prop="code" label="操作">
          <template slot-scope="scope">
            <el-button @click.stop="delApi(scope.row)" type="text" size="mini"
              >删除</el-button
            >
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
        <el-form-item
          label="报告名称"
          :prop="'name'"
          :rules="[{ required: true, message: '请填写报告名称' }]"
        >
          <el-input v-model="addOrUpdateReq.name"></el-input>
        </el-form-item>
        <el-form-item
          label="报告内容"
          :prop="'content'"
          :rules="[{ required: true, message: '请填写报告内容' }]"
        >
          <el-input v-model="addOrUpdateReq.content"></el-input>
        </el-form-item>
        <el-form-item
          label="上传附件"
          :prop="'att'"
          :rules="[{ required: true, message: '请上传附件' }]"
        >
          <el-upload
            class="upload-demo"
            ref="upload"
            action="upload"
            :on-remove="
              (file, fileList) => handleRemove(file, fileList, 'file')
            "
            :file-list="addOrUpdateReq.att"
            :http-request="(value) => handleExport(value, 'file')"
            :on-error="handleError"
            :on-success="handleSuccess"
          >
            <el-button slot="trigger" size="small" type="primary"
              >上传文件</el-button
            >
            <div slot="tip" class="el-upload__tip">只能上传文件</div>
          </el-upload>
        </el-form-item>
        <el-form-item
          label="上传图片"
          :prop="'pic'"
          :rules="[{ required: true, message: '请上传图片' }]"
        >
          <el-upload
            class="upload-demo"
            ref="upload"
            action="upload"
            :on-remove="(file, fileList) => handleRemove(file, fileList, 'pic')"
            :file-list="addOrUpdateReq.pic"
            :http-request="(value) => handleExport(value, 'pic')"
            :on-error="handleError"
            :on-success="handleSuccess"
            :list-type="picture"
          >
            <el-button slot="trigger" size="small" type="primary"
              >上传图片</el-button
            >
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
          </el-upload>
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
  getTestReportList,
  setTestReportList,
  delTestReport,
  // delSysArchivesData,
} from "../../../api/occupHealth";
import { MyPagination } from "../../../components";
import { showMessage, tools } from "../../../utils";

export default {
  name: "testReport",
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
        name: "",
        time: [],
        startTime: 0,
        endTime: 0,
      },
      tableInfo: {
        size: 20,
        current: 1,
      },
      addOrUpdateReq: {
        name: "",
        content: "",
        att: [],
        pic: [],
      },
      addDialogVisible: false,
      isUpdate: false,
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
      //获取浏览器高度并计算得到表格所用高度。
      this.$nextTick(() => {
        this.Height = document.documentElement.clientHeight - 250;
      });
      // 获取接口列表
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

      getTestReportList({
        ...this.paramJson,
        current: this.tableInfo.current,
        size: this.tableInfo.size,
      })
        .then((res) => {
          if (res.data) {
            const data = res.data;
            this.tableData.listItem = [];
            console.log("data", data);
            if (data.data.records && data.data.records.length > 0) {
              const newData = [];
              data.data.records.map((item) => {
                if (item.att && item.att.length !== 0) {
                  item.att.map((x) => {
                    newData.push({
                      ...item,
                      fileName: x.name,
                      fileUrl: x.url,
                    });
                  });
                } else {
                  newData.push(item);
                }
              });
              this.tableData.listItem = newData;
            }
            this.rowspan();
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

    //获得数据相同的行数
    rowspan() {
      //每次调用清空数据
      this.spanArr = [];
      this.position = 0;
      this.tableData.listItem.forEach((item, index) => {
        if (index === 0) {
          this.spanArr.push(1);
          this.position = 0;
        } else {
          if (
            this.tableData.listItem[index].id ===
            this.tableData.listItem[index - 1].id
          ) {
            this.spanArr[this.position] += 1;
            this.spanArr.push(0);
          } else {
            this.spanArr.push(1);
            this.position = index;
          }
        }
      });
    },
    objectSpanMethod({ rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex % 2 !== 1) {
          const _row = this.spanArr[rowIndex];
          const _col = _row > 0 ? 1 : 0;
          return {
            rowspan: _row,
            colspan: _col,
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
      }
    },
    handleTurn(row) {
      window.open(row.fileUrl);
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
          setTestReportList(this.addOrUpdateReq)
            .then(() => {
              if (this.isUpdate) {
                this.$message.success(showMessage.apiMessage.updateSuccess);
              } else {
                this.$message.success(showMessage.apiMessage.addSuccess);
              }
              this.resetForm(formName);
              this.getList();
              this.addDialogVisible = false;
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
      this.$message({
        message: showMessage.fileMessage.importSuccess,
        type: "success",
      });
    },

    // 导入失败回调
    handleError() {
      this.$message({
        message: showMessage.fileMessage.importFail,
        type: "error",
      });
    },
    async handleExport(value, type) {
      const result = await tools.handleExport(value, 1);
      if (result) {
        // this.$message.success("上传成功");
        if (type === "file") {
          this.addOrUpdateReq.att.push({
            name: result.name,
            path: result.path,
          });
        } else {
          this.addOrUpdateReq.pic.push(result.path);
        }
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
          delTestReport({ id: row.id })
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
  },
};
</script>

<style lang="scss" scoped>
.menu-content {
  display: flex;
  flex-direction: row;
  .left-tree {
    // width: 20%;
    border-radius: 10px;
    box-shadow: 0 4px 8px 0 rgba(7, 17, 27, 0.1);
    overflow: auto;
    width: 260px;
    height: 460px;
    background-color: white;
  }
  .right-content {
    padding: 0 20px;
    width: 80%;
    .title {
      margin-bottom: 10px;
    }
    .content {
      border-radius: 10px;
      overflow: auto;
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;
      background: #f0f0f0;
      .menu-name {
        display: flex;
        align-items: center;
        line-height: 30px;
        justify-content: space-between;
        height: 30px;
        margin: 5px;
        width: 120px;
      }
      .sure-btn {
        position: absolute;
        bottom: 15px;
        right: 15px;
      }
    }
  }
}
</style>