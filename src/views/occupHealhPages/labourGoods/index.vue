<template>
  <div class="viewBody">
    <div class="main-content" ref="maincontent">
      <el-row style="display: flex;" id="operate">
        <el-button v-if="!isEdit" type="primary" style="margin-bottom: 10px" size="mini" @click="() => {this.isEdit = true}">设置劳防用品</el-button>
        <el-button v-if="isEdit" type="primary" style="margin-bottom: 10px" size="mini" @click="addApi('addApiForm')">新增劳防用品类型</el-button>
        <el-button v-if="isEdit" type="primary" style="margin-bottom: 10px" size="mini" @click="submitForm('addApiForm')">保存设置</el-button>
        <el-button v-if="isEdit" type="default" style="margin-bottom: 10px" size="mini" @click="handleCancel">取消编辑</el-button>
      </el-row>
      <el-table :span-method="objectSpanMethod" ref="multipleTable" :data="tableData.listItem" :border="true" style="width: 100%" v-loading="tableloading" :height="Height">
        <el-table-column prop="Nosort" label="序号" width="60" :align="'center'"></el-table-column>
        <el-table-column prop="name" label="劳保用品类型" width="200">
          <template slot-scope="scope">
            <el-input v-if="isEdit" size="mini" :disabled="!isEdit" v-model="scope.row.name" style="width: 100%"></el-input>
            <span v-else>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="unit" label="单位" width="100" :align="'center'">
          <template slot-scope="scope">
            <el-input v-if="isEdit" size="mini" :disabled="!isEdit" v-model="scope.row.unit" style="width: 100%"></el-input>
            <span v-else>{{ scope.row.unit }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="goodName" label="劳保用品">
          <template slot-scope="scope">
            <el-input v-if="isEdit" size="mini" :disabled="!scope.row.name || !isEdit" v-model="scope.row.goodName" placeholder="请输入劳保用品名称" style="width: 100%"></el-input>
            <span v-else>{{ scope.row.goodName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="distType" label="发放类型" width="100" :align="'center'">
          <template slot-scope="scope">
            <el-select v-if="isEdit" filterable size="mini" :disabled="!scope.row.name || !isEdit" v-model="scope.row.distType" placeholder="请选择发放类型" style="width: 100%" @change="(value) => handleChange(value, 'factorsIds', scope.row.orgNo)">
              <el-option v-for="item in distTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <span v-else>{{ `${scope.row.distType === 0 ? '全员': scope.row.distType === 1 ? '男' : '女'}` }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="isEdit" prop="code" label="用品操作" width="75">
          <template slot-scope="scope">
            <el-button @click.stop="deleteRow(scope.$index)" type="text" size="mini">删除用品</el-button>
          </template>
        </el-table-column>
        <el-table-column v-if="isEdit" prop="code" label="操作" width="140">
          <template slot-scope="scope">
            <el-button @click.stop="addPost(scope.row, scope.$index)" type="text" size="mini">添加用品</el-button>
            <el-button @click.stop="delApi(scope.row.id)" type="text" size="mini">删除类型</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { occupHealth } from "../../../api";
import { showMessage } from "../../../utils";

export default {
  name: "labourGoods",
  data() {
    return {
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

    delApi(index) {
      const newData = this.tableData.listItem.filter(
        (item) => item.index !== index
      );
      this.tableData.listItem = [];
      this.rowspan(newData);
    },
    deleteRow(index) {
      const newData = this.tableData.listItem;
      newData.splice(index, 1);
      this.tableData.listItem = [];
      this.rowspan(newData);
    },
  },
};
</script>
