//Data Containers---------------------------------------------------------------
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
  useSoundControls: false,
  useCommentary: false
}
var World = {
  player: new PlayerEntity("D13.foyer",
    {}
  ),
  rooms: [
    new Room("D13.foyer",
      "You're standing the D13 foyer.",
      {
        "in": ["D13.reidroom","walk in to Mr. Reid's room"],
        "east": ["D13.grijalvaroom","east to Mr. Grijalva's room"],
        "west": ["D13.workshop","west to the machine shop"]
      },
      "D13 Foyer"
    ),
    new Room("D13.reidroom",
      "You're standing in Mr. Reid's room. This is where the programming team \
      usually meets.",
      {
        "out": ["D13.foyer","walk out the door to the foyer"]
      },
      "Mr. Reid's Classroom"
    ),
    new Room("D13.grijalvaroom",
      "This is Mr. Grijalva's room. Most people just call him Mr. G, but \
      that's a difficult name to effectively use in a text adventure game.",
      {
        "out": ["D13.foyer","walk out the door to the foyer"]
      },
      "Mr Grijalva's Classroom"
    ),
    new Room("D13.workshop",
      "This is the machine shop.",
      {
        "out": ["D13.foyer","walk out the door to the foyer"],
        "in": ["D13.workshopin","go further in to the workshop"]
      },
      "Machine Shop"
      )
  ],
  entities: [
    new Entity("D13.darrel","D13.foyer",
      "Darrel, who is the programming captain",
      {
        talk: function() {
          output("You talk to Darrel. He says, \"That microwave gun can fry \
          anything--a chicken dinner, a computer... anything. That robot's \
          toast unless we can figure something out fast.");
        }
      },
      "Darrel"
    ),
    new Entity("D13.grijalva","D13.foyer",
      "Mr. Grijalva",
      {
        talk: function() {
          output("You talk to Mr. G. He says, \"" + getPlayer().name + ", this \
          has never happened before. I don't know what to do now.");
        }
      },
      "Grijalva"
    ),
    new Entity("D13.reid","D13.foyer",
      "Mr. Reid",
      {
        talk: function() {
          output("You talk to Mr. Reid. He says, \"What just happened?\"");
        }
      },
      "Reid"
    ),
    new Entity("D13.note","D13.foyer",
      "a small, handwritten note",
      {
        look: function() {
          this.read();
        },
        read: function() {
          output("You pick up the note and begin reading it aloud.");
          startConversation("D13.note");
        },
        take: function() {
          output("You pick up the note. <em>You can view your items with the \
          <strong>inventory</strong> command.</em>");
          warp(this.parent, "Inventory");
        }
      },
      "note"
      )
  ],
  obstructions: [
    new Obstruction("D13.noglasses",
      "D13.workshop",
      {
        nothing: function() {
          output(this.parent.exits.in[1]);
        }
      },
      {
        "in": ["D13.workshopin","You can't go in to the shop unless you have \
          <strong>safety glasses</strong>"]
      },
      "in"
      )
  ],
  interceptors: [],
  conversations: [
    new Monolog("Setup",
      [
        "This game features optional commentary about the NUAMES robotics \
        team. Would you like to turn it on? (Y/N)",
        function() {
          if (testForWord(getInput(), 'y')) {
            Configuration.useCommentary = true;
            outputCommentary("Commentary is enabled. It will appear in \
            italics.");
          } else {
            output("Commentary is disabled.");
          }
          this.parent.methods.nothing();
        },
        "Please enter your name:",
        function() {
          var player = getPlayer();
          player.name = getInput();
          output("Your name is " + player.name + ". Is this okay? (Y/N)");
        },
        function() {
          if (testForWord(getInput(), 'y')) {
            this.parent.methods.nothing();
          } else {
            this.i -= 3;
            this.parent.methods.nothing();
          }
        },
        function() {
          startConversation("Opening");
        }
      ],
      true
    ),
    new Monolog("Opening",
      [
        "Our story begins on a Saturday afternoon, at the Northern Utah Academy for \
        Math, Engineering & Science. A school club was in session.",
        "\"Great job, guys,\" Mr. Grijalva said. He was one of the instructors in \
        charge of the robotics program.",
        "\"I'm proud of you for building a robot in six weeks,\" he finished.",
        "\"And this time with a day to spare,\" Mr. Reid chimed in. \"Let's \
        drive it around.\"",
        "Mr. Reid flipped a switch on the robot, hooked up the controllers, and \
        started handing them off to people.",
        function() {
          output("\"Hey " + getPlayer().name + ", do you want to drive it?\" \
          he asked.");
        },
        "At that moment, a Hooded Figure appeared, dashing around the corner. It \
        was holding a strange device.",
        function() {
          output("\"Stop!\" Darrel yelled. \"That's my microwave gun!\"");
          outputCommentary("Darrel, our programming captain, really does have a \
          microwave gun. I have no idea why.");
        },
        "But Darrel was too late. The Hooded Figure pointed the gun at the robot \
        and fired.",
        "The robot's lights fizzled out.",
        "And as quickly as he'd come, the perpetrator was gone.",
        "\"HALT, FOUL VILLAIN\", a voice yelled belatedly.",
        "Someone wearing the NUAMES Nighthawk costume turned around the corner. \
        \"Citizens of NUAMES, I require your assistance! Where did the hooded \
        figure go?\"",
        "Dumbfounded, everyone pointed out the door, and the mascot dashed \
        away."
      ]
    ),
    new Monolog("D13.note",
      [
        "\"Haha! Take that, NUAMES Nighthawks. I, The Hooded Figure, have \
        disabled your robot. Good luck repairing it before bag and tag!",
        "\"You'll never manage to collect what you need--namely \
        <strong>wires</strong>, <strong>duct tape</strong> and a \
        <strong>computer chip</strong>--in time! You will flounder on the \
        field! You will be laughed at as your robot fails to work! Feel my \
        wrath!",
        "Sincerely, The Hooded Figure.\""
      ]
    )
  ]
}
//Functions---------------------------------------------------------------------
function init() {
  updateNameDisplay("Robotics Adventure");
  startConversation("Setup");
}
function outputCommentary(string) {
  if (Configuration.useCommentary) {
    output(addTag("em", string));
  }
}
//Execution---------------------------------------------------------------------
setup();
