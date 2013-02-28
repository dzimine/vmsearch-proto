/**
 *  node solr-fillup.js
 *  Fill up the Solr database with [massive] vm data.
 */
var solr = require('solr-client');
var async = require('async');
var generator = require('./generator');

var BATCH_SIZE = 1000;
var N_BATCHES  = 1000;

var solrClient = solr.createClient();
var date=new Date();
var t1, t2;

async.waterfall(
   [
      // Step 1. prepare
      function (callback) {
         //TODO: do all preps, if any
         solrClient.autoCommit = false;
         t1 = new Date();
         callback();
      },

      // Step 2. load data in batches, in parallel
      // Strange: Despite the Solr error
      // message: 'HTTP status 503.Reason: Error opening new searcher. exceeded limit of maxWarmingSearchers=2, try again later.' }
      // solrClient.add didn't set err, and all 100 000 records got created.
      // TODO: consider eachLimit to make sure we don't pile up too much.

      function(callback) {
         for (var batch = 0; batch < N_BATCHES; batch++) {
            //FIXME: check here it may be a memory leak
            var vms = [];
            for (var i = 0; i < BATCH_SIZE; i++) {
               vms.push(generator.getVm());
            }
            solrClient.add(vms, callback);
         }
      }
   ],
   // Step3. Commit on success, or roll-back on error(s), for each batch.
   function (err, res) {
      if(err) {
         console.log(err);
         solrClient.rollback();
         return;
      }

      if(!res) {
         console.log("WARN: no result when no error");
      }
      console.log(res, "committing... ");
      solrClient.commit(function(err, res) {
         if (err) {
            console.log(err);
         } else {
            t2 = new Date();
            console.log(res, " done! ", (t2-t1)/1000, ' sec');
         }
      });
   }
);




