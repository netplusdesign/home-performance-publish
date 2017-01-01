'use strict';

/* Controllers */

/* global angular */
/* jshint strict : true */
/* jshint undef : true */
/* jshint unused : true */
/* jshint globalstrict : true */

angular.module('myApp.controllers.updateLocal', ['electangular']).

	controller( 'UpdateLocalCtrl', [
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

			// local update
			$scope.localUpdateStatus = {
				'response': 'Checking...',
				'action': '..',
				'status': '.'
			};

			$scope.status = dataService.status;

			$scope.localUpdate = function() {
				ipc.send('local-update');
			}

			$scope.localBrowse = function() {
				ipc.send('local-browse');
			}

			// show stdout from main
			$rootScope.$on('electron-msg', (event, msg) => {

				if (msg.sender == 'local-update') {
					$scope.localUpdateStatus.status = msg.response;
					$scope.$apply($scope.localUpdateStatus);
				}

			})
			// make sure batch json file is updated with latest settings
			ipc.send('batch-update');

	}]);
