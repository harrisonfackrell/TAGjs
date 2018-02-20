//Data Containers---------------------------------------------------------------
var Configuration = {
  synonyms: {
    look: ["look","examine","read"],
    attack: ["attack","kick","punch","fight","destroy","crush","break","smash",
      "tear","rip","burn"],
    move: ["move","go","walk","run","drive"],
    throw: ["throw","toss"],
    use: ["use","activate"],
    open: ["open"],
    close: ["close","shut"],
    talk: ["talk","ask","say","shout","speak"],
    take: ["take","pick up","steal","get"],
    unequip: ["unequip","take off"],
    equip: ["equip","put on","wear"],
    inventory: ["inventory","item"],
    deactivate: ["deactivate","on"],
    activate: ["activate","off"],
    "duct tape": ["tape"],
    "computer chip": ["chip"],
    hammer: ["hammer","mallet"]
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
      "This is D3, which houses the NUAMES office.",
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
      "You're standing outside of the seminary building. Lots of students come \
      here every day.",
      {
        "south": ["nuames.basketball","south to the basketball court"]
      },
      "Seminary Building"
    ),
    new Room("robot.driving",
      "You're driving the robot. Conveniently, it's equipped with mecanum \
      wheels for omni-directional movement",
      {
        "NUAMES": ["D13.foyer","go back to NUAMES"]
      },
      "Driving the Robot"
      )
  ],
  entities: [
    new Entity("D13.darrel","D13.foyer",
      "Darrel, who is the programming captain",
      {
        talk: function() {
          output("You talk to Darrel. He says, \"The perpetrator has made off, \
          and is still at large!\" You pause for a minute to consider the \
          obvious nature of his statement.");
        },
        attack: function() {
          output("You try to attack Darrel. He whips out a cardboard lance and \
          expertly deflects all of your blows.");
          outputCommentary("Once, the programming team went jousting \
          with cardboard \"lances\". On that same day, we also had races \
          on swivel chairs.");
        }
      },
      "Darrel"
    ),
    new Entity("D13.grijalva","D13.foyer",
      "Mr. Grijalva",
      {
        talk: function() {
          output("You talk to Mr. G. He says, \"Well, better fix the robot.\" \
          He seems remarkably unconcerned--maybe even *suspiciously* \
          unconcerned.");
        }
      },
      "Grijalva"
    ),
    new Entity("D13.reid","D13.foyer",
      "Mr. Reid",
      {
        talk: function() {
          output("You talk to Mr. Reid. He says, \"Were you guys jousting \
          again? Is that what this is all about?\"");
          outputCommentary("Once, the programming team went jousting \
          with cardboard \"lances\". On that same day, we also had races \
          on swivel chairs.");
        }
      },
      "Reid"
    ),
    new Entity("D13.brokenbot","D13.foyer",
      "the fried robot",
      {
        take: function() {
          output("Yeah... good luck carrying that.");
        },
        attack: function() {
          lose("You attack the robot, breaking it even more. Despite \
          everyone's best efforts, nobody is able to fix the robot in time. \
          You lose.");
        },
        look: function() {
          output("The robot is pretty fried--you're going to need \
          <strong>wires</strong>, <strong>duct tape</strong> and a \
          <strong>computer chip</strong> to fix it.");
          outputCommentary("Darrel has pointed out to me that his microwave \
          gun wouldn't actually harm the robot all that much. Oh well; I guess \
          the plot is invalidated.");
        },
        "duct tape": function() {
          if (inventoryContains("D13.ducttape")) {
            output("You apply duct tape to the robot. Now it shouldn't fall \
            apart--emphasis on \"shouldn't\".");
            this.parent.ducttape = true;
          } else {
            output("You don't have any duct tape.");
          }
        },
        wires: function() {
          if (inventoryContains("D13.wires")) {
            output("You replace the robot's wires. It should be able to \
            communicate with its motors again.");
            this.parent.wires = true;
          } else {
            output("You don't have any wires.");
          }
        },
        "computer chip": function() {
          if (inventoryContains("D13.wires")) {
            output("You replace the robot's computer chip. It should be able \
            to run code now.");
            this.parent.computerchip = true;
          } else {
            output("You don't have a computer chip.");
          }
        }
      },
      "robot",
      function() {
        if (this.ducttape && this.wires && this.computerchip) {
          output("The robot is working again. Everybody gives a cheer. <em>The \
          environment has changed; you should <strong>look</strong> around.");
          warp(this, "Nowhere");
          var workingrobot = findByName("D13.workingrobot", getInterceptors());
          warp(workingrobot, "D13.foyer");
        }
      }
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
    new Entity("D13.glassessign","D13.workshop",
      "a piece of paper taped to the wall. It says, \"Ha! I took your safety \
      glasses! Good luck getting into the worshop now!\" It's signed with \
      \"The Hooded Figure\"",
      {
        attack: function() {
          output("You tear down the paper.");
          warp(this.parent, "Nowhere");
        }
      },
      "paper"
    ),
    new Entity("D13.memecomputer","D13.workshopin",
      "a computer playing meme songs on loop",
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
        hammer: function() {
          this.attack();
        },
        off: function() {
          output("You turn off the computer. A dedicated robotic arm reaches \
          over and turns it on again.");
        }
      },
      "computer"
    ),
    new Entity("D13.ducttapecase","D13.grijalvaroom",
      "A glass case that says \"IN CASE OF ROBOT EMERGENCY, BREAK \
      GLASS\"",
      {
        attack: function() {
          output("You do your best, but the glass doesn't break. It appears to \
          be remarkably durable for something that's intended to be broken.");
        },
        hammer: function() {
          if (inventoryContains("D13.hammer")) {
            output("You swing the hammer and shatter the glass, revealing a \
            roll of <strong>duct tape</strong>");
            output("You take the duct tape with you; you should be able to use \
            it on the robot.");
            var tape = findByName("D13.ducttape", getEntities());
          } else {
            getPlayer().nothing();
          }
        }
      },
      "case"
    ),
    new Entity("D13.ducttape","Nowhere",
      "a roll of duct tape",
      {
        take: function() {
          output("You are now carrying the duct tape. This was one of the \
          items The Hooded Figure talked about in his note.");
          warp(this.parent, "Inventory");
        },
        look: function() {
          output("It's a roll of duct tape--it can fix anything! (Except, of \
          course, your hair. Don't try it; it will go poorly.)");
        }
      },
      "duct tape"
    ),
    new Entity("D13.hammer","D13.workshopin",
      "a hammer",
      {
        look: function() {
          output("It's a hammer. Were you expecting a porker?");
        },
        take: function() {
          output("You take the hammer. This will come in handy if you need to \
          make ham.");
          outputCommentary("Harrison, one of the programmers, *really* likes \
          to tell lame jokes like this. Coincidentally, he also wrote this \
          adventure game.");
        }
      },
      "hammer"
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
          this.parent.location = "Inventory";
          this.parent.description = "a pair of safety glasses";
        }
      },
      "glasses"
      )
  ],
  obstructions: [
    new Obstruction("D13.noglasses","D13.workshop",
      {
        nothing: function() {
          getPlayer().methods.nothing();
        },
        in: function() {
          if (inventoryContains("D3.glasses")) {
            this.parent.location = "Nowhere";
          }
          moveEntity(getPlayer(), "in");
          getPlayer().methods.look();
        }
      },
      {
        "in": ["D13.workshopin","You can't go in to the shop unless you have \
          <strong>safety glasses</strong>"]
      },
      "in"
    ),
    new Obstruction("D2.lock","D2.outside",
      {
        attack: function() {
          output("You do your best, but the lock won't budge.");
        }
      },
      {
        "in": ["Nowhere","there is a lock on the door, so you can't go in"]
      },
      "lock"
    ),
    new Obstruction("D3.lock","D3.outside",
      {
        attack: function() {
          output("You do your best, but the lock won't budge.");
        }
      },
      {
        "in": ["Nowhere","there is a lock on the door, so you can't go in"]
      },
      "lock"
    )
  ],
  interceptors: [
    new Obstruction("D13.workingrobot","Nowhere",
      {
        take: function() {
          output("Yeah... good luck carrying that.");
        },
        attack: function() {
          lose("You attack the robot, breaking it even more. Despite \
          everyone's best efforts, nobody is able to fix the robot in time. \
          You lose.");
        },
        look: function() {
          output("Thanks to your efforts, the robot is now fixed.");
        }
      },
      {
        "drive": ["robot.driving","drive the robot somewhere"]
      },
      "robot"
      )
  ],
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
          var blacklist = "darrel reid braden grijalva"
          if (testForWord(blacklist, player.name)) {
            output("<em>That name will be confusing. It has been replaced with \
            a different one.</em>")
            player.name = "Generick Persson";
          }
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
        \"Citizens of NUAMES, I require your assistance! Where did The Hooded \
        Figure go?\"",
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
        "\"Sincerely, The Hooded Figure. :)\""
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
    string = addTag("em", string)
    output(string);
  }
}
//Execution---------------------------------------------------------------------
setup();
