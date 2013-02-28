/**
 * Generates mock data
 */
var lorem = require('./loremipsum');

var tagList = ["SolarWinds","Network Monitoring", "Application", "Performance", "Monitor", "Orion", "Management", "Apache", "Video", "Virt", "ESX", "iSCSI", "Cisco", "LAMP", "Production", "Testing", "FIXME" ];

var MAX_VMS_PER_HOST = 10;

var getVm = exports.getVm = function() {
   var i;
   var vm = {};
   vm.id = generateId();
   vm.name = generateVmName();
   vm.ip = [];
   for (i=0; i< randomInt(3); i++) {
      vm.ip.push(generateIp());
   }
   vm.power = powerState();
   //TODO: mix it up, to get N vm per user, M per project.
   vm.user = "Knight";
   vm.project = "Tenant 1";
   vm.host = generateHostName();
   vm.health = generateHealth();
   vm.storage_total = 10;
   vm.storage_use = 10 - randomInt(10);
   vm.memory_total = 1024 * randomInt(4);
   vm.memory_use_ave = randomInt(1024);
   vm.cpu_use_ave = randomInt(100);
   vm.tags = getTags(randomInt(5));
   if (randomInt(10)<2) {
      vm.notes = lorem.loremIpsumSentence(200);
   }
   return vm;
};

////////////////////////////////////////////////////////////////////////////////
// Implementation Details

var idCounter = 0;

function generateId() {
   return 10000+idCounter++;
}

var vmCounter = 100;

function generateVmName() {
   return "vm-"+vmCounter++;
}

function generateIp() {
   var ip=[];
   for (var i=0; i<4; i++ ) {
      ip.push(randomInt(100));
   }
   return ip.join(".");
}

var vmsOnThisHost = 0;
var hostname = undefined;

function generateHostName() {
   if (!hostname || vmsOnThisHost >= MAX_VMS_PER_HOST) {
      vmsOnThisHost = 0;
      hostname = 'host_'+randomString(5);
   }
   vmsOnThisHost++;
   return hostname;
}

function powerState() {
   return Math.random() > 0.5 ? "PowerOn" : "PowerOff";
}

function generateHealth() {
   if (randomInt(100)<20) {
      return randomInt(100);
   } else {
      return 100;
   }
}
/**
 * Generates array of non-repeating tags from the tag list
 * @param num - number of tags to return
 * @return {Array}
 */
function getTags(num) {
   if (num > tagList.length) return ["dude you ask too much"];
   var remaining = tagList.slice(0);
   var tags = [];
   for (var i = 0; i < num; i++) {
      var indexLast = remaining.length-1;
      var index = randomInt(indexLast);
      tags.push(remaining[index]);
      remaining[index] = remaining[indexLast];
      remaining.pop();
   }
   return tags;
}

function randomInt(max) {
   return Math.ceil(Math.random()*max);
}

function randomString(len) {
   var s = "";
   var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
   for( var i=0; i < len; i++ )
      s += possible.charAt(Math.floor(Math.random() * possible.length));
   return s;
}
