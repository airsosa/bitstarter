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
		.when('/support', {
			templateUrl: 'app/views/support.html',
			controler: 'SupportCtrl'
		});
	}]);

	app.controller('HomeCtrl', [function() {
		console.log('This is the HomeCtrl');
	}])
	.controller('SupportCtrl', ['$scope', '$http', function($scope, $http) {
		$http.get('/api/usercountry').then(function(res) {
			$scope.country_code = res.data.country_code ? res.data.country_code : 'NG';
			if ($scope.country_code !== 'NG') $scope.country_code = 'UN';
		}, function(err) {
			$scope.country_code = 'NG';
		});
		$http.get('/api/locale').then(function(res) {
			$scope.locale = res.data;
		});
		$scope.enterAmount = function(event) {
			$scope.donationamount = '';
			if (event.target.hasAttribute('data-amount')) 
				$scope.donationamount = parseInt(event.target.getAttribute('data-amount'));
			document.querySelector('#donationAmount').focus();
		};

	}]);
})();