import socialValidator from "../";

test("kaihao.dev baseline", async () => {
  const results = await socialValidator("https://kaihao.dev");

  expect(results).toMatchSnapshot();
});

test("kaihao.dev enable all features", async () => {
  const results = await socialValidator("https://kaihao.dev", {
    og: true,
    facebook: true,
    twitter: true,
    AASA: true,
    facebookAppLink: {
      ios: true,
      android: true
    }
  });

  expect(results).toMatchSnapshot();
});
