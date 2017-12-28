//Constants---------------------------------------------------------------------
var SYNONYMS = {
  look: ["look","examine"],
  attack: ["attack","kick","punch","fight","destroy","crush","break","smash","spar"],
  equip: ["equip","on","wear"],
  move: ["move","go","walk","run"],
  throw: ["throw","toss"],
  use: ["use"],
  open: ["open"],
  close: ["close","shut"],
  talk: ["talk","ask","say","shout","speak"],
  take: ["take","pick up","steal"],
  activate: ["activate","turn on"],
  deactivate: ["deactivate","turn off"],
  key: ["rusty thing", "key"]
};
var USE_IMAGES = false;
var USE_SOUND = false;
var STARTING_ROOM = "dojo.outside.frontdoor";
//Player------------------------------------------------------------------------
var Player = new Entity("player",
  STARTING_ROOM,
  "you",
  {
    "do a barrel roll": function() {
      output("Press Z or R twice!");
    },
    zz: function() {
      output("You have done a barrel roll");
    },
    rr: function() {
      output("You have done a barrel roll");
    },
    inventory: function() {
      var inventory = findByName("Inventory", getRooms());
      var description = describeEntities(inventory);
      if (description.length > 0) {
        output("You have " + describeEntities(inventory) + ".");
      } else {
        output("You have nothing.");
      }
    },
    nothing: function() {
      var room = findByName(getPlayerLocation(), getRooms());
      var exits = Object.keys(getCurrentExits());
      exits = exits.concat(Object.keys(getInterceptorExits(room)));
      for (var i = 0; i < exits.length; i++) {
        var input = getInput().toLowerCase();
        var exit = exits[i].toLowerCase();
        if(input == exit) {
          var player = getPlayer();
          player.methods.move();
          return;
        }
      }
      output("I'm afraid I don't understand.");
    },
    move: function() {
      var input = getInput();
      movePlayerByInput(input);
    },
    look: function() {
      var player = getPlayer();
      var currentRoom = findByName(player.location, getRooms());
      updateRoomDisplay(currentRoom);
    },
    use: function() {
      output("Use what?");
    },
    throw: function() {
      output("Throw what?");
    },
  },
  "player"
);
//Data Containers---------------------------------------------------------------
var roomArray = [
  //System
  new Room("Inventory",
    "https://goo.gl/LbCU99",
    "",
    "Somehow, you have managed to place *yourself* inside of that magical \
    non-space you call an inventory. All your items are here, but then, \
    aren't they in your bag? What happens now? Maybe you should submit a bug \
    report.",
    {
      "out": ["Inventory", "climb out of your bag"],
    },
    "Inventory"
  ),
  new Room("Nowhere",
    "https://goo.gl/thCGRv",
    "",
    "Somehow, you've made it to a secret room where entities are placed when \
    they aren't needed. Either you're a clever hacker, or something's gone \
    wrong. Maybe you should submit a bug report.",
    {
      "north": ["North of nowhere", "go north"],
      "south": ["South of nowhere", "south"]
    },
    "Nowhere in particular"
  ),
  //dojo
  new Room("dojo.outside.frontdoor",
    "",
    "",
    "You're standing outside of Fighting Brothers Karate, which shares a \
    building with some other fitness-related businesses. Even so, the room \
    dedicated to FBK is quite spacious.",
    {
      in: ["dojo.inside.frontdoor","go in through the door"],
      around: ["dojo.outside.back","around to the back"]
    },
    "FBK Entrance"
  ),
  new Room("dojo.outside.back",
    "",
    "",
    "The back of the complex is very messy; you notice more than one trickle of \
    slightly-moldy-looking water flowing from the building.",
    {
      around: ["dojo.outside.frontdoor","go around to the front"]
    },
    "Behind the complex"
  ),
  new Room("dojo.inside.frontdoor",
    "",
    "",
    "The FBK Dojo is probably the nicest warehouse you've ever seen. The walls \
    are even painted a nice shade of brown.",
    {
      out: ["dojo.outside.frontdoor","walk out through the door"],
      on: ["dojo.inside.mat","bow on to the mat"]
    },
    "Dojo - Front Desk"
  ),
  new Room("dojo.inside.mat",
    "",
    "",
    "The mat is a semi-dark shade of blue, and it has a few \
    lines of red squares - the \'red dots\' - to assist with classroom \
    management. It's all very comfortable, except for that rough spot in the \
    back, colloquially called the \'sandpaper mat\'.",
    {
      off: ["dojo.inside.frontdoor","bow off of the mat"]
    },
    "Dojo - Mat"
    )
];
var entityArray = [
  //Inventory
  new Entity("dojo.sparringgear","Inventory",
    "your sparring gear",
    {
      equip: function() {
        var player = getPlayer();
        if (player.gearOn) {
          output("Your gear is already on!");
        } else {
          var gear = findByName("dojo.sparringgear", getEntities());
          gear.location = "Inventory";
          player.gearOn = 1;
          output("You put your sparring gear on.");
        }
      },
      off: function() {
        var player = getPlayer();
        if (player.gearOn) {
          player.gearOn = 0;
          output("You take your sparring gear off.");
        } else {
          output("You gear is already off!");
        }
      }
    },
    "gear"
  ),
  new Entity("whitebelt","Inventory",
    "a white belt",
    {},
    "belt"
  ),
  //dojo
  new Entity("dojo.frontdoorLock.key","dojo.outside.back",
    "a nice key",
    {
      take: function() {
        output("You take the <strong>key</strong>");
        var key = findByName("dojo.frontdoorLock.key", getEntities());
        warp(key, "Inventory");
      }
    },
    "key"
  ),
  new Entity("dojo.pallets","dojo.outside.back",
    "a stack of pallets",
    {
      attack: function() {
        output("You'd get terrible splinters if you did that!");
      },
      climb: function() {
        output("You jump on the pallets. You realize that was pointless.");
      },
      burn: function() {
        output("WOAH pyro! You don't even have anything to burn it with!");
      },
      take: function() {
        output("You try to take the pallets. It doesn't work.")
      }
    },
    "pallets"
  ),
  new Entity("dojo.bluethings","dojo.outside.back",
    "some giant blue things",
    {
      attack: function() {
        output("You try your best, but you just bounce off the plastic.");
      },
      climb: function() {
        output("Why?");
      },
      take: function()  {
        output("With a great heave, you manage to get *one* of the things half \
        an inch off the floor.");
      }
    },
    "things"
  ),
  new Entity("dojo.students","dojo.outside.frontdoor",
    "a group of martial arts students",
    {
      attack: function() {
        var player = getPlayer();
        if (player.gearOn) {
          output("You engage in some friendly sparring with one of the \
          students.");
        } else {
          output("But you don't have your sparring <strong>gear</strong> on!");
        }
      }
    },
    "students"
  ),
  new Entity("dojo.computertabor","dojo.inside.frontdoor",
    "Sensei Tabor, who is intently staring at his computer",
    {
      talk: function() {
        output("Tabor says, \"Oh, would you look at that! It's class time \
        already! I was making lesson plans for next week, and I didn't even \
        notice you all standing out there. Let's get started. Everybody find a \
        red dot!");
        output("Everyone marches over and bows onto the mat.");
        var entities = getEntities();
        var students = findByName("dojo.students", entities);
        var computerTabor = findByName("dojo.computertabor", entities);
        var sparringTabor = findByName("dojo.sparringtabor", entities);
        warp(students, "dojo.inside.mat");
        warp(computerTabor, "Nowhere");
        warp(sparringTabor, "dojo.inside.mat");
      }
    },
    "Tabor"
  ),
  new Entity("dojo.sparringtabor","Nowhere",
    "Sensei Tabor",
    {

    },
    "Tabor"
    )
];
var obstructionArray = [
  new Obstruction("dojo.frontdoorLock","dojo.outside.frontdoor",
    {
      nothing: function() {
        output("I don't think that will work");
      },
      attack: function() {
        output("You atttack the lock with all your might. It doesn't do a \
        budge.");
      },
      unlock: function() {
        if (inventoryContains("dojo.frontdoorLock.key")) {
          output("The <strong>key</strong> fits the lock!");
          output("The students cheer and file inside.")
          var lock = findByName("dojo.frontdoorLock",getObstructions());
          var key = findByName("dojo.frontdoorLock.key",getEntities());
          var students = findByName("dojo.students",getEntities());
          warp(lock, "Nowhere");
          warp(key, "Nowhere");
          warp(students, "dojo.inside.frontdoor");
        } else {
          output("But you don't have a <strong>key</strong>!");
        }
      },
      use: function() {
        var lock = findByName("dojo.frontdoorLock",getObstructions());
        lock.methods.unlock();
      },
      open: function() {
        var lock = findByName("dojo.frontdoorLock",getObstructions());
        lock.methods.unlock();
      }
    },
    ["in","there is a lock on the door, and you cannot go in"],
    "lock"
  )
];
var interceptorArray = [
];
//Functions---------------------------------------------------------------------
function init() {
  updateRoomDisplay(STARTING_ROOM);
}
//Execution---------------------------------------------------------------------
setup();
