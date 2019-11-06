import { URL } from "url";
import getMetaData from "./lib/getMetaData";
import parseMeta from "./lib/parseMeta";
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
import { NAMES } from "./lib/names";

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
    facebookAppLinkIOS = false,
    facebookAppLinkAndroid = false
  } = {},
  { userAgent = USER_AGENTS.general } = {}
) => {
  const fullURL = transformToFullURL(url);

  const rawMeta = await getMetaData(fullURL, { userAgent });
  const meta = parseMeta(rawMeta);

  const results = {};

  results.og = validateOGMeta(meta, { url: fullURL });

  let ogURLMeta = meta;
  if (
    meta.og &&
    meta.og.url &&
    !results.og.errors.find(err => err.property === "og:url") &&
    meta.og.url !== fullURL
  ) {
    const ogURL = meta.og.url;
    const ogURLRawMeta = await getMetaData(ogURL, {
      userAgent: USER_AGENTS.facebook
    });
    ogURLMeta = parseMeta(ogURLRawMeta);
  }

  if (facebook) {
    results.facebook = validateFBMeta(ogURLMeta);
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
  if (facebookAppLinkIOS) {
    results.facebookAppLinkIOS = validateFBAppLinkIOSMeta(ogURLMeta);
  }
  if (facebookAppLinkAndroid) {
    results.facebookAppLinkAndroid = validateFBAppLinkAndroidMeta(ogURLMeta);
  }

  for (let key in results) {
    results[key].name = NAMES[key];
  }

  return {
    results,
    meta
  };
};

export { NAMES };

export default sharingValidator;
