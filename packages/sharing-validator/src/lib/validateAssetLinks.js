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

function getResults(result) {
  return {
    validations: [result],
    errors: result.valid ? [] : [result]
  };
}

async function validateAssetLinks(url) {
  const domain = getDomain(url);
  const result = {
    valid: false,
    property: "assetlinks.json",
    content: "Error"
  };

  let response;
  try {
    response = await fetchWithUserAgentAndContentType(
      `https://${domain}/.well-known/assetlinks.json`
    );
  } catch (error) {
    result.message = `Response status returns \`${error.status}\` when trying to access \`https://${domain}/.well-known/assetlinks.json\`.`;
    return getResults(result);
  }

  const contentType = response.headers.get("content-type");
  if (contentType.split(";")[0].trim() !== "application/json") {
    result.message = `The "assetlinks.json" file is NOT served with content-type "application/json", instead received \`${JSON.stringify(
      contentType
    )}.\``;
    return getResults(result);
  }

  const text = await response.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch (err) {
    result.message = `Invalid JSON format, instead received:
${text}`;
    return getResults(result);
  }

  if (!Array.isArray(json)) {
    result.message = `Expected an array of object, instead received \`${typeof json}\``;
    return getResults(result);
  }

  if (
    !json.every(
      statement =>
        Object.keys(statement).length === 2 &&
        Array.isArray(statement.relation) &&
        typeof statement.target === "object"
    )
  ) {
    result.message = `The file is NOT a valid statement list, see the doc for more info.
${JSON.stringify(json, null, 2)}`;
    return getResults(result);
  }

  result.valid = true;
  result.content = "Valid";

  return getResults(result);
}

export default validateAssetLinks;
