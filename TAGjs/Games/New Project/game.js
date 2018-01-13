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
  equip: ["equip","put on","wear"],
  inventory: ["inventory","item"]
};
var USE_IMAGES = false;
var USE_SOUND = false;
var STARTING_ROOM = "Nowhere";
//Player------------------------------------------------------------------------
var Player = new PlayerEntity(
  {}
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
var conversationArray = [];
//Functions---------------------------------------------------------------------
function init() {
  updateRoomDisplay(STARTING_ROOM);
}
//Execution---------------------------------------------------------------------
setup();
