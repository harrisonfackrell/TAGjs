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
var USE_IMAGES = false;
var USE_SOUND = false;
var STARTING_ROOM = "Crossroads";
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
      output("You can't do that.");
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
var ROOM_ARRAY = [
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
  //Road
  new Room("Crossroads",
    "",
    "",
    "Two roads diverge in a yellow wood.",
    {
      "first": ["One Path", "take the first path"],
      "other": ["One Path", "you can take the other, just as fair."]
    },
    "Two Roads Diverge in a Yellow Wood"
  ),
  new Room("One Path",
    "",
    "",
    "So then, in leaves no step had trodden black, you left the other path \
    behind. Oh, you left it for another day, but knowing how way leads on to \
    way, you doubted if you should ever come back. Here you are, then, \
    somewhere ages and ages hence, telling this tale with a sigh.",
    {},
    "Somewhere Ages and Ages Hence"
    )
];
var entityArray = [];
var obstructionArray = [
  new Obstruction("Indecision","Crossroads",
    {
      nothing: function() {
        output("You can't do that.");
      }
    },
    ["first","you are sorry you cannot travel both;"],
    "stand"
  ),
  new Obstruction("OtherIndecision","Crossroads",
    {
      nothing: function() {
        output("You look down one path as far as you can, to where it bends in the \
          undergrowth.");
        output("You feel more ready to make a decision.");
        this.parent.location = "Nowhere";
        var other = findByName("OtherIndecision", getEntities());
      }
    },
    ["other","being one traveler, long you stand."],
    "stand"
    )
];
var interceptorArray = [];
//Functions---------------------------------------------------------------------
function init() {

}
//Execution---------------------------------------------------------------------
setup();
