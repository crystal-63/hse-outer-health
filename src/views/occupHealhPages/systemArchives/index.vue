<template>
  <div class="viewBody">
    <div class="query-head" id="header">
      <div class="head-form">
        <el-form :inline="true" :model="paramJson" class="demo-form-inline">
          <el-form-item label="文件名称" style="margin-bottom: 0px">
            <el-input v-model="paramJson.name" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="上传人" style="margin-bottom: 0px">
            <el-input v-model="paramJson.creatorName" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="上传时间" style="margin-bottom: 0px">
            <el-date-picker size="mini" v-model="paramJson.time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </el-form-item>
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
      <el-table :span-method="objectSpanMethod" ref="multipleTable" :data="tableData.listItem" :border="true" style="width: 100%" v-loading="tableloading" :height="Height">
        <el-table-column prop="Nosort" label="序号" width="60" :align="'center'"></el-table-column>
        <el-table-column prop="name" label="文件名称"></el-table-column>
        <el-table-column prop="fileName" label="文件内容">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="handleTurn(scope.row)">
              {{
              scope.row.fileName
              }}
            </el-button>
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
        <el-form-item label="文件名称" :prop="'name'" :rules="[{ required: true, message: '请填写文件名称' }]">
          <el-input v-model="addOrUpdateReq.name"></el-input>
        </el-form-item>
        <el-form-item label="文件内容" :prop="'files'" :rules="[{ required: true, message: '请上传文件' }]">
          <el-upload class="upload-demo" ref="upload" action="upload" :on-remove="handleRemove" :file-list="addOrUpdateReq.files" :http-request="handleImport" :on-error="handleError" :on-success="handleSuccess">
            <el-button slot="trigger" size="mini" type="primary">上传文件</el-button>
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
import {
  getSysArchivesList,
  setSysArchivesData,
  delSysArchivesData,
} from "../../../api/occupHealth";
import { MyPagination } from "../../../components";
import { showMessage, tools } from "../../../utils";
import { mapState } from "vuex";

export default {
  name: "systemArchives",
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
        type: 1,
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
        type: 1,
        name: "",
        files: [],
      },
      addDialogVisible: false,
      isUpdate: false,
    };
  },
  computed: mapState({
    topMenuHeight: (state) => state.topMenuHeight,
  }),
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
      const operateHeight = document.getElementById("operate").clientHeight;
      //获取浏览器高度并计算得到表格所用高度。
      this.$nextTick(() => {
        this.Height =
          document.documentElement.clientHeight -
          headerHeight -
          operateHeight -
          this.topMenuHeight -
          70;
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

      getSysArchivesList({
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
                if (item.files && item.files.length !== 0) {
                  item.files.map((x) => {
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
              // this.tableData.listItem = newData;
              this.rowspan(newData);
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

    //获得数据相同的行数
    rowspan(newData) {
      //每次调用清空数据
      this.spanArr = [];
      this.position = 0;
      newData.forEach((item, index) => {
        if (index === 0) {
          this.spanArr.push(1);
          this.position = 0;
        } else {
          if (item.id === newData[index - 1].id) {
            this.spanArr[this.position] += 1;
            this.spanArr.push(0);
          } else {
            this.spanArr.push(1);
            this.position = index;
          }
        }
      });
      // 表格序号
      let Nosort = 0;
      for (let n in this.spanArr) {
        if (this.spanArr[n] > 0) {
          Nosort += 1;
          this.$set(newData[n], "Nosort", Nosort);
        }
      }
      this.tableData.listItem = newData;
    },
    objectSpanMethod({ rowIndex, columnIndex }) {
      if (columnIndex !== 2) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        console.log(`rowIndex =------- ${columnIndex} _col ===== ${_col}`);

        return {
          rowspan: _row,
          colspan: _col,
        };
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
      this.tableInfo.type = 1;
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
        this.addOrUpdateReq.files = [];
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
          setSysArchivesData(this.addOrUpdateReq)
            .then((res) => {
              if (res.data.code === 200) {
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
      this.isRequest = true;
      const result = await tools.handleImport(value, 1);
      if (result) {
        this.addOrUpdateReq.files.push({
          name: result.name,
          path: result.path,
        });
      } else {
        let uid = value.file.uid; // 关键作用代码，去除文件列表失败文件
        let idx = this.$refs.upload.uploadFiles.findIndex(
          (item) => item.uid === uid
        ); // 关键作用代码，去除文件列表失败文件（uploadFiles为el-upload中的ref值）
        this.$refs.upload.uploadFiles.splice(idx, 1); // 关键作用代码，去除文件列表失败文件
      }
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
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
          delSysArchivesData({ id: row.id })
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