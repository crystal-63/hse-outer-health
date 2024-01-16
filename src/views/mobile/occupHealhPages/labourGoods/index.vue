<template>
  <div class="viewBody">
    <div class="query-head" id="header" style="width: 100%;display: flex;justify-content: space-between; padding: 10px 10px;margin-bottom: 0;">
      <div class="head-form" style="padding-left: 0;" @click="$router.go(-1)">
        <MyIcon class="el-icon-arrow-left" :color="'#409EFF'" :font="18"></MyIcon>
        <span style="margin-left: 0px;color: #409EFF;">返回</span>
      </div>
      <div style="text-align: center;">{{ $route.meta.title }}</div>
      <div class="head-form"></div>
    </div>
    <div class="main-content" ref="maincontent" style="padding: 0 3px;">
      <el-table :span-method="objectSpanMethod" ref="multipleTable" :data="tableData.listItem" :border="true" style="width: 100%" v-loading="tableloading" :height="Height">
        <el-table-column prop="Nosort" label="序号" width="60" :align="'center'"></el-table-column>
        <el-table-column prop="name" label="劳保用品类型" min-width="120"></el-table-column>
        <el-table-column prop="unit" label="单位" :align="'center'" width="70"></el-table-column>
        <el-table-column prop="goodName" label="劳保用品" width="200">
          <template slot-scope="scope">
            <span class="cell1" style="color: #409eff;" @click="() => {detailRow = scope.row; drawer = true}">{{ scope.row.goodName }}</span>
          </template>
        </el-table-column>
        <!-- <af-table-column prop="goodName" label="劳保用品"></af-table-column> -->
        <el-table-column prop="distType" label="发放类型" :align="'center'" width="100">
          <template slot-scope="scope">
            <div>{{ `${scope.row.distType === 0 ? '全员': scope.row.distType === 1 ? '男' : '女'}` }}</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-drawer ref="drawer" title="筛选" :with-header="false" :visible.sync="drawer" direction="btt" :before-close="handleClose">
      <div class="demo-drawer__content">
        <div class="drawer_top" @click="drawer = false">
          <span style="margin-left: 10px;">劳保用品名称</span>
        </div>
        <div style="width: 100%;text-align: center;padding: 20px;">{{ detailRow.goodName }}</div>
        <div class="demo-drawer__footer">
          <el-button style="width: 100%;height: 40px;font-size: 16px;" type="primary" @click="drawer = false">{{ '关 闭' }}</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { occupHealth } from "../../../../api";
import { showMessage } from "../../../../utils";
import { MyIcon } from "../../../../components";

export default {
  name: "labourGoods",
  components: {
    MyIcon,
  },
  data() {
    return {
      drawer: false,
      tableloading: false,
      tableData: {
        listItem: [],
        total: 0,
      },
      Height: 250,
      distTypeOptions: [
        {
          label: "全员",
          value: 0,
        },
        {
          label: "男",
          value: 1,
        },
        {
          label: "女",
          value: 2,
        },
      ],
      isEdit: false,
      detailRow: {},
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
      const headerHeight = document.getElementById("header").clientHeight;
      //获取浏览器高度并计算得到表格所用高度。
      this.$nextTick(() => {
        this.Height = document.documentElement.clientHeight - headerHeight;
      });
      // 获取接口列表
    },
    getList() {
      this.tableloading = true;
      occupHealth
        .getLabourGoodsList()
        .then((res) => {
          if (res.data) {
            const data = res.data;
            this.tableData.listItem = [];
            if (data.data && data.data.length > 0) {
              const newData = [];
              data.data.map((item) => {
                if (item.items && item.items.length !== 0) {
                  item.items.map((x) => {
                    newData.push({
                      ...item,
                      index: item.id,
                      distType: x.distType,
                      goodId: x.id,
                      goodName: x.name,
                    });
                  });
                } else {
                  newData.push({ ...item, index: item.id });
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
          if (item.index && item.index === newData[index - 1].index) {
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
      if (columnIndex !== 3 && columnIndex !== 4 && columnIndex !== 5) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col,
        };
      }
    },
    handleCancel() {
      this.isEdit = false;
      this.getList();
    },
    // 新增接口
    addApi() {
      const newData = JSON.parse(JSON.stringify(this.tableData.listItem));
      newData.push({
        index: newData.length + 1,
        items: [
          {
            index: newData.length + 1,
            name: "",
            distType: 0,
          },
        ],
        goodId: newData.length + 1,
        goodName: "",
        name: "",
        distType: 0,
        unit: "",
      });
      this.rowspan(newData);
    },
    addPost(row, index) {
      if (!row.name) {
        this.$message.warning("请输入劳保用品类型!");
        return;
      }
      const newData = JSON.parse(JSON.stringify(this.tableData.listItem));
      console.log("row", row, index, row.items);
      let items = JSON.parse(JSON.stringify(row.items));
      items.push({
        index: index + row.items.length + 1,
        name: "",
        distType: 0,
      });
      newData.map((item) => {
        if (row.orgNo === item.orgNo) {
          item.items = items;
        }
      });

      newData.splice(index + row.items.length + 1, 0, {
        Nosort: row.Nosort,
        index: row.index,
        items,
        goodId: index + row.items.length,
        goodName: "",
        name: row.name,
        distType: 0,
        unit: row.unit,
      });
      console.log("items", items);
      this.tableData.listItem = [];
      this.rowspan(newData);
    },

    submitForm() {
      const newList = [];
      const newData = JSON.parse(JSON.stringify(this.tableData.listItem));
      newData.map((item) => {
        const temp = newList.filter((x) => x.index === item.index);
        if (temp.length > 0) {
          newList.map((x) => {
            if (x.index === item.index) {
              x.items.push({
                distType: item.distType,
                index: item.goodId,
                name: item.goodName,
              });
            }
          });
        } else {
          newList.push({
            ...item,
            items: [
              {
                distType: item.distType,
                index: item.goodId,
                name: item.goodName,
              },
            ],
          });
        }
      });
      occupHealth
        .setLabourGoods({ data: newList })
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
    handleChange(value, type) {
      if (type === "post") {
        this.isPostAlready.push(value);
      } else if (type === "org") {
        this.isOrgAlready.push(value);
      } else if (type === "factorsIds") {
        // this.isOrgAlready.push(value);
      }
    },
    handleClose(done) {
      done();
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
  // justify-content: end;
  align-items: center;
  border-bottom: 1px solid #e6e6e6;
}
::v-deep .el-pagination__sizes {
  margin: 0;
}
::v-deep .el-pagination__total {
  margin: 0;
}
// .cell1 {
//   white-space: nowrap;
//   text-overflow: ellipsis;
//   word-break: break-all;
//   overflow: hidden;
// }
::v-deep .el-table .cell {
  white-space: inherit;
}
</style>
