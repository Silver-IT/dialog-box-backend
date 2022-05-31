const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const fs = require("fs");
const Collection = require("../../models/collection");
const Nft = require("../../models/nft");

exports.getCollections = (req, res) => {
    Collection.find().exec((err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send({ message: err });
            return;
        };
        res.status(200).send(result);
    });
};

exports.uploadCollectionImage = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, './public/images/collections');
        },
        filename(req, file, cb) {
            cb(null, `collection_${new Date().getTime()}.png`);
        }
    }),
    limits: {
        fileSize: 24000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.*$/)) {
            return cb(
                new Error(
                    'only upload image files.'
                )
            );
        }
        cb(undefined, true);
    }
});

exports.addCollection = async (req, res) => {
    try {

        console.log(req.body);

        const new_collection = new Collection({
            title: req.body.title,
            symbol: req.body.symbol,
            init_base_uri: req.body.initBaseURI,
            init_logo_uri: req.body.initLogoURI,
            max_supply: req.body.maxSupply,
            mint_price: req.body.mintPrice,
            address: req.body.address,
        });

        new_collection.save();

        res.status(200).send(true);
    } catch (error) {
        console.log(error);
        res.status(500).send(false);
    }
};

exports.updateCollection = async (req, res) => {
    try {
        const filter = { collectionId: req.body.collectionId };
        const updates = {
            title: req.body.title,
            img: req.body.img,
        };
        await Collection.findOneAndUpdate(filter, updates);
        var data = await fs.readFileSync("collection.json");
        var myObject = JSON.parse(data);
        myObject.map(item => {
            if (item.collectionId === req.body.collectionId) {
                item.title = req.body.title;
                item.img = req.body.img;
            }
        });
        var newData = JSON.stringify(myObject);
        fs.writeFile("collection.json", newData, err => {
            console.log("A collection is updated");
        });
        res.status(200).send(true);
    } catch (error) {
        console.log(error);
        res.status(500).send(false);
    }
};

exports.deleteCollection = (req, res) => {
    Collection.deleteOne({ collectionId: req.query.id }).exec((err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send(false);
        } else {
            Nft.find().exec(async (err, result) => {
                if (result.length > 0) {
                    await result.map(item => {
                        if (item.collectionId === req.query.id) {
                            fs.unlinkSync(`./public/${item.url}`);
                        }
                    });
                    Nft.deleteMany({ collectionId: req.query.id }).exec((error, result1) => {
                        if (error) {
                            console.log(error);
                        } else {
                            res.status(200).send(true);
                        }
                    });
                }
            });
        }
    });
};