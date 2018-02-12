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
      "You're standing the D13 foyer. This is the third building on the NUAMES \
      campus.",
      {
        "in": ["D13.reidroom","walk in to Mr. Reid's room"],
        "east": ["D13.grijalvaroom","east to Mr. Grijalva's room"],
        "west": ["D13.workshop","west to the machine shop"],
        "out": ["D13.outside","out the door to the parking lot"]
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
      "This is the machine shop. There's meme music playing from the back of \
      the room.",
      {
        "out": ["D13.foyer","walk out the door to the foyer"],
        "in": ["D13.workshopin","go further in to the workshop"]
      },
      "Machine Shop"
    ),
    new Room("D13.workshopin",
      "This is the interior of the machine shop. Coming here without safety \
      glasses is decidedly unsafe.",
      {
        "out": ["D13.workshop","walk out of the taped-off glasses-only zone"]
      },
      "Machine Shop Interior"
    ),
    new Room("D13.outside",
      "You're in the D13 parking lot. This building is famous for being \
      incredibly far away from the rest of the NUAMES campus.",
      {
        "in": ["D13.foyer","walk in through the doors"],
        "east": ["nuames.tfield","east to the trampled field"]
      },
      "D13 Parking Lot"
    ),
    new Room("nuames.tfield",
      "The field you're standing in is used by most if not all NUAMES students \
      to get between D13 and the other buildings. It's not very healthy for the \
      grass, and a clear path is worn, but the sidewalk is just too slow.",
      {
        "west": ["D13.outside","go west to D13"],
        "east": ["nuames.busstop","east to the bus stop"]
      },
      "Trampled Field"
    ),
    new Room("nuames.busstop",
      "You're standing at the bus stop. unfortunately, you seem to have \
      forgotten your bus pass, so you won't be using public transportation to \
      go anywhere anytime soon. It's too bad you don't have your own car yet.",
      {
        "west": ["nuames.tfield","go west to the trampled field"],
        "north": ["nuames.gfield","north to the gym field"]
      },
      "Bus Stop"
    ),
    new Room("nuames.gfield",
      "The field you're standing in us frequently used for gym activities. \
      Amusingly, the room that the 'Fit for Life' class meets in is labeled \
      'Engineering'--needless to say, they don't actually do a lot of their \
      exercising there, and they often come out here instead.",
      {
        "south": ["nuames.busstop","go south to the bus stop"],
        "east": ["nuames.basketball","east to the basketball court"],
        "north": ["D2.outside","north to D2"]
      },
      "Gym Field"
    ),
    new Room("D2.outside",
      "This is D2, probably the least used of all the NUAMES buildings.",
      {
        "south": ["nuames.gfield","go south to the gym field"],
        "north": ["D3.outside","north to D3"],
        "in": ["Nowhere","in to the building"]
      },
      "D2 Sidewalk"
    ),
    new Room("D3.outside",
      "This is D3, which houses the NUAMES office",
      {
        "south": ["D2.outside","go south to D2"]
      },
      "D3 Sidewalk"
    ),
    new Room("nuames.basketball",
      "This basketball court is strangely circular--clearly, it wasn't meant \
      for serious competitive play.",
      {
        "west": ["nuames.gfield","go west to the gym field"],
        "north": ["nuames.seminary","north to the seminary building"]
      },
      "Basketball Court"
    ),
    new Room("nuames.seminary",
      "You're standing outside of the seminary building, which may or may not be \
      an official part of campus.",
      {
        "south": ["nuames.basketball","south to the basketball court"]
      },
      "Seminary Building"
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
    ),
    new Entity("D13.memecomputer","D13.workshopin",
      "a computer, playing meme songs on loop",
      {
        look: function() {
          output("It's a computer, playing meme songs on loop");
          outputCommentary("The build team really likes their meme music. If \
          the robotics team is in here, meme songs are going. They once \
          finished an entire 10-hour video; I think they have a meme problem.");
        },
        attack: function() {
          output("You begin to attack the computer--after all, the build team \
          needs help overcoming their meme addiction. However, just before you \
          strike, you pause to consider the fact that Mr. Reid would be angry \
          if you broke the computer. You ultimately decide not to smash it.");
          outputCommentary("The build team really likes their meme music. If \
          the robotics team is in here, meme songs are going. They once \
          finished an entire 10-hour video; I think they have a meme problem.");
        },
        "turn off": function() {
          output("You turn off the computer. A dedicated robotic arm reaches \
          over and turns it on again.");
        }
      },
      "computer"
    ),
    new Entity("D3.glasses","D3.outside",
      "a pair of safety glasses. How convenient",
      {
        look: function() {
          output("It's a sturdy pair of plastic safety glasses: perfect for \
          saving your eyes from flying debris");
        },
        take: function() {
          output("You take the glasses and put them on.");
          this.parent.location = "Inventory",
          this.parent.description = "a pair of safety glasses"
        }
      },
      "glasses"
      )
  ],
  obstructions: [
    new Obstruction("D13.noglasses",
      "D13.workshop",
      {
        nothing: function() {
          getPlayer().methods.nothing();
        },
        in: function() {
          if (inventoryContains("D3.glasses")) {
            this.parent.location = "Nowhere";
          }
          movePlayerByInput(getInput());
        }
      },
      {
        "in": ["D13.workshopin","You can't go in to the shop unless you have \
          <strong>safety glasses</strong>"]
      },
      "nothing"
    ),
    new Obstruction("D2.lock",
      "D2.outside",
      {
        attack: function() {
          output("You do your best, but the lock won't budge.");
        }
      },
      {
        "in": ["Nowhere","there is a lock on the door, preventing you from \
        going in"]
      },
      "lock"
    ),
    new Obstruction("D3.lock",
      "D3.outside",
      {
        attack: function() {
          output("You do your best, but the lock won't budge.");
        }
      },
      {
        "in": ["Nowhere","there is a lock on the door, preventing you from \
        going in"]
      },
      "lock"
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
