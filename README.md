# VM Search prototype
Note: most scripts and all unit tests are from angular-seed project, not currently used.

## Requirements
* node.js, Solr 3.6, Cassandra 1.2.1
* Run $npm install in the project root folder to install dependencies. 

## Set up Solr: 
* Figure out how to run solr instance. I just copied an example structure with the name "vmsearch"
* Note: solr schema is under conf/solr/scheema.xml, and setting by the solr-run script
* Adjust Solr path in scripts/solr-run

## How to use:
* Start solr: ./scripts/solr-run.sh
* Add data to solr: $node ./app/node/solr-fillup.js
* Start cassandra: sudo /usr/local/dsc-cassandra-1.2.1/bin/cassandra
* Add data to cassandra
   * set up the scheme: $node ./app/node/cass-setup.js
   * fill up the data: $node ./app/node/cass-fillup.js
* Start web server: node ./app/server.js
* Connect the browser: http://localhost:9000/




