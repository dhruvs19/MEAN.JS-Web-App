(function () {
  'use strict';
	
  // Items controller
  angular
    .module('items')
    .controller('ItemsController', ItemsController);

  ItemsController.$inject = ['$scope', '$state', '$window','Upload','$http' ,'Authentication', 'itemResolve'];

  function ItemsController ($scope, $state, $window, Upload, $http, Authentication, item) {
    var vm = this;

    vm.authentication = Authentication;
    vm.item = item;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
	vm.progress = 0;

    // Remove existing Item
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.item.$remove($state.go('items.list'));
      }
    }

    // Save Item
    function save(isValid,pic) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.itemForm');
        return false;
      }
		console.log("previous image url: "+ vm.item.imageUrl);
      // TODO: move create/update logic to service
	if(pic != null){
		
	  Upload.upload({			//uploading the image
		  url: '/api/upload/picture/item',
		  data: {
			  item_image: pic, prev_image: vm.item.imageUrl
		  }
	  }).then(function (response) {
		  console.log("new image url: "+ response.data);
		  if(response.data.length > 0){
			vm.item.imageUrl = response.data;
		  }
		  if (vm.item._id) {
			vm.item.$update(successCallback, errorCallback);		//updating item after uploading the image
		  }else {
			vm.item.$save(successCallback, errorCallback);
		  }

	  }, function (evt) {
		  vm.progress = parseInt(100.0 * evt.loaded / evt.total, 10);
	  });
		
	}else{
		if (vm.item._id) {
			vm.item.$update(successCallback, errorCallback);
		}else {
			vm.item.$save(successCallback, errorCallback);
		}
	}

      function successCallback(res) {
        $state.go('items.view', {
          itemId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
