<script>
import {QueuePromise} from './index.js';

export default {
  inject: {
    asyncTemplate: {default: null},
  },
  props: {
    filterBlur: {type: Boolean, default: false}, // 是否是模糊
    loading: {type: Boolean, default: true}, // 是否在加载
    responseData: {type: [Array, Object], default: () => []}, // 组件数据
    request: [Function, Object, Promise], // 监听异步用来更新组件内部 渲染
    fetchData: [Function, Object, Promise], // 组件请求函数
    isAwait: {type: Boolean, default: false}, // 是否等待搜索完成
  },
  data() {
    if (this.fetchData) {
      if (!this.fetchData.original) {
        const original = this.fetchData;
        const copyFetch = async (...arg) => {
          const res = await original(...arg);
          return res;
        };
        // eslint-disable-next-line
      this.fetchData.original = copyFetch;
      }

      const fetch = async (...arg) => {
        if (this.isAwait && this.isLoad) return;
        this.isLoad = true;
        if (this.beforeFetch) this.beforeFetch();
        this.loading_ = true;
        this.$emit('update:loading', true);
        this.fetchArg = [...arg];
        // console.log(...arg, 'asyncOptions beforeFetch');
        this.responseData_ = await this.queuePromise;
        this.log(this.responseData_, this.fetchData.name || '');
        this.loading_ = false;
        this.$emit('update:loading', false);
        this.$emit('update:responseData', this.responseData_);
        if (this.afterFetch) this.afterFetch();
        this.isLoad = false;
        return Promise.resolve(this.responseData_);
      };
      fetch.original = this.fetchData.original;

      return {
        isLoad: false,
        loading_: this.loading,
        responseData_: this.responseData,
        propsFetchData:
          this.request || this.fetchData.original || this.fetchData,
        fetchData_: fetch,
        queuePromise: new QueuePromise((resolve, reject) => {
          this.propsFetchData(...this.fetchArg)
            .then(res => {
              resolve(res);
            })
            .catch(res => {
              reject(res);
            });
        }),
      };
    }
    return {
      loading_: this.loading,
      responseData_: this.responseData,
      propsFetchData: null,
      fetchData_: null,
    };
  },
  emits: ['update:fetchData', 'update:responseData', 'update:loading'],
  watch: {
    loading(newV) {
      this.loading_ = newV;
    },
    responseData(newV) {
      this.responseData_ = newV;
    },
    request(newV) {
      this.propsFetchData = newV;
      this.$emit('update:fetchData', this.fetchData_);
    },
  },
  methods: {
    log(...arg) {
      console.log('%c%s', 'color: yellowGreen;', 'asyncOptions *************');
      console.log(...arg);
      console.log('                 ');
    },
  },
  unmounted() {},
  created() {
    if (this.propsFetchData) this.$emit('update:fetchData', this.fetchData_);
    if (!this.asyncTemplate) return;
    if (!this.asyncTemplate.items.includes(this)) {
      this.asyncTemplate.items.push(this);
    }
  },
  destroyed() {
    if (!this.asyncTemplate) return;
    const index = this.asyncTemplate.items.findIndex(vm => vm === this);
    if (index >= 0) this.asyncTemplate.items.splice(index, 1);
  },
  mounted() {
    // console.log("this.$emit('onMounted')");
    this.$emit('onMounted');
  },
};
</script>
