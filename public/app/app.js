(function() {
	var app = angular.module('bitstarter', ['ngRoute'])
	.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
		$locationProvider.hashPrefix('');
		$routeProvider
		.when('/', {
			templateUrl: 'app/views/home.html',
			controller: 'HomeCtrl'
		})
		.when('/about', {
			templateUrl: 'app/views/about.html'
		})
		.when('/contact', {
			templateUrl: 'app/views/contact.html'
		})
	}]);

	app.controller('HomeCtrl', [function() {
		console.log('This is the HomeCtrl');
	}]);
})();