<template>
  <div class="mmb-input-box">
    <div v-if="label" class="mmb-input-label">{{ label }}</div>
    <div class="mmb-input-content">
      <div
        class="mmb-input"
        :style="`height:${height};width: ${width};border-radius: ${radius};${cssStyle}`"
      >
        <el-autocomplete
          v-model="state"
          :clearable="clearable"
          class="mmb-input-input"
          :fetch-suggestions="querySearch"
          :placeholder="placeholder"
          @select="handleSelect"
          @focus="onfocus"
          @blur="onblur"
          @change="onchange"
        >
          <template slot-scope="item">
            <slot :item="item.item">
              <div class="mmb-input-item">{{ formatterValue(item.item) }}</div>
            </slot>
          </template>
        </el-autocomplete>
      </div>
      <div v-if="required && showMessage" class="mmb-input-message">
        {{ message_ }}
      </div>
    </div>
  </div>
</template>

<script>
import fetchOptions from "../mixins/fetchOptions";

export default {
  mixins: [fetchOptions],
  model: {
    prop: 'value',
    event: 'sreach'
  },
  props: {
    label: String,
    storeKey: { type: String, default: '1' },
    color: { type: String, default: '#004C96' },
    placeholder: String,
    value: String,
    height: { type: String, default: '40px' },
    radius: { type: String, default: '5px' },
    clearable: { type: Boolean, default: true },
    required: { type: Boolean, default: false },
    width: { type: String, default: '300px' },
    searchType: { type: String, default: 'request' }, // history
    message: String,
    formatterValue: {
      type: Function,
      default: data => {
        return data
      }
    }
  },
  data() {
    return {
      restaurants: [],
      state: this.value,
      cssStyle: '',
      storageKey: `indptStoreKey${this.storeKey}`,
      historyData: [],
      message_: this.message || `请输入${this.label}`,
      showMessage: false
    }
  },
  watch: {
    value(newV) {
      this.state = newV
    }
  },
  created() {
    this.historyData = JSON.parse(
      window.localStorage.getItem(this.storageKey) || '[]'
    )
  },
  mounted() {},
  methods: {
    onfocus() {
      this.cssStyle = `box-shadow: 0px 0px 10px 1px ${this.color}55;`
    },
    onblur() {
      this.cssStyle = ''
      if (this.searchType === 'history') this.setHistoryData()
      this.showMessage = !this.state
      this.$emit('sreach', this.state)
    },
    onchange() {
      this.showMessage = !this.state
      this.$emit('sreach', this.state)
    },
    onselect() {
      this.showMessage = !this.state
      this.$emit('sreach', this.state)
    },
    setHistoryData() {
      let arr = [...this.historyData]
      if (this.state !== '') arr.splice(0, 0, this.state)
      arr = Array.from(new Set(arr))
      this.historyData = arr
      window.localStorage.setItem(
        this.storageKey,
        JSON.stringify(this.historyData)
      )
    },
    sreach() {
      this.$emit('sreach', this.state)
      this.$emit('onSearch', this.state)
    },
    querySearch(queryString, cb) {
      this.cb = cb
      if (this.searchType === 'request') cb(this.responseData_ || [])
      if (this.searchType === 'history') cb(this.historyData)
    },
    afterFetch() {
      if (!this.cb) return
      if (this.searchType === 'request') this.cb(this.responseData_ || [])
      if (this.searchType === 'history') this.cb(this.historyData)
    },
    handleSelect(item) {
      this.state = this.formatterValue(item)
      this.$emit('sreach', this.state)
      this.$emit('onSearch', this.state)
      this.showMessage = !this.state
    }
  }
}
</script>
<style lang="scss">
.mmb-input-box {
  display: inline-flex;
  align-items: center;
  .mmb-input-label {
    padding-right: 10px;
    min-width: 50px;
    text-align: right;
  }
  .mmb-input {
    display: inline-flex;
    border-radius: 50px;
    overflow: hidden;
    border: 1px solid #dedcdc;
    background: white;
    .mmb-input-input {
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
    .mmb-input-button {
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
  .mmb-input-content {
    position: relative;
  }
  .mmb-input-message {
    position: absolute;
    bottom: 0;
    left: 0;
    padding-left: 10px;
    color: #ff5d32;
    padding-top: 10px;
    transform: translateY(100%);
  }
}
.mmb-input.onfocus {
}
.mmb-input-item {
  padding: 10px 0;
}
</style>
