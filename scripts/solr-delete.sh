# Deletes all records from Solr
# TODO: add delete by query

source $(dirname $0)/../config/solr/params.sh

echo Deleting everything...
curl $URL_BASE/update?stream.body=%3Cdelete%3E%3Cquery%3E*:*%3C/query%3E%3C/delete%3E

echo Committing...

#send the commit command to make sure all the changes are flushed and visible
curl $URL_BASE/update?commit=true
echo Check the response for results!
