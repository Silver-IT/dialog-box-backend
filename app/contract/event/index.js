var Web3 = require("web3");
const Collection = require("../../models/collection");
var artTokenManagerContractABI = require("../abis/artTokenManager.json");
var artTokenContractABI = require("../abis/artToken.json");
const Nft = require("../../models/nft");

const web3 = new Web3(new Web3.providers.WebsocketProvider(process.env.WS_URL));

let tokenManagerContract = null;
let tokenContracts = [];

exports.getAllCollectionsFromContract = async () => {
  tokenManagerContract = new web3.eth.Contract(
    artTokenManagerContractABI.abi,
    process.env.TOKENMANAGER_CONTRACT_ADDRESS
  );

  //set event listener to collection deployment.
  tokenManagerContract.events.CollectionAdded().on("data", async (event) => {
    console.log(`collection deployed: ${event.returnValues._addr}`);

    const artTokenContract = new web3.eth.Contract(
      artTokenContractABI.abi,
      event.returnValues._addr
    );

    let name = await artTokenContract.methods.name().call();
    let symbol = await artTokenContract.methods.symbol().call();
    let logoURL = await artTokenContract.methods.logoURI().call();
    let mintPrice = await artTokenContract.methods.MINT_PRICE().call();
    let maxSupply = await artTokenContract.methods.MAX_SUPPLY().call();
    let baseURI = await artTokenContract.methods.baseURI().call();
    let owner = await artTokenContract.methods.owner().call();

    const new_collection = new Collection({
      title: name,
      symbol: symbol,
      init_logo_uri: logoURL,
      mint_price: web3.utils.fromWei(mintPrice, "ether"),
      max_supply: maxSupply,
      address: event.returnValues._addr,
      init_base_uri: baseURI,
      owner: owner
    });

    new_collection.save();
    const tokenContract = new web3.eth.Contract(artTokenContractABI.abi, address);
    tokenContracts.push(tokenContract);
    setArtTokenListener(tokenContract);
  });

  // Get All Collections From Smart Contract
  try {
    Collection.collection.drop();
  } catch(error) {
    console.log("Drop 'collections' collection", error.message);
  }
  
  const addressArray = await tokenManagerContract.methods.getAllCollections().call();

  for (let i = 0; i < addressArray.length; i++) {
    const tokenContract = new web3.eth.Contract(
      artTokenContractABI.abi,
      addressArray[i]
    );

    let name = await tokenContract.methods.name().call();
    let symbol = await tokenContract.methods.symbol().call();
    let logoURL = await tokenContract.methods.logoURI().call();
    let mintPrice = await tokenContract.methods.MINT_PRICE().call();
    let maxSupply = await tokenContract.methods.MAX_SUPPLY().call();
    let baseURI = await tokenContract.methods.baseURI().call();
    let owner = await tokenContract.methods.owner().call();

    const new_collection = new Collection({
      title: name,
      symbol: symbol,
      init_logo_uri: logoURL,
      mint_price: mintPrice,
      address: addressArray[i],
      max_supply: maxSupply,
      init_base_uri: baseURI,
      owner: owner
    });

    console.log("collection: ", new_collection.title);

    await new_collection.save();
  }

  for (let i = 0; i < addressArray.length; i++) {
    const tokenContract = new web3.eth.Contract(artTokenContractABI.abi, addressArray[i]);
    tokenContracts.push(tokenContract);
    setArtTokenListener(tokenContract);
  }
};


const setArtTokenListener = (tokenContract) => {
  const { address } = tokenContract.options;
  console.log("setArtTokenEVentListener", address);

  tokenContract.events.TokenMinted().on("data", (event) => {
    console.log("TokenMinted", event.returnValues);

    const filter = {
      collection_address: address,
      metadata_id: event.returnValues._metadataId
    };
    const updates = { token_id: event.returnValues._tokenId };
    Nft.findOneAndUpdate(filter, updates, (err, result) => {
      if (err) {
        console.log(err.message);
      }
      console.log("token mint update success");
    });
  });

  tokenContract.events.LogoURIUpdated().on("data", (event) => {
    console.log("LogoURIUpdated", event.returnValues);

    const filter = { address: address };
    const updates = { init_logo_uri: event.returnValues._logoURI };
    Collection.findOneAndUpdate(filter, updates, (err, result) => {
      if (err) {
        console.log(err.message);
      }
      console.log("logo update success");
    });
  });
};