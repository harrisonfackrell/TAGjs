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
  take: ["take","pick up","steal","get"],
  unequip: ["unequip","take off"],
  equip: ["equip","put on","wear"]
};
var USE_IMAGES = false;
var USE_SOUND = false;
var STARTING_ROOM = "Nowhere";
//Player------------------------------------------------------------------------
var Player = new Entity("player",
  STARTING_ROOM,
  "you",
  {
    inventory: function() {
      var inventory = findByName("Inventory", getRooms());
      var entities = narrowEntitiesByLocation(getEntities(), "Inventory");
      if (entities.length > 0) {
        var description = describeEntities(inventory);
        output("You have " + describeEntities(inventory));
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
          this.move();
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
      updateRoomDisplay(player.location);
    },
    use: function() {
      output("Use what?");
    },
  },
  "player"
);
//Data Containers---------------------------------------------------------------
var roomArray = [
  //System
  new Room("Inventory",
    "",
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
    "",
    "",
    "Somehow, you've made it to a secret room where entities are placed when \
    they aren't needed. Either you're a clever hacker, or something's gone \
    wrong. Maybe you should submit a bug report.",
    {
      "north": ["North of nowhere", "go north"],
      "south": ["South of nowhere", "south"]
    },
    "Nowhere in particular"
  )
];
var entityArray = [];
var obstructionArray = [];
var interceptorArray = [];
//Functions---------------------------------------------------------------------
function init() {
  updateRoomDisplay(STARTING_ROOM);
}
//Execution---------------------------------------------------------------------
setup();
