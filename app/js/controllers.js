'use strict';

var NavCtrl = ['$scope', '$location', function ($s, $loc) {
// Notice an alternative way to trigger injection. But it generates jslint warning.

   $s.isActiveLocation = function (route) {
      return route === $loc.path();
   };

}];

function SearchSolrCtrl($s, $http) {

   var facetMap= undefined;
//   For testing... TODO: move test data to json/facets
//   {
//      "tags"  : ["SolarWinds","Network Monitoring", "Application", "Performance", "Monitor", "Orion", "Management", "Apache", "Video", "Virt", "ESX", "iSCSI", "Cisco", "LAMP", "Production", "Testing", "FIXME" ],
//      "host" : ["host1", "host2", "10.20.30.40", "dzimine-dev-ubuntu"]
//   };

   $s.facets = [{facet: "tags",  label:"Tags"}, {facet: "host", label:"Hosts"}];

   function initFacets() {
      if (!facetMap) {
         var facets = {};
         for (var fi = 0; fi < $s.facets.length; fi++) {
            facets[$s.facets[fi].facet] = '';
            //MAYBE pass limits along with facet name, to limit on backend
         }

         $http.get("solr/facets", { params: facets })
               .success(function (data) {
                  facetMap = {};
                  for (var f in facets) {
                     if (facets.hasOwnProperty(f)) {
                        var pairs = [];
                        for (var i = 1; i < data[f].length; i += 2) {
                           pairs.push([data[f][i - 1], data[f][i]]);
                        }
                        facetMap[f] = pairs;
                     }
                  }
                  // comment this out for no default selection
                  // but hide the 'filter' div than.
                  $s.onSelectFacet($s.facets[0].facet);
               });
      }
   }

   function reset() {
      $s.searchResults = [];
      $s.limit = 20;
      $s.start = 0;
      $s.moreResults = false;
   }

   function fetch (){
      var t1 = new Date();
      $s.searchStatus = "Searching...";
      var params = {"k":$s.start, "l":$s.limit, "q": $s.query};
      if ($s.facetValueSelected) {
         params["f"] = $s.facetSelected;
         params["fv"] = $s.facetValueSelected;
      }

      $http.get("solr/vms", {params: params })
            .success(function(res) {
               var rows = res.docs;
               $s.searchResults = $s.searchResults.concat(rows);
               $s.start += rows.length;
               $s.moreResults = $s.limit <= rows.length;
               $s.searchStatus = res.numFound
                     + " matches in " + (new Date() - t1) + " ms";
            });
   }

   //On load;
   // MAYBE: is it better to bring facets on the first query.
   initFacets();
   reset();
   fetch();

   $s.onSelectFacet = function (facet) {
      if (facet == $s.facetSelected) return;
      $s.facetSelected = facet;
      $s.facetItems = facetMap[$s.facetSelected];
   };

   $s.onSelectFacetValue = function (val) {
      $s.facetValueSelected = (val == $s.facetValueSelected) ? null : val;
      reset();
      fetch();
   };

   $s.onLoadMore = function () {
      fetch();
   };

   $s.onSearch = function () {
      reset();
      fetch();
   };

} SearchSolrCtrl.$inject = ['$scope', '$http'];

function SearchCassCtrl($s, $http) {

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

   $s.onLoadMore = function () {
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
SearchCassCtrl.$inject = ['$scope', '$http'];




