import config from './config.js';
import Fetch from './http.js';
import components from './components/index'

const module = {};
const element = {};

const vueFiles = require.context('./element', false, /\.vue$/);
const jsFiles = require.context('./module', false, /\.js$/);

jsFiles.keys().forEach(jsPath => {
  const Key = jsPath.replace(/\.\/([^]*?)\.js/g, '$1');
  const content = jsFiles(jsPath);
  module[Key] = content.default || {};
  const obj = module[Key];
  for (const name in content) {
    if (Object.hasOwnProperty.call(content, name)) {
      if (name === 'default') continue;
      obj[name] = content[name];
    }
  }
});

vueFiles.keys().forEach(vuePath => {
  const Key = vuePath.replace(/\.\/([^]*?)\.vue/g, '$1');
  const content = vueFiles(vuePath);
  element[Key] = content.default || {};
});

element.install = function install(Vue) {

  Vue.prototype[config.name + '$confirm'] = function (...arg) {
    return new Promise((resolve, reject) => {
      this.$confirm(...arg)
        .then(() => {
          resolve(true)
        })
        .catch(() => {
          resolve(false)
        })
    })
  }

  for (const key in components) {
    if (Object.hasOwnProperty.call(components, key)) {
      Vue.component(`${config.name}-${key}`, components[key]);
    }
  }

  for (const key in element) {
    if (Object.hasOwnProperty.call(element, key)) {
      Vue.component(`${config.name}-${key}`, element[key]);
    }
  }



  for (const key in module) {
    if (Object.hasOwnProperty.call(module, key)) {
      Vue.prototype[`$${key}`] = module[key];
    }
  }
};

import fetchOptions from './mixins/fetchOptions'

export { element, Fetch, fetchOptions, config };
