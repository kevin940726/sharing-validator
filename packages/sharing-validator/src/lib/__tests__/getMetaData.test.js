import getMetadata from "../getMetaData";

test("spotify", async () => {
  const meta = await getMetadata(
    "https://open.spotify.com/track/4u7EnebtmKWzUH433cf5Qv"
  );

  expect(meta).toMatchSnapshot();
});
