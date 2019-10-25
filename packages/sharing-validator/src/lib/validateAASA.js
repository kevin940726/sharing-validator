import fetch from "node-fetch";
import any from "promise.any";
import getDomain from "../utils/getDomain";
import USER_AGENTS from "./userAgents";

function fetchWithErrorHandler(url) {
  return fetch(url, {
    headers: {
      "User-Agent": USER_AGENTS.apple
    },
    size: 128 * 1024 // Limits to 128 KB
  }).then(res => {
    if (res.status >= 300) {
      return Promise.reject(res);
    }
    return res;
  });
}

async function validateAASA(url) {
  const domain = getDomain(url);
  const results = [];

  let response;
  try {
    response = await any([
      fetchWithErrorHandler(`https://${domain}/apple-app-site-association`),
      fetchWithErrorHandler(
        `https://${domain}/.well-known/apple-app-site-association`
      )
    ]);
  } catch (error) {
    results.push({
      error: `Response status returns ${error.status}.`
    });
    return results;
  }

  const text = await response.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch (err) {
    results.push({
      error: `Invalid JSON format, received:
${text}`
    });
    return results;
  }

  if (!json.applinks) {
    results.push({
      error: `Response JSON doesn't have 'applinks' key`
    });
    return results;
  }

  if (json.applinks.apps.length !== 0) {
    results.push({
      error: `Response JSON 'applinks.apps' should be an empty array, received ${JSON.stringify(
        json.applinks.apps
      )}`
    });
    return results;
  }

  return results;
}

export default validateAASA;
