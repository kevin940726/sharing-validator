import sharingValidator from "../";

test("kaihao.dev baseline", async () => {
  const results = await sharingValidator("https://kaihao.dev");

  expect(results).toMatchSnapshot();
});

test("kaihao.dev enable all features", async () => {
  const results = await sharingValidator("https://kaihao.dev", {
    facebook: true,
    twitter: true,
    AASA: true,
    assetlinks: true,
    facebookAppLink: {
      ios: true,
      android: true
    }
  });

  expect(results).toMatchSnapshot();
});
