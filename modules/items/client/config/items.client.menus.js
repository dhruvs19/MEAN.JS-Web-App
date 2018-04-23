(function () {
  'use strict';

  angular
    .module('items.menu')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Items',
      state: 'items',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'items', {
      title: 'List Items',
      state: 'items.list',
      roles: ['*']
    });
	  // Add the dropdown list item
	  menuService.addSubMenuItem('topbar', 'items', {
		  title: 'Add Items',
		  state: 'items.create',
		  roles: ['admin', 'user']
	  });
	  
	  menuService.addSubMenuItem('topbar', 'items', {
		  title: 'My Items',
		  state: 'items.mylist',
		  roles: ['admin', 'user']
	  });
  }
}());
