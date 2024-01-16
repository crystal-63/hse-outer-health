<template>
  <div class="viewBody">
    <div class="main-content" ref="maincontent">
      <el-row style="display: flex;" id="operate">
        <el-button type="primary" style="margin-bottom: 10px" size="mini" @click="addApi('addApiForm')">新增</el-button>
      </el-row>
      <el-table ref="multipleTable" :data="tableData.listItem" :border="true" style="width: 100%" v-loading="tableloading" :height="Height">
        <el-table-column prop="no" label="序号" width="60" :align="'center'">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column prop="name" label="危害因素"></el-table-column>
        <el-table-column prop="frequency" label="体检评率（单位：月/次）"></el-table-column>
        <el-table-column prop="isOnsite" label="是否在岗体检" :align="'center'">
          <template slot-scope="scope">
            <span v-if="scope.row.isOnsite === 1">是</span>
            <span v-else>否</span>
          </template>
        </el-table-column>
        <el-table-column prop="isPre" label="是否岗前体检" :align="'center'">
          <template slot-scope="scope">
            <span v-if="scope.row.isPre === 1">是</span>
            <span v-else>否</span>
          </template>
        </el-table-column>
        <el-table-column prop="code" label="操作">
          <template slot-scope="scope">
            <el-button @click.stop="update(scope.row)" type="text" size="mini">编辑</el-button>
            <el-button @click.stop="delApi(scope.row)" type="text" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增模态框 -->
    <el-dialog :visible.sync="addDialogVisible" width="30%">
      <span slot="title">{{ isUpdate ? "修改" : "新增" }}</span>
      <el-form :model="addOrUpdateReq" status-icon ref="addApiForm" label-width="120px" class="demo-ruleForm">
        <el-form-item label="危害因素名称" :prop="'name'">
          <el-input v-model="addOrUpdateReq.name"></el-input>
        </el-form-item>
        <el-form-item label="体检频率" :prop="'frequency'" :rules="[{ required: true, message: '请填写体检频率' }]">
          <el-input onkeyup="value=value.replace(/[^\d]/g,'')" v-model="addOrUpdateReq.frequency" placeholder="（单位：月/次）"></el-input>
        </el-form-item>
        <el-form-item label="是否在岗体检" :prop="'isOnsite'" :rules="[{ required: true, message: '请选择是否在岗体检' }]">
          <el-select filterable v-model="addOrUpdateReq.isOnsite" placeholder="请选择是否在岗体检" style="width: 100%" size="mini">
            <el-option v-for="item in isOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否岗前体检" :prop="'isPre'" :rules="[{ required: true, message: '请填写是否岗前体检' }]">
          <el-select filterable v-model="addOrUpdateReq.isPre" placeholder="请选择是否岗前体检" style="width: 100%" size="mini">
            <el-option v-for="item in isOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
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
import { occupHealth } from "../../../api";
import { showMessage } from "../../../utils";

export default {
  name: "frequencySetUp",
  data() {
    return {
      tableloading: false,
      tableData: {
        listItem: [],
        total: 0,
      },
      Height: 250,
      addOrUpdateReq: {
        id: 0,
        frequency: null,
        isOnsite: null,
        isPre: null,
        name: "",
      },
      addDialogVisible: false,
      isUpdate: false,
      type: "add",
      isOptions: [
        {
          label: "否",
          value: 0,
        },
        {
          label: "是",
          value: 1,
        },
      ],
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
      const operateHeight = document.getElementById("operate").clientHeight;
      //获取浏览器高度并计算得到表格所用高度。
      this.$nextTick(() => {
        this.Height =
          document.documentElement.clientHeight - operateHeight - 50;
      });
      // 获取接口列表
    },
    getList() {
      this.tableloading = true;
      occupHealth
        .getHazardFactorsList()
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
    // 新增接口
    addApi(formName) {
      this.addDialogVisible = true;
      console.log("formName", formName);
      this.type = "add";
      try {
        this.addOrUpdateReq.name = "";
        this.addOrUpdateReq.frequency = null;
        this.addOrUpdateReq.isOnsite = null;
        this.addOrUpdateReq.isPre = null;
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
      this.type = "edit";
      this.addOrUpdateReq = JSON.parse(JSON.stringify(data));
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.type === "add") {
            occupHealth
              .setHazardFactors({
                ...this.addOrUpdateReq,
                frequency: Number(this.addOrUpdateReq.frequency),
              })
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
          } else {
            occupHealth
              .editHazardFactors({
                ...this.addOrUpdateReq,
                frequency: Number(this.addOrUpdateReq.frequency),
              })
              .then((res) => {
                if (res.data.code === 200) {
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
          occupHealth
            .delHazardFactors({ id: row.id })
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
