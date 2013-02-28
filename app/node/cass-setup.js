var System = require('cassandra-client').System;
var CfDef = require('cassandra-client').CfDef;
var KsDef = require('cassandra-client').KsDef;

var keyspace = "vmsearch";

function die (err) {
   console.error("PANIC!:\n" + err);
   process.exit(1);
};

var setupCf =exports.setupCf = function(assert) {
   var sys = new System('127.0.0.1:9160');
   var ksName = keyspace;
   var close = function() {
      sys.close(function() {
         sys.close();
         console.log('System keyspace closed');
      });
   };

   sys.describeKeyspace(ksName, function(descErr, ksDef) {
      if (descErr) {
         console.log('adding keyspace ' + ksName);
         var vmsCf = new CfDef({keyspace: ksName, name: 'vms',
            column_type: 'Standard', comparator_type: 'UTF8Type', default_validation_class: 'UTF8Type', key_validation_class: 'UTF8Type'});
//         var vmsStaticCf = new CfDef({keyspace: ksName, name: 'CfUgly', column_type: 'Standard', comparator_type: 'UTF8Type',
//                                  default_validation_class: 'LongType', key_validation_class: 'IntegerType',
//                                  column_metadata: [
//                                    new ttypes.ColumnDef({name: 'int_col', validation_class: 'IntegerType'}),
//                                    new ttypes.ColumnDef({name: 'string_col', validation_class: 'UTF8Type'}),
//                                    new ttypes.ColumnDef({name: 'uuid_col', validation_class: 'TimeUUIDType'})
//                                  ]});

//         var cfLong = new CfDef({keyspace: ksName, name: 'CfLong',
//            column_type: 'Standard', comparator_type: 'LongType', default_validation_class: 'LongType', U: 'LongType'});
//         var cfInt = new CfDef({keyspace: ksName, name: 'CfInt',
//            column_type: 'Standard', comparator_type: 'IntegerType', default_validation_class: 'IntegerType', key_validation_class: 'IntegerType'});
//         var cfUtf8 = new CfDef({keyspace: ksName, name: 'CfUtf8',
//            column_type: 'Standard', comparator_type: 'UTF8Type', default_validation_class: 'UTF8Type', key_validation_class: 'UTF8Type'});
//         var cfBytes = new CfDef({keyspace: ksName, name: 'CfBytes',
//            column_type: 'Standard', comparator_type: 'BytesType', default_validation_class: 'BytesType', key_validation_class: 'BytesType'});
//         var cfBoolean = new CfDef({keyspace: ksName, name: 'CfBoolean',
//            column_type: 'Standard', comparator_type: 'BooleanType', default_validation_class: 'BooleanType', key_validation_class: 'BooleanType'});
//         var cfDate = new CfDef({keyspace: ksName, name: 'CfDate', column_type: 'Standard', comparator_type: 'DateType', default_validation_class: 'DateType', key_validation_class: 'DateType'});
//         var cfUuid = new CfDef({keyspace: ksName, name: 'CfUuid',
//            column_type: 'Standard', comparator_type: 'TimeUUIDType', default_validation_class: 'TimeUUIDType', key_validation_class: 'TimeUUIDType'});
//         var cfUgly = new CfDef({keyspace: ksName, name: 'CfUgly', column_type: 'Standard', comparator_type: 'UTF8Type',
//                                  default_validation_class: 'LongType', key_validation_class: 'IntegerType',
//                                  column_metadata: [
//                                    new ttypes.ColumnDef({name: 'int_col', validation_class: 'IntegerType'}),
//                                    new ttypes.ColumnDef({name: 'string_col', validation_class: 'UTF8Type'}),
//                                    new ttypes.ColumnDef({name: 'uuid_col', validation_class: 'TimeUUIDType'})
//                                  ]});
//         var cfCounter = new CfDef({keyspace: ksName, name: 'CfCounter',
//            column_type: 'Standard', comparator_type: 'AsciiType', default_validation_class: 'CounterColumnType', key_validation_class: 'AsciiType'});
//         var super1 = new CfDef({keyspace: ksName, name: 'Super1',
//            column_type: 'Super', comparator_type: 'UTF8Type', subcomparator_type: 'UTF8Type'});
//         var cfReversed = new CfDef({keyspace: ksName, name: 'CfReversed1',
//            column_type: 'Standard', comparator_type: 'UTF8Type(reversed=true)', default_validation_class: 'UTF8Type', key_validation_class: 'UTF8Type'});
//

         var keyspace1 = new KsDef({name: ksName,
               strategy_class: 'org.apache.cassandra.locator.SimpleStrategy',
               strategy_options: {'replication_factor': '1'},
               cf_defs: [vmsCf]});
         sys.addKeyspace(keyspace1, function(addErr) {
            console.log(addErr);
            close();
            if (addErr) {
               assert.ifError(addErr);
            } else {
               console.log('keyspace created');
            }
         });
      } else {
         close();
         die(ksDef.name + ' keyspace already exists');
      }
   });
};



