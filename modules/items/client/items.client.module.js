(function (app) {
  'use strict';

	app.registerModule('items',['core']);
	app.registerModule('items.menu');
	app.registerModule('items.routes',['ui.router','core.routes']);
}(ApplicationConfiguration));
