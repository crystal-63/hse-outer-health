<template>
  <div class="viewBody">
    <div class="query-head">
      <div class="head-form">
        <el-form :inline="true" :model="paramJson" class="demo-form-inline">
          <el-form-item label="文件名称" style="margin-bottom: 0px">
            <el-input v-model="paramJson.name" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="上传人" style="margin-bottom: 0px">
            <el-input v-model="paramJson.creatorName" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="上传时间" style="margin-bottom: 0px">
            <el-date-picker
              size="mini"
              v-model="paramJson.time"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item style="margin-bottom: 0px">
            <el-button type="primary" @click="onSubmit" size="mini"
              >查询</el-button
            >
            <el-button @click="reSubmit" size="mini">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="main-content" ref="maincontent">
      <el-button
        type="primary"
        style="margin-bottom: 10px"
        size="mini"
        @click="addApi('addApiForm')"
        >新增</el-button
      >
      <el-table
        :span-method="objectSpanMethod"
        ref="multipleTable"
        :data="tableData.listItem"
        :border="true"
        style="width: 100%"
        v-loading="tableloading"
        :height="Height"
      >
        <el-table-column prop="no" label="序号" width="60"></el-table-column>
        <el-table-column prop="name" label="文件名称"></el-table-column>
        <el-table-column prop="files" label="文件内容"></el-table-column>
        <el-table-column prop="creatorName" label="上传者"></el-table-column>
        <el-table-column prop="createTime" label="上传时间"></el-table-column>
        <el-table-column prop="code" label="操作">
          <template slot-scope="scope">
            <el-button @click.stop="update(scope.row)" type="text" size="mini"
              >编辑</el-button
            >
            <el-button @click.stop="delApi(scope.row)" type="text" size="mini"
              >删除</el-button
            >
          </template>
        </el-table-column>
        <my-pagination
          :total="tableData.total"
          :page-size="tableInfo.size"
          @size-change="changeSize"
          @current-change="changePage"
        ></my-pagination>
      </el-table>
    </div>
  </div>
</template>

<script>
import { getSysArchivesList } from "../../../api/occupHealth";
import { DataParse } from "@wj/common";
import { MyPagination } from "../../../components";

export default {
  name: "systemArchives",
  components: {
    MyPagination,
  },
  data() {
    return {
      tableloading: false,
      tableData: new DataParse(),
      Height: 250,
      paramJson: {
        creatorName: "",
        name: "",
        time: [],
        startTime: 0,
        endTime: 0,
      },
      tableInfo: {
        size: 20,
        current: 1,
      },
      addOrUpdateReq: {},
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
      //获取浏览器高度并计算得到表格所用高度。
      this.$nextTick(() => {
        this.Height = document.documentElement.clientHeight - 250;
      });
      // 获取接口列表
    },
    getList() {
      this.tableloading = true;
      console.log("tableInfo", this.tableInfo);
      if (this.paramJson.time && this.paramJson.time.length !== 0) {
        this.paramJson.startTime = this.paramJson.time[0].valueOf();
        this.paramJson.endTime = this.paramJson.time[1].valueOf();
      } else {
        delete this.paramJson.startTime;
        delete this.paramJson.endTime;
      }

      getSysArchivesList({
        ...this.paramJson,
        current: this.tableInfo.current,
        size: this.tableInfo.size,
      })
        .then((res) => {
          if (res.data) {
            this.tableData.listItem = [];
            this.tableData.listItem = res.data.records.map((item) => {
              if (item.files && item.files.length !== 0) {
                item.files.map((x) => {
                  return {
                    ...item,
                    ...x,
                  };
                });
              } else {
                return item;
              }
            });
            this.tableData.total = res.data.total;
            this.tableData.getNo(res.data.current, res.data.size);
            this.tableloading = false;
          }
        })
        .catch((e) => {
          this.tableloading = false;
          console.log("e", e);
        });
    },

    //获得数据相同的行数
    rowspan() {
      //每次调用清空数据
      this.spanArr = [];
      this.position = 0;
      this.tableData.listItem.forEach((item, index) => {
        if (index === 0) {
          this.spanArr.push(1);
          this.position = 0;
        } else {
          if (
            this.tableData.listItem[index].id ===
            this.tableData.listItem[index - 1].id
          ) {
            this.spanArr[this.position] += 1;
            this.spanArr.push(0);
          } else {
            this.spanArr.push(1);
            this.position = index;
          }
        }
      });
    },
    objectSpanMethod({ rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex % 2 !== 1) {
          const _row = this.spanArr[rowIndex];
          const _col = _row > 0 ? 1 : 0;
          return {
            rowspan: _row,
            colspan: _col,
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
      }
    },

    // 查询接口
    onSubmit() {
      this.getList();
    },

    // 重置查询
    reSubmit() {
      this.tableInfo.current = 1;
      this.tableInfo.size = 20;
      for (var key in this.paramJson) {
        if (key === "time") {
          this.paramJson[key] = [];
        } else if (key === "startTime" || key === "endTime") {
          this.paramJson[key] = 0;
        } else {
          this.paramJson[key] = "";
        }
      }
      this.getList();
    },
    // 分页
    changeSize(index) {
      this.tableInfo.size = index;
      this.getList();
    },
    changePage(index) {
      this.tableInfo.current = index;
      this.getList();
    },

    // 新增接口
    addApi(formName) {
      // this.addOrUpdateReq = new addOrUpdateReq();
      this.addDialogVisible = true;
      try {
        this.$refs[formName].resetFields();
      } catch (error) {
        console.log("error", error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.menu-content {
  display: flex;
  flex-direction: row;
  .left-tree {
    // width: 20%;
    border-radius: 10px;
    box-shadow: 0 4px 8px 0 rgba(7, 17, 27, 0.1);
    overflow: auto;
    width: 260px;
    height: 460px;
    background-color: white;
  }
  .right-content {
    padding: 0 20px;
    width: 80%;
    .title {
      margin-bottom: 10px;
    }
    .content {
      border-radius: 10px;
      overflow: auto;
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;
      background: #f0f0f0;
      .menu-name {
        display: flex;
        align-items: center;
        line-height: 30px;
        justify-content: space-between;
        height: 30px;
        margin: 5px;
        width: 120px;
      }
      .sure-btn {
        position: absolute;
        bottom: 15px;
        right: 15px;
      }
    }
  }
}
</style>