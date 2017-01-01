'use strict';

/* global angular */
/* jshint strict : true */
/* jshint undef : true */
/* jshint unused : true */
/* jshint globalstrict : true */

// Declare app level module which depends on filters, and services
angular.module('myApp', [
	'ngRoute',
	'myApp.services',
	'myApp.directives',
	'myApp.controllers'
]).
config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when ( '/settings', {
			templateUrl: function ( params ) {
				return 'settings/partial.html';
			},
			controller: 'SettingsCtrl'
		}).
		when ( '/start', {
			templateUrl: function ( params ) {
				return 'start/partial.html';
			},
			controller: 'StartCtrl'
		}).
		when ( '/water', {
			templateUrl: function ( params ) {
				return 'water/partial.html';
			},
			controller: 'WaterCtrl'
		}).
		when ( '/temperature', {
			templateUrl: function ( params ) {
				return 'temperature/partial.html';
			},
			controller: 'TemperatureCtrl'
		}).
		when ( '/database', {
			templateUrl: function ( params ) {
				return 'database/partial.html';
			},
			controller: 'DatabaseCtrl'
		}).
		when ( '/server', {
			templateUrl: function ( params ) {
				return 'server/partial.html';
			},
			controller: 'ServerCtrl'
		}).
		when ( '/local', {
			templateUrl: function ( params ) {
				return 'local/partial.html';
			},
			controller: 'UpdateLocalCtrl'
		}).
		when ( '/remote', {
			templateUrl: function ( params ) {
				return 'remote/partial.html';
			},
			controller: 'UpdateRemoteCtrl'
		}).
		when ( '/comparison', {
			templateUrl: function ( params ) {
				return 'comparison/partial.html';
			},
			controller: 'ComparisonCtrl'
		}).
		otherwise( { redirectTo: '/settings' } );
}]);
