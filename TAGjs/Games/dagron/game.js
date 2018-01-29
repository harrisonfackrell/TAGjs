//Globals-----------------------------------------------------------------------
var Configuration = {
  synonyms: {
    look: ["look","examine"],
    attack: ["attack","kick","punch","fight","destroy","crush","break","smash"],
    move: ["move","go","walk","run"],
    throw: ["throw","toss"],
    use: ["use","activate"],
    open: ["open"],
    close: ["close","shut"],
    talk: ["talk","ask","say","shout","speak"],
    take: ["take","pick up","steal","get"],
    unequip: ["unequip","take off"],
    equip: ["equip","put on","wear"],
    inventory: ["inventory","item"]
  },
  useImages: false,
  useMusicControls: false,
  useSoundControls: false
}
var World = {
  player: new PlayerEntity("hut.interior",
    {}
  ),
  rooms:[
    //hut
    new Room("hut.interior",
      "This is the one-room-hut you rented. It's small, but everyone starts \
      somewhere.",
      {
        "out": ["hut.exterior","go out the door"]
      },
      "Small Hut"
    ),
    new Room("hut.exterior",
      "You're standing outside your hut. It may be small, but at least it was \
      cheap.",
      {
        "in": ["hut.interior", "go in to your hut"]
      },
      "Outside"
    ),
    //amulet
    new Room("amulet.dagronroom",
      "You're standing in a grassy plain. The land, however, is anything *but* \
      plain--there's flowers everywhere.",
      {
        "return": ["hut.exterior", "return to where you used the amulet"]
      },
      "Fantastic Plain"
      )
  ],
  entities: [
    new Entity("hut.amulet",
      "hut.exterior",
      "a magical amulet",
      {
        take: function() {
          if (inventoryContains("hut.amulet")) {
            output("You're already wearing the MAGICAL AMULET.");
          } else {
            output("For some reason, you feel like the amulet is probably \
            important.");
            output("You take it with you and put it on--it's probably not \
            cursed.");
          }
        },
        equip: function() {
          this.take();
        },
        use: function() {
          if (!inventoryContains("hut.amulet")) {
            this.take();
          }
          var player = getPlayer();
          if (testForWord("amulet", player.location)) {
            output("You concentrate on the amulet for a moment. A small ghost \
            appears and tells you \"NOOOO! YOU ARE OF THE WRONGNESS! \
            POCKET-DIMENSIONS ARE BADNESS IF DONE TWICE IN LAYERS.");
            output("...and then he disappears. Cool.");
          } else {
            output("You concentrate on the amulet for a moment. It starts to \
            glow.");
            warp(player, "amulet.dagronroom");
            updateRoomDisplay(player.location);
            var amuletRoom = findByName("amulet.dagronroom", getRooms());
            amuletRoom.exits["return"][0] = player.prevLocation;
          }
        }
      },
      "amulet"
    ),
    new Entity("hut.table",
      "hut.interior",
      "a wooden table",
      {
        take: function() {
          output("Do you really expect to be able to carry around a *table* with \
          you?");
        }
      },
      "table"
    ),
    new Entity("hut.stove",
      "hut.interior",
      "a small wood-burning stove",
      {

      },
      "stove"
    ),
    new Entity("amulet.egg",
      "amulet.dagronroom",
      "a pedestal with an egg. Above it are the words \"DAGRON EGG\"",
      {
        take: function() {
          output("You take the egg");
          this.parent.description = "A dagron egg";
        },
        look: function() {
          output("The dagron egg is beige, marbled with slightly darker beige. \
          There's also a graphic on it depicting a fist.");
        },
        attack: function() {
          output("You attack the egg.");
          output("Time and space warp around the egg, and it magically \
          transforms into a <strong>dagron</strong>.");
          this.parent.location = "Nowhere";
          var dagron = findByName("amulet.dagron", getEntities());
          dagron.location = "amulet.dagronroom";
          startConversation("dagron.setup");
        }
      },
      "egg"
    ),
    new Entity("amulet.dagron",
      "Nowhere",
      "your dagron",
      {
        attack: function() {
          output("You attack the dagron. You're disappointed when it doesn't \
          cause a temporal rift.");
        }
      },
      "dagron",
      function() {
        if (this.age) {
          this.age += 1;
        } else {
          this.age = 0;
        }
      }
      )
  ],
  obstructions: [],
  interceptors: [],
  conversations: [
    new Monolog("dagron.setup",
      [
        "What will be the dagron's name?",
        function() {
          var input = getInput();
          var dagron = getDagron();
          dagron.givenName = input;
          output("The dagron's name is " + input + ".");
          output("Is this okay? (Y/N)");
        },
        function() {
          var input = getInput();
          if (testForWord(input, "n")) {
            this.i -= 3;
            this.parent.methods.nothing();
          } else {
            var dagron = getDagron();
            output("The dagron's name is now " + dagron.givenName);
            this.parent.methods.nothing();
          }
        },
        "What color will the dagron be?",
        function() {
          var input = getInput();
          var dagron = getDagron();
          dagron.color = input;
          var inputBackground = document.getElementById("inputBackground");
          inputBackground.style.backgroundColor = input;
          output("The dagron is " + colorize(input, input));
          output("Is this okay? (Y/N)");
        },
        function() {
          var input = getInput();
          if (testForWord(input, "n")) {
            this.i -= 3;
            this.parent.methods.nothing();
          } else {
            var dagron = getDagron();
            output("The dagron is now " + dagron.color);
            output("Have fun with " + dagron.givenName);
            dagron.description = colorize(dagron.color, dagron.givenName + " the \
              dagron");
            this.parent.methods.nothing();
          }
        }
      ],
      true
      )
  ]
}
//Functions---------------------------------------------------------------------
function init() {
  updateRoomDisplay(getPlayer().location);
}
function getDagron() {
  return findByName("amulet.dagron", getEntities());
}
//Execution---------------------------------------------------------------------
setup();
