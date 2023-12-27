<template>
  <div class="pagination-style">
    <el-pagination
      :page-size="pageSize"
      :page-sizes="pageSizes"
      :current-page="current"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :layout="layout"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  name: "MyPagination",

  props: {
    layout: String,
    total: Number,
    pageSize: Number,
    pageSizes: Array,
    current: Number,
  },
  created() {
    console.log("12341", this.total1, this.current);
  },
  methods: {
    handleSizeChange(val) {
      this.$emit("size-change", val);
    },

    handleCurrentChange(val) {
      this.$emit("current-change", val);
    },
  },
};
</script>