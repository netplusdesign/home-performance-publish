'use strict';

/* Controllers */

/* global angular */
/* jshint strict : true */
/* jshint undef : true */
/* jshint unused : true */
/* jshint globalstrict : true */

angular.module('myApp.controllers.server', ['electangular']).

	controller( 'ServerCtrl', [
		'$rootScope',
  	'$scope',
    'ipc',
		'dataService',
		function (
			$rootScope,
      $scope,
      ipc,
			dataService
		) {

    // server
		$scope.serverStatus = {
			'response': 'Checking...',
			'action': '..'
		};

		$scope.status = dataService.status;

		$scope.serverStartStop = function() {
			if ($scope.serverStatus.action == 'Start') {
				ipc.send('server-start');
			}
			else if ($scope.serverStatus.action == 'Stop') {
				ipc.send('server-stop');
			}
		}

		// show stdout from main
		$rootScope.$on('electron-msg', (event, msg) => {

			if (msg.sender == 'server-status') {
				setServerAction(msg.response.trim());
				$scope.$apply($scope.serverStatus);
			}

			if (msg.sender == 'server-start') {
				setServerAction(msg.response.trim());
				$scope.$apply($scope.serverStatus);
			}

			if (msg.sender == 'server-stop') {
				setServerAction(msg.response.trim());
				$scope.$apply($scope.serverStatus);
			}

		})

		var setServerAction = function(status) {
			$scope.serverStatus.response = status;
			if (status == 'Stopped') {
				$scope.serverStatus.action = 'Start';
				dataService.status.server = false;
			}
			else {
				// status == 'Running'
				$scope.serverStatus.action = 'Stop';
				dataService.status.server = true;
			}
		}

		ipc.send('server-status');

	}]);
