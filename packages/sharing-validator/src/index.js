import { URL } from "url";
import getMetadata from "./lib/getMetaData";
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

  const rawMeta = await getMetadata(fullURL, { userAgent });
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

    if (facebookAppLink.ios) {
      results.facebookAppLink.ios = validateFBAppLinkIOSMeta(meta);
    }
    if (facebookAppLink.android) {
      results.facebookAppLink.android = validateFBAppLinkAndroidMeta(meta);
    }
  }

  return {
    results,
    meta
  };
};

export default sharingValidator;
