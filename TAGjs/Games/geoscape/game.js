//Globals-----------------------------------------------------------------------
var Configuration = new GameConfiguration(
  {/*worlds*/
    main: new GameWorld(
      /*player*/new PlayerEntity("Nowhere",
        {}
      ),
      {/*rooms*/},
      {/*entities*/},
      function() {/*init*/
        getCutscenes()["ending"].start();
      },
      function() {/*endLogic*/}
    )
  },
  {/*synonyms*/
    look: ["look","examine"],
    attack: ["attack","kick","punch","fight","destroy","crush","break","smash","kill","bite"],
    move: ["move","go","walk","run","step","fly","head","press"],
    throw: ["throw","toss"],
    use: ["use"],
    open: ["open","search","check"],
    close: ["close","shut"],
    talk: ["talk","ask","say","shout","speak"],
    take: ["take","pick up","steal","get","keep"],
    unequip: ["unequip","take off"],
    equip: ["equip","put on","wear"],
  },
  {/*cutscenes*/
    "notabadperson": new Monolog([
      "\"There is a voice inside my head,\" Alec says as he appears in the \
      mirror. \"It is the voice of a man who radiates light.",
      "\'You're not a bad person.",
      "I hope you realize that.",
      "You won't drown",
      "in the darkness",
      "today.\'",
      "Those are his words.",
      "I wish I could believe in them.\"",
      "Alec swipes his hand to the side, and the mirror shatters, revealing a \
      <strong>hallway</strong> behind it."
    ]),
    "ending": new Monolog([
      Display.colorize("red", "\"I am a bad person,\" Alec says softly. \"I cannot \
      believe anything to the contrary.\"", ["bad person", "cannot believe"]),
      "\"How can I, when I can hear them,\"",
      "\"the voices of the others?\"",
      "\"...\"",
      function() {
        getAudioChannels()["music"].setVolume(0.1);
        getAudioChannels()["music"].play("music/Raucous Rancor.ogg")
        IO.output("You aware of another mind.");
      },
      "You are aware of four other minds.",
      "\"Four witnesses\", Alec says quietly.",
      Display.colorize("red", "\"Four people.\"", "people"),
      function() {
        getAudioChannels()["music"].setVolume(0.2);
        IO.output(Display.colorize("red", "\"I'm burning,\" Alec says. He \
        smiles ironically.", "burning"));
      },
      function() {
        getAudioChannels()["music"].setVolume(0.5);
        IO.output(Display.colorize("red", "\"These people have DIED at my \
        hands!\"", ["DIED", "my hands"]));
      },
      Display.colorize("red", "I'm sorry."),
      function() {
        getAudioChannels()["music"].setVolume(1);
        IO.output(Display.colorize("red", "I didn't mean for this."));
      },
      function() {
        getAudioChannels()["sound"].play("sound/breathing tired.ogg");
        IO.output("You're gasping now.")
      },
      "You're desperately gripping the frame of the mirror.",
      "You feel afraid,",
      "sad,",
      "guilty,",
      "exhausted.",
      "You are breaking, but cannot shatter.",
      function() {
        getAudioChannels()["sound"].play("sound/scream_horror1.ogg");
        IO.output(Display.colorize("red", "Do you hear my condemnation?"));
      },
      function() {
        getAudioChannels()["sound"].play("sound/scream_horror1.ogg");
        IO.output(Display.colorize("red", "Do you hear the accusations screaming in their souls?"));
      },
      "You can't hear;",
      "you can't think;",
      "you can barely even register that you've fallen to the ground.",
      function() {
        getAudioChannels()["music"].pause();
        getAudioChannels()["sound"].pause();
        IO.output("\"I don't hate you;\" someone says.");
      },
      "\"they didn't either.\"",
      "\"I know it's hard to avoid the demons,\"",
      "\"but I believe in you.\"",
      function() {
        getAudioChannels()["music"].setVolume(0);
        getAudioChannels()["music"].fade(1, 5, "music/motions.ogg");
        IO.output("\"You've run the race so valiantly;\"");
      },
      "\"you can rest now if you need it.\"",
      "\"Carry on, my child;\"",
      "\"I know you will overcome.\"",
      "Alec is shocked.",
      "Fear turns to hope,",
      "and sadness turns to comfort.",
      "Alec begins to <em>glow</em>.",
      "\"It's okay; you are not evil.\" Alec forms the words soundlessly.",
      "Benevolence fills your mind.",
      "The shadows of the room begin to light up brilliantly.",
      "The walls begin to leak luminescence.",
      "It all begins to break, to crumble, to dissolve",
      "This is not a destruction;",
      "it is a reconstruction,",
      "a dispelling of that which is old",
      "to allow for that which is new.",
      function() {
        getAudioChannels()["sound"].play("sound/glass_breaking.ogg");
        IO.output("With a swipe of his hand, Alec shatters the mirror.");
      },
      function() {
        getAudioChannels()["sound"].play("sound/ghostbreath.ogg");
        IO.output("The fragments disintegrate.");
      },
      "The ground disintegrates.",
      "You're falling, faster and faster.",
      "The last thing you see, before the M-Path disconnects, is an infinite \
      canvas of white.",
      function() {
        IO.output("**********");
        IO.output("GEOSCAPE");
      },
      function() {
        getAudioChannels()["music"].fade(0, 2);
        IO.output("Created by Harrison Fackrell.");
      },
      "\"You're not a bad person.\"",
      "\"I hope you believe that;\"",
      "\"for the light\"",
      "\"shines from you\"",
      function() {
        IO.output("\"in rays.\"");
        IO.inputBox.disabled = true;
      }
    ])
  },
  {/*globals*/},
  {
    "background": new ImageChannel(0)
  },
  {
    "music": new AudioChannel({"loop": true}),
    "sound": new AudioChannel()
  }
)
//Execution---------------------------------------------------------------------
Setup.setup();
