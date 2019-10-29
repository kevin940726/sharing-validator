#!/usr/bin/env node

const meow = require("meow");
const chalk = require("chalk");
const sharingValidator = require("../");

const cli = meow(
  `
    Usage
      $ sharing-validator [--facebook|--twitter|--AASA|--facebookAppLink.ios|--facebookAppLink.android] <url>

    Options
      --facebook  Validate Facebook meta
      --twitter  Validate Twitter meta
      --AASA  Validate apple-app-site-association file for iOS universal links
      --assetlinks  Validate assetlinks.json for Android app links
      --facebookAppLink-ios  Validate iOS facebook app link meta
      --facebookAppLink-android  Validate Android facebook app link meta

    Examples
      $ sharing-validator kaihao.dev
      $ sharing-validator blog.example.com
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
     Or try {bold \`sharing-validator kaihao.dev\`}.`);
  process.exit(1);
}

let allValid = true;

function logErrors(feature, errors) {
  if (!errors.length) {
    return;
  }

  console.log(chalk`{yellow.bold ${feature}}`);

  errors.forEach(error => {
    console.log(
      chalk`  ❌  {greenBright.underline ${error.property}}: {red ${error.message}}`
    );
  });

  console.log("");

  allValid = false;
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

  if (allValid) {
    console.log(chalk.green.bold`🎉  All pass!`);
  }
});
