'use strict';

/* Controllers */

/* global angular */
/* jshint strict : true */
/* jshint undef : true */
/* jshint unused : true */
/* jshint globalstrict : true */

var settings = require('./shared/configuration');

angular.module('myApp.controllers.database', ['electangular']).

	controller( 'DatabaseCtrl', [
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

    // database
		$scope.databaseStatus = {
			'response': 'Checking...',
			'action': '..', 'backups': [],
			'backupSelected': '',
			'restore': '',
			'backups': settings.readSettings('backups'),
			'backupSelected': settings.readSettings('selected-backup')
		};

		$scope.databaseStartStop = function() {
			if ($scope.databaseStatus.action == 'Start') {
				ipc.send('database-start');
			}
			else if ($scope.databaseStatus.action == 'Stop') {
				ipc.send('database-stop');
			}
		}

		$scope.databaseBackup = function() {
			ipc.send('database-backup');
		}

		$scope.databaseRestore = function() {
			settings.saveSettings('selected-backup', $scope.databaseStatus.backupSelected);
			$scope.databaseStatus.restore = 'Restoring...';
			ipc.send('database-restore');
		}

		// show stdout from main
		$rootScope.$on('electron-msg', (event, msg) => {

			if (msg.sender == 'database-status') {
				setDatabaseAction(msg.response.trim());
				$scope.$apply($scope.databaseStatus);
			}

			if (msg.sender == 'database-start') {
				setDatabaseAction(msg.response.trim());
				$scope.$apply($scope.databaseStatus);
			}

			if (msg.sender == 'database-stop') {
				setDatabaseAction(msg.response.trim());
				$scope.$apply($scope.databaseStatus);
			}

			if (msg.sender == 'database-backup') {
				setLastDatabaseBackup(msg.response);
				$scope.$apply($scope.databaseStatus);
			}

			if (msg.sender == 'database-restore') {
				$scope.databaseStatus.restore = msg.response;
				$scope.$apply($scope.databaseStatus);
			}

		})

		var setDatabaseAction = function(status) {
			$scope.databaseStatus.response = status;
			if (status == 'Stopped') {
				$scope.databaseStatus.action = 'Start';
				dataService.status.database = false;
			}
			else {
				// status == 'Running\n'
				$scope.databaseStatus.action = 'Stop';
				dataService.status.database = true;
			}
		},

		setLastDatabaseBackup = function(msg) {
			// update select
			$scope.databaseStatus.backups = settings.readSettings('backups');
		}

		ipc.send('database-status');

	}]);
