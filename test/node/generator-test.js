var async = require('async');

var arr = [1,2,3,4,5];

function f (i, callback) {
   console.log(i);
//   if (3 == i) {
//      callback("mock error");
//   } else {
//      callback(null);
//   }
   callback(null);
}

function cb (err) {
   if (err) {
      console.log(err);
   } else {
      console.log('I must be done');
   }
}

function begin(callback) {
   console.log("just beginning");
   callback(null);
}

function commit(callback) {
   console.log("checks are  here");
   callback(null, "done");
}

async.waterfall([
      begin,
      function(callback) {
         async.each(arr, f, callback);
      },
      commit
   ],
   function (err, results) {
      //actually I can commit here
      if (err) console.log(err); else console.log(results);
   }
);
