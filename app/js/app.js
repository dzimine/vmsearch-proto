'use strict';

/* App Module */
angular.module('vmsearch', []).
      config(['$routeProvider', function($routeProvider) {
   $routeProvider
         .when('/cassandra',
            {templateUrl: 'partials/cassandra.html', controller: 'SearchCtrl'})
         .when('/solr',
            {templateUrl: 'partials/solr.html', controller: 'SearchSolrCtrl'})
         .otherwise({redirectTo: '/cassandra'});
}]);
