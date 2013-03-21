/**
 * Generates mock data
 */
var lorem = require('./loremipsum');

var tagList = ["SolarWinds","Network Monitoring", "Application", "Performance", "Monitor", "Orion", "Management", "Apache", "Video", "Virt", "ESX", "iSCSI", "Cisco", "LAMP", "Production", "Testing", "FIXME" ];
var guestOsList = ["Windows 8", "Windows Server 2012", "Ubuntu 10.04 Server", "Red Hat Enterprise Linux 6", "CentOS 6.3"];
var imageList = ["m1.tiny", "m1.small", "m1.medium", "m1.large", "m1.jumbo"];
var userNameList = ["Dmitri Zimine", "Arie Branson", "Salley Hankins", "Marla Ebright", "Graham Cottone", "Marvin Harriott", "Shenika Benedetti", "Laure Chenail", "Abram Cole", "Demetrius Aybar", "Jonie Sigmund", "Grady Laduke", "Dalton Nowlen", "Ty Plaisance", "Tina Holiman", "Barrie Frazier", "Wilhelmina Kamm", "Alysia Hardegree", "Dong Custis", "Teodora Burroughs", "Mignon Peskin", "Flora Nogle", "Tammara Peachey", "Jina Carrel", "Ruthie Torbett", "Asa Dyal", "Reina Foss", "Pauline Pugsley", "Sirena Linzy", "Trudie Mirabito", "Evie Gholston", "Kasie Woltman", "Luetta Saari", "Cara Boruff", "Miles Rathjen", "Zelda Dimmitt", "Freida Finkbeiner", "Cherry Lowman", "Estefana Tolleson", "Cathi Gonser", "Debroah Sheets", "Ivette Ali", "Tonya Robb", "Leesa Vandever", "Karin Williford", "Tracie Luedke", "Asia Ricard", "Majorie Sartori", "Melaine Murray", "Velma Rebello", "Shavon Bohner"];
var projectList = ["Birmingham", "Anchorage", "Phoenix", "Little Rock", "Los Angeles", "Denver", "Bridgeport", "Wilmington", "Jacksonville", "Atlanta", "Honolulu", "Boise", "Chicago", "Indianapolis", "Des Moines", "Wichita", "Louisville", "New Orleans", "Portland", "Baltimore", "Boston", "Detroit", "Minneapolis", "Jackson", "Kansas City", "Billings", "Omaha", "Las Vegas", "Machester", "Newark", "Albuquerque", "New York", "Charlotte", "Fargo", "Columbus", "Oklahoma", "City", "Portland", "Philadelphia", "Providence", "Columbia", "Sioux Falls", "Memphis", "Houston", "Salt Lake City", "Burlington", "Virginia Beach", "Seattle", "Charleston", "Milwaukee", "Cheyenne"];

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
   vm.user = randomFrom(userNameList);
   vm.project = randomFrom(projectList);
   vm.host = generateHostName();
   vm.guest_os = randomFrom(guestOsList);
   vm.image = randomFrom(imageList);
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


function randomFrom(array) {
   return array[randomInt(array.length - 1)];
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
