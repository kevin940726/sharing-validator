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
      --facebook-app-link-ios  Validate iOS facebook app link meta
      --facebook-app-link-android  Validate Android facebook app link meta
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
      "facebook-app-link-ios": {
        type: "boolean"
      },
      "facebook-app-link-android": {
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
  facebookAppLinkIOS: getFlag("facebookAppLinkIos"),
  facebookAppLinkAndroid: getFlag("facebookAppLinkAndroid")
};

if (!url) {
  console.log(chalk`
  ⚠️  You have to provide the <url>.
     Run {bold \`sharing-validator --help\`} to see the usage.
     Or try {bold \`sharing-validator kaihao.dev\`}.`);
  process.exit(1);
}

function getContent({ property, content }) {
  if (typeof content === "undefined") {
    return chalk.gray`undefined`;
  } else if (
    (property === "apple-app-site-association" ||
      property === "assetlinks.json") &&
  ) {
    return chalk.bold`${content}`;
  } else {
    return JSON.stringify(content, null, 2);
  }
}

function logValidations({ name, validations }) {
  const validationList = validations.filter(
    validation => validation.content || !validation.valid
  );

  if (!validationList.length) {
    return;
  }

  console.log(chalk`{bgGreen.bold.rgb(0,0,0)  ${name} }`);

  validationList.forEach(validation => {
    let icon = validation.valid ? "✅" : "❌";
    if (validation.type === "warning" && !validation.valid) {
      // Weird that warning emoji needs to be padded to the same length
      icon = "⚠️ ";
    }

    console.log(
      chalk`${icon}  {greenBright.underline "${
        validation.property
      }"} = ${getContent(validation)}`
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
      logValidations(results[feature]);
    }
  }
});
