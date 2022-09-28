<template>
  <div
    v-loading="loading"
    :style="`height: ${height}; max-height: ${maxHeight};`"
    class="mmb-table"
    :class="filterBlur ? `filterBlur6` : ''"
  >
    <el-table
      ref="elTable"
      :cell-class-name="
        ({row, column, rowIndex, columnIndex}) =>
          `row${pageIndex}-${row.index} column${columnIndex}`
      "
      class="mmb-table-content"
      :fit="fit"
      :height="tableHeight"
      :data="tableData_"
      :default-sort="defaultSort"
      @sort-change="sortChange"
      @cell-mouse-leave="cellMouseLeave"
      @cell-mouse-enter="cellMouseEnter"
      @selection-change="handleSelectionChange"
    >
      <template slot="empty"> <slot name="empty" /></template>
      <el-table-column
        v-if="showSelection"
        type="selection"
        width="55"
        fixed="left"
        class-name="bgfff"
      />
      <el-table-column
        v-if="showIndex"
        prop="index"
        width="50"
        align="center"
      />
      <slot />
      <template slot="append">
        <slot name="append" />
      </template>
    </el-table>
    <div>
      <slot name="end" />
    </div>
    <div v-if="showPagination" class="mmb-pagination">
      <el-pagination
        :current-page="pageIndex_"
        :page-size="pageSize"
        layout="total,  prev, pager, next, jumper"
        :total="total_"
        @current-change="pageIndexChange"
      />
    </div>
  </div>
</template>
<script>
import fetchOptions from '../mixins/fetchOptions';

export default {
  mixins: [fetchOptions],
  name: 'Table',
  props: {
    localStorageKey: String,
    isCachePageIndex: Boolean,
    selectList: {type: Array, default: () => []},
    fit: {type: Boolean, default: true},
    showSelection: {type: Boolean, default: true},
    loading: {type: Boolean, default: false},
    height: {type: String, default: 'auto'},
    maxHeight: {type: String, default: 'auto'},
    showPagination: {type: Boolean, default: true},
    showIndex: Boolean,
    tableHeight: [Number, String],
    setTableData: {
      type: Function,
      default(res) {
        const data = res.Items || res || [];
        return data;
      },
    },
    setTotal: {
      type: Function,
      default(res) {
        const data = res.TotalItems || res.length || 0;
        return data;
      },
    },
    refTable: [String, Object, null],
    pageIndex: {type: Number, default: 1},
    pageSize: {type: Number, default: 10},
    total: {type: Number, default: 0},
    sortProp: String,
    sortOrder: String,
    tableData: {type: Array, default: () => []},
  },
  data() {
    return {
      pageIndex_: (() => {
        if (!this.pageIndex) return 1;
        let index;
        if (this.localStorageKey)
          index = window.localStorage.getItem(this.localStorageKey);
        if (index) return index * 1;
        return this.pageIndex;
      })(),
      pageSize_: this.pageSize,
      total_: this.total,
      sortProp_: this.sortProp,
      sortOrder_: this.sortOrder,
      tableData_: this.tableData || [],
    };
  },
  computed: {
    defaultSort() {
      let order;
      if (this.sortOrder === 'Asc') order = 'ascending';
      if (this.sortOrder === 'Desc') order = 'descending';
      if (!this.sortProp) {
        if (this.$refs.elTable) this.$refs.elTable.clearSort();
        return {};
      }
      if (!this.sortOrder) {
        if (this.$refs.elTable) this.$refs.elTable.clearSort();
        return {};
      }
      return {
        prop: this.sortProp,
        order,
      };
    },
  },
  watch: {
    pageIndex(val) {
      this.pageIndex_ = val;
    },
    pageSize(val) {
      this.pageSize_ = val;
    },
    total(val) {
      this.total_ = val;
    },
    sortProp(val) {
      this.sortProp_ = val;
    },
    sortOrder(val) {
      this.sortOrder_ = val;
    },
    tableData(val) {
      this.tableData_ = val;
    },
    loading_(newV) {
      if (newV) {
        this.beforeFetch_();
      } else {
        this.afterFetch_();
      }
    },
    responseData_() {
      this.handleTableData();
    },
  },

  created() {
    this.$emit('update:pageIndex', this.pageIndex_);
    this.$emit('update:pageSize', this.pageSize_);
    this.$emit('update:sortProp', this.sortProp_);
    this.$emit('update:sortOrder', this.sortOrder_);
  },

  mounted() {
    // this.handleTableData()
    this.$emit('update:refTable', this.$refs.elTable);
  },
  methods: {
    saveStore() {
      if (!this.localStorageKey) return;
      if (this.isCachePageIndex)
        window.localStorage.setItem(this.localStorageKey, this.pageIndex_);
    },
    pageIndexChange(num) {
      this.pageIndex_ = num;
      this.saveStore();
      this.$emit('update:pageIndex', num);
      this.$emit('pageChange', this.pageIndex, this.pageSize);
    },
    sortChange(e) {
      const {prop} = e;
      let {order} = e;
      if (order === 'ascending') order = 'Asc';
      if (order === 'descending') order = 'Desc';
      this.sortProp_ = prop;
      this.sortOrder_ = order;
      this.$emit('update:sortProp', prop);
      this.$emit('update:sortOrder', order);
      this.$emit('sortChange', e);
    },
    beforeFetch_() {
      const target = this.$refs.elTable.$el.children[2];
      if (!target) return;

      if (!this.innerloadingElement)
        this.innerloadingElement = this.$loading({
          target,
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(255, 255, 255, 0.7)',
        });

      target.scrollTop = 0;
      target.style.overflow = 'hidden';
    },
    afterFetch_() {
      if (this.innerloadingElement) this.innerloadingElement.close();
      this.innerloadingElement = null;
      const target = this.$refs.elTable.$el.children[2];
      if (!target) return;
      target.style.overflow = 'auto';
    },
    cellMouseEvent(row, column, cell, event, key) {
      const index = this.tableData_.findIndex(element => element === row);
      this.$children.forEach(element => {
        element.$children.forEach(el => {
          if (el[key]) el[key](index, row, column, cell, event);
        });
      });
      this.$emit(key, index, row, column, cell, event);
    },
    cellMouseLeave(row, column, cell, event) {
      this.cellMouseEvent(row, column, cell, event, 'cellMouseLeave');
    },
    cellMouseEnter(row, column, cell, event) {
      this.cellMouseEvent(row, column, cell, event, 'cellMouseEnter');
    },
    handleTableData() {
      this.total_ = this.setTotal(this.responseData_);
      this.tableData_ = this.setTableData(this.responseData_) || [];
      this.tableData_ = this.tableData_.map((val, index) => ({
        ...val,
        index: index + 1,
      }));
      this.$emit('update:total', this.total_);
      this.$emit('update:tableData', this.tableData_);
    },
    handleSelectionChange(list) {
      this.$emit('update:selectList', list);
    },
  },
};
</script>
<style lang="scss">
.mmb-table {
  display: flex;
  flex-direction: column;
  margin: 0;
  .mmb-pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 15px;
    height: 62px;
    background: white;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    overflow: hidden;
  }
  .mmb-table-content {
    background: white;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    overflow: hidden;
  }
  .el-table__header-wrapper {
    border: 1px solid #dddddd;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    border-bottom: none;
    box-sizing: border-box;
  }
  .el-table__header {
    colgroup {
      display: table-column-group;
      background: #eeeeee;
      border-top-left-radius: 15px;
      border-top-right-radius: 15px;
      border-color: #dddddd;
      border-bottom: none;
      overflow: hidden;
      box-sizing: border-box;
    }
  }
  .el-table th,
  .el-table tr {
    background-color: #ffffff00;
  }
}
</style>
