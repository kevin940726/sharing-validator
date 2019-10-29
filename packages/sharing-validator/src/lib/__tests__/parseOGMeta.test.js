import parseOGMeta from "../parseOGMeta";
import getMetaData from "../getMetaData";

test("baseline", () => {
  const meta = [
    ["undefined", "ie=edge"],
    ["viewport", "width=device-width, initial-scale=1, shrink-to-fit=no"],
    ["generator", "Gatsby 2.15.11"],
    ["description", "I&#x27;m Kai Hao, a front-end developer in Taiwan."],
    ["og:url", "https://kaihao.dev/"],
    ["og:title", "Kai Hao"],
    ["og:description", "I&#x27;m Kai Hao, a front-end developer in Taiwan."],
    [
      "og:image",
      "https://kaihao.dev/static/15baf5b2b73048942a827496d3805470/70e2c/default-meta-image.png"
    ],
    ["og:image:width", "1200"],
    ["og:image:height", "626"],
    ["og:type", "website"],
    ["twitter:card", "summary_large_image"],
    ["twitter:creator", "@kevin940726"],
    ["twitter:title", "Kai Hao"],
    [
      "twitter:description",
      "I&#x27;m Kai Hao, a front-end developer in Taiwan."
    ],
    [
      "twitter:image",
      "https://kaihao.dev/static/15baf5b2b73048942a827496d3805470/70e2c/default-meta-image.png"
    ],
    ["theme-color", "#f2994a"]
  ];

  expect(parseOGMeta(meta)).toMatchSnapshot();
});

// https://ogp.me/#array
test("array", () => {
  const meta = [
    ["og:image:width", "300"],
    ["og:image", "http://example.com/rock.jpg"],
    ["og:image:height", "300"],
    ["og:image", "http://example.com/rock2.jpg"],
    ["og:image", "http://example.com/rock3.jpg"],
    ["og:image:height", "1000"]
  ];

  expect(parseOGMeta(meta)).toEqual({
    og: {
      image: [
        { url: "http://example.com/rock.jpg", width: "300", height: "300" },
        { url: "http://example.com/rock2.jpg" },
        { url: "http://example.com/rock3.jpg", height: "1000" }
      ]
    }
  });
});
