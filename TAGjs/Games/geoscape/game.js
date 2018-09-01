//Globals-----------------------------------------------------------------------
var Configuration = new GameConfiguration(
  {/*worlds*/
    main: new GameWorld(
      /*player*/,
      {/*rooms*/},
      {/*entities*/},
      function() {/*init*/},
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
      "\"There's a voice inside my head,\" Alec says as he appears in the \
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
      "\"I am a bad person,\" Alec says softly. There is no malice, nor \
      bitterness, in his voice. \"I cannot believe anything to the contrary.",
      "At the least, I can say that the world would be better without me; for \
      though I have summoned voices to speak on my behalf,",
      "The voices of the others are so much louder.",
      "Four witnesses, in the darkness, testify against me. Four witnesses \
      cry of the pain that I brought them.",
      "I can hear them, if I let myself. I can hear them if I open my mind to \
      the void in which they reside.\"",
      "Alec grips the frame of the mirror for stability. He's clearly dreading \
      what he's about to do.",
      "\"I AM SORRY,\" he yells, shaking the mirror slightly. The sharp \
      increase in the volume of his voice is mildly startling. You feel, from \
      his presence, a wave of guilt and revulsion, a feeling of wrongness that \
      seems unresolvable.",
      function() {
        IO.output("Suddenly, Alec's face falls, and you become aware of another mind. No, \
        that's not it. It's a set of minds, a collection of--");
        IO.output("\"Four witnesses,\" Alec says solemnly.")
      },
      "The presence of these \"witnesses\" seems to grow steadily. They're \
      getting closer, clearer. Alec's mind is <em>burning</em>, consuming \
      itself in anticipation of what's coming.",
      "The witnesses--you can clearly sense them now--carry a collective, \
      heavy well of nebulous, negative <em>emotion</em>. It's a pressure against \
      your psyche, and it grows more oppressive with every passing second.",
      "Your breathing begins to slow, to become more labored. Exposure to this \
      freneticism, to this unrelenting tide of sorrow, is at the limit of the \
      experience that you can handle.",
      "Before you realize it, you find yourself gripping the frame of the \
      mirror, your hand meeting Alec's. You look up to see him smiling. His \
      expression is not one of malevolence, though, nor is it one of joy. It's \
      more complex than that, and through the M-Path, you can tell that he \
      himself doesn't fully understand. He's smiling in spite of the tears--or \
      with them; he's unsure.",
      function() {
        IO.output("You're gasping now, as if more air will somehow sustain you \
        against this cacaphony of psychic voice.");
        IO.output("\"Do... Do you see? Do you hear my condemnation?\" Alec \
        asks. He has difficulty forming the words.");
      }
      "\"I DON'T HATE YOU,\" someone says, \"AND NEITHER DID THEY.\" They're \
      not yelling, but their voice seems to be amplified.",
      "\"I KNOW IT'S HARD TO AVOID THE DEMONS,\" another voice continues, \
      BUT I BELIEVE IN YOU.\"",
      "Alec's expression has changed entirely, and he's now looking at you \
      with complete shock.",
      "Slowly, the atmosphere that you are experiencing changes. Fear turns to \
      hope as the witnesses--the residents of the Geoscape--consider the words \
      of the Man of Light, spoken to them in their time of need."
      "Alec begins to glow.",
      "First luminous,",
      "and then radiant.",
      "In one stroke, you understand. Alec himself is the Man of Light. His is \
      the voice of hope in the Geoscape's desolation. The joy of helping \
      people--of empathy and of compassion--is what motivates him. His charity \
      precludes his guilt.",
      "The dark shades of the room begin to light up brilliantly. The walls \
      are leaking luminescence.",
      "They begin to disintegrate, to dissolve at their edges. But this is not a \
      destruction; it is a reconstruction, a dispelling of that which is old \
      to allow for that which is new.",
      "Alec swipes his hand to the side, shattering the mirror. The fragments \
      disintegrate, along with everything else.",
      "The last thing you see, before the M-Path disconnects, is an infinite \
      canvas of white.",
      function() {
        IO.output("**********");
        IO.output("GEOSCAPE");
        IO.output("Created by Harrison Fackrell.");
      },
      "\"You're not a bad person.",
      "\"I hope you believe that;",
      "\"for the light",
      "\"shines from you",
      "\"in rays.\""
    ])
  }
)
//Execution---------------------------------------------------------------------
Setup.setup();
