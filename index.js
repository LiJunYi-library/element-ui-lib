import config from './config.js';

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

export {element};
