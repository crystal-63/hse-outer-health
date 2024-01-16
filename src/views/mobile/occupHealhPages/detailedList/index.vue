<template>
  <div class="viewBody">
    <div class="query-head" id="header" style="width: 100%;display: flex;justify-content: space-between; padding: 10px 10px;margin-bottom: 0;">
      <div class="head-form" style="padding-left: 0;" @click="$router.go(-1)">
        <MyIcon class="el-icon-arrow-left" :color="'#409EFF'" :font="18"></MyIcon>
        <span style="margin-left: 0px;color: #409EFF;">返回</span>
      </div>
      <div style="text-align: center;">{{ $route.meta.title }}</div>
      <div class="head-form" style="padding-left: 0;" @click="drawer = true">
        <MyIcon class="el-icon-search" :color="'#409EFF'" :font="18"></MyIcon>
        <span style="color: #409EFF;">筛 选</span>
      </div>
    </div>
    <div class="main-content" ref="maincontent" style="padding: 0 3px;">
      <el-table :span-method="objectSpanMethod" ref="multipleTable" :data="tableData.listItem" :border="true" style="width: 100%" v-loading="tableloading" :height="Height">
        <af-table-column prop="Nosort" label="序号" width="60" :align="'center'"></af-table-column>
        <af-table-column prop="groupName" label="班组名称" width="180"></af-table-column>
        <af-table-column prop="userName" label="员工姓名" width="100" :align="'center'"></af-table-column>
        <af-table-column prop="postName" label="岗位名称"></af-table-column>
        <af-table-column prop="goodsName" label="用品名称" width="100" :align="'center'"></af-table-column>
        <af-table-column prop="quantity" label="发放数量" width="100" :align="'center'"></af-table-column>
      </el-table>
    </div>
    <el-drawer ref="drawer" title="筛选" :size="'80%'" :with-header="false" :visible.sync="drawer" direction="btt" :before-close="handleClose">
      <div class="demo-drawer__content">
        <div class="drawer_top" @click="reSubmit">
          <MyIcon class="el-icon-delete" :color="'#409EFF'" :font="18"></MyIcon>
          <span style="margin-left: 10px;color: #409EFF;">清 空</span>
        </div>
        <el-form label-position="top" :model="paramJson" class="demo-form-inline">
          <el-form-item label="年份" style="margin-bottom: 5px">
            <el-date-picker size="medium" v-model="paramJson.year" type="year" placeholder="选择年"></el-date-picker>
          </el-form-item>
          <el-form-item label="月份" style="margin-bottom: 5px">
            <el-select filterable :disabled="!paramJson.year" size="medium" v-model="paramJson.month" placeholder="请选择月" style="width: 100%">
              <el-option v-for="item in monthOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div class="demo-drawer__footer">
          <el-button style="width: 45%;height: 40px;font-size: 16px;" @click="drawer = false">取 消</el-button>
          <el-button style="width: 45%;height: 40px;font-size: 16px;" type="primary" @click="onSubmit">{{ '筛 选' }}</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import { occupHealth, common } from "../../../../api";
import { showMessage } from "../../../../utils";
import { mapState } from "vuex";
import { monthList } from "./data";
import { MyIcon } from "../../../../components";
import dayjs from "dayjs";

export default {
  name: "detailedList",
  components: {
    MyIcon,
  },
  data() {
    return {
      drawer: false,
      tableloading: false,
      paramJson: { year: new Date(), month: dayjs(new Date()).month() + 1 },
      tableData: {
        listItem: [],
        total: 0,
      },
      Height: 250,
      isEdit: false,
      postOptions: [],
      orgOptions: [],
      monthOptions: monthList,
      addDialogVisible: false,
      operateRow: 0,
      userValue: [],
      groupNameList: [],
      status: 0,
    };
  },
  computed: mapState({
    userInfo: (state) => state.userInfo,
  }),
  created() {
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
        this.Height = document.documentElement.clientHeight - headerHeight;
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
        .getIssueRecordDetail({
          ...this.paramJson,
          year: this.paramJson.year ? dayjs(this.paramJson.year).year() : null,
        })
        .then((res) => {
          if (res.data) {
            const data = res.data;
            this.tableData.listItem = [];
            if (data.data.groupList && data.data.groupList.length > 0) {
              const newData = [];
              data.data.groupList.map((item) => {
                this.groupNameList.push(item.groupName);
                if (item.dataList && item.dataList.length !== 0) {
                  item.dataList.map((x) => {
                    newData.push({
                      ...item,
                      ...x,
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
      this.spanArr1 = [];
      this.position = 0;
      this.position1 = 1;
      newData.forEach((item, index) => {
        if (index === 0) {
          this.spanArr.push(1);
          this.spanArr1.push(1);
          this.position = 0;
          this.position1 = 0;
        } else {
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
      for (let n in this.spanArr) {
        if (this.spanArr[n] > 0) {
          Nosort += 1;
          this.$set(newData[n], "Nosort", Nosort);
        }
      }
      this.tableData.listItem = newData;
    },
    objectSpanMethod({ rowIndex, columnIndex }) {
      if (columnIndex === 1 || columnIndex === 0 || columnIndex === 7) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col,
        };
      } else if (columnIndex === 2 || columnIndex === 6) {
        const _row = this.spanArr1[rowIndex];
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

    startSetUp() {
      this.isEdit = true;
    },
    handleCancel() {
      this.isEdit = false;
      this.getList();
    },
    // 新增接口
    addApi() {
      const newData = JSON.parse(JSON.stringify(this.tableData.listItem));
      newData.push({
        groupName: "",
        goodsId: null,
        quantity: null,
        userId: null,
        dataList: [
          {
            index: newData.length
              ? newData.length + newData.dataList
                ? newData.dataList.length
                : 0
              : 0,
            goodsId: null,
            quantity: null,
            userId: null,
          },
        ],
      });
      this.rowspan(newData);
    },
    addUserRow(row, index) {
      if (!row.groupName) {
        this.$message.warning("请先输入班组名称!");
        return;
      }
      const newData = JSON.parse(JSON.stringify(this.tableData.listItem));
      console.log("row", row, index + row.dataList.length);
      let dataList = JSON.parse(JSON.stringify(row.dataList));
      dataList.push({
        index: index + row.dataList.length,
        goodsId: null,
        quantity: null,
        userId: null,
      });
      newData.map((item) => {
        if (row.groupName === item.groupName) {
          item.dataList = dataList;
        }
      });
      newData.splice(row.dataList.length + index, 0, {
        Nosort: row.Nosort,
        groupName: row.groupName,
        goodsId: null,
        quantity: null,
        userId: null,
        dataList,
      });
      this.tableData.listItem = [];
      this.rowspan(newData);
    },
    openDialog(row, index) {
      if (!row.groupName) {
        this.$message.warning("请先输入班组名称！");
        return;
      }
      if (row.userId) {
        return;
      }
      this.addDialogVisible = true;
      console.log("value", row, index, row.dataList.length);
      this.operateRow = index;
    },
    // 选择添加人员
    onSelectUser(value) {
      this.userValue = value;
    },
    addUser() {
      occupHealth
        .getDeptIssueRecord({
          ...this.paramJson,
          year: this.paramJson.year && dayjs(this.paramJson.year).year(),
          userId: this.userValue.map((item) => item.userId).toString(),
        })
        .then((res) => {
          if (res.data) {
            const data = res.data;
            if (data.data.length === 0) {
              this.$message.warning("该人员还未进行劳防用品配置");
              return;
            }
            // const arr = [
            //   {
            //     goodsId: "1740662165612892161",
            //     goodsName: "涤卡工作服（秋装）",
            //     quantity: 2,
            //   },
            //   {
            //     goodsId: "1740662165625475073",
            //     goodsName: "夏装工作服短袖",
            //     quantity: 2,
            //   },
            //   {
            //     goodsId: "1740662165629669378",
            //     goodsName: "电焊工作服6301",
            //     quantity: 2,
            //   },
            //   {
            //     goodsId: "1740662165629669379",
            //     goodsName: "警用反光背心",
            //     quantity: 2,
            //   },
            //   {
            //     goodsId: "1740662165629669380",
            //     goodsName: "雨衣雨裤",
            //     quantity: 2,
            //   },
            // ];
            const newData = JSON.parse(JSON.stringify(this.tableData.listItem));
            const newList = newData[this.operateRow].dataList;
            let num = this.operateRow;
            this.userValue.map((x, index) => {
              data.data.map((item, idx) => {
                if (index === 0 && idx === 0) {
                  newList[newList.length - 1] = {
                    ...item,
                    userId: x.userId,
                  };
                  newData[num] = {
                    ...newData[0],
                    ...item,
                    userName: x.name,
                    userId: x.userId,
                    postName: x.postName,
                    dataList: [],
                  };
                  num += 1;
                } else {
                  newList.push({
                    ...item,
                    userId: x.userId,
                  });
                  newData.splice(num + 1, 0, {
                    ...item,
                    groupName:
                      this.tableData.listItem[this.operateRow].groupName,
                    userName: x.name,
                    userId: x.userId,
                    postName: x.postName,
                    dataList: [],
                  });
                  num += 1;
                }
              });
            });
            newData.map((item) => {
              if (
                item.groupName ===
                this.tableData.listItem[this.operateRow].groupName
              ) {
                item.dataList = newList;
              }
            });
            this.rowspan(newData);
            this.addDialogVisible = false;
          }
        })
        .catch((e) => {
          console.log("e", e);
        });
    },
    submitForm() {
      let obj = {};
      const newData = JSON.parse(
        JSON.stringify(this.tableData.listItem)
      ).reduce(function (item, next) {
        //item为没有重复id的数组，next为当前对象
        obj[next.groupName]
          ? ""
          : (obj[next.groupName] = true && item.push(next));
        return item;
      }, []);
      occupHealth
        .setDetailedListUser({
          ...this.paramJson,
          year: dayjs(this.paramJson.year).year(),
          groupList: newData,
        })
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
        this.tableData.listItem.map((item) => {
          if (item.groupName === row.groupName) {
            item.dataList[index].quantity = value;
          }
        });
      } else if (type === "groupName") {
        if (this.groupNameList.includes(value)) {
          this.$message.warning("班组不能重复");
          return;
        }
      }
    },
    delApi(index) {
      const newData = this.tableData.listItem.filter(
        (item) => item.groupName !== index
      );
      this.tableData.listItem = [];
      this.rowspan(newData);
    },
    deleteRow(index) {
      const newData = this.tableData.listItem.filter(
        (item) => item.userId !== index
      );
      this.tableData.listItem = [];
      this.rowspan(newData);
    },
  },
};
</script>
<style lang="scss" scoped>
.user_input {
  height: 28px;
  line-height: 27px;
  background: #fff;
  padding: 0px 10px;
  border: 1px dotted #bcbcbc;
  border-radius: 4px;
  cursor: pointer;
  // font-size: 16px;
}
.viewBody {
  margin-top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.demo-form-inline {
  padding: 10px 10px 60px;
}

.demo-drawer__footer {
  width: 100%;
  position: fixed;
  bottom: 0;
  padding: 10px;
  display: flex;
  justify-content: center;
}
.head-form {
  display: flex;
  justify-content: end;
  align-items: center;
}
.drawer_top {
  width: 100%;
  padding: 10px;
  display: flex;
  justify-content: end;
  align-items: center;
  border-bottom: 1px solid #e6e6e6;
}
::v-deep .el-pagination__sizes {
  margin: 0;
}
::v-deep .el-pagination__total {
  margin: 0;
}
</style>
