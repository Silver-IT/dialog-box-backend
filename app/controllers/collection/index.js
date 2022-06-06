const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const fs = require("fs");
const Collection = require("../../models/collection");
const Nft = require("../../models/nft");

exports.getCollections = (req, res) => {
    Collection.find().exec((err, result) => {
        if (err) {
            res.json({success: false, error: err.message});
        }else{
            res.json({success: true, result: result});
        };
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

