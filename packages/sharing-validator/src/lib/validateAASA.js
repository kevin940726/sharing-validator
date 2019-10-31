import fetch from "node-fetch";
import any from "promise.any";
import extractSignedDataFromDER from "./extractSignedDataFromDER";
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

function getResults(result) {
  return {
    validations: [result],
    errors: result.valid ? [] : [result]
  };
}

async function validateAASA(url) {
  const domain = getDomain(url);
  const result = {
    valid: false,
    property: "apple-app-site-association",
    content: {
      toString: () => "Error"
    }
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
    result.message = `Response status returns ${error.errors[0].status} when trying to access https://${domain}/apple-app-site-association,
and returns status ${error.errors[1].status} when trying to access https://${domain}/.well-known/apple-app-site-association.
One of the above url should be set up to be accessed.`;
    return getResults(result);
  }

  const buffer = await response.buffer();
  let text = buffer.toString("utf8");

  let json;
  try {
    try {
      json = JSON.parse(text);
    } catch (err) {
      if (
        response.headers
          .get("content-type")
          .split(";")[0]
          .trim() === "application/pkcs7-mime"
      ) {
        text = extractSignedDataFromDER(buffer);
        json = JSON.parse(text);
      }
    }
  } catch (err) {
    result.message = `Invalid JSON format, received:
${text}`;
    return getResults(result);
  }

  if (!json.applinks) {
    result.message = `Response JSON should have a 'applinks' key.`;
    return getResults(result);
  }

  if (!json.applinks.details) {
    result.message = `Response JSON should have a 'applinks.details' key.`;
    return getResults(result);
  }

  if (json.applinks.apps.length !== 0) {
    result.message = `Response JSON 'applinks.apps' should be an empty array, received
${JSON.stringify(json.applinks.apps, null, 2)}`;
    return getResults(result);
  }

  result.valid = true;
  result.content = {
    toString: () => "Valid"
  };

  return getResults(result);
}

export default validateAASA;
