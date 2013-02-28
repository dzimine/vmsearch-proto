/**
 * Fill up Cassandra DB with mock records.
 * 100,000 in 11 sec. But can't do 1M.
 * Problem - async is wrongly done.
 * TODO: fix batching algorythm.
 */

var Connection = require('cassandra-client').Connection;
var util = require('util');
var async = require('async');
var generator = require('./generator');

var keyspace = "vmsearch";
var BATCH_SIZE = 1000;
var N_BATCHES  = 100;
var N_PARALLELS = 10;

var con = new Connection({host:'127.0.0.1', port:9160, keyspace:keyspace});

function makeUpdateQuery(vm) {
   var params = [];
   for (var key in vm)
   {
      //TODO: Handle multiple values!!!
      params.push("'" + key + "'='" + vm[key] + "'");
   }
   var query = "UPDATE vms SET " + params + " WHERE key='" + vm.name + "'";
   return query;
}

function sendToCassandra(vm, callback) {
   console.log(vm.name);
   // on error, call callback(error);
   // on success one MUST call callback(null, params...)
   // Info: Problem if callback not called iterator.length times
   con.execute(makeUpdateQuery(vm), [], function (exErr, rows) {
      if (exErr) {
         callback(exErr);
      } else {
         util.print('.');
      }
   });

   callback(null, "ha-ha");
}


var t1 = new Date(), t2;

async.waterfall(
      [
         // Step 1. prepare
         function (callback) {
            t1 = new Date();
            con.connect(callback);
         },
         // Step 2. load data in batches, in parallel (no more then
         // Why do I batch? To avoid blocking node for too long, generating vms[1M]
         // Why do I limit parallel sends? Just for the off-case, to not choke the API.
         // TODO: Wrong! Here I still create all batches before committing.
         function(callback) {
            var batches = [];
            for (var batch = 0; batch < N_BATCHES; batch++) {
               var queries = ["BEGIN BATCH"];
               for (var i = 0; i < BATCH_SIZE; i++) {
                  //vms.push(generator.getVm());
                  queries.push(makeUpdateQuery(generator.getVm()));
               }
               queries.push("APPLY BATCH");
               var batchQuery = queries.join (" ");
               batches.push(batchQuery);
               console.log(batchQuery);
            }
            async.eachLimit(batches, N_PARALLELS, function(batchQuery, callback) {
               console.log("executing:", batchQuery.slice(0,80));
               con.execute(batchQuery, [], callback);
            }, callback);
         }

      ],
      // Step3. Commit on success, or roll-back on error(s)
      // TODO: strange but "commit" is called for each batch separately. Why?
      function (err, res) {
         if(err) {
            console.log(err);
            // ROLLBACK if you can
            return;
         }
         t2 = new Date();
         console.log("Done! Elapsed time: %s ms",  t2-t1);
         // commit
      }
);









