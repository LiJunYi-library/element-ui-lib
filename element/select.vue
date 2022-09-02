<template>
  <div class="mmb-select">
    <div v-if="label" class="mmb-select-label">{{ label }}</div>
    <el-select
      :size="size"
      v-model="state"
      :style="`width: ${width}`"
      :placeholder="placeholder"
      :filterable="filterable"
      :clearable="clearable"
      :remote="remote"
      :reserveKeyword="reserveKeyword"
      :remote-method="remoteMethod_"
      @change="onChange"
      @clear="onClear"
      @visible-change="visibleChange"
      :loading="loading_"
    >
      <el-option
        v-for="(item, id) in responseData_"
        :key="id"
        :label="formatterLabel(item)"
        :value="formatterValue(item)"
        :disabled="formatterDisabled(item)"
      >
        <slot name="item" :item="item" />
      </el-option>
    </el-select>
    <slot :currentItem="currentItem" />
  </div>
</template>
<script>
import fetchOptions from "../mixins/fetchOptions";

export default {
  mixins: [fetchOptions],
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    current: { type: [String, Number, Object], default: "" },
    value: { type: [String, Number, Object], default: "" },
    labelValue: String,
    keyWord: String,

    size: String,
    label: String,
    width: { type: String, default: "auto" },
    remote: Boolean,
    reserveKeyword: Boolean,
    remoteMethod: Function,
    clearable: { type: [Boolean], default: true },
    filterable: { type: [Boolean], default: true },
    defaultIndex: { type: Number, default: 0 },
    placeholder: { type: String, default: "请选择" },
    isSetDefaultstate: Boolean,
    formatterLabel: {
      type: Function,
      default: (data) => {
        return data;
      },
    },
    formatterValue: {
      type: Function,
      default: (data) => {
        return data;
      },
    },
    formatterDisabled:{
      type: Function,
      default: (data) => {
        return false;
      },
    }
  },
  data() {
    // console.log("this.responseData_", this.responseData_);
    let state;
    if (!this.responseData_) state = this.labelValue || this.value;
    return {
      state,
      currentItem: {},
    };
  },
  updated() {
    // console.log(this);
    // console.log(this.responseData_);
  },
  computed: {},
  watch: {
    value(newV) {
      this.state = newV;
      this.setCurrent();
    },
    state(newV) {},
    responseData() {
      this.setDefaultstate();
    },
  },
  created() {
    if (!this.fetchData && this.responseData_ && this.responseData_.length) {
      this.setDefaultstate();
    }
  },
  methods: {
    onChange() {
      this.$emit("change", this.state);
      this.setCurrent();
    },
    onClear() {
      this.$emit("clear", this.state);
      this.setCurrent();
    },
    afterFetch() {
      this.setDefaultstate();
    },
    setCurrent() {
      this.currentItem = this.responseData_.find(
        (el) => this.state === this.formatterValue(el)
      );
      this.$emit("update:current", this.currentItem);
      this.$emit(
        "update:labelValue",
        this.formatterLabel(this.currentItem || {})
      );
    },

    remoteMethod_(keyWord) {
      this.$emit("update:keyWord", keyWord);
      this.$emit("input", keyWord);
    },
    visibleChange(bool) {
      if (bool) this.$emit("onPull", this.state);
      else this.$emit("onPut", this.state);
    },

    setDefaultstate() {
      if (this.defaultIndex === undefined) return;
      if (this.defaultIndex < 0) return;
      this.currentItem = this.responseData_[this.defaultIndex];
      this.$emit("update:current", this.currentItem);
      this.state = this.formatterValue(this.currentItem);
      this.$emit(
        "update:labelValue",
        this.formatterLabel(this.currentItem || {})
      );
      this.$emit("change", this.state);
    },
  },
};
</script>
<style lang="scss">
.mmb-select {
  display: inline-flex;
  align-items: center;
  .mmb-select-label {
    padding-right: 10px;
    min-width: 50px;
    text-align: right;
  }
}
</style>
