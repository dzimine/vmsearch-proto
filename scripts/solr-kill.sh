#!/bin/sh
#

source $(dirname $0)/../config/solr/params.sh
PID=`ps -af | grep -v grep | grep $PORT | awk '{print $2}'`
echo Killing Solr process: pid=$PID
kill $PID