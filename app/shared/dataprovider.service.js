'use strict';

/* Services */

/* global angular */
/* jshint strict : true */
/* jshint undef : true */
/* jshint unused : true */
/* jshint globalstrict : true */

angular.module( 'myApp.services.dataProvider', [] ).

	factory( 'dataProvider', [ '$http', function ( $http ) {

		var getData = function ( config ) {

			return $http( config ).

			then( function ( result ) {

				return result.data;
			});
		}

		return {
			getData : getData
		};

	}]);
