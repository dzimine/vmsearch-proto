'use strict';

var NavCtrl = ['$scope', '$location', function ($s, $loc) {
// Notice an alternative way to trigger injection. But it generates jslint warning.

   $s.isActiveLocation = function (route) {
      return route === $loc.path();
   };

}];

function FacetSolrCtrl($s, $http) {

   var facetMap= undefined;
//   For testing... TODO: move test data to json/facets
//   {
//      "tags"  : ["SolarWinds","Network Monitoring", "Application", "Performance", "Monitor", "Orion", "Management", "Apache", "Video", "Virt", "ESX", "iSCSI", "Cisco", "LAMP", "Production", "Testing", "FIXME" ],
//      "host" : ["host1", "host2", "10.20.30.40", "dzimine-dev-ubuntu"]
//   };

   $s.facets = [{facet: "tags",  label:"Tags"}, {facet: "host", label:"Hosts"}];


   function initFacets() {
      if (!facetMap) {
         $http.get("solr/facets")
               .success(function (data) {
                  facetMap = {};
                  var tags = [];
                  for (var i = 1; i < data.tags.length; i += 2) {
                     tags.push([data.tags[i - 1], data.tags[i]]);
                  }
                  facetMap.tags = tags;

                  var host = [];
                  for (var j = 1; j < data.host.length; j += 2) {
                     host.push([data.host[j - 1], data.host[j]]);
                  }
                  facetMap.host = host;

                  // comment this out for no default selection
                  // but hide the search results than.
                  $s.selectFacet($s.facets[0].facet);
               });
      }
   }

   $s.selectFacet = function (facet) {
      if (facet == $s.selectedFacet) return;
      $s.facetSelected = facet;
      $s.facetItems = facetMap[$s.facetSelected];
   };

   $s.selectFacetItem = function (item) {
      if (item == $s.facetItemSelected) return;
      $s.facetItemSelected = item;
   };

   initFacets();

} FacetSolrCtrl.$inject = ['$scope', '$http'];


function SearchCtrl($s, $http) {

   $s.searchResults=[];
   $s.limit = 100;
   $s.lastKey=undefined;

   function fetch (url){
      var t1 = new Date();
      $http.get(url, {params: {"k":$s.lastKey, "l":$s.limit} })
            .success(function(rows) {
               $s.searchResults = $s.searchResults.concat(rows);
               $s.lastKey = rows[rows.length-1].name;
               $s.elapsedTime = new Date() - t1;
            });

   }

   //On load
   fetch("data/vms");

   $s.loadMore = function () {
      fetch("data/vms");
   };

   $s.onSearch = function () {
      //FIXME: security problem, CQL injection? Must sanitize query.
      $http.get("data/vms/" + $s.query).success(function (rows) {
         $s.searchResults = rows;
      });
   };
   //TODO-MAYBE: consider more on scroll, like here http://jsfiddle.net/vojtajina/U7Bz9/
}
// Force Inject to handle minimizer and use any params in controller sig.
SearchCtrl.$inject = ['$scope', '$http'];

function SearchSolrCtrl($s, $http) {

   function ready() {
      $s.searchResults = [];
      $s.limit = 50;
      $s.start = 0;
      $s.moreResults = false;
   }

   function fetch (url){
      var t1 = new Date();
      $http.get(url, {params: {"k":$s.start, "l":$s.limit, q: $s.query} })
            .success(function(res) {
               var rows = res.docs;
               $s.searchResults = $s.searchResults.concat(rows);
               $s.start += rows.length;
               $s.moreResults = $s.limit <= rows.length;
               $s.numFound = res.numFound;
               $s.elapsedTime = new Date() - t1;
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

} SearchSolrCtrl.$inject = ['$scope', '$http'];


