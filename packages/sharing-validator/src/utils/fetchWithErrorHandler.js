import fetch from "node-fetch";

function fetchWithErrorHandler(url, options) {
  return fetch(url, options).then(res => {
    if (res.status >= 300) {
      return Promise.reject(res);
    }
    return res;
  });
}

export default fetchWithErrorHandler;
