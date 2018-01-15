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
  inventory: ["inventory","item"],
  "babe maglev": ["babe", "maglev"],
  "mard coin": ["coin"]
};
var USE_IMAGES = false;
var USE_SOUND = false;
var STARTING_ROOM = "mard.landing";
//Player------------------------------------------------------------------------
var Player = new PlayerEntity(
  {}
);
//Data Containers---------------------------------------------------------------
var roomArray = [
  //System
  new Room("Inventory",
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
    "Somehow, you've made it to a secret room where entities are placed when \
    they aren't needed. Either you're a clever hacker, or something's gone \
    wrong. Maybe you should submit a bug report.",
    {
      "north": ["North of nowhere", "go north"],
      "south": ["South of nowhere", "south"]
    },
    "Nowhere in particular"
  ),
  //Mard Surface
  new Room("mard.landing",
    "You are on the surface of Mard.",
    {
      "north": ["mard.market","venture north"],
      "south": ["mard.face","south"]
    },
    "MARD"
  ),
  new Room("mard.face",
    "You are on the face of Mard. Yes, it has a face, complete with a fake \
    nose and mustache.",
    {
      "north": ["mard.landing", "go north to the landing site"]
    },
    "FACE OF MARD"
  ),
  new Room("mard.market",
    "You are at the Mard market. Lots of stalls are set up here, but they're \
    all selling lard.",
    {
      "south": ["mard.landing", "go south to the landing site"]
    },
    "MARKET OF MARD"
  ),
  new Room("endroom",
    "You've made it off of Mard. Good job.",
    {

    },
    "THE END"
    )
];
var entityArray = [
  new Entity("mard.spaceship",
    "mard.landing",
    "Your ship, which is lacking the necessary energy-rich organic compounds \
    it needs as fuel",
    {
      attack: function() {
        output("That would get you more hoplessly stuck here.");
      },
      fly: function() {
        output("You don't have any fuel, though.");
      },
      lard: function() {
        if (inventoryContains("mard.lard")) {
          output("You put the lard in the fuel compartment. You should be able \
          to <strong>fly</strong> away now.");
          var flyaway = findByName("mard.flyaway", getInterceptors());
          flyaway.location = "mard.landing";
          this.parent.description = "Your ship, which now has plenty of fuel.";
        } else {
          output("You don't have any lard.");
        }
      }
    },
    "ship"
  ),
  new Entity("mard.welcomesign",
    "mard.landing",
    "A sign that says \"Welcome to Mard! Population: Babe Maglev\"",
    {
      attack: function() {
        output("You break the sign. Babe Maglev looks pretty annoyed.");
      }
    },
    "sign"
  ),
  new Entity("mard.landing.maglev",
    "mard.landing",
    "Babe Maglev himself",
    {
      talk: function() {
        startConversation("mard.landing.maglev");
      },
      attack: function() {
        output("You do your best to attack Babe Maglev, but he stops you with \
        a brick of lard.");
      }
    },
    "Babe Maglev"
  ),
  new Entity("mard.market.maglev",
    "mard.market",
    "Babe Maglev, who seems to be the only one manning any of the shops",
    {
      talk: function() {
        startConversation("mard.market.maglev");
      },
      attack: function() {
        output("You do your best to attack Babe Maglev, but he stops you with \
        a brick of lard.");
      },
      "Mard coin": function() {
        if (inventoryContains("mard.mardcoin")) {
          output("You give your Mard coin to Maglev. He gives you \
          <strong>lard</strong>.");
          var coin = findByName("mard.mardcoin", getEntities());
          coin.location = "Nowhere";
          var lard = findByName("mard.lard", getEntities());
          lard.location = "Inventory";
        } else {
          output("You don't have a Mard coin.");
        }
      }
    },
    "Babe Maglev"
  ),
  new Entity("mard.mardcoin",
    "mard.face",
    "a Mard coin",
    {
      take: function() {
        output("You take the Mard coin.");
        this.parent.location = "Inventory";
      }
    },
    "Mard coin"
  ),
  new Entity("mard.lard",
    "Nowhere",
    "some lard",
    {
      attack: function() {
        output("You attack the lard.");
        output("You are now all slimy.");
      },
      eat: function() {
        output("You bite off a chunk of lard and immediately spit it out.");
        output("What were you thinking?");
      }
    },
    "lard"
    )
];
var obstructionArray = [];
var interceptorArray = [
  new Obstruction("mard.flyaway",
    "Nowhere",
    {
      nothing: function() {
        movePlayerByInput(getInput());
      }
    },
    {
      "fly": ["endroom", "fly away in your ship"]
    },
    "fly"
    )
];
var conversationArray = [
  new Sequence("mard.landing.maglev",
    [
      "I originally typed my address and it popped in my entire address.",
      "Also it is on Mard",
      "Mard home to our famous lard",
      "If we all lived on Mard",
      "We'd all live longer lives due to the frequent consumption of straight \
       lard.",
      "Very healthy.",
      "You say you need something to power your ship so you can leave Mard?",
      "Yes, well, you must let the past die."
    ]
  ),
  new Sequence("mard.market.maglev",
    [
      "Welcome to the Market of Mard",
      "Mard home to our famous lard",
      "If you give me a Mard coin I will give you lard"
    ]
    )
];
//Functions---------------------------------------------------------------------
function init() {

  output("While flying on a routine mission, you noticed a planet wearing a \
  disguise. You were so surprised that you momentarily lost control of your \
  ship, and while trying to recover, you expended too much fuel. You are now \
  stranded.");
  updateRoomDisplay(STARTING_ROOM);
}
//Execution---------------------------------------------------------------------
setup();
