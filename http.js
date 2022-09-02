import axios from 'axios'
import { Message, MessageBox, Loading } from 'element-ui'

let Fetch = {}

function catchSuccess(data) { }

function catchError(error) {
  if (error && error.response) {
    switch (error.response.status) {
      case 400:
        return Promise.reject('请求错误')
      case 401:
        return Promise.reject('未授权，请登录')
      case 403:
        return Promise.reject('拒绝访问')
      case 404:
        return Promise.reject(`请求地址出错: ${error.response.config.url}`)
      case 408:
        return Promise.reject('请求超时')
      case 500:
        return Promise.reject('服务器繁忙')
      case 501:
        return Promise.reject('服务未实现')
      case 502:
        return Promise.reject('网关错误')
      case 503:
        return Promise.reject('服务不可用')
      case 504:
        return Promise.reject('网关超时')
      case 505:
        return Promise.reject('HTTP版本不受支持')
      default:
        return Promise.reject(`网络不给力，请重试`)
    }
  } else {
    return Promise.reject('网络请求超时，请重试。')
  }
}

/*** */
Fetch.create = function (props = {}) {

  let fetchConfig = Object.assign({
    baseURL: process.env.VUE_APP_HTTP_CONTEXT,
    interceptRequest: (config) => config,
    exitCode: 400,
    successCode: 200,
    timeout: 3000,
    withCredentials: true,
    setCode: (res) => res.code,
    setMessage: (res) => res.msg,
    isShowMessage: true,
    isShowErrMessag: true,
    returnRes: (res) => res.data,
  }, props);

  const fetch = axios.create({
    baseURL: fetchConfig.baseURL,
    withCredentials: fetchConfig.withCredentials,
    timeout: fetchConfig.timeout,
  });

  fetch.interceptors.request.use(config => {
    if (!config.headers) config.headers = {};
    config.headers['Access-Control-Allow-Origin'] = '*';
    let iRConfig = fetchConfig.interceptRequest(config)
    return config
  });

  fetch.interceptors.response.use(
    response => {
      catchSuccess(response.data)
      return response
    }, error => catchError(error));


  const request = async (axiosRequestConfig, params = {}) => {
    const {
      isShowLoad,
      loadOptions = {},
      isShowMessage = fetchConfig.isShowMessage,
      isShowErrMessag = fetchConfig.isShowErrMessag,
      messageText = '',
      errMessageText = '',
      messageType = undefined,
      returnRes = fetchConfig.returnRes,
    } = params;
    const rest = axiosRequestConfig;

    const load_options = Object.assign(loadOptions, {
      lock: true,
      text: 'Loading',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    });

    const load = isShowLoad ? Loading.service(load_options) : null;
    const response = await fetch(rest);
    const res = response.data;
    let code = fetchConfig.setCode(res);

    const text = (code === fetchConfig.successCode ? messageText : errMessageText) || fetchConfig.setMessage(res);
    let msgType;
    if (code === fetchConfig.successCode) msgType = "success";
    else msgType = "error";
    if (messageType) msgType = messageType;

    if (code === fetchConfig.exitCode) {
      MessageBox.confirm(text || '您已被登出请重新登录', '提示', {
        confirmButtonText: '确定',
        showCancelButton: false,
        type: msgType,
        center: true,
        beforeClose() {
          window.localStorage.clear();
          location.reload();
        }
      });
      return returnRes(response);
    }

    load && load.close();

    if (msgType === "success") {
      if (isShowMessage && text) Message({ message: text, type: msgType });
    }else {
      if (isShowErrMessag && text) Message({ message: text, type: msgType });
    }


    return returnRes(response);
  }

  request.get = (url, data = {}, config = {}) => request({ method: 'get', url: url, params: data }, config);
  request.put = (url, data = {}, config = {}) => request({ method: 'PUT', url: url, data: data }, config);
  request.post = (url, data = {}, config = {}) => request({ method: 'post', url: url, data: data }, config);
  request.uploadFile = (url, data = {}, config = {}) => {
    const formData = new FormData();
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        formData.append(key, data[key]);
      }
    }
    return request({ method: 'post', url: url, data: formData, headers: { 'Content-Type': 'multipart/form-data' } }, config);
  }

  request.downloadFile = (buffer, fileName) => {
    const blob = new Blob([buffer]);
    if ('msSaveOrOpenBlob' in navigator) {
      window.navigator.msSaveOrOpenBlob(blob, fileName);
    } else {
      const elink = document.createElement('a');
      elink.download = fileName;
      elink.style.display = 'none';
      elink.href = URL.createObjectURL(blob);
      document.body.appendChild(elink);
      elink.click();
      URL.revokeObjectURL(elink.href);
      document.body.removeChild(elink);
    }
  };

  request.getFile = async (url, data, filename, config = {}) => {
    config.returnRes = (response) => response;
    let res = await request({
      method: 'get', url: url, params: data, responseType: 'blob',
      xsrfHeaderName: 'Authorization'
    }, config);
    let disposition = res.headers['content-disposition'];
    let remoteFilename;
    if (disposition) {
      remoteFilename = res.headers['content-disposition'].split('filename=').pop();
    }
    request.downloadFile(res.data, filename || remoteFilename)
  };
  return request
}

export default Fetch;


















