aspiria.controller("UserController",function($scope, $http, $compile, $location,$interval){

	$scope._user_id = 0;

	$scope.init = (user_id) => {
		$scope._user_id = user_id;

		$scope.members();
	}


	$scope.members = () => {

		$http({
			method:"GET",
			url: angular.element(this).scope.url+"/api/user/members"
		}).then(
			function success(response){
				$scope.members = response.data;
			},
			function error(response){

			}
		);

	}



});