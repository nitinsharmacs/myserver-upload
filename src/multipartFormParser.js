const CRLFB = Buffer.from('\r\n');
const TCRLFB = Buffer.from('\r\n\r\n');

const refineHeaderValue = (value) => {
  return value.trim().replaceAll('"', '');
};

const parseHeader = (rawHeader) => {
  const headers = rawHeader.split('\r\n').join(';');
  const _headers = headers.split(';');

  const parsedHeaders = {};
  _headers.forEach(header => {
    const [name, value] = header.split(/:|=/);
    parsedHeaders[name.trim()] = refineHeaderValue(value);
  });
  return parsedHeaders;
};

const parseBodyBlock = ({ rawHeader, rawValue }) => {
  const refinedHeader = rawHeader.toString().trim();
  return {
    headers: parseHeader(refinedHeader),
    value: rawValue
  };
};

const parseBody = (reqBodyBuffer, boundary) => {
  let bodyBuffer = reqBodyBuffer;
  const boundaryBuffer = Buffer.from(boundary + CRLFB);
  const boundaryBufferEnd = Buffer.from(boundary + '--' + CRLFB);
  const boundaryLength = boundaryBuffer.length;

  const parsedBody = [];

  let boundaryPos = bodyBuffer.indexOf(boundaryBuffer);
  let dataStartIndex = bodyBuffer.indexOf(TCRLFB);

  while (dataStartIndex >= 0) {
    const rawHeader = bodyBuffer.slice(boundaryLength, dataStartIndex);

    boundaryPos = bodyBuffer.indexOf(
      boundaryBuffer, dataStartIndex
    );

    if (boundaryPos < 0) {
      boundaryPos = bodyBuffer.indexOf(
        boundaryBufferEnd, dataStartIndex
      );
    }

    const rawValue = bodyBuffer.slice(
      dataStartIndex + TCRLFB.length, boundaryPos - 2
    );

    bodyBuffer = bodyBuffer.slice(boundaryPos);

    dataStartIndex = bodyBuffer.indexOf(TCRLFB);

    parsedBody.push({ rawHeader, rawValue });
  }

  return parsedBody;
};

const parseMultipartFormData = (reqBody, boundary) => {
  const bodyContents = parseBody(reqBody, boundary);

  return bodyContents.map(parseBodyBlock);
};

module.exports = parseMultipartFormData;
