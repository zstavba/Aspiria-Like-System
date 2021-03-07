window.aspiria = angular.module('aspiria',["ngRoute"]);

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
   $routeProvider.when("/clani", {
    templateUrl : angular.element(this).scope.url+"/members",
    controller: "UserController"
  });
   $routeProvider.when("/privat_slike", {
    templateUrl : angular.element(this).scope.url+"/private/images",
    controller: "IndexController"
  });
   $routeProvider.when("/vse_slike", {
    templateUrl : angular.element(this).scope.url+"/all/images",
    controller: "IndexController"
  });
});




aspiria.controller("IndexController",function($scope, $http, $compile, $location,$interval){

	$scope._user_id = 0;

	$scope.init = ($user_id = null) => {
		$scope._user_id = $user_id;


		$scope.getInfo();

	}

	$scope.message = (error_type,message) => {
		$('.system_message').addClass(error_type);
		$scope.message = (message.text == undefined) ? message : message.text;
		$('.system_message .sm_text').html($scope.message);
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

				setTimeout(function(){
					window.location.href =  angular.element(this).scope.url;
				},2000);
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

	$scope.openModal = () => {
		const modal = document.querySelector('.modal');
		modal.classList.toggle('opacity-0')
		modal.classList.toggle('pointer-events-none')
	}
	$scope.closeModal = () => {
		const modal = document.querySelector('.modal');
		modal.classList.toggle('opacity-0')
		modal.classList.toggle('pointer-events-none')
	}


	$scope.logout = () => {
		$http({
			method:"GET",
			url: angular.element(this).scope.url+"/api/user/logout"
		}).then(
			function success(response){
				$scope.message("bg-green-100",response.data["message"]);

				setTimeout(function(){
					window.location.href = angular.element(this).scope.url;
				},2000);
			},
			function error(response){

			}

		)
	}


	$scope.getInfo  = () => {
		$http({
			method:"GET",
			url: angular.element(this).scope.url+"/api/user/info/"+$scope._user_id
		}).then(
			function success(response){
				$scope.user_info = response.data["user"];
			},
			function error(response){

			}

		)

	}

});