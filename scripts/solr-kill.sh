#!/bin/sh
#

source $(dirname $0)/../config/solr/params.sh
PID=`ps -afx | grep -v grep | grep $PORT | awk '{print $2}'`
echo Killing Solr process on port $PORT: pid=$PID
kill $PID