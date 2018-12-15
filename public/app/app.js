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
			event.preventDefault();
		};

		$scope.processDonation = function() {
			var handler = PaystackPop.setup({
      key: 'pk_test_d6b77c0b2c69324c5c80e54a5cefc4dc1458168f',
      email: $scope.email,
      amount: $scope.donationamount * 100,
      ref: ''+Math.floor((Math.random() * 1000000000) + 1), // generates a pseudo-unique reference. Please replace with a reference you generated. Or remove the line entirely so our API will generate one for you
      metadata: {
         custom_fields: [
            {
                display_name: "Full Name",
                variable_name: "full_name",
                value: $scope.fname + ' ' + $scope.lname
            }
         ]
      },
      callback: function(response){
          alert('success. transaction ref is ' + response.reference);
      },
      onClose: function(){
          alert('window closed');
      }
    });
    handler.openIframe();
	};

	}]);
})();
