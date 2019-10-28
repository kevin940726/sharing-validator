import fetch from "node-fetch";
import any from "promise.any";
import getDomain from "../utils/getDomain";
import fetchWithErrorHandler from "../utils/fetchWithErrorHandler";
import USER_AGENTS from "./userAgents";

function fetchWithSizeLimitAndUserAgent(url) {
  return fetchWithErrorHandler(url, {
    headers: {
      "User-Agent": USER_AGENTS.apple
    },
    size: 128 * 1024 // Limits to 128 KB
  });
}

async function validateAASA(url) {
  const domain = getDomain(url);
  const results = {
    errors: [
      {
        valid: false,
        property: "apple-app-site-association"
      }
    ]
  };

  let response;
  try {
    response = await any([
      fetchWithSizeLimitAndUserAgent(
        `https://${domain}/apple-app-site-association`
      ),
      fetchWithSizeLimitAndUserAgent(
        `https://${domain}/.well-known/apple-app-site-association`
      )
    ]);
  } catch (error) {
    results.errors[0].message = `Response status returns ${error.errors[0].status} when trying to access https://${domain}/apple-app-site-association,
and returns status ${error.errors[1].status} when trying to access https://${domain}/.well-known/apple-app-site-association.
One of the above url should be set up to be accessed.`;
    return results;
  }

  const text = await response.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch (err) {
    results.errors[0].message = `Invalid JSON format, received:
        ${text}`;
    return results;
  }

  if (!json.applinks) {
    results.errors[0].message = `Response JSON doesn't have 'applinks' key`;
    return results;
  }

  if (json.applinks.apps.length !== 0) {
    results.errors[0].message = `Response JSON 'applinks.apps' should be an empty array, received ${JSON.stringify(
      json.applinks.apps
    )}`;
    return results;
  }

  return { errors: [], validations: [] };
}

export default validateAASA;
