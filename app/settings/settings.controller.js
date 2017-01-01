'use strict';

/* Controllers */

/* global angular */
/* jshint strict : true */
/* jshint undef : true */
/* jshint unused : true */
/* jshint globalstrict : true */

var settings = require('./shared/configuration');

angular.module('myApp.controllers.settings', []).

	controller( 'SettingsCtrl', [
  	'$scope',
		function (
      $scope
		) {

			// settings
			$scope.settings = {
				temperatureSourcePath: settings.readSettings('temperature-source-path'),
				temperatureTargetPath: settings.readSettings('temperature-target-path'),
				temperatureLocations: settings.readSettings('temperature-locations'),
				templatePathFile: settings.readSettings('template-path-file'),
				batchPath: settings.readSettings('batch-path'),
				shellPath: settings.readSettings('shell-path'),
				databaseName: settings.readSettings('database-name'),
				databasePassword: settings.readSettings('database-password'),
				databaseBackupPath: settings.readSettings('database-backup-path'),
				flaskServer: settings.readSettings('flask-server'),
				flaskConfig: settings.readSettings('flask-config'),
				flaskUploadApp: settings.readSettings('flask-upload-app'),
				localSite: settings.readSettings('local-site'),
				remoteSite: settings.readSettings('remote-site'),
				apiUrl: settings.readSettings('api-url')
			}

			$scope.updateSetting = function( setting, value ) {
				settings.saveSettings( setting, value );
			}

	}]);
