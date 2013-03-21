'use strict';

var NavCtrl = ['$scope', '$location', function ($s, $loc) {
// Notice an alternative way to trigger injection. But it generates jslint warning.

   $s.isActiveLocation = function (route) {
      return route === $loc.path();
   };

}];

function SearchSolrCtrl($s, $http) {
   //   Facet Definition (getting from backend). Format:
   //   $s.facets = [
   //       {facet: "tags", label: "Tags", count: 2},
   //       {facet: "host", label: "Hosts", count: 4},
   //    ];
   $s.facets = undefined;

   //   Facet map (getting from backend, transformed to array of facet:counter pairs). Format:
   //   facetMap = {
   //      "tags"  : [["SolarWinds",10],["Network Monitoring",20]],
   //      "host" : [["host1",10], ["host2",3] ["10.20.30.40",5], ["dzimine-dev-ubuntu",11]
   //   };
   var facetMap= undefined;

   function initFacets() {
      if (!facetMap) {
         $http.get("solr/facets")
               .success(function (res) {
                  $s.facets = res.facets;
                  var data = res.fields;
                  facetMap = {};
                  for (var i1 = 0; i1 < $s.facets.length; i1++) {
                     var f = $s.facets[i1].facet;
                     if (data.hasOwnProperty(f)) {
                        var pairs = [];
                        for (var i2 = 1; i2 < data[f].length; i2 += 2) {
                           pairs.push([data[f][i2 - 1], data[f][i2]]);
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




