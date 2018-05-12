'use strict';

/**
 * Module dependencies
 */
var itemsPolicy = require('../policies/items.server.policy'),
  items = require('../controllers/items.server.controller');

module.exports = function(app) {
  // Items Routes
  app.route('/api/items').all(itemsPolicy.isAllowed)
    .get(items.list)
    .post(items.create);

  app.route('/api/items/:itemId').all(itemsPolicy.isAllowed)
    .get(items.read)
    .put(items.update)
    .delete(items.delete);
	
	app.route('/api/upload/picture/item').all(itemsPolicy.isAllowed)
		.post(items.uploadpicture);

  // Finish by binding the Item middleware
  app.param('itemId', items.itemByID);
};
