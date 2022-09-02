<template>
  <el-dialog
    append-to-body
    :title="title"
    :visible.sync="visible"
    width="80%"
    top="0px"
    key="mmbLog"
    custom-class="mmb-log"
    class="mmb-log-wrapper"
  >
    <ul class="hrefList">
      <div v-for="(item, index) in data" :key="index">
        <el-button type="text" @click="link(item)">
          {{ item }}
        </el-button>
      </div>
    </ul>
  </el-dialog>
</template>

<script type="text/babel">
export default {
  data() {
    return {
      visible: false,
      title: "",
      data: [],
    };
  },
  watch: {
    visible(val) {
      if (val) {
      }
    },
  },
  mounted() {
    //
  },
  methods: {
    //
    link(item) {
      window.open(item);
    },
  },
};
</script>
<style>
.mmb-log-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}
.mmb-log {
  margin: 0;
}
.hrefList {
  max-height: 500px;
  overflow: auto;
  margin: 0;
}
</style>