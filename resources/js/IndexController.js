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


	$scope.login = () => {


	}


	$scope.register =  () => {
		
		
	}

});