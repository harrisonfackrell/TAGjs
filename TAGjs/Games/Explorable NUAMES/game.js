//Constants---------------------------------------------------------------------
var SYNONYMS = {
  look: ["look","examine"],
  attack: ["attack","kick","punch","fight","destroy","explode","crush","break","smash","ram"],
  move: ["move","go","walk","run"],
  throw: ["throw","toss"],
  use: ["use"],
  open: ["open"],
  close: ["close","shut"],
  talk: ["talk","ask","say","shout","speak"],
  take: ["take","pick up","steal"],
  activate: ["activate","turn on"],
  deactivate: ["deactivate","turn off"],
  key: ["rusty thing", "key"],
};
var USE_IMAGES = true;
var USE_SOUND = true;
var STARTING_ROOM = "Outside - In Front of D3";
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
      "south": ["South of nowhere", "south"],
    },
    "Nowhere in particular"
  ),
  //Outside
  new Room("Outside - Crosswalk",
    "Images/Outside/Outside - Crosswalk.jpg",
    "",
    "You are on the grass near the crosswalk between D2 and D3",
    {
      left: ["Outside - In Front of D2", "go left to D2"],
      right: ["Outside - In Front of D3", "right to D3"],
    },
    "Crosswalk"
  ),
  new Room("Outside - In Front of D3",
    "Images/Outside/Outside - In Front of D3.jpg",
    "Music/Baltic Levity.mp3",
    "You're standing outside of D3. It's really quite majestic, in your \
    opinion.",
    {
      in: ["D3 - First Floor Foyer", "go in to the building"],
      left: ["Outside - Crosswalk", "left towards D2"],
    },
    "Outside of D3"
  ),
  new Room("Outside - In Front of D2",
    "Images/Outside/Outside - In Front of D2.jpg",
    "",
    "You are stainding outside of D2. It's not as fancy as D3, unfortunately, \
    but it's still quite impressive.",
    {
      in: ["D2 - First Floor Foyer", "go in to the building"],
      left: ["Outside - Gym Field", "left to the gym field"],
      right: ["Outside - Crosswalk", "right towards D3"],
    },
    "Outside of D2"
  ),
  new Room("Outside - Gym Field",
    "Images/Outside/Outside - Gym Field.jpg",
    "",
    "The field you're standing in us frequently used for gym activities. \
    Amusingly, the room that the 'Fit for Life' class meets in is labeled \
    'Engineering' - needless to say, they don't actually do a lot of their \
    exercising there.",
    {
      left: ["Outside - Bus Stop", "go left to the bus stop"],
      right: ["Outside - In Front of D2", "right to D2"],
      up: ["Outside - Basketball Court", "up to the basketball court"],
    },
    "Gym Field"
  ),
  new Room("Outside - Basketball Court",
    "Images/Outside/Outside - Basketball Court.jpg",
    "",
    "This basketball court is strangely circular - clearly, it wasn't meant \
    for serious competitive play.",
    {
      down: ["Outside - Gym Field", "go down to the gym field"],
      left: ["Outside - Forked Path", "left towards D3"],
    },
    "Basketball Court"
  ),
  new Room("Outside - Forked Path",
    "Images/Outside/Outside - Forked Path.jpg",
    "",
    "You're standing along the walkway between D2 and D3.",
    {
      forward: ["Outside - Behind D3", "go forward to D3"],
      down: ["Outside - Shaded Lunch Area", "down to the lunch area"],
      back: ["Outside - Basketball Court", "back to the basketball court"],
    },
    "Walkway"
  ),
  new Room("Outside - Behind D3",
    "Images/Outside/Outside - Behind D3.jpg",
    "",
    "You're standing behind D3, on a concrete bridge.",
    {
      left: ["Outside - Forked Path", "go left towards the basketball court"],
      up: ["Outside - In Front of Seminary", "up to the seminary building"],
      in: ["D3 - Second Floor Central Stairs", "in to D3"],
    },
    "Outside of D3"
  ),
  new Room("Outside - Shaded Lunch Area",
    "Images/Outside/Outside - Shaded Lunch Area.jpg",
    "",
    "You're standing just outside D3, in a place that many students like to \
    eat lunch. Though a lot of students go to Northridge for a \
    meal, some students bring their own, or buy one from the local vendors, \
    and eat it on campus.",
    {
      up: ["Outside - Forked Path", "go up to the walkway"],
      in: ["D3 - First Floor Foyer", "in to D3"],
    },
    "Shaded Lunch Area"
  ),
  new Room("Outside - In Front of Seminary",
    "Images/Outside/Outside - In Front of Seminary.jpg",
    "",
    "You're standing outside of the seminary building, which may or may not be \
    an official part of campus.",
    {
      in: ["Seminary - Foyer", "go in to the building"],
      down: ["Outside - Behind D3", "down to D3"],
    },
    "Outside of Seminary"
  ),
  new Room("Outside - Bus Stop",
    "Images/Outside/Outside - Bus Stop.jpg",
    "",
    "You're standing at the bus stop. unfortunately, you seem to have \
    forgotten your bus pass, so you won't be using public transportation to \
    go anywhere anytime soon. It's a good thing you have your own car.",
    {
      left: ["Outside - Trampled Field", "go left to the trampled field"],
      right: ["Outside - Gym Field", "right to the gym field"],
    },
    "Bus Stop"
  ),
  new Room("Outside - Trampled Field",
    "Images/Outside/Outside - Trampled Field.jpg",
    "",
    "The field you're standing in is used by most if not all NUAMES students \
    to get between D13 and the other buildings. It's not very healthy for the \
    grass, and a clear path is worn, but the sidewalk is just too slow.",
    {
      left: ["Outside - In Front of D13", "go left to D13"],
      right: ["Outside - Bus Stop", "right to the bus stop"],
    },
    "Trampled Field"
  ),
  new Room("Outside - In Front of D13",
    "Images/Outside/Outside - In Front of D13.jpg",
    "",
    "Welcome to D13, famed for its incredible distance from the other two \
    buildings. You get used to the walk after a while, but for the first \
    couple of days you kinda' wonder why it's so far away.",
    {
      in: ["D13 - First Floor Foyer", "go in to the building"],
      right: ["Outside - Trampled Field", "right to the trampled field"],
    },
    "Outside of D13"
  ),
];
var entityArray = [
  new Entity("Braden","Outside - Basketball Court",
    "a student waving at you",
    {
      nothing: function() {
        output("What do you mean?");
      },
      talk: function() {
        output("The student responds amiably with a friendly voice");
      },
    },
    "student"
  ),
  new Entity("Jayce","Outside - Basketball Court",
    "his friend is trying to get in the shot",
    {
      nothing: function() {
        output("What do you mean?");
      },
      talk: function() {
        output("He says you should try punching that boulder.")
      },
    },
    "friend"
  ),
  new Entity("Lunch Tables","Outside - Shaded Lunch Area",
    "a group of purple tables to your left",
    {
      take: function() {
        output("Do you really expect to be able to carry a *table* with you?");
      }
    },
    "tables"
  ),
  new Entity("Red-Haired Braden","Outside - Trampled Field",
    "a student with you walking like a gorilla",
    {
      nothing: function() {
        output("The student stares at you blankly.");
      },
      talk: function() {
        output("You mention his gorrilla walking. He returns, \"Why don't  \
        *you* try getting caught off-guard by a camera?\"");
      },
    },
    "student"
  ),
  new Entity("Messy Notebook","Inventory",
    "a messy notebook",
    {
      nothing: function() {
        output("What should I do with the notebook?");
      },
      write: function() {
        output("You jot a few notes down");
      },
    },
    "notebook"
  ),
];
var obstructionArray = [
  new Obstruction("Gym Field Boulder","Outside - Gym Field",
    {
      nothing: function() {
        output("Do what with the boulder?");
      },
      attack: function() {
        output("It broke!");
        var obstructions = getObstructions();
        var boulder = findByName("Gym Field Boulder", obstructions);
        var otherBoulder = findByName("Bus Stop Boulder", obstructions);
        boulder.location = "Nowhere";
        otherBoulder.location = "Nowhere";
        playSound("Sound/kaboom.ogg");
      },
      talk: function() {
        output("You try to talk with the boulder.");
        output("The boulder is stoic and stone-faced.");
      },
      eat: function() {
        output("Um... no.");
      }
    },
    {
      "left": ["Outside - Bus Stop","a two-ton boulder is blocking your path to the left"],
    },
    "boulder"
  ),
  new Obstruction("Bus Stop Boulder","Outside - Bus Stop",
    {
      nothing: function() {
        output("Do what with the boulder?");
      },
      attack: function() {
        output("It broke! You must have a two-ton boulder arm!");
        var obstructions = getObstructions();
        var boulder = findByName("Gym Field Boulder", obstructions);
        var otherBoulder = findByName("Bus Stop Boulder", obstructions);
        boulder.location = "Nowhere";
        otherBoulder.location = "Nowhere";
      },
      talk: function() {
        output("You try to talk with the boulder.");
        output("The boulder is stoic and stone-faced.");
      },
      eat: function() {
        output("Um... no.");
      }
    },
    {
      "right": ["Outside - Gym Field","a two-ton boulder is blocking your path to the right"],
    },
    "boulder"
  ),
  new Obstruction("D3 Front Lock","Outside - In Front of D3",
    {
      nothing: function() {
        output("I don't think that will work.");
      }
    },
    {
      "in": ["undefined","there is a lock on the door, and you cannot go in"],
    },
    "lock"
  ),
  new Obstruction("D2 Front Lock","Outside - In Front of D2",
    {
      nothing: function() {
        output("I don't think that will work.");
      }
    },
    {
      "in": ["undefined","there is a lock on the door, and you cannot go in"],
    },
    "lock"
  ),
  new Obstruction("D3 Back Lock","Outside - Behind D3",
    {
      nothing: function() {
        output("I don't think that will work.");
      }
    },
    {
      "in": ["undefined","there is a lock on the door, and you cannot go in"],
    },
    "lock"
  ),
  new Obstruction("D3 Lunch Area Lock","Outside - Shaded Lunch Area",
    {
      nothing: function() {
        output("I don't think that will work.");
      }
    },
    {
      "in": ["undefined","there is a lock on the door, and you cannot go in"],
    },
    "lock"
  ),
  new Obstruction("D13 Front Lock","Outside - In Front of D13",
    {
      nothing: function() {
        output("I don't think that will work.");
      }
    },
    {
      "in": ["undefined","there is a lock on the door, and you cannot go in"],
    },
    "lock"
  ),
  new Obstruction("Seminary Lock","Outside - In Front of Seminary",
    {
      nothing: function() {
        output("I don't think that will work.");
      }
    },
    {
      "in": ["undefined","there is a lock on the door, and you cannot go in"],
    },
    "lock"
  )
];
var interceptorArray = [
  new Obstruction("Portal to D13","Outside - In Front of D3",
    {
      nothing: function() {
        output("What should I do with the portal?");
      }
    },
    {
      right: ["Outside - In Front of D13","go right through a handy portal"]
    },
    "portal"
  ),
  new Obstruction("Portal to D3","Outside - In Front of D13",
    {
      nothing: function() {
        output("What should I do with the portal?");
      }
    },
    {
      "left": ["Outside - In Front of D3","go left through a handy portal"]
    },
    "portal"
  )
];
//Functions---------------------------------------------------------------------
function init() {
}
//Execution---------------------------------------------------------------------
setup();
