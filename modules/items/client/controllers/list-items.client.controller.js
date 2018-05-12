(function () {
  'use strict';

  angular
    .module('items')
    .controller('ItemsListController', ItemsListController);

  ItemsListController.$inject = ['ItemsService'];

  function ItemsListController(ItemsService) {
    var vm = this;
	vm.display = 'grid';
    vm.items = ItemsService.query();
  }
	
	
	angular
		.module('items')
		.controller('MyItemsListController', MyItemsListController);

	MyItemsListController.$inject = ['ItemsService'];

	function MyItemsListController(ItemsService) {
		var vm = this;
		vm.display = 'grid';
		vm.items = ItemsService.query({"type": "myitems"});
	}
}());
