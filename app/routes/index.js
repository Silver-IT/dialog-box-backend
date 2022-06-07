const { Controllers } = require("../controllers");

module.exports = function (app) {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // NFT Image Upload
  app.post(
    "/api/file_upload",
    Controllers.NFTController.uploadNFT.single("file"),
    (req, res, next) => {
      const file_path =
        req.file.destination.substr(9) + "/" + req.file.filename;
      res.status(200).send({
        success: true,
        file: file_path,
      });
    }
  );
  // NFT Image Delete
  app.post("/api/file_remove", Controllers.NFTController.removeImage);
  // Save New NFT
  app.post("/api/nft", Controllers.NFTController.saveNFT);
  // Update NFT
  app.put("/api/nft", Controllers.NFTController.updateNFT);
  // Get NFTs
  app.get("/api/nfts", Controllers.NFTController.getNFTs);

  // Dashboard
  app.post(
    "/api/tiny_image_upload",
    Controllers.ArticleController.tinyImageUpload.single("file"),
    (req, res, next) => {
      const file_path =
        req.file.destination.substr(9) + "/" + req.file.filename;
      res.status(200).send(file_path);
    }
  );
  app.get("/api/aboutus", Controllers.ArticleController.getAboutus);
  app.post("/api/aboutus", Controllers.ArticleController.saveAboutus);
  app.get("/api/charity", Controllers.ArticleController.getCharity);
  app.post("/api/charity", Controllers.ArticleController.saveCharity);

  app.get("/api/faq", Controllers.ArticleController.getFaq);
  app.post("/api/faq", Controllers.ArticleController.saveFaq);
  app.get("/api/terms", Controllers.ArticleController.getTerms);
  app.post("/api/terms", Controllers.ArticleController.saveTerms);

  app.post(
    "/api/collection_image_upload",
    Controllers.CollectionController.uploadCollectionImage.single("file"),
    (req, res, next) => {
      const file_path =
        req.file.destination.substr(9) + "/" + req.file.filename;
      res.status(200).send({
        success: true,
        file: file_path,
      });
    }
  );

  app.get("/api/collections", Controllers.CollectionController.getCollections);

  //metadata for a token
  app.get("/collection/:collection_address/token/:token_id", Controllers.NFTController.tokenURI);
};
