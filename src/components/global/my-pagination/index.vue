<template>
  <div class="pagination-style">
    <el-pagination
      background
      :layout="layout"
      :total="total"
      :page-size="pageSize"
      :page-sizes="pageSizes"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
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