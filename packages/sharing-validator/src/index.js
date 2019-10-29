import { URL } from "url";
import getMetaData from "./lib/getMetaData";
import parseOGMeta from "./lib/parseOGMeta";
import validateOGMeta from "./lib/validateOGMeta";
import validateFBMeta from "./lib/validateFBMeta";
import validateTwitterMeta from "./lib/validateTwitterMeta";
import validateAASA from "./lib/validateAASA";
import validateAssetLinks from "./lib/validateAssetLinks";
import {
  validateFBAppLinkIOSMeta,
  validateFBAppLinkAndroidMeta
} from "./lib/validateFBAppLinkMeta";
import USER_AGENTS from "./lib/userAgents";

function transformToFullURL(url) {
  let fullURL = url;
  try {
    new URL(fullURL);
  } catch (err) {
    fullURL = `https://${fullURL}`;

    try {
      new URL(fullURL);
    } catch (err) {
      console.error(`Requires a valid URL, instead received ${url}`);
    }
  }

  return fullURL;
}

const sharingValidator = async (
  url,
  {
    facebook = true,
    twitter = true,
    AASA = false,
    assetlinks = false,
    facebookAppLink = false
  } = {},
  { userAgent = USER_AGENTS.general } = {}
) => {
  const fullURL = transformToFullURL(url);

  const rawMeta = await getMetaData(fullURL, { userAgent });
  const meta = parseOGMeta(rawMeta);

  const results = {};

  results.og = validateOGMeta(meta);

  if (facebook) {
    results.facebook = validateFBMeta(meta);
  }
  if (twitter) {
    results.twitter = validateTwitterMeta(meta);
  }
  if (AASA) {
    results.AASA = await validateAASA(fullURL);
  }
  if (assetlinks) {
    results.assetlinks = await validateAssetLinks(fullURL);
  }
  if (facebookAppLink) {
    results.facebookAppLink = {};
    let facebookAppLinkMeta = meta;

    if (
      meta.og &&
      meta.og.url &&
      !results.og.errors.find(err => err.property === "og:url") &&
      meta.og.url !== fullURL
    ) {
      const ogURL = meta.og.url;
      const ogURLRawMeta = await getMetaData(ogURL, {
        userAgent: USER_AGENTS.facebook,
        headers: {
          "Prefer-Html-Meta-Tags": "al"
        }
      });
      facebookAppLinkMeta = parseOGMeta(ogURLRawMeta);
    }

    if (facebookAppLink.ios) {
      results.facebookAppLink.ios = validateFBAppLinkIOSMeta(
        facebookAppLinkMeta
      );
    }
    if (facebookAppLink.android) {
      results.facebookAppLink.android = validateFBAppLinkAndroidMeta(
        facebookAppLinkMeta
      );
    }
  }

  return {
    results,
    meta
  };
};

export default sharingValidator;
