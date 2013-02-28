/**
 *  Solr controller
 */

var solr = require('solr-client');

var solrClient = solr.createClient();

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
   console.log("Querying: ", query);
   solrClient.search(query, function(err,result){
      if(err) {
         next(err);
      } else {
         console.log(result.response.numFound, " records found");

         console.log(result.response.docs.length);
         res.json(result.response.docs);
      }
   });
};

//var rmock = {query:{l:300}};
//getAll(rmock);



