import axios from "axios";
import qs from "qs";

const env = process.env.NODE_ENV;
const lastArgv = process.env.LASTARGV || "";
const port = process.env.PORT;
const host = process.env.HOST;

let urlPrefix =
  env === "development" && lastArgv.includes("test")
    ? `http://${host}:${port}`
    : "";

/**
 * 获取匹配的url,去掉多余的参数
 *
 * @return {string} 页面url
 */
function getURL() {
  var url = location.origin + location.pathname;
  var hash = location.hash.replace(/\?[\s\S]*$/, "");
  return encodeURIComponent(url + hash);
}

const handleResponse = (result, logParams) => {
  // if (typeof result.data === 'string') window.location = result.data;
  return new Promise((resolve, reject) => {
    let api = logParams.url;
    if (result.status === 200) {
      resolve(result.data);
    } else {
      reject(result.data);
    }
  });
};

const _get = (url, params) => {
  let pageOrigin = getURL();
  const requestInfo = {
    status: 0,
    errNo: -1,
  };
  const settings = Object.assign({
    url: urlPrefix + url,
    method: "GET",
    params: params,
    withCredentials: true,
    validateStatus: function (status) {
      return status < 600;
    },
  });
  return axios.request(settings).then((response) => {
    const data = response.data;
    requestInfo.errNo = data.errNo;
    return handleResponse(response, {
      params: params,
      url: url,
      method: "get",
      requestInfo: requestInfo,
      page: pageOrigin,
    });
  });
};

const _post = (url, payload) => {
  let pageOrigin = getURL();
  const requestInfo = {
    status: 0,
    errNo: -1,
  };
  const settings = Object.assign({
    url: urlPrefix + url,
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    data: qs.stringify(payload),
    withCredentials: true,
    validateStatus: function (status) {
      return status < 600;
    },
  });
  return axios.request(settings).then((response) => {
    const data = response.data;
    requestInfo.errNo = data.errNo;
    return handleResponse(response, {
      params: payload,
      url: url,
      method: "post",
      requestInfo: requestInfo,
      page: pageOrigin,
    });
  });
};

export default { get: _get, post: _post };
