//Constants---------------------------------------------------------------------
var SYNONYMS = {
  look: ["look","examine"],
  attack: ["attack","kick","punch","fight"],
  move: ["move","go","walk","run"],
  throw: ["throw","toss"],
  use: ["use"],
  open: ["open"],
  close: ["close","shut"],
  activate: ["activate","turn on"],
  deactivate: ["deactivate","turn off"],
  key: ["rusty thing", "key"],
};
var USE_IMAGES = true;
var USE_SOUND = false;
var STARTING_ROOM = "North of nowhere";
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
  new Room("Inventory",
    "https://goo.gl/LbCU99",
    "",
    "Somehow, you have managed to place *yourself* inside of that magical \
    non-space you call an inventory. All your items are here, but then, \
    aren't they in your bag? What happens now? Maybe you should submit a bug \
    report.",
    {
      "out": ["Inventory", "out and climb out of your bag"]
    },
    "Inventory",
  ),
  new Room("Nowhere",
    "https://goo.gl/thCGRv",
    "",
    "Somehow, you've made it to a secret room where entities are placed when \
    they aren't needed. Either you're a clever hacker, or something's gone \
    wrong. Maybe you should submit a bug report.",
    {
      "north": ["North of nowhere", "north"],
      "south": ["South of nowhere", "south"],
    },
    "Nowhere in particular",
  ),
  new Room("North of nowhere",
    "https://goo.gl/eRmhYE",
    "",
    "Unsurprisingly, the north is extremely cold. You find \
    yourself wishing you had brought your winter coat, but as it turns out, \
    that's rather difficult to do when you suddenly appear in the middle of \
    nowhere.",
    {
      "south": ["Nowhere", "south"],
    },
    "North of Nowhere",
  ),
  new Room("South of nowhere",
    "https://goo.gl/1W196E",
    "",
    "Welcome to the South. This image was sourced from Texas, actually. Isn't \
    that neat?",
    {
      "north": ["Nowhere", "north to Nowhere proper"]
    },
    "South of Nowhere",
  ),
];
var entityArray = [
  new Entity("key","Inventory",
    "a rusty old key",
    {
      "nothing": function() {
        output("What should I do with the key?");
      },
      "open": function() {
        var input = getInput();
      },
    },
    "key",
  ),
  new Entity("Polar Bear","Nowhere",
    "A POLAR BEAR FOR SOME REASON",
    {
      "nothing": function() {
        output("What was that, now?");
      },
      "attack": function() {
        output("I don't think that's very wise.");
      }
    },
    "BEAR",
  ),
];
var obstructionArray = [];
var interceptorArray = [];
//Functions---------------------------------------------------------------------
function init() {

}
//Execution---------------------------------------------------------------------
setup();
