<template>
  <div class="viewBody">
    <div class="query-head" id="header">
      <div class="head-form">
        <el-form :inline="true" :model="paramJson" class="demo-form-inline">
          <el-form-item label="机构名称" style="margin-bottom: 0px">
            <el-select filterable size="mini" v-model="paramJson.orgNo" placeholder="请选择机构" style="width: 100%">
              <el-option v-for="item in orgOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="岗位名称" :prop="'postId'" style="margin-bottom: 0px">
            <el-select filterable size="mini" v-model="paramJson.postId" placeholder="请选择岗位" style="width: 100%">
              <el-option v-for="item in postOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="margin-bottom: 0px">
            <el-button type="primary" @click="onSubmit" size="mini">查询</el-button>
            <el-button @click="reSubmit" size="mini">重置</el-button>
            <el-button v-if="!isEdit" type="primary" size="mini" @click="startSetUp">设置劳防用品</el-button>
            <el-button v-if="isEdit" type="primary" size="mini" @click="submitForm('addApiForm')">保存设置</el-button>
            <el-button v-if="isEdit" type="default" size="mini" @click="handleCancel">取消编辑</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="main-content" ref="maincontent">
      <!-- <el-row style="display: flex;" id="operate">
        <el-button v-if="!isEdit" type="primary" style="margin-bottom: 10px" size="mini" @click="startSetUp">设置劳防用品</el-button>
        <el-button v-if="isEdit" type="primary" style="margin-bottom: 10px" size="mini" @click="submitForm('addApiForm')">保存设置</el-button>
        <el-button v-if="isEdit" type="default" style="margin-bottom: 10px" size="mini" @click="handleCancel">取消编辑</el-button>
      </el-row>-->
      <el-table :span-method="objectSpanMethod" ref="multipleTable" :data="tableData.listItem" :border="true" style="width: 100%" v-loading="tableloading" :height="Height">
        <el-table-column prop="Nosort" label="序号" width="60" :align="'center'"></el-table-column>
        <el-table-column prop="name" label="劳保用品类型" width="160"></el-table-column>
        <!-- <el-table-column prop="unit" label="单位" width="60"></el-table-column> -->
        <el-table-column prop="goodName" label="劳保用品"></el-table-column>
        <el-table-column prop="distTypeName" label="发放类型" width="100"></el-table-column>
        <el-table-column prop="quantity" label="发放数量" width="180" :align="'center'">
          <template slot-scope="scope">
            <el-input v-if="isEdit" size="mini" :disabled="scope.row.isSelect === 0 || !isEdit" v-model="scope.row.quantity" style="width: 100%" @change="(value) => handleChange(value,'quantity', scope.row, scope.$index)" oninput="value=value.replace(/[^\d.]/g,'')">
              <template slot="append">/{{ scope.row.unit }}</template>
            </el-input>
            <span v-else>{{ scope.row.quantity }}/{{ scope.row.unit }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="time" label="领用时间" width="180" :align="'center'">
          <template slot-scope="scope">
            <el-input v-if="isEdit" size="mini" :disabled="scope.row.isSelect === 0 || !isEdit" v-model="scope.row.time" style="width: 100%" @change="(value) => handleChange(value, 'time', scope.row, scope.$index)">
              <template slot="append">/月</template>
            </el-input>
            <span v-else>{{ scope.row.quantity }}/月</span>
          </template>
        </el-table-column>
        <el-table-column label="是否选择" width="70" prop="isSelect" :align="'center'">
          <template slot-scope="scope">
            <el-checkbox size="mini" :disabled="!isEdit" @change="(value) => handleChange(value, 'isSelect', scope.row, scope.$index)" v-model="scope.row.isSelect" :true-label="1" :false-label="0"></el-checkbox>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { occupHealth, common } from "../../../api";
import { showMessage } from "../../../utils";
import { mapState } from "vuex";

export default {
  name: "defendConfig",
  data() {
    return {
      tableloading: false,
      paramJson: { orgNo: null, postId: null },
      tableData: {
        listItem: [],
        total: 0,
      },
      Height: 250,
      isEdit: false,
      postOptions: [],
      orgOptions: [],
      isSelectOption: [
        {
          label: "是",
          value: 1,
        },
        {
          label: "否",
          value: 0,
        },
      ],
      itemsList: [],
    };
  },
  computed: mapState({
    userInfo: (state) => state.userInfo,
    topMenuHeight: (state) => state.topMenuHeight,
  }),
  created() {
    this.getPostDataFn();
    this.paramJson = {
      orgNo: this.userInfo.orgNo,
      postId: this.userInfo.postId,
    };
    this.getList();
  },
  mounted() {
    this.getHeight();
    window.addEventListener("resize", this.getHeight, false);
  },
  methods: {
    getHeight() {
      const headerHeight = document.getElementById("header").clientHeight;
      // const operateHeight = document.getElementById("operate").clientHeight;
      //获取浏览器高度并计算得到表格所用高度。
      this.$nextTick(() => {
        this.Height =
          document.documentElement.clientHeight -
          headerHeight -
          this.topMenuHeight;
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
        .getDefendConfigList(this.paramJson)
        .then((res) => {
          if (res.data) {
            const data = res.data;
            this.tableData.listItem = [];
            if (data.data && data.data.length > 0) {
              const newData = [];
              data.data.map((item) => {
                if (item.items && item.items.length !== 0) {
                  item.items.map((x) => {
                    if (x.isSelect === 1) {
                      this.itemsList.push({
                        itemId: x.itemId,
                        quantity: x.quantity,
                        time: x.time,
                      });
                    }
                    newData.push({
                      ...item,
                      itemId: x.itemId,
                      distType: x.distType,
                      distTypeName: x.distTypeName,
                      goodName: x.name,
                      isSelect: x.isSelect,
                      quantity: x.quantity,
                      time: x.time,
                    });
                  });
                } else {
                  newData.push(item);
                }
              });
              // this.tableData.listItem = newData;
              this.rowspan(newData);
            }
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
          if (item.id && item.id === newData[index - 1].id) {
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
      console.log("newData", newData);
      this.tableData.listItem = newData;
    },
    objectSpanMethod({ rowIndex, columnIndex }) {
      if (
        columnIndex !== 2 &&
        columnIndex !== 3 &&
        columnIndex !== 4 &&
        columnIndex !== 5 &&
        columnIndex !== 6
      ) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col,
        };
      }
    },
    // 查询接口
    onSubmit() {
      this.getList();
    },

    // 重置查询
    reSubmit() {
      this.paramJson.orgNo = null;
      this.paramJson.postId = null;
      this.getList();
    },
    startSetUp() {
      this.isEdit = true;
    },
    handleCancel() {
      this.isEdit = false;
      this.getList();
    },
    submitForm() {
      occupHealth
        .setDefendConfig({ ...this.paramJson, items: this.itemsList })
        .then((res) => {
          if (res.data.code === 200) {
            this.$message.success(showMessage.apiMessage.updateSuccess);
            this.isEdit = false;
            this.getList();
          }
        })
        .catch((e) => {
          console.log("e", e);
          this.$message.error(showMessage.apiMessage.updateFail);
        });
    },
    handleChange(value, type, row, index) {
      if (type === "quantity") {
        if (row.isSelect === 1) {
          this.itemsList.map((item) => {
            if (item.itemId === row.itemId) {
              item.quantity = value;
            }
          });
        }
        this.tableData.listItem.map((item) => {
          if (item.id === row.id) {
            item.items[index].quantity = value;
          }
        });
      } else if (type === "time") {
        if (row.isSelect === 1) {
          this.itemsList.map((item) => {
            if (item.itemId === row.itemId) {
              item.time = value;
            }
          });
        }
        this.tableData.listItem.map((item) => {
          if (item.id === row.id) {
            item.items[index].time = value;
          }
        });
      } else if (type === "isSelect") {
        if (value === 1) {
          this.itemsList.push({
            itemId: row.itemId,
            quantity: row.quantity,
            time: row.time,
          });
        } else {
          this.itemsList = this.itemsList.filter(
            (item) => item.itemId !== row.itemId
          );
        }
        this.tableData.listItem.map((item) => {
          if (item.id === row.id) {
            item.items[index].isSelect = Number(value);
          }
        });
      }
    },
  },
};
</script>
