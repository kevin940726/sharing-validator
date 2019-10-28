const meow = require("meow");
const chalk = require("chalk");
const sharingValidator = require("sharing-validator");

const cli = meow(
  `
    Usage
      $ sharing-validator [--facebook|--twitter|--AASA|--facebookAppLink.ios|--facebookAppLink.android] <url>

    Options
      --facebook  Validate Facebook meta
      --twitter  Validate Twitter meta
      --AASA  Validate apple-app-site-association file for iOS universal links
      --facebookAppLink-ios  Validate iOS facebook app link meta
      --facebookAppLink-android  Validate Android facebook app link meta

    Examples
      $ sharing-validator https://kaihao.dev
      $ sharing-validator https://blog.example.com
`,
  {
    flags: {
      facebook: {
        type: "boolean",
        default: true
      },
      twitter: {
        type: "boolean",
        default: true
      },
      AASA: {
        type: "boolean"
      },
      assetlinks: {
        type: "boolean"
      },
      "facebookAppLink-ios": {
        type: "boolean"
      },
      "facebookAppLink-android": {
        type: "boolean"
      }
    }
  }
);

const [url] = cli.input;

const options = {
  facebook: cli.flags.facebook,
  twitter: cli.flags.twitter,
  AASA: cli.flags.aasa,
  assetlinks: cli.flags.assetlinks,
  facebookAppLink: {
    ios: cli.flags.facebookAppLinkIos,
    android: cli.flags.facebookAppLinkAndroid
  }
};

if (!url) {
  console.log(chalk`
  ⚠️  You have to provide the <url>.
     Run {bold \`sharing-validator --help\`} to see the usage.
     Or try {bold \`sharing-validator https://google.com\`}.`);
  process.exit(1);
}

function logErrors(feature, errors) {
  console.log(chalk`{green.bold ${feature}}`);

  errors.forEach(error => {
    console.log(
      chalk`  ❌  {greenBright.underline ${error.property}}: {red ${error.message}}`
    );
  });

  console.log("");
}

sharingValidator(url, options).then(({ meta, results }) => {
  for (let feature in options) {
    if (options[feature]) {
      if ("errors" in results[feature]) {
        logErrors(feature, results[feature].errors);
      } else {
        for (let subFeature in results[feature]) {
          logErrors(
            `${feature}.${subFeature}`,
            results[feature][subFeature].errors
          );
        }
      }
    }
  }
});
