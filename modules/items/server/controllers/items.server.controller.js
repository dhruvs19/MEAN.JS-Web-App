'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
	Item = mongoose.model('Item'),
	config = require(path.resolve('./config/config')),
	multer = require('multer'),
	fs = require('fs'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Item
 */
exports.create = function(req, res) {
  var item = new Item(req.body);
  item.user = req.user;

  item.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(item);
    }
  });
};

/**
 * Show the current Item
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var item = req.item ? req.item.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  item.isCurrentUserOwner = req.user && item.user && item.user._id.toString() === req.user._id.toString();

  res.jsonp(item);
};

/**
 * Update a Item
 */
exports.update = function(req, res) {
  var item = req.item;

	if(req.user._id.toString()  === item.user._id.toString()){
		item = _.extend(item, req.body);

		item.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(item);
			}
		});
	}else{
		return res.status(400).send({
			message: "you are not the owner of this item"
		});
	}
};

/**
 * Delete an Item
 */
exports.delete = function(req, res) {
  var item = req.item;

  item.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(item);
    }
  });
};

/**
 * List of Items
 */
exports.list = function(req, res) {
	var itm = '';
	if(req.query.type == "myitems"){
		var itm = Item.find({"user": req.user._id}).sort('-created').populate('user', 'displayName');
	}else{
		var itm = Item.find().sort('-created').populate('user', 'displayName');
	}
	itm.exec(function(err, items) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(items);
		}
	});
};

/**
 * Item middleware
 */
exports.itemByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Item is invalid'
    });
  }

  Item.findById(id).populate('user', 'displayName').exec(function (err, item) {
    if (err) {
      return next(err);
    } else if (!item) {
      return res.status(404).send({
        message: 'No Item with that identifier has been found'
      });
    }
    req.item = item;
    next();
  });
};

/**
 * Update profile picture
 */
exports.uploadpicture = function (req, res) {
	
	var multerConfig;
	
	multerConfig = config.uploads.profile.image;
	
	multerConfig.dest = './public/images/uploads/items';
	multerConfig.fileFilter = require(path.resolve('./config/lib/multer')).imageFileFilter;

	var upload = multer(multerConfig).single('item_image');

	upload(req, res, function (uploadError) {
		if (uploadError) {
			console.error(uploadError);
		} else {
			console.log("prev image url on server: " + req.body.prev_image);	
			deleteOldImage(req.body.prev_image);							//delete prev image
			res.jsonp('/images/uploads/items/' + req.file.filename);
		}
	});
	
	function deleteOldImage(existingImageUrl) {
		var file_path = './public' + existingImageUrl;
		console.log("removing file: " + file_path);
		if (existingImageUrl !== Item.schema.path('imageUrl').defaultValue) {

			fs.unlink(path.resolve(file_path), function (unlinkError) {
				if (unlinkError) {
					// If file didn't exist, no need to reject promise
					if (unlinkError.code === 'ENOENT') {
						console.log('Removing profile image failed because file did not exist.');
					}
				} else {
					
				}
			});
		}
	}

};

