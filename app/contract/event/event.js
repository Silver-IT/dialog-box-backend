var Web3 = require("web3");
const web3 = new Web3(new Web3.providers.WebsocketProvider(process.env.WS_URL));
var artTokenContractABI = require("../abis/artToken.json");
const Nft = require("../../models/nft");
const Collection = require("../../models/collection");

exports.setArtTokenListener = (address) => {
  const tokenContract = new web3.eth.Contract(artTokenContractABI.abi, address);

  tokenContract.events.TokenMinted().on("data", (event) => {
    console.log("token minted", event.returnValues);

    const filter = { metadata_id: event.returnValues._metadataId };
    const updates = { token_id: event.returnValues._tokenId };
    Nft.findOneAndUpdate(filter, updates, (err, result) => {
      if (err) {
        console.log(err.message);
      }
      console.log("token mint update success");
    });
  });

  tokenContract.events.LogoURIUpdated().on("data", (event) => {
    console.log("logoURI minted", event.returnValues);

    const filter = { address: event.returnValues.address };
    const updates = { init_logo_uri: event.returnValues._logoURI };
    Collection.findOneAndUpdate(filter, updates, (err, result) => {
      if (err) {
        console.log(err.message);
      }
      console.log("logo update success");
    });
  });
};
