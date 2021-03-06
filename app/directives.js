'use strict';

/* Directives */

/* global angular */
/* global moment */
/* global chroma */
/* jshint globalstrict : true */

angular.module('myApp.directives', ['electangular']).

	directive( 'copyAsHtml', [ 'electron', function (electron) {
		return {
			restrict : 'A',
			link : function ( scope, el, attr ) {

				el.bind('click', function () {
					copy();
				});

				var copy = function() {
					var code = document.querySelector(attr.element).innerHTML
						.replace(/ng-if="prior.totals.net<0"/g, '\b')
						.replace(/ng-if="prior.totals.net>=0"/g, '\b')
						.replace(/ng-if="current.totals.net<0"/g, '\b')
						.replace(/ng-if="current.totals.net>=0"/g, '\b')
						.replace(/ng-if="years.totals.net<0"/g, '\b')
						.replace(/ng-if="years.totals.net>=0"/g, '\b')
						.replace(/ng-if="item.net<0"/g, '\b')
						.replace(/ng-if="item.net>=0"/g, '\b')
						.replace(/class="ng-binding"/g, '\b')
						.replace(/class="ng-scope"/g, '\b')
						.replace(/class="ng-binding ng-scope"/g, '\b')
						.replace(/<!--[\s\S]*?-->/g, '\b')
						.replace(/&amp;/g, '&')
						.replace(/ng-repeat="item in years.items"/g, '\b')
						.replace(/ng-repeat="item in prior.items"/g, '\b')
						.replace(/ng-repeat="item in current.items"/g, '\b');

					electron.clipboard.clear();
					electron.clipboard.writeText(code);
				};

			} // end link
		};
	}]);
