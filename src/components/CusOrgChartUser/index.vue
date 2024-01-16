<template>
  <div class="box">
    <div class="box_top">
      <ul class="field_content">
        <li class="select_item" v-for="item in selectUserList" :key="item.userId">
          <div class="avatar" :style="tranColor(item.name)">{{ item.name.substring(1, 0) }}</div>
          <span>{{ item.name }}</span>
        </li>
      </ul>
    </div>
    <el-input class="search" placeholder="请输入人员姓名" v-model="tableInfo.userName" @focus="() => {activeName = '2'; handleTabClick()}" @change="handleSearch">
      <i class="el-icon-search el-input__icon" slot="suffix"></i>
    </el-input>
    <el-tabs v-model="activeName" @tab-click="handleTabClick">
      <el-tab-pane label="组织架构" name="1">
        <el-row>
          <el-col :span="12" class="ctx_left">
            <el-tree ref="tree" node-key="id" :highlight-current="true" :data="treeData" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
          </el-col>
          <el-col :span="12" class="ctx_right">
            <div class="ctx_right_top" v-if="selectType === 'checkbox'">
              <span>已选 {{ `${nowNum} / ${total}` }}</span>
              <el-checkbox v-model="checkedAll" @change="handleCheckAll"></el-checkbox>
            </div>
            <ul class="ctx_right_list">
              <li class="ctx_right_li" v-for="item in userList" :key="item.userId">
                <div style="display: flex;align-items: center;">
                  <div class="avatar" :style="tranColor(item.name)">{{ item.name.substring(1, 0) }}</div>
                  <span style="margin-left: 10px;">{{ item.name }}</span>
                  <span style="margin-left: 10px;color: #a3a3a3;">{{ item.postName }}</span>
                </div>
                <el-checkbox v-if="selectType === 'checkbox'" v-model="checkedList[item.userId]" @change="(value) => handleCheck(value, item)"></el-checkbox>
                <el-radio v-else v-model="radioValue" :label="item.userId" @input="(value) => handleRadio(value, item)"></el-radio>
              </li>
              <el-button v-if="LoadMore" type="text" style="width: 100%; padding: 10px;" @click="handleMore">加载更多</el-button>
            </ul>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="人员列表" name="2" style="height: 300px;overflow: auto;">
        <div class="ctx_right_top" v-if="selectType === 'checkbox'">
          <span>已选 {{ `${nowNum} / ${total}` }}</span>
          <el-checkbox v-model="checkedAll1" @change="handleCheckAll"></el-checkbox>
        </div>
        <ul class="ctx_right_list">
          <li class="ctx_right_li" v-for="item in userList1" :key="item.userId">
            <div style="display: flex;align-items: center;">
              <div class="avatar" :style="tranColor(item.name)">{{ item.name.substring(1, 0) }}</div>
              <span style="margin-left: 10px;">{{ item.name }}</span>
              <span style="margin-left: 10px;color: #a3a3a3;">{{ item.orgName }}</span>
              <span style="margin-left: 10px;color: #a3a3a3;">{{ item.carName }}</span>
              <span style="margin-left: 10px;color: #a3a3a3;">{{ item.postName }}</span>
            </div>
            <el-checkbox v-if="selectType === 'checkbox'" v-model="checkedList[item.userId]" @change="(value) => handleCheck(value, item)"></el-checkbox>
            <el-radio v-else v-model="radioValue" :label="item.userId" @input="(value) => handleRadio(value, item)"></el-radio>
          </li>
          <el-button v-if="LoadMore" type="text" style="width: 100%; padding: 10px;" @click="handleMore">加载更多</el-button>
        </ul>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { common } from "../../api";

export default {
  name: "MyUserChart",
  props: {
    addDialogVisible: Boolean,
    selectType: {
      type: String,
      default: "checkbox",
    },
  },
  data() {
    return {
      activeName: "1",
      treeData: [],
      userList: [],
      userList1: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
      checkedAll: false,
      checkedAll1: false,
      total: 0,
      checkedList: {},
      selectUserList: [],
      orgNo: "",
      radioValue: "",
      tableInfo: {
        size: 20,
        current: 1,
        userName: "",
      },
      LoadMore: false,
      nowNum: 0,
    };
  },
  computed: {
    visible() {
      return this.addDialogVisible;
    },
    tranColor() {
      return (strValue) => {
        let str = "";
        for (let i = 0; i < strValue.length; i++) {
          str += parseInt(strValue[i]?.charCodeAt(0), 10).toString(16);
        }
        return { background: `#${str.slice(1, 4)}` };
      };
    },
  },
  watch: {
    visible: {
      handler(newValue) {
        if (newValue) {
          this.getTreeListFn();
          this.getUserListFn();
        } else {
          for (let key in this.checkedList) {
            this.checkedList[key] = false;
          }
          this.selectUserList = [];
          this.checkedAll = false;
          this.checkedAll1 = false;
          this.nowNum = 0;
          // this.checkedList = {};
        }
      },
      // 这里增加了一个immediate属性，说明监听到props传参后立即先去执行handler方法
      immediate: true,
    },
    userList: {
      handler(newValue) {
        const newList = Object.keys(this.checkedList);
        const arr = newValue.filter((item) => newList.includes(item.userId));
        this.nowNum = arr.length;
      },
      immediate: true,
    },
    userList1: {
      handler(newValue) {
        const newList = Object.keys(this.checkedList);
        const arr = newValue.filter((item) => newList.includes(item.userId));
        this.nowNum = arr.length;
      },
      immediate: true,
    },
    checkedList: {
      handler(newValue) {
        this.checkedList = newValue;
      },
      immediate: true,
    },
  },

  methods: {
    getTreeListFn() {
      common
        .GetOrgTreeList()
        .then((res) => {
          if (res.data) {
            const data = res.data;
            this.treeData = [];
            this.treeData = data.data;
            // this.orgNo = data.data[0].no;
            // this.$nextTick(() => {
            //   this.$refs.tree.setCurrentKey(data.data[0].id); // 默认选中节点第一个
            // });
          }
        })
        .catch((e) => {
          console.log("e", e);
        });
    },
    getUserListFn() {
      common
        .GetUserSelectList({
          ...this.tableInfo,
          orgNo: this.activeName === "2" ? "" : this.orgNo,
        })
        .then((res) => {
          if (res.data) {
            const data = res.data;
            if (this.tableInfo.current !== 1) {
              if (this.activeName === "1") {
                this.userList = [...this.userList, ...data.data.records];
              } else {
                this.userList1 = [...this.userList, ...data.data.records];
              }
            } else {
              this.userList = [];
              if (this.activeName === "1") {
                this.userList = data.data.records;
              } else {
                this.userList1 = data.data.records;
              }
            }
            if (this.activeName === "1") {
              this.total = Number(this.userList.length);
            } else {
              this.total = Number(this.userList1.length);
            }

            this.LoadMore = Boolean(
              Number(data.data.total) > Number(data.data.size)
            );
          }
        })
        .catch((e) => {
          console.log("e", e);
        });
    },
    handleTabClick() {
      this.tableInfo.size = 20;
      this.tableInfo.current = 1;
      this.tableInfo.userName = "";
      this.getUserListFn();
    },
    handleMore() {
      this.tableInfo.size = 20;
      this.tableInfo.current += 1;
      this.tableInfo.userName = "";
      this.getUserListFn();
    },
    handleNodeClick(data) {
      console.log(data);
      if (data.children.length > 0) return;
      this.tableInfo.size = 20;
      this.tableInfo.current = 1;
      this.tableInfo.userName = "";
      this.orgNo = data.no;
      this.getUserListFn();
    },
    handleRadio(value, item) {
      console.log("value", value);
      this.selectUserList = [item];
      this.$emit("onChange", [item]);
    },
    handleCheck(value, item) {
      this.checkedList[item.userId] = value;
      if (value) {
        this.selectUserList.push(item);
        this.nowNum += 1;
      } else {
        this.selectUserList = this.selectUserList.filter(
          (x) => x.userId !== item.userId
        );
        this.nowNum += -1;
      }
      this.$emit("onChange", this.selectUserList);
    },
    handleCheckAll(value) {
      if (value) {
        if (this.activeName === "1") {
          this.userList.map((item) => {
            this.checkedList[item.userId] = true;
          });
          this.selectUserList = this.userList;
          this.nowNum = this.userList.length;
        } else {
          this.userList1.map((item) => {
            this.checkedList[item.userId] = true;
          });
          this.selectUserList = this.userList1;
          this.nowNum = this.userList1.length;
        }
      } else {
        this.selectUserList.map((item) => {
          this.checkedList[item.userId] = false;
        });
        this.selectUserList = [];
        this.nowNum = 0;
      }
      this.$emit("onChange", this.selectUserList);
    },
    handleSearch(v) {
      console.log("v", v);
      this.tableInfo.size = 2000;
      this.tableInfo.current = 1;
      // this.tableInfo.userName = v;
      this.getUserListFn();
    },
  },
};
</script>
<style lang="scss" scoped>
.box {
  width: 100%;
}
.box_top {
  width: 100%;
  height: 70px;
  .avatar {
    width: 20px;
    height: 20px;
    color: #fff;
    border-radius: 50%;
    line-height: 20px;
    text-align: center;
    font-size: 12px;
  }
  .field_content {
    align-content: flex-start;
    align-items: flex-start;
    border: 1px dashed #d7d9dc;
    cursor: pointer;
    display: flex;
    flex-wrap: wrap;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 5px;
    .select_item {
      background: #f0f1f4;
      border-radius: 5px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin: 3px 0 0 5px;
      padding: 5px 10px;
    }
  }
}
.search {
  width: 260px;
  position: absolute;
  right: 20px;
  top: 22.5%;
  z-index: 99;
}
.ctx_left {
  height: 300px;
  overflow: auto;
}
.ctx_right {
  height: 300px;
  overflow: auto;
}
.ctx_right_top {
  display: flex;
  justify-content: space-between;
  padding: 5px 10px;
}
.ctx_right_list {
  .ctx_right_li {
    width: 100%;
    padding: 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .avatar {
    width: 20px;
    height: 20px;
    color: #fff;
    border-radius: 50%;
    line-height: 20px;
    text-align: center;
    font-size: 12px;
  }
}
::v-deep .el-radio__label {
  display: none !important;
}
li {
  list-style-type: none;
}
ul {
  margin: 0;
  padding: 10px;
}
.el-tabs__item {
  font-family: 400;
}
</style>