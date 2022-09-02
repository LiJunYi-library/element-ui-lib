<template>
  <el-date-picker
    @change="onChange"
    v-model="times"
    type="monthrange"
    range-separator="至"
    start-placeholder="开始月份"
    end-placeholder="结束月份"
  >
  </el-date-picker>
</template>
<script>
export default {
  model: {
    prop: "value",
    event: "change",
  },
  data() {
    return {
      times: ['',''],
    };
  },
  watch: {
    startTime(){

    },
    endTime(){

    }

  },
  props: {
    startTime: String,
    endTime: String,
  },
  methods: {
    onChange() {
      this.$emit("update:pageIndex", this.pageIndex_);
      this.$emit("change");
    },
  },
};
</script>