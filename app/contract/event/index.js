var Web3 = require("web3");
const Collection = require("../../models/collection");
var artTokenManagerContractABI = require("../abis/artTokenManager.json");
var artTokenContractABI = require("../abis/artToken.json");
const Nft = require("../../models/nft");
const { Controllers } = require("../../controllers");
const { setArtTokenListener } = require("./event");

const web3 = new Web3(new Web3.providers.WebsocketProvider(process.env.WS_URL));
// const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:3000"));

var addressArray = [];

exports.getAllCollectionsFromContract = async () => {
  const tokenManagerContract = new web3.eth.Contract(
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

    const new_collection = new Collection({
      title: name,
      symbol: symbol,
      init_logo_uri: logoURL,
      mint_price: web3.utils.fromWei(mintPrice, "ether"),
      max_supply: maxSupply,
      address: event.returnValues._addr,
      init_base_uri: baseURI,
    });

    new_collection.save();
    setArtTokenListener(event.returnValues._addr);
  });

  // Get All Collections From Smart Contract
  Collection.collection.drop();

  addressArray = await tokenManagerContract.methods.getAllCollections().call();

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

    const new_collection = new Collection({
      title: name,
      symbol: symbol,
      init_logo_uri: logoURL,
      mint_price: mintPrice,
      address: addressArray[i],
      max_supply: maxSupply,
      init_base_uri: baseURI,
    });

    console.log("collectionarray", new_collection);

    await new_collection.save();
  }

  for (let i = 0; i < addressArray.length; i++) {
    setArtTokenListener(addressArray[i]);
  }
};
