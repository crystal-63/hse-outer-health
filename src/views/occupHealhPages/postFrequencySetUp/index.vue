<template>
  <div class="viewBody">
    <div class="main-content" ref="maincontent">
      <el-row style="display: flex;" id="operate">
        <el-button v-if="!isEdit" type="primary" style="margin-bottom: 10px" size="mini" @click="() => {this.isEdit = true}">设置岗位危害因素</el-button>
        <el-button v-if="isEdit" type="primary" style="margin-bottom: 10px" size="mini" @click="addApi('addApiForm')">新增机构</el-button>
        <el-button v-if="isEdit" type="primary" style="margin-bottom: 10px" size="mini" @click="submitForm('addApiForm')">保存设置</el-button>
        <el-button v-if="isEdit" type="default" style="margin-bottom: 10px" size="mini" @click="handleCancel">取消编辑</el-button>
      </el-row>
      <el-table :span-method="objectSpanMethod" ref="multipleTable" :data="tableData.listItem" :border="true" style="width: 100%" v-loading="tableloading" :height="Height">
        <el-table-column prop="Nosort" label="序号" width="60" :align="'center'"></el-table-column>
        <el-table-column prop="orgNo" label="机构名称" width="200">
          <template slot-scope="scope">
            <el-select :disabled="!isEdit" filterable size="mini" v-model="scope.row.orgNo" placeholder="请选择机构" style="width: 100%" @change="(value) => handleChange(value, 'org')">
              <el-option v-for="item in orgOptions" :key="item.value" :label="item.label" :value="item.value" :disabled="isOrgAlready.includes(item.value)"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="postId" label="岗位" width="200">
          <template slot-scope="scope">
            <el-select filterable size="mini" :disabled="!scope.row.orgNo || !isEdit" v-model="scope.row.postId" placeholder="请选择岗位" style="width: 100%" @change="(value) => handleChange(value, 'post', scope.row.orgNo)">
              <el-option v-for="item in postOptions" :key="item.value" :label="item.label" :value="item.value" :disabled="isPostAlready.includes(item.value)"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="factorsIds" label="危害因素">
          <template slot-scope="scope">
            <el-select filterable size="mini" :disabled="!scope.row.postId || !isEdit" v-model="scope.row.factorsIds" placeholder="请选择危害因素" style="width: 100%" multiple @change="(value) => handleChange(value, 'factorsIds', scope.row.orgNo)">
              <el-option v-for="item in hazardFactorsOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column v-if="isEdit" prop="code" label="岗位操作" width="75">
          <template slot-scope="scope">
            <el-button @click.stop="deleteRow(scope.$index)" type="text" size="mini">删除岗位</el-button>
          </template>
        </el-table-column>
        <el-table-column v-if="isEdit" prop="code" label="操作" width="140">
          <template slot-scope="scope">
            <el-button @click.stop="addPost(scope.row, scope.$index)" type="text" size="mini">添加岗位</el-button>
            <el-button @click.stop="delApi(scope.row.orgNo)" type="text" size="mini">删除机构</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { occupHealth, common } from "../../../api";
import { showMessage } from "../../../utils";

export default {
  name: "postFrequencySetUp",
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
      postOptions: [],
      orgOptions: [],
      hazardFactorsOptions: [],
      isEdit: false,
      isPostAlready: [],
      isOrgAlready: [],
    };
  },
  created() {
    this.getList();
    this.getPostDataFn();
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
      occupHealth
        .getHazardFactorsList()
        .then((res) => {
          if (res.data) {
            const data = res.data;
            this.hazardFactorsOptions = data.data;
          }
        })
        .catch((e) => {
          this.tableloading = false;
          console.log("e", e);
        });
    },
    getList() {
      this.tableloading = true;
      occupHealth
        .getPostHazardList()
        .then((res) => {
          if (res.data) {
            const data = res.data;
            this.tableData.listItem = [];
            if (data.data && data.data.length > 0) {
              const newData = [];
              const orgNo = data.data.map((item) => item.orgNo);
              this.isOrgAlready = [...this.isOrgAlready, ...orgNo];
              data.data.map((item) => {
                if (item.postList && item.postList.length !== 0) {
                  const postId = item.postList.map((item) => item.postId);
                  this.isPostAlready = [...this.isPostAlready, ...postId];
                  item.postList.map((x) => {
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
      this.position = 0;
      newData.forEach((item, index) => {
        if (index === 0) {
          this.spanArr.push(1);
          this.position = 0;
        } else {
          if (item.orgNo && item.orgNo === newData[index - 1].orgNo) {
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
      if (columnIndex !== 2 && columnIndex !== 3 && columnIndex !== 4) {
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
        orgNo: null,
        postList: [],
        postId: null,
        factorsIds: [],
      });
      this.rowspan(newData);
    },
    addPost(row, index) {
      if (!row.orgNo) {
        this.$message.warning("请选择机构!");
        return;
      }
      if (!row.postId) {
        this.$message.warning("请选择岗位!");
        return;
      }
      const newData = JSON.parse(JSON.stringify(this.tableData.listItem));
      console.log("row", row, index);
      let postList = JSON.parse(JSON.stringify(row.postList));
      postList.push({
        id: index + row.postList.length + 1,
        name: "",
        distType: 0,
      });
      newData.map((item) => {
        if (row.orgNo === item.orgNo) {
          item.postList = postList;
        }
      });
      console.log("row.postList.length", row.postList.length);

      newData.splice(row.postList.length + index, 0, {
        Nosort: row.Nosort,
        orgNo: row.orgNo,
        postList,
        postId: null,
        factorsIds: null,
      });
      this.tableData.listItem = [];
      console.log("12341234324", newData);
      this.rowspan(newData);
    },

    submitForm() {
      const newList = [];
      const newData = JSON.parse(JSON.stringify(this.tableData.listItem));
      newData.map((item) => {
        const temp = newList.filter((x) => x.orgNo === item.orgNo);
        if (temp.length > 0) {
          newList.map((x) => {
            if (x.orgNo === item.orgNo) {
              x.postList.push({
                factorsIds: item.factorsIds,
                postId: item.postId,
              });
            }
          });
        } else {
          newList.push({
            ...item,
            postList: [
              {
                factorsIds: item.factorsIds,
                postId: item.postId,
              },
            ],
          });
        }
      });
      occupHealth
        .addPostHazardFactors({ dataList: newList })
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
        (item) => item.orgNo !== index
      );
      this.tableData.listItem = [];
      this.rowspan(newData);
    },
    deleteRow(index) {
      const newData = this.tableData.listItem;
      newData.splice(index, 1);
      this.tableData.listItem = [];
      console.log("rows", newData);
      this.rowspan(newData);
    },
  },
};
</script>
