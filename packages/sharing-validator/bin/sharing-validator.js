#!/usr/bin/env node

const meow = require("meow");
const chalk = require("chalk");
const sharingValidator = require("../").default;

const cli = meow(
  `
    Usage
      $ sharing-validator [--facebook|--twitter|--AASA|--facebookAppLink.ios|--facebookAppLink.android] <url>

    Options
      --facebook  Validate Facebook meta
      --twitter  Validate Twitter meta
      --aasa  Validate apple-app-site-association file for iOS universal links
      --assetlinks  Validate assetlinks.json for Android app links
      --facebookAppLink-ios  Validate iOS facebook app link meta
      --facebookAppLink-android  Validate Android facebook app link meta
      --all Enable all features

    Examples
      $ sharing-validator kaihao.dev
      $ sharing-validator blog.example.com --aasa
      $ sharing-validator https://example.com --all
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
      },
      all: {
        type: "boolean"
      }
    }
  }
);

const [url] = cli.input;

function getFlag(key) {
  return cli.flags[key] || cli.flags.all;
}

const options = {
  og: true,
  facebook: getFlag("facebook"),
  twitter: getFlag("twitter"),
  AASA: getFlag("aasa"),
  assetlinks: getFlag("assetlinks"),
  facebookAppLink: {
    ios: getFlag("facebookAppLinkIos"),
    android: getFlag("facebookAppLinkAndroid")
  }
};

if (!url) {
  console.log(chalk`
  ⚠️  You have to provide the <url>.
     Run {bold \`sharing-validator --help\`} to see the usage.
     Or try {bold \`sharing-validator kaihao.dev\`}.`);
  process.exit(1);
}

function logValidations(feature, validations) {
  const validationList = validations.filter(
    validation => validation.content || !validation.valid
  );

  if (!validationList.length) {
    return;
  }

  console.log(chalk`{bgGreen.bold.rgb(0,0,0)  ${feature} }`);

  validationList.forEach(validation => {
    let icon = validation.valid ? "✅" : "❌";
    if (validation.type === "warning" && !validation.valid) {
      // Weird that warning emoji needs to be padded to the same length
      icon = "⚠️ ";
    }

    console.log(
      chalk`${icon}  {greenBright.underline "${validation.property}"} = ${
        typeof validation.content === "string"
          ? `"${validation.content}"`
          : validation.content
      }`
    );
    if (!validation.valid && validation.message) {
      console.log(chalk`  {red ${validation.message}}`);
    }
  });

  console.log("");
}

sharingValidator(url, options).then(({ meta, results }) => {
  for (let feature in results) {
    if (options[feature]) {
      if (results[feature].hasOwnProperty("validations")) {
        logValidations(feature, results[feature].validations);
      } else {
        for (let subFeature in results[feature]) {
          if (options[feature][subFeature]) {
            logValidations(
              `${feature}.${subFeature}`,
              results[feature][subFeature].validations
            );
          }
        }
      }
    }
  }
});
