'use strict';

/* Services */

/* global angular */
/* global moment */
/* jshint strict : true */
/* jshint undef : true */
/* jshint unused : true */
/* jshint globalstrict : true */

var settings = require('./shared/configuration');

angular.module( 'myApp.services.data', [] ).

	factory('dataService', function() {

		var status = { 'database': false, 'server': false },

		insertAverage = function (data, props, avg_props) {

			var i, j, d,
			adu,
			totalDays = 0;

			if (data.interval === 'year') {
				// years
				for ( j = 0; j < data.items.length; j++ ) {

					// assumes all years have a full year of data -- assumption
					var daysInYear = 365;
					if ( moment( data.items[j].date ).isLeapYear() ) { daysInYear++; }

					for ( i = 0; i < props.length; i++ ) {

						adu = data.items[j][ props[i] ] / daysInYear;
						data.items[j][ avg_props[i] ] = adu;
					}

					totalDays = totalDays + daysInYear;
				}
			} else {
				// months
				for ( j = 0; j < data.items.length; j++ ) {

					for ( i = 0; i < props.length; i++ ) {

						var daysInMonth = moment( data.items[j].date ).daysInMonth();
						adu = data.items[j][ props[i] ] / daysInMonth;
						data.items[j][ avg_props[i] ] = adu;
					}

					totalDays = totalDays + daysInMonth;
				}
			}
			// total
			for ( i = 0; i < props.length; i++ ) {

				adu = data.totals[ props[i] ] / totalDays;
				data.totals[ avg_props[i] ] = adu;
			}
			//console.log(JSON.stringify(data));
			return data;
		},

		getRange = function() {
			var range = {};
			range.monthsArr = [];
			range.start  = moment(settings.readSettings('startdate'), 'YYYY-MM-DD');
			range.end    = moment(settings.readSettings('enddate'), 'YYYY-MM-DD');
			range.months = range.end.diff(range.start, 'months')+1;
			for (var m=0; m<range.months; m++) {
				range.monthsArr.push( range.start.clone().add(m, 'M').format('YYYY-MM-DD') );
			}
			return range;
		}

		return {
			status : status,
			insertAverage : insertAverage,
			getRange : getRange
		};

	});
