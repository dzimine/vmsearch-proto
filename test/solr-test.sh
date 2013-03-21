#!/bin/bash
# Testing Solr install if this works, all solr params are good.
# Keeps the solr running in the backgroud.

BASE_DIR=`dirname $0`
SOLR_START_TIME=5
source $(dirname $0)/../config/solr/params.sh

echo Launching Solr and sleeping $SOLR_START_TIME sec to get it started...

# It runs solr in foreground, using the terminal for output.
# To detauch completely, use: nohup ./script.sh >/dev/null 2>&1 &
#
nohup $BASE_DIR/../scripts/solr-run.sh >solr.out 2>&1 &
sleep $SOLR_START_TIME

$BASE_DIR/../scripts/solr-delete.sh

$BASE_DIR/../scripts/solr-post.sh $BASE_DIR/../app/json/vms/vms.json

RECORDS=`curl --silent 'http://localhost:8983/solr/collection1/select?q=*%3A*&fl=name&wt=csv&indent=true' | wc -l`
MY_COOL_VM=`curl --silent 'http://localhost:8983/solr/collection1/select?q=*%3A*&fl=name&wt=csv&indent=true' | grep "My Cool VM" | wc -l`
echo $RECORDS - $MY_COOL_VM

$BASE_DIR/../scripts/solr-delete.sh
AFTER_DELETE=`curl --silent 'http://localhost:8983/solr/collection1/select?q=*%3A*&fl=name&wt=csv&indent=true' | wc -l`


echo $RECORDS - $MY_COOL_VM -  $AFTER_DELETE
echo ===========================================================================
if [[ $RECORDS -eq 3 && $MY_COOL_VM -eq 1 && $AFTER_DELETE -eq 1 ]]
then
   echo OK ":)"
   echo Solr installed, configured, tested, and running
   echo Go to $URL_BASE
   echo For output: tail -f -20 solr.out
   echo To shut down: ./scripts/solr-kill.sh
else
   echo FAILED!
   echo Check your Solr installation and configuration
fi
echo
echo
