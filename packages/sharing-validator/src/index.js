import getMetadata from "./lib/getMetaData";
import parseOGMeta from "./lib/parseOGMeta";
import validateOGMeta from "./lib/validateOGMeta";
import validateFBMeta from "./lib/validateFBMeta";
import validateTwitterMeta from "./lib/validateTwitterMeta";
import validateAASA from "./lib/validateAASA";
import validateFBAppLinkMeta from "./lib/validateFBAppLinkMeta";

const socialValidator = async (
  url,
  {
    og = true,
    facebook = true,
    twitter = true,
    AASA = false,
    facebookAppLink = false
  } = {}
) => {
  const raw = await getMetadata(url);
  const meta = parseOGMeta(raw);

  let results = {};

  if (og) {
    results.og = validateOGMeta(meta);
  }
  if (facebook) {
    results.facebook = validateFBMeta(meta);
  }
  if (twitter) {
    results.twitter = validateTwitterMeta(meta);
  }
  if (AASA) {
    results.AASA = await validateAASA(url);
  }
  if (facebookAppLink) {
    results.facebookAppLink = validateFBAppLinkMeta(meta, facebookAppLink);
  }

  return results;
};

export default socialValidator;
