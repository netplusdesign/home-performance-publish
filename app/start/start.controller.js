'use strict';

/* Controllers */

/* global angular */
/* jshint strict : true */
/* jshint undef : true */
/* jshint unused : true */
/* jshint globalstrict : true */

var settings = require('./shared/configuration');

angular.module('myApp.controllers.start', ['electangular']).

	controller( 'StartCtrl', [
  	'$scope',
    'ipc',
		function (
      $scope,
      ipc
		) {

      // start
      $scope.startdate = moment(settings.readSettings('startdate'), 'YYYY-MM-DD').toDate();
      $scope.enddate = moment(settings.readSettings('enddate'), 'YYYY-MM-DD').toDate();

      $scope.updateDate = function( which ) {

        if(which == 'start') {
          settings.saveSettings('startdate', moment($scope.startdate).format('YYYY-MM-DD'));
        }
        else {
          // end
          settings.saveSettings('enddate', moment($scope.enddate).format('YYYY-MM-DD'));
        }
        // TODO validate that time period is a unit of 1 or more months, and start < end
      }

	}]);
