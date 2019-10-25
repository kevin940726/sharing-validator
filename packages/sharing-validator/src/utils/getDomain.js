import { URL } from "url";

const getDomain = url => {
  const urlData = new URL(url);

  return urlData.hostname;
};

export default getDomain;
