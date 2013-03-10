#!/bin/sh
# Posts JSON files to solr.
# try app/json/vms/vms.json

source $(dirname $0)/../config/solr/params.sh

FILES=$*

for f in $FILES; do
  echo Posting file $f to $URL
  curl $URL_BASE/update --data-binary @$f -H 'Content-type:application/json'
  echo
done

#send the commit command to make sure all the changes are flushed and visible
curl $URL_BASE/update?commit=true
echo
