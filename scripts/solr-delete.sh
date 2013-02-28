# Deletes all records from Solr
# TODO: add delete by query

QUERY=$*
URL=http://localhost:8983/solr/update

echo Deleting everything...
curl $URL?stream.body=%3Cdelete%3E%3Cquery%3E*:*%3C/query%3E%3C/delete%3E
echo

#send the commit command to make sure all the changes are flushed and visible
curl $URL?commit=true
echo
