import fetch from "node-fetch";
import { Parser } from "htmlparser2";
import USER_AGENTS from "./userAgents";

async function getMetadata(
  url,
  { userAgent = USER_AGENTS.general, headers = {} } = {}
) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": userAgent,
      ...headers
    }
  });

  return new Promise(resolve => {
    const meta = [];

    const htmlParser = new Parser(
      {
        onopentag(name, attrs) {
          if (name === "meta" && (attrs.property || attrs.name)) {
            meta.push([attrs.property || attrs.name, attrs.content]);
          }
        },
        onclosetag(name) {
          if (name === "head") {
            htmlParser.end();
          }
        },
        onend() {
          resolve(meta);
        }
      },
      { decodeEntities: false }
    );

    response.body.pipe(htmlParser);
  });
}

export default getMetadata;
