<template>
  <div v-loading="loading" :class="filterBlur ? `filterBlur6` : ''">
    <slot :responseData="responseData_" :loading="loading" />
  </div>
</template>
<script>
import { QueuePromise } from "../utils/index.js";

export default {
  name: "r-asyncTemplate",
  provide() {
    return {
      asyncTemplate: this,
    };
  },
  props: {
    filterBlur: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    fetchData: Function,
    isAwait: { type: Boolean, default: false },
    isLoad: { type: Boolean, default: false },
  },
  data() {
    if (!this.fetchData.original) {
      const original = this.fetchData;
      const copyFetch = async (...arg) => {
        const res = await original(...arg);
        return res;
      };
      // eslint-disable-next-line
      this.fetchData.original = copyFetch;
      // eslint-disable-next-line
      this.fetchData.originals = [];
      // eslint-disable-next-line
      this.fetchData.fetchArg = [];
      // eslint-disable-next-line
      this.fetchData.queuePromise = new QueuePromise((resolve, reject) => {
        this.fetchData
          .original(...this.fetchData.fetchArg)
          .then((res) => {
            resolve(res);
          })
          .catch((res) => {
            reject(res);
          });
      });
    }

    //
    if (!this.fetchData.originals.includes(this)) {
      // eslint-disable-next-line
      this.fetchData.originals.push(this);
    }
    const fetch = async (...arg) => {
      if (this.isAwait && this.isLoad) return;
      this.$emit("update:isLoad", true);
      this.fetchData.originals.forEach((vm) => {
        vm.beforeFetch();
      });
      // eslint-disable-next-line
      this.fetchData.fetchArg = [...arg];
      const responseData = await this.fetchData.queuePromise;
      // this.log(responseData);
      this.fetchData.originals.forEach((vm) => {
        vm.afterFetch(responseData);
      });
      this.$emit("update:isLoad", false);
    };
    fetch.original = this.fetchData.original;
    fetch.originals = this.fetchData.originals;
    fetch.fetchArg = this.fetchData.fetchArg;
    fetch.queuePromise = this.fetchData.queuePromise;

    return {
      loading_: this.loading,
      responseData_: {},
      items: [],
      fetch,
    };
  },
  beforeCreate() {},
  beforeDestroy() {
    const index = this.fetchData.originals.findIndex((vm) => vm === this);
    if (index >= 0) {
      // eslint-disable-next-line
      this.fetchData.originals.splice(index, 1);
    }
  },
  created() {
    this.$emit("update:fetchData", this.fetch);
  },
  methods: {
    log(...arg) {
      console.log("%c%s", "color: green;", "asyncTemplate———————————");
      console.log(...arg);
      console.log("                 ");
    },
    nextTick() {
      return new Promise((resolve) => {
        this.$nextTick(() => {
          resolve(true);
        });
      });
    },
    beforeFetch() {
      this.loading_ = true;
      this.items.forEach((item) => {
        item.loading_ = true;
      });
    },
    afterFetch(data) {
      this.loading_ = false;
      this.responseData_ = data;
      this.items.forEach((item) => {
        if (item.fetchData_) item.fetchData_(this.responseData_);
        item.loading_ = false;
      });
    },
  },
};
</script>
