'use strict';

/* App Module */
angular.module('vmsearch', []).
      config(['$routeProvider', function($routeProvider) {
   $routeProvider.
         when('/cassandra', {templateUrl: 'partials/cassandra.html'}).
         when('/solr', {templateUrl: 'partials/solr.html'}).
         otherwise({redirectTo: '/cassandra'});
}]);
