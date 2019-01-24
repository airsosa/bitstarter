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
	});

	app.controller('HomeCtrl', [function() {
		//console.log('This is the HomeCtrl');
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
		$scope.toggleCur = function(event, code) {
			event.preventDefault();
			$scope.donationamount = '';
			if (code == 'NG')
				$scope.country_code = 'UN';
			else
				$scope.country_code = 'NG';
		};

		$scope.processDonation = function() {

			var details = {
				fullname: $scope.fname + ' ' + $scope.lname,
				amount: $scope.donationamount * 100,
				currency: $scope.locale[$scope.country_code].currency,
				email: $scope.email,
				reference: ''+Math.floor((Math.random() * 1000000000) + 1),
				timestamp: new Date().getTime(),
				country: $scope.country_code
			};

			//console.log(JSON.stringify(data));
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
				console.log(JSON.stringify(details));
				$http.post('/api/contribution', JSON.stringify(details)).then(function(res) {
					console.log('success');
					console.log(res.data);
					//alert('success. transaction ref is ' + response.reference);
					// redirect to thankyou page
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