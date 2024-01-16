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
      <el-table ref="multipleTable" :data="tableData.listItem" :border="true" style="width: 100%" v-loading="tableloading" :height="Height">
        <el-table-column prop="no" label="序号" width="60" :align="'center'">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column prop="no" label="体检编号"></el-table-column>
        <el-table-column prop="userNo" label="用户编号"></el-table-column>
        <el-table-column prop="name" label="用户名称"></el-table-column>
        <el-table-column prop="sex" label="性别" width="60" :align="'center'"></el-table-column>
        <el-table-column prop="age" label="年龄" width="60" :align="'center'"></el-table-column>
        <!-- <el-table-column prop="companyNo" label="公司编号"></el-table-column>
        <el-table-column prop="companyName" label="公司名称"></el-table-column>-->
        <el-table-column prop="orgNo" label="机构编号"></el-table-column>
        <el-table-column prop="orgName" label="机构名称"></el-table-column>
        <el-table-column prop="postName" label="岗位名称"></el-table-column>
        <el-table-column prop="tabooContent" label="禁忌内容"></el-table-column>
        <el-table-column prop="harmAge" label="接害工龄"></el-table-column>
        <el-table-column prop="harm" label="接害因素"></el-table-column>
        <el-table-column prop="abnormal" label="异常指标"></el-table-column>
        <el-table-column prop="conclusion" label="结论"></el-table-column>
        <el-table-column prop="proposal" label="医学建议"></el-table-column>
      </el-table>
      <my-pagination :total="Number(tableData.total)" :current="tableInfo.current" :page-size="tableInfo.size" :page-sizes="[20, 50, 100, 200, 300]" @size-change="changeSize" @current-change="changePage" :layout="'total, sizes, prev, pager, next'"></my-pagination>
    </div>
    <el-drawer ref="drawer" title="筛选" :size="'80%'" :with-header="false" :visible.sync="drawer" direction="btt" :before-close="handleClose">
      <div class="demo-drawer__content">
        <div class="drawer_top" @click="reSubmit">
          <MyIcon class="el-icon-delete" :color="'#409EFF'" :font="18"></MyIcon>
          <span style="margin-left: 10px;color: #409EFF;">清 空</span>
        </div>
        <el-form label-position="top" :model="paramJson" class="demo-form-inline">
          <el-form-item label="员工姓名" style="margin-bottom: 5px">
            <el-input v-model="paramJson.userName" size="medium"></el-input>
          </el-form-item>
          <el-form-item label="禁忌名称" style="margin-bottom: 5px">
            <el-input v-model="paramJson.tabooName" size="medium"></el-input>
          </el-form-item>
          <el-form-item label="机构名称" style="margin-bottom: 5px">
            <el-select filterable v-model="paramJson.org" placeholder="请选择机构" style="width: 100%" size="medium">
              <el-option v-for="item in orgOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="岗位" :prop="'postId'" style="margin-bottom: 5px">
            <el-select filterable v-model="paramJson.postId" placeholder="请选择岗位" style="width: 100%" size="medium">
              <el-option v-for="item in postOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
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
import { MyPagination, MyIcon } from "../../../../components";

export default {
  name: "occupTaboos",
  components: {
    MyPagination,
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
      paramJson: {
        checkEndTime: 0,
        checkStartTime: 0,
        checkType: "",
        nextCheckEndTime: 0,
        nextCheckStartTime: 0,
        overdueTime: 0,
        org: null,
        userName: "",
        postId: null,
        checkTime: [],
        nextCheckTime: [],
      },
      tableInfo: {
        size: 20,
        current: 1,
      },
      postOptions: [],
      orgOptions: [],
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
      const headerHeight = document.getElementById("header").clientHeight;
      //获取浏览器高度并计算得到表格所用高度。
      this.$nextTick(() => {
        this.Height = document.documentElement.clientHeight - headerHeight - 50;
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
        .getHealthUserTabooList({
          ...this.paramJson,
          current: this.tableInfo.current,
          size: this.tableInfo.size,
        })
        .then((res) => {
          if (res.data) {
            const data = res.data;
            this.tableData.listItem = [];
            if (data.data.records && data.data.records.length > 0) {
              this.tableData.listItem = data.data.records;
            }
            this.tableData.total = data.data.total;
            // this.tableData.getNo(res.data.current, res.data.size);
            this.tableloading = false;
          }
        })
        .catch((e) => {
          this.tableloading = false;
          console.log("e", e);
        });
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
        if (key === "postId") {
          this.paramJson[key] = null;
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