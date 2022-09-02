<template>
  <div class="mmb-select">
    <div v-if="label" class="mmb-select-label">{{ label }}</div>
    <el-select
      v-model="state"
      :style="`width: ${width}`"
      :placeholder="placeholder"
      :filterable="filterable"
      @change="changeVal"
    >
      <el-option
        v-for="(item, id) in responseData_"
        :key="id"
        :label="formatterLabel(item)"
        :value="formatterValue(item)"
      />
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
    label: String,
    width: { type: String, default: "auto" },
    filterable: { type: [Boolean], default: true },
    defaultIndex: { type: Number, default: 0 },
    current: { type: [String, Number, Object], default: "" },
    value: { type: [String, Number, Object], default: "" },
    placeholder: { type: String, default: "请选择" },
    labelValue: String,
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
  },
  data() {
    return {
      state: this.value,
      currentItem: {},
    };
  },
  computed: {},
  watch: {
    state(newV) {
      this.$emit("change", this.state);
      const current = this.responseData_.find(
        (el) => newV === this.formatterValue(el)
      );
      if (current) {
        this.currentItem = current;
        this.$emit("update:current", current);
        this.$emit("update:labelValue", this.formatterLabel(current));
      }
    },
    responseData() {
      this.setDefaultstate();
    },
  },
  created() {
    if (!this.fetchData && this.responseData_ && this.responseData_.length) {
      this.setDefaultstate();
    }
  },
  mounted() {
    console.log(this);
  },
  methods: {
    formatterState(val) {
      if (val === 0) return "";
      return val;
    },
    changeVal() {},
    afterFetch() {
      this.setDefaultstate();
    },
    setDefaultstate() {
      if (this.defaultIndex < 0) return;
      const state = this.responseData_[this.defaultIndex];
      try {
        this.state = this.formatterValue(state);
      } catch {
        this.state = "";
      }
      console.log(this.state);
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
