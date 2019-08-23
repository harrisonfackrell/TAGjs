//Globals-----------------------------------------------------------------------
var Configuration = new GameConfiguration(
  {/*worlds*/
    main: new GameWorld(
      new PlayerEntity("driedgulch",{}),
      {/*rooms*/},
      {/*entities*/},
      function() {/*init*/
        getCutscenes()["VoicesOfMark"].start();
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
    VoicesOfMark: new Monolog([
      () => {
        IO.output("You're at home.");
        getAudioChannels()["music"].play("sound/breathing.ogg");
        //getAudioChannels()["music2"].play("sound/breathing.ogg");
      },
      "You're alone.",
      "You can feel beads of sweat forming at the base of your scalp, and your \
      breathing is heavy",
      "You're pretty sure you had a nightmare.",
      () => {
        IO.output("You curse under your breath as you turn your head.");
        getAudioChannels()["music"].fadeSpeed(1.1, 2);
      },
      "There's a humanoid figure slumped over in the corner.",
      "It's a corpse, you think, and it's wearing a black coat.",
      "When your eyes focus, you can see that the face is covered in blood, \
      and a part of the skull is shattered.",
      "It's Harrison.",
      "Very suddenly, you become aware of another corpse next to his.",
      "It's a woman. You're not sure if you recognize her.",
      "It looks like she's been stabbed.",
      "Over and over.",
      "You remember that.",
      "You remember getting stabbed.",
      "You notice a third corpse, and then a fourth",
      "Then an entire pile.",
      "You can feel their fear.",
      "It's *your* fear.",
      () => {
        IO.output("You feel overwhelmed by emotion.");
        getAudioChannels()["music"].fadeSpeed(1.2, 2);
      },
      "You're afraid, yes,",
      "but you're angry, too.",
      "And you're sad,",
      "and ecstatic.",
      () => {
        IO.output("You're not really sure how, but it's like your mind is \
        being shattered into a thousand fragments");
        getAudioChannels()["music"].fadeSpeed(1.4, 2);
      },
      () => {
        IO.output("Your horizons are expanding, and splintering.");
        getAudioChannels()["sound"].setSpeed(0.25);
        getAudioChannels()["sound"].play("sound/glass_breaking.ogg");
      },
      "You want to cry, but you don't know why.",
      "There are so many memories; you can't interpret them all.",
      "And if you listen closely, you can hear the whispers.",
      "They're chittering in your mind",
      "\"You're going to die.\"",
      () => {
        IO.output("\"THEY WILL STAB YOU. IN THE BACK.\"");
        getAudioChannels()["sound"].setSpeed(0.25);
        getAudioChannels()["sound"].play("sound/scream_horror1.ogg");
      },
      "\"It's going to hurt so badly.\"",
      () => {
        IO.output("\"YOU ARE. A MONSTER.\"");
        getAudioChannels()["sound"].play("sound/scream_horror1.ogg");
        getAudioChannels()["sound"].setCurrentTime(0);
      },
      () => {
        IO.output("\"I HATE YOU.\"");
        getAudioChannels()["sound"].play("sound/scream_horror1.ogg");
        getAudioChannels()["sound"].setCurrentTime(0);
      },
      () => {
        IO.output("You don't understand it.");
        var channels = getAudioChannels();
        for (var channel in channels) {
          channels[channel].pause();
        }
      },
      "You just feel violent",
      "and",
      "so many things.",
      "\"You're already dead,\" a voice says clearly, as you bury your head in \
      your pillow.",
      () => {
        IO.output("The screaming doesn't stop.");
        IO.inputBox.disabled = true;
      }
    ])
  },
  {/*globals*/},
  {/*imageChannels*/},
  {/*audioChannels*/
    "music": new AudioChannel({"loop": true}),
    "music2": new AudioChannel({"loop": true}),
    "sound": new AudioChannel({"loop": false})
  }
)
//Execution---------------------------------------------------------------------
Setup.setup();
