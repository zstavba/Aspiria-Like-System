var aspiria = angular.module('aspiria',["ngRoute"]);

/* Adding link to the script to easy hange for later on  */
angular.element(this).scope.url =  "http://localhost/aspiria/public";

aspiria.config(function($routeProvider,$locationProvider) {

  $routeProvider.when("/", {
    templateUrl : angular.element(this).scope.url+"/home",
    controller: "IndexController"
  })
  $routeProvider.when("/prijava", {
    templateUrl : angular.element(this).scope.url+"/login",
    controller: "IndexController"
  })
   $routeProvider.when("/registracija", {
    templateUrl : angular.element(this).scope.url+"/register",
    controller: "IndexController"
  });

});




aspiria.controller("IndexController",function($scope, $http, $compile, $location,$interval){

	$scope.init = () => {
		

	}

	$scope.message = (error_type,message) => {
		$('.system_message').addClass(error_type);
		$('.system_message .sm_text').html(message.text);
		$('.system_message').fadeIn();
		setTimeout(function(){
			$('.system_message').removeClass(error_type);
			$('.system_message .sm_text').html("");
			$('.system_message').fadeOut();
		},4000);
	 }



	


	$scope.login = () => {
		$http({
			method:"POST",
			url: angular.element(this).scope.url+"/api/user/login",
			data:{
				"username": $scope.login_username,
				"password": $scope.login_password
			}
		}).then(
			function success(response){
				$scope.message("bg-green-100",response.data["message"]);
			},
			function error(response){
				$scope.message("bg-red-200",response.data["message"]);
			}

		);

	}


	$scope.register =  () => {
		$http({
			method:"POST",
			url: angular.element(this).scope.url+"/api/user/register",
			data: {
				"name": $scope.register_name,
				"email":  $scope.register_email,
				"password": $scope.register_password,
				"username" : $scope.register_username,
			}
		}).then(
			function success(response){
				$scope.message("bg-green-100",response.data["message"]);
			},
			function error(response){
				$scope.message("bg-red-200",response.data["message"]);
			}

		);
	}

});