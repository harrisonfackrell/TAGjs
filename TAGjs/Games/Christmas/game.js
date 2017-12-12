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
  take: ["take","pick up","steal"],
  unequip: ["unequip","take off"],
  equip: ["equip","put on","wear"]
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
    "This is the living room, all set up and ready for Christmas.",
    {
      "kitchen": ["home.kitchen","go down the hall to the kitchen"],
      "reading room": ["home.readingroom","down the hall to the reading room"],
      "out": ["home.outside","out through the door"]
    },
    "Living Room"
  ),
  new Room("home.readingroom",
    "https://engagethepews.files.wordpress.com/2013/03/book-shelves.jpg?w=512&h=415",
    "",
    "The reading room is rather large; sometimes, you wonder why anyone \
    would ever dedicate that much space to something as boring as books.",
    {
      "living room": ["home.livingroom","go out the door to the living room"]
    },
    "Reading Room"
  ),
  new Room("home.kitchen",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_IxkHLFHNPhaGN5Tj8K_yhr22PVWLHCOMlYcl9bjPpMKc-w-EXQ",
    "",
    "The kitchen is nicely decorated. You're still not sure how someone \
    managed to hang that plant from the ceiling.",
    {
      "living room": ["home.livingroom","go down the hall to the living room"],
      "garage": ["home.garage","through the door to the garage"]
    },
    "Kitchen"
  ),
  new Room("home.garage",
    "http://3.bp.blogspot.com/-Rz3_aplVzII/TVPoIoafgJI/AAAAAAAAEgs/krhJgtZjF68/s1600/car%2Bin%2Bgarage.jpg",
    "",
    "The garage is a little more drab than the rest of the house. As you look \
    around, you can't help but think that the night sky looks remarkably \
    bright through the garage door.",
    {
      "kitchen": ["home.kitchen","go in to the kitchen"],
      "out": ["home.outside","out through the garage door"]
    },
    "Garage"
  ),
  new Room("home.outside",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLwt2bg7aG2mv8GsLkPKqMmFx2cEQtWfD__yMtFWZ5KA8Q11cW",
    "",
    "Your exterior decorations are humble, but they're not the worst you've \
    ever seen. That honor goes to the inflatable pumpkin your family once \
    put up for Halloween and then forgot to take down by December.",
    {
      "living room": ["home.livingroom","go to the living room through the front door"],
      "garage": ["home.garage","step into the garage"]
    },
    "Outside"
    )
];
var entityArray = [
  //inventory
  new Entity("inventory.coat",
    "Inventory",
    "a warm winter coat",
    {
      nothing: function() {
        output("What should I do with the coat?");
        output("<em>You can view your inventory items with the \
          <strong>inventory</strong> command.");
      },
      unequip: function() {
        if (this.parent.isOn) {
          output("It's too cold to do that!");
        } else {
          output("But you're not wearing your coat.")
        }
      },
      use: function() {
        this.equip
      },
      equip: function() {
        output("You put on your coat. You can probably go outside now.");
        output("<em>You can view your inventory items with the \
          <strong>inventory</strong> command.");
        this.parent.isOn = true
      }
    },
    "coat"
  ),
  //Home
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
          light</strong> it; you figure you can probably manage with a \
          <strong>lighter</strong> and two pieces of tinder.");
      },
      light: function() {
        output("But you don't have a <strong>lighter</strong>!");
      }
    },
    "fireplace"
  ),
  new Entity("home.elf",
    "home.kitchen",
    "an elf on the shelf",
    {
      nothing: function() {
        output("The elf smiles at you and waves.");
      },
      attack: function() {
        output("You do your best to catch the elf, but he's always one step \
          ahead of you.");
      },
      talk: function() {
        output("You ask the elf how you can get to Santa.");
        output("He laughs, tosses you a paper candy cane ornament, and \
          scampers off.");
        this.parent.location = "Nowhere"
      },
      examine: function() {
        output("Surely this elf knows how to get to Santa. You should ask \
          him about it.");
      },
    },
    "elf"
  )

];
var obstructionArray = [
  new Obstruction("home.livingroom.nocoat",
    "home.livingroom",
    {
      nothing: function() {
        var coat = findByName("inventory.coat", getEntities());
        if (coat.isOn) {
          this.parent.location = "Nowhere";
          movePlayerByInput(getInput());
        } else {
          output("You can't go <strong>out</strong> unless you're wearing \
            your <strong>coat</strong>.");
        }
      }
    },
    ["out","You can't go out unless you're wearing your <strong>coat</strong>"],
    "out"
  ),
  new Obstruction("home.garage.nocoat",
    "home.garage",
    {
      nothing: function() {
        var coat = findByName("inventory.coat", getEntities());
        if (coat.isOn) {
          this.parent.location = "Nowhere";
          movePlayerByInput(getInput());
        } else {
          output("You can't go <strong>out</strong> unless you're wearing \
            your <strong>coat</strong>.");
        }
      }
    },
    ["out","You can't go out unless you're wearing your <strong>coat</strong>"],
    "out"
    )
];
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
