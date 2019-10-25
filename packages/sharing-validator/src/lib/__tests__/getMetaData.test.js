import getMetadata from "../getMetaData";

test("kaihao.dev", async () => {
  const meta = await getMetadata("https://kaihao.dev");

  expect(meta).toMatchSnapshot();
});
