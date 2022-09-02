
import Vue from 'vue';
function createDialog(template, defaultOptions) {
  const LogConstructor = Vue.extend(template);

  let instance;

  const initInstance = () => {
    instance = new LogConstructor({
      el: document.createElement('div'),
    });
  };

  const merge = (tart = {}, config = {}) => {
    for (const key in config) {
      if (Object.hasOwnProperty.call(config, key)) {
        tart[key] = config[key];
      }
    }
  }

  const dialog = function(options = {}, callback) {
    if (!instance) {
      initInstance();
    }
    document.body.appendChild(instance.$el);
    let config = Object.assign(defaultOptions, options);
    merge(instance, config)
    instance.visible = true
  }

  return dialog
}
export default createDialog













