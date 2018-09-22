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
        getCutscenes()["fightshadow"].start();
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
    "ilethimdie": new Monolog([
      "\"There was nothing that you could have done, Alec.\"",
      "\"That's not true. That <em>cannot</em> be true.\"",
      "\"He was comatose.\"",
      "\"But he was <em>alive</em>.\"",
      "\"Was he alive? Or was he living his death?\"",
      "\"He still had a chance.\"",
      "\"A chance without hope.\"",
      "\"Shall I kill a hopeless man?\"",
      "\"You didn't kill him.\"",
      Display.colorize("red", "\"But I let him die.\"", "I let him die")
    ]),
    "fightshadow": new Monolog([
      "You raise your weapons and approach the shadow. It attacks quickly and \
      aggressively.",
      function() {
        getAudioChannels()["music"].setVolume(0);
        getAudioChannels()["music"].fade(1, 2, "music/fight_looped.ogg");
        IO.output("Instinctively, you block the strikes with your weapons. You're holding \
        them upside-down now, which feels natural.")
      },
      "The weapons, they're called tonfa. How you know that is a mystery, \
      but it's a sure and oddly comforting knowledge. These are defensive \
      instruments; they keep their weilder safe.",
      "Your actions, timid at first, become stronger and more confident. You \
      feel like you have used these tonfa many times, on the order of \
      thousands.",
      "You fall in to familiar motions, forms of defense that you know by \
      heart.",
      function() {
        getAudioChannels()["music"].fadeSpeed(1.2, 4);
        IO.output("Gradually, the tempo of your combat increases. You're blocking and \
        striking faster and faster, with greater speed and alacrity. Every \
        interaction takes more concentration than the last.");
      },
      "You feel like you're balancing on a highwire. You're performing \
      gracefully, but you're past the point of return. The momentum of the fight \
      is such that if you stopped, or if you tripped or stuttered, you would \
      lose all of that grace instantly.",
      "Your breathing begins to slow. Your eyes defocus, and then \
      focus on <em>everything</em>. In this place, in this interaction, you \
      are completely in control. You're not fighting anymore--you're \
      performing. This shadow is not your enemy.",
      "This shadow is your friend, providing a distraction from--",
      function() {
        getAudioChannels()["music"].clearQueue();
        getAudioChannels()["music"].pause();
        getAudioChannels()["music"].setSpeed(1);
        IO.output("No. I will not follow that line of cognition.");
      },
      function() {
        getAudioChannels()["music"].play();
        IO.output("You throw yourself back in to the battle--the duel. In the land of your \
        mind, you can be perfection. You can expertly dodge and block and \
        attack, only to meet a perfect parry and start all over again.")
      },
      "It's wonderful to forget everything else, to pour all of your focus \
      into sustaining a complex and nuanced exercise. You feel exhausted, \
      tired, and yet incredibly relieved. This frantic, chaotic state is \
      underscored with a calm feeling of peace.",
      "There is no room for panic, no room for fear inside of your mind. There \
      is nothing that can harm you, for nothing exists. There is only \
      the frenetic rhythm of determination.",
      function() {
        getAudioChannels()["music"].fadeSpeed(0.75, 2);
        IO.output("Slowly, however, your acuity weakens, and your exhaustion finds you.");
      },
      function() {
        getAudioChannels()["music"].fadeSpeed(0.25, 1);
        getAudioChannels()["music"].fade(0, 3);
        IO.output("You miss a block, and the shadow's tonfa passes through your skull \
        harmlessly. It's nothing more than an illusion, one that has now been broken.")
      },
      function() {
        getAudioChannels()["music"].clearQueue();
        getAudioChannels()["music"].pause();
        getAudioChannels()["music"].setSpeed(1);
        getAudioChannels()["sound"].play("sound/ghostbreath.ogg");
        IO.output("The shadow disappears, and you're left feeling numb, tired, and \
        slightly worried. You are safe for now, but that safety feels fragile.");
      }
    ]),
    "playtrumpet": new Monolog([
      function() {
        getAudioChannels()["sound"].play("sound/bicycle-horn-1(slow).ogg");
        IO.output("You raise the trumpet to your lips and play a discordant \
        tone. Immediately, everyone in the room turns to stare at you. The \
        conductor makes a sharp silencing motion with his hand as he scowls.");
      },
      "Shadows start to form around you. They look hollow--you <em>feel</em> \
      hollow.",
      "You feel sick.",
      "You blink against a well of water, and as your vision blurs, you find \
      yourself somewhere else."
    ]),
    "darksilhouette": new Monolog([
      "Before you can otherwise interact with the mirror, you find yourself \
      stopped by the image the mirror contains.",
      "You don't see your own reflection, but you do see <em>a</em> reflection;",
      "The man in the mirror is a dark silhouette, a hole in reality.",
      function() {
        getAudioChannels()["sound"].play("sound/glass_breaking.ogg");
        IO.output("With a quick, startling motion, he raises his right hand \
        and extends it to the side. The mirror breaks.");
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
        getAudioChannels()["sound"].setProperties({"loop": true});
        IO.output("You're falling, faster and faster.");
      },
      function() {
        IO.output("The last thing you see, before the M-Path disconnects, \
        is an infinite canvas of white.");
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
