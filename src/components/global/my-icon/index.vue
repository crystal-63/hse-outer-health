<template>
  <i :class="[icon]" :style="style" @click="click"></i>
</template>

<script>
export default {
  name: "MyIcon",
  props: {
    icon: String,
    font: Number,
    color: String,
    padding: String,
  },
  // ["icon", "font", "color", "padding"]
  computed: {
    style: function () {
      const style = {
        cursor: "pointer",
        display: "flex",
        justifyContent: "center",
      };
      this.font && (style.fontSize = this.font + "px");
      this.color && (style.color = this.color);
      this.padding && (style.padding = this.padding);
      return style;
    },
  },
  methods: {
    click(...args) {
      console.log(args);
      this.$emit("click");
    },
  },
};
</script>

<style lang="scss" scoped>
.my-icon {
  font-size: 16px;
}
</style>