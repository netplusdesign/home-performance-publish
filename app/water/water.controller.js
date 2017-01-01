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
        // for each row make 2 objects
        var waterJSON = [];
        for (let item of $scope.water.items) {
          waterJSON.push({ 'date': item.date, 'type': 'main', 'gallons': item.main, 'device_id':6 });
          waterJSON.push({ 'date': item.date, 'type': 'hot', 'gallons': item.hot, 'device_id':7 });
        }
        settings.saveSettings('water', waterJSON);
      }

      var updateWaterTable = function() {
        //$scope.water.items.length = 0;
        var range = dataService.getRange();
        for (var i=0; i<range.months; i++) {
          $scope.water.items.push({'date': range.monthsArr[i], 'main': 0, 'hot': 0});
        }
      },

      initWaterTable = function() {
        var waterSettings = settings.readSettings('water');
				if ( waterSettings.length > 0 ) {
	        var catWater = function(arr, curr) {
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
	        }
	        $scope.water.items = waterSettings.reduce( catWater, [{ 'date': waterSettings[0].date, 'main': waterSettings[0].gallons }] );
				}
      }

			updateWaterTable();
      initWaterTable();

	}]);
