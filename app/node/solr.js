/**
 *  Solr controller
 */
var http = require('http');
var solr = require('solr-client');

var solrClient = solr.createClient(
      { host:'127.0.0.1', port:'7574', core:'', path:'/solr' });

var getAll = exports.getAll = function(req, res, next) {
   var limit= req.query.l ? req.query.l : 100;
   var start = req.query.k ? req.query.k : 0;
   var qs =   req.query.q ? req.query.q : "*";
   var query = solrClient.createQuery()
         .q(qs)
//         .dismax()
//         .mm(2)
         .start(start)
         .rows(limit);
   if (req.query.f) {
      query.matchFilter(req.query.f, req.query.fv);
      console.log("Addomg facets: ", query);
   }

   console.log("Querying: ", query);
   solrClient.search(query, function(err,result){
      if(err) {
         next(err);
      } else {
         console.log(result.response.numFound, " records found");
         console.log(result.response.docs.length);
         res.json(result.response);
      }
   });
};
/*
  Solr query: http://localhost:7574/solr/ - base solr path
      select?indent=on&wt=json&version=2.2 - method and settings
      &q=*:*&rows=0 - go over all docs, but return zero
      &facet=true - bring facets
      &facet.field=host - host field facet
         &f.host.facet.limit=10 - bring only 10 first
         &f.host.sort=index - sort by alpha (default by counts)
      &facet.field=tags" - tags field facet
 */
var getFacets = exports.getFacets = function (req, res, next) {
   // TODO: add parameters for search, it's hardcoded.
   // TODO: allow to select facets, it's hardcoded
   var query = "q=*:*&rows=0&facet=true&facet.field=host&f.host.facet.limit=10&facet.field=tags";
   solrClient.search(query, function(err, result) {
      if(err) {
         next(err);
      } else {
         console.log(result.facet_counts.facet_fields);
         res.json(result.facet_counts.facet_fields);
      }
   });


};
//
//var reqmock = {query:{l:300}};
//var resmock = {json: function(data) { console.log(data); }}
//var nextmock = function(err) { console.log(err); }
//getFacets(reqmock, resmock, nextmock);




