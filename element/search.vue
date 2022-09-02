<template>
  <div
    class="mmb-serach"
    :style="`height:${height};width: ${width};border-radius: ${radius};${cssStyle}`"
  >
    <el-autocomplete
      v-model="state"
      :clearable="clearable"
      class="mmb-serach-input"
      :fetch-suggestions="querySearch"
      :placeholder="placeholder"
      @select="handleSelect"
      @focus="onfocus"
      @blur="onblur"
    >
      <template slot-scope="item">
        <slot :item="item.item">
          <div class="mmb-serach-item">{{ formatterValue(item.item) }}</div>
        </slot>
      </template>
    </el-autocomplete>
    <div
      class="mmb-serach-button"
      :style="`background:${color}`"
      @click="sreach"
    >
      搜 索
    </div>
  </div>
</template>

<script>
import input from './input.vue'

export default {
  mixins: [input],
  props: {
    radius: { type: String, default: '40px' },
    width: { type: String, default: '500px' }
  },
  data() {
    return {
      storageKey: `serachStoreKey${this.storeKey}`
    }
  }
}
</script>
<style lang="scss">
.mmb-serach {
  display: inline-flex;
  border-radius: 50px;
  overflow: hidden;
  border: 1px solid #dedcdc;
  background: white;
  .mmb-serach-input {
    width: 200px;
    height: 100%;
    width: 100%;
    .el-input {
      height: 100%;
      width: 100%;
    }

    .el-input__inner {
      border: none;
      border-radius: 50px 0 0 50px;
      height: 100%;
      width: 100%;
    }
  }
  .mmb-serach-button {
    display: flex;
    justify-content: center;
    align-items: center;
    background: #409eff;
    color: white;
    padding: 0 25px;
    border-radius: 50px;
    cursor: pointer;
    margin: 3px;
    white-space: nowrap;
  }
  .item {
    padding: 15px 10px;
  }
}
.mmb-serach.onfocus {
}
.mmb-serach-item {
  padding: 10px 0;
}
</style>
