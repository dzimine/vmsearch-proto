#!/bin/bash
# All Solr params for solr-* scripts
#

# This is for 3.x: SOLR_VMSEARCH='/usr/local/apache-solr-3.6.2/vmsearch'
#                  SOLR_VMSEARCH_CONFIG=$SOLR_VMSEARCH/solr/conf

SOLR_VMSEARCH='/usr/local/solr-4.1.0/vmsearch'
SOLR_VMSEARCH_CONFIG=$SOLR_VMSEARCH/solr/collection1/conf
PORT=8983
URL_BASE=http://localhost:$PORT/solr