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
  {/*cutscenes*/}
)
//Execution---------------------------------------------------------------------
Setup.setup();
