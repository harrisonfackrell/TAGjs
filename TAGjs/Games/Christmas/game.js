//Constants---------------------------------------------------------------------
var SYNONYMS = {
  look: ["look","examine"],
  attack: ["attack","kick","punch","fight","destroy","crush","break","smash"],
  move: ["move","go","walk","run"],
  throw: ["throw","toss"],
  use: ["use"],
  open: ["open"],
  close: ["close","shut"],
  talk: ["talk","ask","say","shout","speak"],
  take: ["take","pick up","steal"]
};
var USE_IMAGES = true;
var USE_SOUND = false;
var STARTING_ROOM = "home.livingroom";
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
  //Home
  new Room("home.livingroom",
    "http://founterior.com/wp-content/uploads/2014/11/Christmas-fireplace-2-with-red-and-white-socks.jpg",
    "",
    "This is the your living room, all set up and ready for Christmas.",
    {},
    "Living Room"
    )
];
var entityArray = [
  new Entity("home.tree",
    "home.livingroom",
    "a heavily ornamented tree",
    {
      nothing: function() {
        output("What should I do with the tree?");
      },
      look: function() {
        output("The tree really is quite beautiful. You feel proud of the \
          decorating job you did with the rest of the family. You even got to \
          put up a homemade paper candy cane.");
        output("Hey wait a minute... where's your candy cane?");
      },
      attack: function() {
        output("You summon all of your martial wisdom and engage the tree \
          in an honorable duel.");
        output("Nothing really happens.");
      }
    },
    "tree"
  ),
  new Entity("home.presents",
    "home.livingroom",
    "a stack of presents",
    {
      nothing: function() {
        output("What should I do with the presents?");
        output("<em>If you want to take a closer look, you can use the \
        <strong>examine</strong> or <strong>look</strong> commands.</em>");
      },
      look: function() {
        output("As you look through the presents, you realize with mounting \
          horror that none of them are labeled with your name.");
        output("This is going to require a visit to Santa, if you can just \
          figure out how to get to him.");
      },
      attack: function() {
        output("Why would anyone *attack* presents?");
      }
    },
    "presents"
  ),
  new Entity("home.fireplace",
    "home.livingroom",
    "a depressingly empty fireplace",
    {
      nothing: function() {
        output("What should I do with the fireplace?");
        output("<em>If you want to take a closer look, you can use the \
        <strong>examine</strong> or <strong>look</strong> commands.</em>");
      },
      look: function() {
        output("The fireplace really needs some fire. You should <strong>\
          light</strong> it.");
      },
      light: function() {
        output("But you don't have a <strong>lighter</strong>!");
      }
    },
    "fireplace"
    )
];
var obstructionArray = [];
var interceptorArray = [];
//Functions---------------------------------------------------------------------
function init() {
  output("It's Christmas day, and you're feeling very excited to get \
    on with it. Unfortunately, you've been told that \"opening presents at \
    3 in the morning is ridiculous\" Well, fine, but that's not going to stop \
    you from waking up early to get a sneak peek. After some fumbling, you \
    manage to find the lightswitch.")
}
//Execution---------------------------------------------------------------------
setup();
