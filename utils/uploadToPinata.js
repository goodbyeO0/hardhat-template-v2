const pinataSDK = require("@pinata/sdk");
const path = require("path");
const fs = require("fs");
const metadata = require("./pinataData.json");
require("dotenv").config();

const pinataApiKey = process.env.PINATA_API_KEY;
const pinataApiSecret = process.env.PINATA_API_SECRET;

const pinata = new pinataSDK({
  pinataApiKey: pinataApiKey,
  pinataSecretApiKey: pinataApiSecret,
});

async function storeImages(imagesFilePath) {
  const fullImagesPath = path.resolve(imagesFilePath);
  const files = fs.readdirSync(fullImagesPath);

  let responses = [];

  for (let i = 0; i < 1; i++) {
    const readablestreamForFile = fs.createReadStream(
      `${fullImagesPath}/${files[i]}`
    );
    const options = metadata[i];
    try {
      const response = await pinata.pinFileToIPFS(
        readablestreamForFile,
        options
      );
      console.log(response);
      responses.push(response);
    } catch (e) {
      console.log(e);
    }
  }
  return { responses, files };
}

async function storeTokenUriMetadata(metadata) {
  try {
    const response = await pinata.pinJSONToIPFS(metadata);
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
  }
  return null;
}

const metadataNft = {
  name: "ubat batuk",
  Price: "0.0001 eth",
  image: "ipfs://bafybeie34esmrgpceok7komqmdr4gnyjvzh6ooc3vocgkuxmkezdmtfyoi/",
  Description: "Cap kelapa laut afrika",
};

storeTokenUriMetadata(metadataNft);

// storeImages("./img");

// module.exports = { storeImages, storeTokenUriMetadata };
