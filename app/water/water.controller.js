'use strict';

/* Controllers */

/* global angular */
/* jshint strict : true */
/* jshint undef : true */
/* jshint unused : true */
/* jshint globalstrict : true */

var settings = require('./shared/configuration');

angular.module('myApp.controllers.water', []).

	controller( 'WaterCtrl', [
  	'$scope',
		'dataService',
		function (
      $scope,
			dataService
		) {

      // water
      $scope.water = { items: [] }

			$scope.updateWater = function() {

        settings.saveSettings( 'water', expand($scope.water.items) );
      }

      var updateWaterTable = function() {
        //$scope.water.items.length = 0;
        var range = dataService.getRange();
        for (var i=0; i<range.months; i++) {
          $scope.water.items.push({'date': range.monthsArr[i], 'main': 0, 'hot': 0});
        }
      },

			expand = function(arr) {
				// for each row make 2 objects
        var waterJSON = [];
        for (let item of arr) {
          waterJSON.push({ 'date': item.date, 'type': 'main', 'gallons': item.main, 'device_id':6 });
          waterJSON.push({ 'date': item.date, 'type': 'hot', 'gallons': item.hot, 'device_id':7 });
        }
				return waterJSON;
			},

			shrink = function(arr, curr) {
				// for every 2 rows make 1 object
				for (var i=0; i<arr.length; i++) {
					if (curr.date == arr[i].date) {
						// add property & value to object in array
						arr[i][curr.type] = curr.gallons;
						return arr;
					}
				}
				// then add it
				let obj = { 'date': curr.date };
				obj[curr.type] = curr.gallons;
				arr.push(obj);
				return arr;
			},

      initWaterTable = function() {
        var waterSettings = settings.readSettings('water');
				if ( waterSettings.length > 0 ) {
					// if any water settings match new start/end dates then update $scope.water.items
	        var items = waterSettings.reduce( shrink, [{ 'date': waterSettings[0].date, 'main': waterSettings[0].gallons }] );
					for (var i=0; i<$scope.water.items.length; i++) {
						for (var j=0; j<items.length; j++) {
							if ($scope.water.items[i].date == items[j].date) {
								$scope.water.items[i].main = items[j].main;
								$scope.water.items[i].hot = items[j].hot;
							}
						}
					}
				}
      }

			updateWaterTable();
      initWaterTable();

	}]);
