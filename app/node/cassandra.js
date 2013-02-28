var Connection = require('cassandra-client').Connection;

var keyspace = "vmsearch";
var con = new Connection({host:'127.0.0.1', port:9160, keyspace:keyspace});

//TODO: factor out connect so that I use the same connection.
//select * from vms where token(key)>token('vm-8679') limit 10;
exports.getAll = function(req, res, next) {
   con.connect(function(err){
      if (err)  {
         next(err);
      } else {
         var fetch = function(err,rows){
            if (err) {
               next(err);
            } else {
               //console.log(rows);
               var data = [];
               for (var i=0; i<rows.length; i++) {
                  data.push(rows[i].colHash);
               }
               res.json(data);
            }
         };
         var limit= req.query.l ? req.query.l : 1000;

         if (req.query.k) {
            //CQL3 supports SELECT * FROM vms WHERE token(key)>token('vm-6864')
            //but  cassandra-client CQL binds to CQL2.
            con.execute("SELECT * FROM vms WHERE key>? LIMIT " + limit,
                  [req.query.k], fetch);
         } else {
            con.execute("SELECT * FROM vms LIMIT " + limit,
                  [], fetch);
         }
      }
   });
};

exports.getById = function(req, res, next) {
   con.connect(function(err){
      if (err) {
         next(err);
      } else {
         var vmKey = req.params.id;
         con.execute("SELECT * FROM vms WHERE key=?", [vmKey], function(err,rows){
            if (err) {
               next(err);
            } else {
               var data = [];
               for (var i=0; i<rows.length; i++) {
                  console.log(rows[i]);
                  data.push(rows[i].colHash);
               }
               res.json(data);
            }
         });
      }

   });
};


