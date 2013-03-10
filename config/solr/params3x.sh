#!/bin/bash
# All Solr params for solr-* scripts
#

echo THIS IS NOT TESTED YET, AND KNOWN TO HAVE BUGS !!!

SOLR_VMSEARCH='/usr/local/apache-solr-3.6.2/vmsearch'
SOLR_VMSEARCH_CONFIG=$SOLR_VMSEARCH/solr/conf
PORT=7574
URL_BASE=http://localhost:$PORT/solr/json