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

  results.og = validateOGMeta(meta);
  results.og.name = "Open Graph";

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
    results.facebook.name = "Facebook";
  }
  if (twitter) {
    results.twitter = validateTwitterMeta(meta);
    results.twitter.name = "Twitter";
  }
  if (AASA) {
    results.AASA = await validateAASA(fullURL);
    results.AASA.name = "Apple universal link";
  }
  if (assetlinks) {
    results.assetlinks = await validateAssetLinks(fullURL);
    results.assetlinks.name = "Android app link";
  }
  if (facebookAppLinkIOS) {
    results.facebookAppLinkIOS = validateFBAppLinkIOSMeta(ogURLMeta);
    results.facebookAppLinkIOS.name = "Facebook app link for iOS";
  }
  if (facebookAppLinkAndroid) {
    results.facebookAppLinkAndroid = validateFBAppLinkAndroidMeta(ogURLMeta);
    results.facebookAppLinkAndroid.name = "Facebook app link for Android";
  }

  return {
    results,
    meta
  };
};

export default sharingValidator;
