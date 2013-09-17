# VM Search prototype
Note: many and all unit tests are from angular-seed project, and not currently used.

## Requirements
* node.js, Solr > 4.2, Cassandra 1.2.1
* Run $npm install in the project root folder to get nodejs dependencies.

## Set up Solr (4.x)
1. Install solr 4.x into $SOLR directory (e.g. /usr/local/solr-4.1.0). If installed by homebrew, it ends up in /usr/local/Cellar/solr/4.4.0/
1. Create vmsearch project by copying $SOLR/example to $SOLR/vmsearch (in homebrew installation it's $SOLR/libexec/example)

		cd $SOLR && cp example vmsearch
1. Optional: remove unused stuff:
    	
    	cd $SOLR/vmsearch && rm -r example*  && rm -r mulitcore
1. Adjust Solr parameters in the project's Solr config file, ./config/solr/params.sh
1. Run the test test script  
  
		./tests/solr-test.sh
If everything Ok, the Solr will be configured and ready to go.

		===============================================
		OK :)
		Solr installed, configured, tested, and running
		Go to http://localhost:8983/solr
		For output: tail -f -20 solr.out
		To shut down: ./scripts/solr-kill.sh
		
1. To stop, ./scripts/solr-kill.sh. To start it again, use ./scripts/solr-run.sh

## Runing VMSearch:
* Start solr: ./scripts/solr-run.sh, if not already started.
* Add data to solr: $node ./app/node/solr-fillup.js
* Start cassandra: sudo /usr/local/dsc-cassandra-1.2.1/bin/cassandra
* Add data to cassandra
   * set up the scheme: $node ./app/node/cass-setup.js
   * fill up the data: $node ./app/node/cass-fillup.js
* Start web server: node ./app/server.js
* Connect the browser: http://localhost:9000/





