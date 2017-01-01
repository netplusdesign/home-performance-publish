'use strict';

/* Controllers */

/* global angular */
/* jshint strict : true */
/* jshint undef : true */
/* jshint unused : true */
/* jshint globalstrict : true */

angular.module('myApp.controllers.temperature', ['electangular']).

	controller( 'TemperatureCtrl', [
		'$rootScope',
  	'$scope',
    'ipc',
		function (
			$rootScope,
      $scope,
      ipc
		) {

			// temperature
			$scope.temperatureStatus = {
				'response': 'Checking...'
			};

			// if yes, then trim
			$scope.trim = function() {
				$scope.temperatureStatus.response = 'Sending trim command...';
				ipc.send('trim');
			}

			// show stdout from main
			$rootScope.$on('electron-msg', (event, msg) => {

				if (msg.sender == 'trim') {
					$scope.temperatureStatus.response = msg.response;
					$scope.$apply($scope.temperatureStatus);
				}

				if (msg.sender == 'trim-precheck') {
					$scope.temperatureStatus.response = msg.response;
					$scope.$apply($scope.temperatureStatus);
				}

			})

			// check if files exist
			ipc.send('trim-precheck');

	}]);
