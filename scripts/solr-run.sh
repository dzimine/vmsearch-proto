#!/bin/bash

BASE_DIR=`dirname $0`
SOLR_VMSEARCH='/usr/local/apache-solr-3.6.2/vmsearch'

# Copy the config file
cp -v $BASE_DIR/../config/solr/schema.xml $SOLR_VMSEARCH/solr/conf/

# Run Solr - default path at SOLR_VMSEARCH
(cd $SOLR_VMSEARCH && java -Djetty.port=7574 -jar start.jar)


#TODO: may be store solr home right here?
#(cd $SOLR_VMSEARCH && java -Djetty.port=7574 -Dsolr.solr.home=$BASE_DIR/../solr -jar start.jar)