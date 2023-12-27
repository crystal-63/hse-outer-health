<template>
  <div>
    <span class="span-title">{{ labelName }}：</span>
    <el-badge :value="fileTableData.listItem.length" class="item"></el-badge>
    <i class="el-icon-circle-plus-outline" @click="showFiles"></i>
    <el-dialog :visible.sync="showFileVisible" width="60%">
      <div style="display: flex; margin-bottom: 10px"></div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "MyUploader",
};
</script>
