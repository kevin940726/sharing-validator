const DATA_PKCS7 = "2a864886f70d010701";

function extractSignedDataFromDER(derBuffer) {
  let signedData;

  function parseDER(buffer) {
    const json = [];

    let index = 0;

    while (index < buffer.length) {
      const type = buffer[index];
      index += 1;

      let length;
      if (buffer[index] < 128) {
        length = buffer[index];
        index += 1;
      } else {
        const lengthOfLength = buffer[index] & 0x7f;
        index += 1;
        length = parseInt(
          buffer.slice(index, index + lengthOfLength).toString("hex"),
          16
        );
        index += lengthOfLength;
      }

      let value = buffer.slice(index, index + length);
      index += length;

      if (
        // SEQUENCE, SEQUENCE OF
        type === 0x30 ||
        // SET, SET OF
        type === 0x31 ||
        // context-specific tag
        (type & 0xc0) === 0x80
      ) {
        const children = parseDER(value);
        value = [].concat(children);
      }

      if (type === 0x06 && value.toString("hex") === DATA_PKCS7) {
        const signedDataBuffer = parseDER(buffer.slice(index)).value[0].value;
        signedData = signedDataBuffer.toString("utf8");
        break;
      }

      json.push({
        type,
        length,
        value
      });
    }

    return json.length === 1 ? json[0] : json;
  }

  parseDER(derBuffer);

  return signedData;
}

export default extractSignedDataFromDER;
