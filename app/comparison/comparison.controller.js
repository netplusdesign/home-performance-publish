'use strict';

/* Controllers */

/* global angular */
/* jshint strict : true */
/* jshint undef : true */
/* jshint unused : true */
/* jshint globalstrict : true */

var settings = require('./shared/configuration');

angular.module('myApp.controllers.comparison', []).

	controller( 'ComparisonCtrl', [
  	'$scope',
		'dataProvider',
		'dataService',
		function (
      $scope,
			dataProvider,
			dataService
		) {

    // table comparisons
		$scope.house=0;

		var comparisons = [
			{'interval': 'months', 'template': 'comparison/months.html'},
			{'interval': 'years', 'template': 'comparison/years.html'}
		]
		$scope.comparison = comparisons[0];

		$scope.compare = function(interval) {
			if (interval == 'months') {
				// show months table
				$scope.comparison = comparisons[0];
			}
			else {
				// show years tables
				$scope.comparison = comparisons[1];
			}
		}

		$scope.updateData = function() {
			var range = dataService.getRange();
			if ($scope.comparison.interval == 'months') {
				getData('prior', range.start.clone().subtract(1, 'y'), range.months);
				getData('current', range.start, range.months);
			}
			else {
				getData('years');
			}
		}

		var getData = function(period, start, duration) {
			var config = {
				method: 'GET',
				url: settings.readSettings('api-url') + 'houses/0/views/summary/'
			}
			if (period == 'years') {
				config.params = { 'interval': 'years' };
			}
			else {
				config.params = { 'interval': 'months', 'start': start.format('YYYY-MM-DD'), 'duration': duration+'months' }
			}
			console.log(JSON.stringify(config));

			dataProvider.getData( config ).then( function( data ) {
				// get data
				$scope[period] = dataService.insertAverage (data, ['used'], ['adu']);

			}, function ( reason ) {
				$scope.warning = true;
				$scope.message = reason;
			});

		}

	}]);
