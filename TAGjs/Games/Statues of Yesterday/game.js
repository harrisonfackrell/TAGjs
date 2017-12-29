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
var USE_SOUND = true;
var STARTING_ROOM = "factory.outside";
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
  ),
  //Gun Factory
  new Room("factory.outside",
    "",
    "Music/Ambient B.mp3",
    "This is the outside of the munitions factory. Thousands of citizens are \
    employed here, yourself included. The walls are stained gray with soot.",
    {
      "inside": ["factory.inside","go inside"]
    },
    "The Factory - Outside"
  ),
  new Room("factory.inside",
    "",
    "Music/Ambient B.mp3",
    "The room stretches before you, like the hall of a king. Of course, you \
    don't see such grandeur in it anymore - you haven't for the last five \
    years.",
    {
      "outside": ["factory.outside","go outside"]
    },
    "The Factory - Central Chamber"
    )
];
var entityArray = [
  //player
  new Entity("player.idCard","Inventory",
    "your ID card",
    {
      nothing: function() {
        this.look();
      },
      look: function() {
        output("It says \"Ivan Kalashnikov, South District\". There's a small \
        insignia on it - a bullet representing your profession. You're a Worker of \
        Weaponry.")
      }
    },
    "ID card"
  ),
  //Factory
  new Entity("factory.inside.poster","factory.inside",
    "a poster on the wall",
    {
      nothing: function() {
        output("You can't do that.");
        output("<em>You can take a closer look at things with the <strong>\
        Examine</strong> command.")
      },
      look: function() {
        output("It's an ad for a microwaveable dinner. It says \"Fast. Easy. \
        Delicious. Fun.\" You don't need the smile insignia to know that the  \
        poster came from a Worker of Marketry.")
      }
    },
    "poster"
    )
];
var obstructionArray = [
  new Obstruction("factory.outside.guard","factory.outside",
    {
      nothing: function() {
        output("You hold out your <strong>ID card</strong> to the Worker. \
        he looks at it momentarily, before stepping aside and making a mark on his \
        clipboard.");
        output("<em>You can view your items with the <strong>Inventory \
        </strong> command.");
        this.parent.location = "Nowhere";
      }
    },
    ["inside","a man blocks your entrance. The scroll insignia on his \
    wristband tells you that he is a Worker of Administration"],
    "man"
    )
];
var interceptorArray = [];
//Functions---------------------------------------------------------------------
function init() {
  output("<em>Did you know that Vozhd Kalashnikov once had a \
  brother?</em>");
  updateRoomDisplay(STARTING_ROOM);
}
//Execution---------------------------------------------------------------------
setup();
