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
    "darksilhouette": new Monolog([
      "Before you can otherwise interact with the mirror, you find yourself \
      stopped by the image the mirror contains.",
      "You don't see your own reflection, but you do see <em>a</em> reflection;",
      "The man in the mirror is a dark silhouette, a hole in reality.",
      function() {
        getAudioChannels()["sound"].play("sound/glass_breaking.ogg");
        IO.output("In a quick, startling motion, he raises his right hand and extends it to \
        the side. The mirror breaks.");
      },
      "Behind the mirror, you find a key, which you take."
    ]),
    "mynameisalec": new Monolog([
      "As you look at the mirror, the silhouette forms again.",
      "\"My name is Alec Nimo,\" the silhouette says. Its--his--voice has an \
      implaceable, otherworldly quality.",
      "\"I am the one who created this place.\"",
      Display.colorize("red", "the geoscape is my fault."),
      function() {
        getAudioChannels()["sound"].play("sound/glass_breaking.ogg");
        IO.output("As before, he swipes his right hand, and the mirror breaks.");
      }
    ]),
    "notabadperson": new Monolog([
      "\"There is a voice inside my head,\" Alec says as he appears in the \
      mirror. ",
      "\"It is the voice of a man who radiates light.\"",
      "\'You're not a bad person.\'",
      "\'I hope you realize that.\'",
      "\'You won't drown\'",
      "\'in the darkness\'",
      "\'today.\'",
      "\"Those are his words.\"",
      "\"I wish I could believe in them.\"",
      function() {
        getAudioChannels()["sound"].play("sound/glass_breaking.ogg");
        IO.output("With a swipe of his hand, Alec breaks the mirror, revealing a \
        <strong>hallway</strong> behind it.");
      }
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
      "\"Four witnesses,\" Alec says quietly.",
      Display.colorize("red", "\"Four people.\"", "people"),
      function() {
        getAudioChannels()["music"].setVolume(0.2);
        IO.output(Display.colorize("red", "\"I'm burning.\"", "burning"));
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
        IO.output(Display.colorize("red", "Do you hear the accusations?"));
      },
      "You can't hear;",
      "you can't think;",
      "you can barely even register that you've fallen to the ground.",
      function() {
        getAudioChannels()["sound"].play("sound/scream_horror1.ogg");
        IO.output(Display.colorize("red", "unfettered hatred"));
      },
      function() {
        getAudioChannels()["music"].pause();
        getAudioChannels()["sound"].pause();
        IO.output("\"I don't hate you;\" someone says.");
      },
      "\"they didn't either.\"",
      "\"I know it's hard to avoid the demons,\"",
      "\"but I believe in you.\"",
      "\"You've run the race so valiantly;\"",
      "\"you can rest now if you need it.\"",
      "\"Carry on, my child;\"",
      "\"I know you will overcome.\"",
      "Alec is shocked,",
      "stunned, even.",
      Display.colorize("red", "\"How?\"", "How"),
      "For a long time, he doesn't move.",
      function() {
        getAudioChannels()["music"].setVolume(0);
        getAudioChannels()["music"].fade(1, 5, "music/motions.ogg");
        IO.output("And then he begins to <em>glow</em>.");
      },
      "\"It's okay; you are not evil.\" Alec forms the words nearly soundlessly.",
      "Benevolence fills your mind.",
      "The shadows of the room begin to light up brilliantly.",
      "The walls begin to leak luminescence.",
      "It all begins to break, to crumble, to dissolve.",
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
        IO.output("The fragments disintegrate. So does the ground.");
      },
      function() {
        getAudioChannels()["sound"].play("sound/wind.ogg");
        IO.output("You're falling, faster and faster.");
      },
      function() {
        getAudioChannels()["sound"].fade(0, 5);
        IO.output("The last thing you see, before the M-Path disconnects, is an infinite \
        canvas of white.");
      },
      function() {
        IO.output("**********");
        IO.output("GEOSCAPE");
      },
      "Created by Harrison Fackrell.",
      "\"You're not a bad person.\"",
      "\"I hope you believe that;\"",
      "\"for the light\"",
      "\"shines from you\"",
      function() {
        IO.inputBox.disabled = true;
        getAudioChannels()["music"].setProperties({"loop": false});
        IO.output("\"in rays.\"");
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
