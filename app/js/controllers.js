'use strict';

var NavCtrl = ['$scope', '$location', function ($s, $loc) {
   // Notice an alternative way to trigger injection .

   $s.isActiveLocation = function (route) {
      return route === $loc.path();
   };

   //TEMP, for mock data
   var facetMap= {
      "Tags"  : ["SolarWinds","Network Monitoring", "Application", "Performance", "Monitor", "Orion", "Management", "Apache", "Video", "Virt", "ESX", "iSCSI", "Cisco", "LAMP", "Production", "Testing", "FIXME" ],
      "Hosts" : ["host1", "host2", "10.20.30.40", "dzimine-dev-ubuntu"]
   };

   //TODO: get from backend
   $s.facets = [{facet: "Tags", count: 100}, {facet: "Hosts", count:100000}];

   $s.selectFacet = function (facet) {
      if (facet == $s.selectedFacet) return;
      $s.facetSelected = facet;
      $s.facetItems = facetMap[$s.facetSelected];
   };

   $s.selectFacet($s.facets[0].facet);

   $s.selectFacetItem = function (item) {
      if (item == $s.facetItemSelected) return;
      $s.facetItemSelected = item;
   }

}];

function SearchCtrl($s, $http) {

   $s.searchResults=[];
   $s.limit = 100;
   $s.lastKey=undefined;

   function fetch (url){

      $http.get(url, {params: {"k":$s.lastKey, "l":$s.limit} })
            .success(function(rows) {
               $s.searchResults = $s.searchResults.concat(rows);
               $s.lastKey = rows[rows.length-1].name;
            });
   }

   //On load
   fetch("data/vms");

   $s.loadMore = function () {
      fetch("data/vms");
   };

   $s.onSearch = function () {
      //FIXME: secuity problem. Must sanitize query.
      $http.get("data/vms/" + $s.query).success(function (rows) {
         $s.searchResults = rows;
      });
   };
   //TODO-MAYBE: consider more on scroll, like here http://jsfiddle.net/vojtajina/U7Bz9/

}

// Force Inject to handle minimizer and use any params in controller sig.
SearchCtrl.$inject = ['$scope', '$http'];

// TODO: refactor!!!!! rith now this is a DIRTY COPY PASTE from SearchCtrl.
function SearchSolrCtrl($s, $http) {

   function ready() {
      $s.searchResults = [];
      $s.limit = 50;
      $s.start = 0;
      $s.moreResults = false;
   }


   function fetch (url){

      $http.get(url, {params: {"k":$s.start, "l":$s.limit, "q":$s.query} })
            .success(function(rows) {
               $s.searchResults = $s.searchResults.concat(rows);
               $s.start += rows.length;
               $s.moreResults = $s.limit <= rows.length;
            });
   }

   //On load;
   ready();
   fetch("solr/vms");

   $s.loadMore = function () {
      fetch("solr/vms");
   };

   $s.onSearch = function () {
      ready();
      fetch("solr/vms");
   };

   //TODO-MAYBE: consider more on scroll, like here http://jsfiddle.net/vojtajina/U7Bz9/
}

// Force Inject to handle minimizer and use any params in controller sig.
SearchSolrCtrl.$inject = ['$scope', '$http'];


