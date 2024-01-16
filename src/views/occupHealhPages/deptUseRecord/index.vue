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
          <el-form-item label="年份" style="margin-bottom: 0px">
            <el-date-picker size="mini" v-model="paramJson.year" type="year" placeholder="选择年"></el-date-picker>
          </el-form-item>
          <el-form-item label="月份" style="margin-bottom: 0px">
            <el-select filterable :disabled="!paramJson.year" size="mini" v-model="paramJson.month" placeholder="请选择月" style="width: 100%">
              <el-option v-for="item in monthOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="margin-bottom: 0px">
            <el-button type="primary" @click="onSubmit" size="mini">查询</el-button>
            <el-button @click="reSubmit" size="mini">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="main-content" ref="maincontent">
      <el-table :span-method="objectSpanMethod" ref="multipleTable" :data="tableData.listItem" :border="true" style="width: 100%" v-loading="tableloading" :height="Height">
        <el-table-column prop="Nosort" label="序号" width="60" :align="'center'"></el-table-column>
        <el-table-column prop="creatorName" label="发放人" width="100"></el-table-column>
        <el-table-column prop="groupName" label="班组名称" width="180"></el-table-column>
        <el-table-column prop="userName" label="员工姓名"></el-table-column>
        <el-table-column prop="postName" label="岗位名称"></el-table-column>
        <el-table-column prop="goodsName" label="用品名称"></el-table-column>
        <el-table-column prop="quantity" label="发放数量" width="100"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { occupHealth, common } from "../../../api";
// import { showMessage } from "../../../utils";
import { mapState } from "vuex";
import { monthList } from "../detailedList/data";
import dayjs from "dayjs";

export default {
  name: "deptUseRecord",
  data() {
    return {
      tableloading: false,
      tableData: {
        listItem: [],
        total: 0,
      },
      paramJson: {
        year: new Date(),
        month: dayjs(new Date()).month() + 1,
        orgNo: null,
      },
      Height: 250,
      orgOptions: [],
      monthOptions: monthList,
    };
  },
  computed: mapState({
    userInfo: (state) => state.userInfo,
  }),
  created() {
    this.paramJson.orgNo = this.userInfo.orgNo;
    this.getPostDataFn();
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
        this.Height = document.documentElement.clientHeight - headerHeight - 60;
      });
      // 获取接口列表
    },
    // 获取岗位列表
    getPostDataFn() {
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
        .getDeptIssueRecord({
          ...this.paramJson,
          year: this.paramJson.year ? dayjs(this.paramJson.year).year() : null,
        })
        .then((res) => {
          if (res.data) {
            const data = res.data;
            this.tableData.listItem = [];
            if (data.data && data.data.length > 0) {
              const newData = [];
              data.data.map((items) => {
                items.groupList.map((item) => {
                  if (item.dataList && item.dataList.length !== 0) {
                    item.dataList.map((x) => {
                      newData.push({
                        ...items,
                        ...item,
                        ...x,
                      });
                    });
                  } else {
                    newData.push(item);
                  }
                });
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
      this.spanArr1 = [];
      this.position = 0;
      this.position1 = 1;
      this.spanArr2 = [];
      this.position2 = 1;
      newData.forEach((item, index) => {
        if (index === 0) {
          this.spanArr.push(1);
          this.spanArr1.push(1);
          this.spanArr2.push(1);
          this.position = 0;
          this.position1 = 0;
          this.position2 = 0;
        } else {
          if (
            item.creatorId &&
            item.creatorId === newData[index - 1].creatorId
          ) {
            this.spanArr2[this.position2] += 1;
            this.spanArr2.push(0);
          } else {
            this.spanArr2.push(1);
            this.position2 = index;
          }
          if (
            item.groupName &&
            item.groupName === newData[index - 1].groupName
          ) {
            this.spanArr[this.position] += 1;
            this.spanArr.push(0);
          } else {
            this.spanArr.push(1);
            this.position = index;
          }
          if (item.userId && item.userId === newData[index - 1].userId) {
            this.spanArr1[this.position1] += 1;
            this.spanArr1.push(0);
          } else {
            this.spanArr1.push(1);
            this.position1 = index;
          }
        }
      });
      // 表格序号
      let Nosort = 0;
      for (let n in this.spanArr2) {
        if (this.spanArr2[n] > 0) {
          Nosort += 1;
          this.$set(newData[n], "Nosort", Nosort);
        }
      }
      this.tableData.listItem = newData;
    },
    objectSpanMethod({ rowIndex, columnIndex }) {
      if (columnIndex === 2) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col,
        };
      } else if (columnIndex === 3 || columnIndex === 4) {
        const _row = this.spanArr1[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col,
        };
      } else if (columnIndex === 1 || columnIndex === 0) {
        const _row = this.spanArr2[rowIndex];
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
      this.paramJson.year = null;
      this.paramJson.month = null;
      this.getList();
    },
  },
};
</script>