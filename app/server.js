// Node.js backend for the app
var express = require('express');
var cassandra = require('./node/cassandra');
var solr = require('./node/solr');

var app = express();
var port = 9001;


//body parser next, so we have req.body
app.use(express.bodyParser());

// simple logger middleware
app.use(function(req, res, next) {
   console.log("Received %s %s:", req.method, req.url);
   if (req.method == "POST") console.log(req.body);
   if (req.query.length>0) console.log(req.query);
   next();
});

// static first, to ignore logging static requests
app.use(express.static(__dirname));

app.use(express.errorHandler({dumpExceptions: true }));


app.get('/data/vms', cassandra.getAll);
app.get('/data/vms/:id', cassandra.getById);

app.get('/solr/vms', solr.getAll);
app.get('/solr/facets', solr.getFacets);

app.listen(port);
console.log('Express listening on port ' + port);
console.log('Serving directory: ' + __dirname);