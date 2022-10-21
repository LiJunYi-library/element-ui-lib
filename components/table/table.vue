<script>
import fetchOptions from "../../mixins/fetchOptions"; 

export default {
  mixins: [fetchOptions],
  name: "Table",
  props: {},
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {},
  render() {
    return <div></div>;
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
