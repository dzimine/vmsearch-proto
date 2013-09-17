/**
 *  node solr-fillup.js
 *  Fill up the Solr database with [massive] vm data.
 */
var solr = require('solr-client');
var async = require('async');
var generator = require('./generator');

var BATCH_SIZE = 1000;
var N_BATCHES  = 100;


var solrClient = solr.createClient(
      { host:'127.0.0.1', port:'8983', core:'', path:'/solr' });

var t1, t2;
t1 = new Date();

solrClient.autoCommit = false;

var count = 0;
async.whilst(
  function () { return count < N_BATCHES; },
  function (callback) {
    count++;
    console.log('Batch #', count);
    doBatch(callback);
  },
  function (err) {
    if (err) {
      console.log('Done with errors:', err);
    } else {
      console.log('Done!');
    }
  }
);

//////////////////////////////////////////////////////////////////////////////////////////////////
// Helper functions

/**
* Generates a batch of vms and sends it to Solr. Callback is for async. 
*/
function doBatch(callback) {
  var vms = [];
  for (var i = 0; i < BATCH_SIZE; i++) {
     vms.push(generator.getVm());
  }
  solrClient.add(vms, function (err, res) {
    //MAYBE: Can pass callback through to commit once.
    commitOrRollback(err, res, callback);
  });
}

/** 
* Commits or rolls back a batch.
* passes callback(err) when done - for async
*/
function commitOrRollback(err, res, callback) {
  if(err) {
     console.log(err);
     solrClient.rollback();
     callback(err);
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
     callback(err);
  });
}





