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
		.when('/thanks', {
			templateUrl: 'app/views/thanks.html'
		})
		.when('/privacy', {
			templateUrl: 'app/views/privacy.html'
		})
		.when('/support', {
			templateUrl: 'app/views/support.html',
			controler: 'SupportCtrl'
		});
	}]);
	app.directive('donationNg', function() {
		return {
			restrict: 'E',
			templateUrl: 'app/views/donation-ng.html',
		};
	})
	.directive('donationUn', function() {
		return {
			restrict: 'E',
			templateUrl: 'app/views/donation-un.html',
		};
	})
	.directive('social', function() {
		return {
			restrict: 'E',
			templateUrl: 'app/views/social.html',
		};
	})
	.directive('faq', function(){
		return {
			restrict: 'E',
			templateUrl: 'app/views/faq.html',
		};
	})
	.directive('action', function() {
		return {
			restrict: 'E',
			templateUrl: 'app/views/action.html',
		};
	});

	app.factory('resource', ['$http', function($http) {
		return {
			getLocale: function() {
				return $http.get('/api/locale');
			},
			getCountry: function() {
				return $http.get('/api/usercountry');
			}
		};
	}]);

	app.controller('HomeCtrl', ['resource', '$scope', '$http', function(resource, $scope, $http) {
		$scope.resource = resource;
		if (!$scope.resource.hasOwnProperty('locale')) {
			$scope.resource.getLocale().then(
				function(res) {
					$scope.resource.locale = res.data;
				});
		}

		if (!$scope.resource.hasOwnProperty('country_code')) {
			$scope.resource.getCountry().then(
				function(res) {
					$scope.resource.country_code = res.data.country_code ? res.data.country_code : 'NG';
					$scope.resource.country_name = res.data.country_name ? res.data.country_name : 'Unknown';
					if ($scope.resource.country_code !== 'NG') $scope.resource.country_code = 'UN';
				}, function(err) {
					$scope.resource.country_code = 'NG';
					$scope.resource.country_name = 'Unknown';
				});
		}

		$http.get('/api/dashboard').then(function(res) {
			$scope.donations = res.data;
			if ($scope.donations.donations_USD > $scope.donations.target_USD)
				$scope.progress = 100;
			else
				$scope.progress = Math.floor($scope.donations.donations_USD / $scope.donations.target_USD * 100);
		})

	}])
	.controller('SupportCtrl', ['$scope', '$http', 'resource', '$location', function($scope, $http, resource, $location) {
		$scope.resource = resource;
		if (!$scope.resource.hasOwnProperty('locale')) {
			$scope.resource.getLocale().then(
				function(res) {
					$scope.resource.locale = res.data;
				}
			);
		}

		if (!$scope.resource.hasOwnProperty('country_code')) {
			$scope.resource.getCountry().then(
				function(res) {
					$scope.resource.country_code = res.data.country_code ? res.data.country_code : 'NG';
					$scope.resource.country_name = res.data.country_name ? res.data.country_name : 'Unknown';
					if ($scope.resource.country_code !== 'NG') $scope.resource.country_code = 'UN';
				}, function(err) {
					$scope.resource.country_code = 'NG';
					$scope.resource.country_name = 'Unknown';
				});
		}

		$scope.enterAmount = function(event) {
			$scope.donationamount = '';
			if (event.target.hasAttribute('data-amount'))
				$scope.donationamount = parseInt(event.target.getAttribute('data-amount'));
			document.querySelector('#donationAmount').focus();
			event.preventDefault();
		};
		$scope.toggleCur = function(event, code) {
			event.preventDefault();
			$scope.donationamount = '';
			if (code == 'NG')
				$scope.resource.country_code = 'UN';
			else
				$scope.resource.country_code = 'NG';
		};

		$scope.processDonation = function() {

			var details = {
				fullname: $scope.fname + ' ' + $scope.lname,
				amount: $scope.donationamount * 100,
				currency: $scope.resource.locale[$scope.resource.country_code].currency,
				email: $scope.email,
				reference: ''+Math.floor((Math.random() * 1000000000) + 1),
				country: $scope.resource.country_name
			};

			var handler = PaystackPop.setup({
      key: 'pk_test_d6b77c0b2c69324c5c80e54a5cefc4dc1458168f',
      email: details['email'],
      amount: details['amount'],
			currency: details['currency'],
      ref: details['reference'],
      metadata: {
         custom_fields: [
            {
                display_name: "Full Name",
                variable_name: "full_name",
                value: details['fullname']
            }
         ]
      },
      callback: function(response){
				$http.post('/api/contribution', JSON.stringify(details)).then(function(res) {
					//console.log(res.data);
					//alert('success. transaction ref is ' + response.reference);
					// redirect to thankyou page
					$location.path('/thanks');
				}, function(err) {
					console.log(err);
				});

      },
      onClose: function(){
          alert('window closed');
      }
    });
    handler.openIframe();
	};

	}]);
})();
