#!/bin/bash
# Copy the schema to solr and launch the instance

source $(dirname $0)/../config/solr/params.sh
BASE_DIR=`dirname $0`

# Copy the config file
cp -v $BASE_DIR/../config/solr/schema.xml $SOLR_VMSEARCH_CONFIG

# Run Solr - default path at SOLR_VMSEARCH
(cd $SOLR_VMSEARCH && java -Djetty.port=$PORT -jar start.jar)

#  TODO: may be store solr home right here?
#  like (cd $SOLR_VMSEARCH && java -Djetty.port=7574 -Dsolr.solr.home=$BASE_DIR/../solr -jar start.jar)
#  but must reconfigure solrcofig.xml and copy the jars referenced there, see solr readme