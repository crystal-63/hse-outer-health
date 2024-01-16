<template>
  <div class="viewBody">
    <div class="query-head" id="header">
      <div class="head-form">
        <el-form :inline="true" :model="paramJson" class="demo-form-inline">
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
            <el-button v-if="!isEdit" type="primary" size="mini" @click="startSetUp">设置劳防清单</el-button>
            <el-button v-if="isEdit" type="primary" size="mini" @click="addApi('addApiForm')">新增班组</el-button>
            <el-button v-if="isEdit" type="primary" size="mini" @click="submitForm('addApiForm')">保存设置</el-button>
            <el-button v-if="isEdit" type="default" size="mini" @click="handleCancel">取消编辑</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="main-content" ref="maincontent">
      <!-- <el-row style="display: flex;" id="operate">
        <el-button v-if="!isEdit" type="primary" style="margin-bottom: 10px" size="mini" @click="startSetUp">设置劳防清单</el-button>
        <el-button v-if="isEdit" type="primary" style="margin-bottom: 10px" size="mini" @click="addApi('addApiForm')">新增班组</el-button>
        <el-button v-if="isEdit" type="primary" style="margin-bottom: 10px" size="mini" @click="submitForm('addApiForm')">保存设置</el-button>
        <el-button v-if="isEdit" type="default" style="margin-bottom: 10px" size="mini" @click="handleCancel">取消编辑</el-button>
      </el-row>-->
      <el-table :span-method="objectSpanMethod" ref="multipleTable" :data="tableData.listItem" :border="true" style="width: 100%" v-loading="tableloading" :height="Height">
        <el-table-column prop="Nosort" label="序号" width="60" :align="'center'"></el-table-column>
        <el-table-column prop="groupName" label="班组名称" width="180">
          <template slot-scope="scope">
            <el-input v-if="isEdit" size="mini" :disabled="scope.row.isSelect === 0 || !isEdit" v-model="scope.row.groupName" style="width: 100%" @change="(v) => handleChange(v, 'groupName', scope.row, scope.$index)"></el-input>
            <span v-else>{{ scope.row.groupName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="userId" label="员工姓名">
          <template slot-scope="scope">
            <div v-if="isEdit" class="user_input" @click="openDialog(scope.row, scope.$index)">{{ scope.row.userId ? scope.row.userName : '请选择人员'}}</div>
            <span v-else>{{ scope.row.userName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="postName" label="岗位名称"></el-table-column>
        <el-table-column prop="goodsName" label="用品名称"></el-table-column>
        <el-table-column prop="quantity" label="发放数量" width="100">
          <template slot-scope="scope">
            <el-input v-if="isEdit" size="mini" :disabled="scope.row.isSelect === 0 || !isEdit" v-model="scope.row.quantity" style="width: 100%" @change="(value) => handleChange(value,'quantity', scope.row, scope.$index)" oninput="value=value.replace(/[^\d.]/g,'')"></el-input>
            <span v-else>{{ scope.row.quantity }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="isEdit" prop="code" label="人员操作" width="75">
          <template slot-scope="scope">
            <el-button @click.stop="deleteRow(scope.row.userId)" type="text" size="mini">删除人员</el-button>
          </template>
        </el-table-column>
        <el-table-column v-if="isEdit" prop="code" label="操作" width="140">
          <template slot-scope="scope">
            <el-button @click.stop="addUserRow(scope.row, scope.$index)" type="text" size="mini">添加人员</el-button>
            <el-button @click.stop="delApi(scope.row.groupName)" type="text" size="mini">删除班组</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :visible.sync="addDialogVisible" width="600px">
      <span slot="title">人员列表</span>
      <CusOrgChartUser selectType="checkbox" :addDialogVisible="addDialogVisible" @onChange="onSelectUser"></CusOrgChartUser>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" size="mini" @click="addUser">添 加</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { occupHealth, common } from "../../../api";
import { showMessage, tools } from "../../../utils";
import { mapState } from "vuex";
import { monthList } from "./data";
import CusOrgChartUser from "../../../components/CusOrgChartUser/index.vue";
import dayjs from "dayjs";

export default {
  name: "detailedList",
  components: {
    CusOrgChartUser,
  },
  data() {
    return {
      tableloading: false,
      paramJson: {
        year: new Date(),
        month: dayjs(new Date()).month() + 1,
        id: tools.getUrlQueryString("id") || "",
      },
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
      token: tools.getUrlQueryString("token") || "",
    };
  },
  computed: mapState({
    userInfo: (state) => state.userInfo,
    topMenuHeight: (state) => state.topMenuHeight,
  }),
  created() {
    const currentUserId = sessionStorage.getItem("currentUserId");
    console.log("12412341234", currentUserId);
    if (!currentUserId) {
      this.getToken();
    } else {
      this.getList();
      this.getPostDataFn();
    }
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
          this.topMenuHeight -
          20;
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
    async getToken() {
      const token = sessionStorage.getItem("token");
      await common.loginResolveToken({ token }).then((res) => {
        console.log("res", res);
        if (res.data.data) {
          localStorage.setItem("userInfo", res.data.data);
          sessionStorage.setItem("currentUserId", res.data.data.id);
          this.$store.commit("SET_USER", res.data.data);
          localStorage.setItem("xfm_username", res.data.data.no);
          sessionStorage.removeItem("token");
          this.getPostDataFn();
          this.getList();
        } else {
          this.$router.push("/login");
        }
      });
    },
    async getList() {
      this.tableloading = true;
      const id = sessionStorage.getItem("query") || { id: "" };
      occupHealth
        .getIssueRecordDetail({
          ...this.paramJson,
          id: JSON.parse(id).id ? JSON.parse(id).id : this.paramJson.id,
          year: this.paramJson.year ? dayjs(this.paramJson.year).year() : null,
        })
        .then((res) => {
          if (res.data) {
            const data = res.data;
            this.tableData.listItem = [];
            console.log("啊啊啊啊啊", data.data);

            if (data.data.groupList && data.data.groupList.length > 0) {
              const newData = [];
              this.paramJson = {
                year: new Date(data.data.year),
                month: data.data.month,
              };
              this.status = data.data.status;
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
        .calculateGrantCount({
          month: this.paramJson.month,
          year: this.paramJson.year && dayjs(this.paramJson.year).year(),
          userIds: this.userValue.map((item) => item.userId).toString(),
        })
        .then((res) => {
          if (res.data) {
            const data = res.data;
            if (data.data.length === 0) {
              this.$message.warning("该人员还未进行劳防用品配置");
              return;
            }
            const arr = [
              {
                goodsId: "1747191453930029058",
                goodsName: "S9027系列网面安全鞋（防砸）",
                quantity: 1,
              },
              // {
              //   goodsId: "1740662165625475073",
              //   goodsName: "夏装工作服短袖",
              //   quantity: 2,
              // },
              // {
              //   goodsId: "1740662165629669378",
              //   goodsName: "电焊工作服6301",
              //   quantity: 2,
              // },
              // {
              //   goodsId: "1740662165629669379",
              //   goodsName: "警用反光背心",
              //   quantity: 2,
              // },
              // {
              //   goodsId: "1740662165629669380",
              //   goodsName: "雨衣雨裤",
              //   quantity: 2,
              // },
            ];
            const newData = JSON.parse(JSON.stringify(this.tableData.listItem));
            const newList = newData[this.operateRow].dataList;
            let num = this.operateRow;
            this.userValue.map((x, index) => {
              arr.map((item, idx) => {
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
          month: this.paramJson.month,
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
</style>