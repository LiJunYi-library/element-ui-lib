<template>
  <el-table-column
    :key="Math.random()"
    ref="tableColumn"
    :align="align"
    :class-name="className"
    :width="width"
    :type="type"
    :label="label"
    :sortable="sortable"
    :sort-orders="['descending']"
    :show-overflow-tooltip="showOverflowTooltip"
    :fixed="fixed"
    :prop="property"
  >
    <template slot-scope="scope">
      <slot :scope="scope">
        <slot name="content" :scope="scope">
          <div
            v-if="propType === 'button'"
            class="column-Button"
            style="white-space: wrap"
            :type="'text'"
            @click="$emit('propClick', { scope }, scope.row[prop], scope.row)"
            v-html="handleProp(scope.row, prop)"
          />

          <template v-else-if="propType === 'img'">
            <el-image
              v-if="scope.row[prop]"
              style="width: 50px; height: 50px"
              :src="handleProp(scope.row, prop)"
              :preview-src-list="[handleProp(scope.row, prop)]"
            >
            </el-image>
            <span v-else>{{ handleProp(scope.row, prop) }}</span>
          </template>

          <template v-else>
            <span v-html="handleProp(scope.row, prop)" />
            <span v-if="arrows" :class="handleArrows(scope.row, prop)" />
          </template>
        </slot>
      </slot>
    </template>
  </el-table-column>
</template>

<script>
export default {
  props: {
    "show-overflow-tooltip": Boolean,
    type: String,
    hover: [Boolean, String],
    propType: String,
    arrows: Boolean,
    fixed: [Boolean, String],
    formatter: String,
    property: String,
    prop: [Function, String],
    before: String,
    after: String,
    columnHtml: String,
    label: String,
    emptyText: { type: String, default: "-" },
    sortable: String,
    rankType: { type: String, default: "" },
    align: { type: String, default: "center" },
    className: {
      type: String,
      default() {
        if (this.$props.prop === "Rank") return `Rank${this.$props.rankType}`;
        return "bgfff";
      },
    },
    width: {
      type: [String, Number],
      default() {
        if (this.$props.prop === "Rank") return 80;
        return "";
      },
    },
  },
  data() {
    return {
      mouseHoverIndex: null,
    };
  },
  mounted() {},
  methods: {
    showHover(scope) {
      if (scope.$index === this.mouseHoverIndex) return true;
      return false;
    },
    cellMouseLeave() {
      if (!this.hover) return;
      this.mouseHoverIndex = null;
    },
    cellMouseEnter(index) {
      if (!this.hover) return;
      this.mouseHoverIndex = index;
    },
    handleArrows(row, prop) {
      const val = row[prop];
      if (!val) return "";
      return val > 0 ? "el-icon-top" : "el-icon-bottom";
    },
    handleProp(row, prop) {
      if (this.$props.columnHtml) return this.$props.columnHtml;
      let str = "";
      if (typeof prop === "string") str = row[prop];
      if (typeof prop === "function") str = prop(row);
      if (str === 0) return str;
      if (!str) return this.$props.emptyText;
      switch (this.formatter) {
        case "万":
          str = Number.fomatter(str);
          break;
        case "%":
          str = `${str.toFixed(2)}%`;
          break;
      }
      if (typeof str === "number" && /\./.test(str)) {
        str = str.toFixed(2);
      }
      return `${this.$props.before || ""}${str}${this.$props.after || ""}`;
    },
    monitor(key, scope) {
      if (this.$listeners[key]) return this.$listeners[key](scope);
      return true;
    },
  },
};
</script>
<style>
.el-table__row .Rank .cell {
  font-size: 24px !important;
  font-style: italic;
}
/* */
.el-table__row .Rank1 .cell {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
  width: 35px;
  height: 35px;
  min-height: 35px;
  background: #bac2c7;
  border-radius: 8px;
  font-size: 20px;
  font-family: DINAlternate-Bold, DINAlternate;
  font-weight: bold;
  color: #ffffff;
  padding: 0;
}
.el-table__row .Rank1.column0.row1-1 .cell {
  background: #ffc600;
}
.el-table__row .Rank1.column0.row1-2 .cell {
  background: #92b4d0;
}
.el-table__row .Rank1.column0.row1-3 .cell {
  background: #a07347;
}
.el-table__row .Rank1.column1.row1-1 .cell {
  background: #ffc600;
}
.el-table__row .Rank1.column1.row1-2 .cell {
  background: #92b4d0;
}
.el-table__row .Rank1.column1.row1-3 .cell {
  background: #a07347;
}
.column-img {
  width: 50px;
  height: 50px;
}
.column-Button {
  color: #409eff;
  cursor: pointer;
  text-align: left;
  line-height: normal;
  text-align: center;
}
</style>
