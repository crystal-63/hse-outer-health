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
        <af-table-column prop="creatorName" label="发放人" width="100"></af-table-column>
        <af-table-column prop="groupName" label="班组名称" width="180"></af-table-column>
        <af-table-column prop="userName" label="员工姓名"></af-table-column>
        <af-table-column prop="postName" label="岗位名称"></af-table-column>
        <af-table-column prop="goodsName" label="用品名称" width="200">
          <template slot-scope="scope">
            <span @click="() => {if(!scope.row.goodsName) return; detailRow = scope.row; drawer1 = true}">{{ scope.row.goodsName }}</span>
          </template>
        </af-table-column>
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
          <el-form-item label="机构名称" style="margin-bottom: 5px">
            <el-select filterable size="medium" v-model="paramJson.orgNo" placeholder="请选择机构" style="width: 100%">
              <el-option v-for="item in orgOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="年份" style="margin-bottom: 5px">
            <el-date-picker v-model="paramJson.year" size="medium" type="year" placeholder="选择年" style="width: 100%;"></el-date-picker>
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
    <el-drawer ref="drawer" title="劳保用品名称" :with-header="false" :visible.sync="drawer1" direction="btt" :before-close="handleClose">
      <div class="demo-drawer__content">
        <div class="drawer_top">
          <span style="margin-left: 10px;">劳保用品名称</span>
        </div>
        <div style="width: 100%;text-align: center;padding: 20px;">{{ detailRow.goodsName }}</div>
        <div class="demo-drawer__footer">
          <el-button style="width: 100%;height: 40px;font-size: 16px;" type="primary" @click="drawer1 = false">{{ '关 闭' }}</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import { occupHealth, common } from "../../../../api";
// import { showMessage } from "../../../utils";
import { mapState } from "vuex";
import { monthList } from "../detailedList/data";
import dayjs from "dayjs";
import { MyIcon } from "../../../../components";

export default {
  name: "deptUseRecord",
  components: {
    MyIcon,
  },
  data() {
    return {
      drawer: false,
      drawer1: false,
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
      detailRow: {},
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
        this.Height = document.documentElement.clientHeight - headerHeight;
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
    handleClose(done) {
      done();
    },
  },
};
</script>
<style lang="scss" scoped>
.viewBody {
  margin-top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.demo-form-inline {
  padding: 10px 10px 60px;
}

.demo-drawer__content {
  height: 100%;
}

.demo-drawer__footer {
  width: 100%;
  position: absolute;
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