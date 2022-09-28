<script>
import element from "element-ui";

export default {
  provide() {
    return {
      tableColumn: this,
    };
  },
  props: {
    ...element.TableColumn.props,
    emptyText: { type: String, default: "-" },
    align: { type: String, default: "center" },
    tipContent: String,
  },
  data() {
    return {
      slot_scope: {},
    };
  },
  methods: {
    renderTooltip(h) {
      const vm = this;
      if (!vm.tipContent) return null;
      return h(
        "el-tooltip",
        {
          attrs: {
            effect: "dark",
            "raw-content": true,
            content: vm.tipContent,
            placement: "top",
          },
        },
        [
          h("i", {
            style: {
              "padding-left": "5px",
            },
            staticClass: "el-icon-question",
          }),
        ]
      );
    },
    _fomatter(row) {
      return row[this.prop];
    },
    renderDefault(h) {
      if (!this.$scopedSlots.default) return undefined;
      return (props) => {
        return this.$scopedSlots.default({ ...props });
      };
    },
    getValue(group) {
      let { row } = group;
      let val = row[this.prop];
      if (this.$props.formatter) val = this.$props.formatter(row);
      return val;
    },
  },
  render(h) {
    const vm = this;
    return h(
      "el-table-column",
      {
        attrs: {
          formatter(row) {
            return vm._fomatter(row);
          },
          ...vm.$props,
        },
        scopedSlots: {
          default: vm.renderDefault(h),
        },
      },
      [
        h("template", { slot: "header" }, [
          h(
            "div",
            {
              staticClass: "table-column-header",
            },
            [
              h(
                "span",
                {
                  staticClass: "table-column-header-span",
                },
                vm.label
              ),
              vm.renderTooltip(h),
            ]
          ),
        ]),
      ]
    );
  },
};
</script>
<style>
.table-column-header {
  display: inline-block;
}
</style>
