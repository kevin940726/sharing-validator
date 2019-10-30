import fetch from "node-fetch";
import getDomain from "../utils/getDomain";
import fetchWithErrorHandler from "../utils/fetchWithErrorHandler";
import USER_AGENTS from "./userAgents";

function fetchWithUserAgentAndContentType(url) {
  return fetchWithErrorHandler(url, {
    headers: {
      "User-Agent": USER_AGENTS.googleAssociation,
      "Content-Type": "application/json"
    }
  });
}

async function validateAssetLinks(url) {
  const domain = getDomain(url);
  const results = {
    errors: [
      {
        valid: false,
        property: "assetlinks.json"
      }
    ],
    validations: []
  };

  let response;
  try {
    response = await fetchWithUserAgentAndContentType(
      `https://${domain}/.well-known/assetlinks.json`
    );
  } catch (error) {
    results.errors[0].message = `Response status returns ${error.status} when trying to access https://${domain}/.well-known/assetlinks.json.`;
    return results;
  }

  const contentType = response.headers.get("content-type");
  if (contentType.split(";")[0].trim() !== "application/json") {
    results.errors[0].message = `The "assetlinks.json" file is NOT served with content-type "application/json", received ${contentType}`;
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

  if (!Array.isArray(json)) {
    results.errors[0].message = `Expected an array of object, received ${typeof json}`;
    return results;
  }

  if (
    !json.every(
      statement =>
        Object.keys(statement).length === 2 &&
        Array.isArray(statement.relation) &&
        typeof statement.target === "object"
    )
  ) {
    results.errors[0].message = `The file is NOT a valid statement list, see the doc for more info.
${JSON.stringify(json, null, 2)}`;
    return results;
  }

  return { errors: [], validations: [] };
}

export default validateAssetLinks;
