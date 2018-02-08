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
      "This is the D13 foyer.",
      {

      },
      "D13 Foyer"
      )
  ],
  entities: [],
  obstructions: [],
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
        "Please enter your name",
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
        "\"Great job, guys,\" Mr. G said. \"You built a robot in six weeks.\"",
        "\"And this time with a day to spare,\" Mr. Reid chimed in. \"Let's \
        drive it around.\"",
        "Mr. Reid flipped a switch on the robot, hooked up the controllers, and \
        started handing them off to people.",
        function() {
          output("Hey " + getPlayer().name + ", do you want to drive it?");
        },
        "At that moment, a hooded figure appeared, dashing around the corner. It \
        was holding a strange device.",
        function() {
          output("\"Stop!\" Darrel yelled. \"That's my microwave gun!\"");
          outputCommentary("Darrel, our programming captain, really does have a \
          microwave gun. I have no idea why.");
        },
        "But Darrel was too late. The hooded figure pointed the gun at the robot \
        and fired.",
        "The robot's lights fizzled out.",
        "As quickly as he'd come, the perpetrator was gone."
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
