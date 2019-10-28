import { version } from "../../package.json";

const USER_AGENTS = {
  general: `sharing-validator-v${version};facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php);line-poker/1.0;(Applebot/0.1; +http://www.apple.com/go/applebot);Twitterbot/1.0;GoogleAssociationService`,
  facebook:
    "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
  apple:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/600.2.5 (KHTML, like Gecko) Version/8.0.2 Safari/600.2.5 (Applebot/0.1; +http://www.apple.com/go/applebot)",
  twitter: "Twitterbot/1.0",
  line: "facebookexternalhit/1.1;line-poker/1.0",
  googleAssociation: "GoogleAssociationService"
};

export default USER_AGENTS;
