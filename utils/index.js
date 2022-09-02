export function setConfig(attrsKty = [], propsKty = []) {
  // eslint-disable-next-line
  for (const key in this.$props) {
    if (Object.prototype.hasOwnProperty.call(this.$props, key)) {
      const element = this.$props[key];
      if (!propsKty.includes(key)) this.config[key] = element;
    }
  }

  // eslint-disable-next-line
  for (const key in this.$attrs) {
    if (Object.prototype.hasOwnProperty.call(this.$attrs, key)) {
      const element = this.$attrs[key];
      if (!attrsKty.includes(key))
        if (!/_/.test(key)) {
          this.config[key] = element;
        } else {
          // eslint-disable-next-line
          const evalKey = key.replace('_', '.');
          const evalKeyarr = key.split('_');
          const recursion = (num, object) => {
            if (num >= evalKeyarr.length) return;
            let keyIndex = num;
            const obj = object;
            const keydd = evalKeyarr[keyIndex];
            if (num === evalKeyarr.length - 1) {
              obj[keydd] = element;
            }
            if (obj[keydd] === undefined) obj[keydd] = {};
            // eslint-disable-next-line
            keyIndex++;
            recursion(keyIndex, obj[keydd]);
          };
          recursion(0, this.config);
        }

      //
    }
  }
}

const itemProps = {
  required: {
    type: Boolean,
    default: true,
  },
  placeholder: String,
  formHint: String,
  isForm: Boolean,
  isHidden: Boolean,
  disabled: Boolean,
  width: [String, Number],
  reg_exp: {
    type: RegExp,
    default: () => new RegExp(''),
  },
  type: String,
  prop: [Function, String],
  label: String,
  fixed: [String, Boolean],
  align: String,
  propLink: String,
  tipContent: String,
  propType: String,
  buttonType: String,
  columnHtml: String,
  columnClass: String,
  minW: [String, Number],
  before: String,
  after: String,
  selectable: Function,
  ellipsis: Boolean,
  emptyText: String,
  'show-overflow-tooltip': Boolean,
};


export class Queue {
  constructor(obj = {}) {
    this.callBack = obj.callBack;
    this.thenCallBack = obj.thenCallBack;
    this.catchCallBack = obj.catchCallBack;
    this.finalCallBack = obj.finalCallBack;
    this.abortCallBack = obj.finalCallBack;
    this.loading = true;
    this.callBack(this.resolve.bind(this), this.reject.bind(this));
  }

  resolve(...arg) {
    if (this.loading === false) return;
    if (this.thenCallBack) this.thenCallBack(...arg);
    if (this.finalCallBack) this.finalCallBack(...arg);
    this.loading = false;
  }
  reject(...arg) {
    if (this.loading === false) return;
    if (this.catchCallBack) this.catchCallBack(...arg);
    if (this.finalCallBack) this.finalCallBack(...arg);
    this.loading = false;
  }

  then(thenCallBack) {
    this.thenCallBack = thenCallBack;
    return this;
  }
  catch(catchCallBack) {
    this.catchCallBack = catchCallBack;
    return this;
  }
  finally(finalCallBack) {
    this.finalCallBack = finalCallBack;
    return this;
  }

  abort(...arg) {
    this.abortArg = [...arg];
    this.abortCallBack = abortCallBack;
    return this;
  }

  termination() {
    this.loading = false;
    if (this.abortCallBack) this.abortCallBack(...this.abortArg);
  }
}

export function QueuePromise(callBack) {
  var currentQueue, prveQueue;
  var callBack = callBack;
  Object.defineProperties(this, {
    then: {
      value: (thenCallBack) => {
        if (prveQueue && prveQueue.loading === true) {
          prveQueue.termination();
        }
        currentQueue = new Queue({ callBack, thenCallBack });
        prveQueue = currentQueue;
        return currentQueue;
      }
    },
    catch: {
      value: (catchCallBack) => {
        if (prveQueue && prveQueue.loading === true) {
          prveQueue.termination();
        }
        currentQueue = new Queue({ callBack, catchCallBack });
        prveQueue = currentQueue;
        return currentQueue;
      }
    },
    finally: {
      value: (finalCallBack) => {
        if (prveQueue && prveQueue.loading === true) {
          prveQueue.termination();
        }
        currentQueue = new Queue({ callBack, finalCallBack });
        prveQueue = currentQueue;
        return currentQueue;
      }
    },
  });

}


QueuePromise.prototype.all = null;




export default {itemProps};
