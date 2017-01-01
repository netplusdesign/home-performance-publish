'use strict';

/* Controllers */

/* global angular */
/* jshint strict : true */
/* jshint undef : true */
/* jshint unused : true */
/* jshint globalstrict : true */

var settings = require('./shared/configuration');

angular.module('myApp.controllers.updateRemote', ['electangular']).

	controller( 'UpdateRemoteCtrl', [
		'$rootScope',
  	'$scope',
    'ipc',
		function (
			$rootScope,
      $scope,
      ipc
		) {

    // remote update
		$scope.remoteUpdateStatus = {
			'response': 'Checking...',
			'action': '..',
			'status': '.',
			'ipCurrent': '',
			'ipStored': settings.readSettings('ip-stored')
		};

		$scope.storeIP = function() {
			settings.saveSettings('ip-stored', $scope.remoteUpdateStatus.ipCurrent);
			$scope.remoteUpdateStatus.ipStored = $scope.remoteUpdateStatus.ipCurrent;
		}

		$scope.remoteUpdate = function() {
			ipc.send('remote-update');
		}

		$scope.remoteBrowse = function() {
			ipc.send('remote-browse');
		}

		// show stdout from main
		$rootScope.$on('electron-msg', (event, msg) => {

			if (msg.sender == 'get-ip') {
				$scope.remoteUpdateStatus.ipCurrent = msg.response;
				$scope.$apply($scope.remoteUpdateStatus);
			}

			if (msg.sender == 'remote-update') {
				$scope.remoteUpdateStatus.status = msg.response;
				$scope.$apply($scope.remoteUpdateStatus);
			}

		});

		ipc.send('get-ip');

	}]);
