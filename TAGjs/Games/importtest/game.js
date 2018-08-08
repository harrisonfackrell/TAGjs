//Globals-----------------------------------------------------------------------
var Configuration = new GameConfiguration(
  {/*settings*/
    useImages: false,
    useMusicControls: false,
    useSoundControls: false
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
  {/*worlds*/
    main: new GameWorld(
      new NamedArray([new PlayerEntity("Nowhere", {}, () => {})]),
      new NamedArray([/*rooms*/]),
      new NamedArray([
        new Entity("garbage","Inventory",
          "a pile of literal garbage",
          {},
          "garbage"
        )
      ]),
      new NamedArray([/*obstructions*/]),
      function() {getConfiguration().worlds["testWorld"].start();},
      function() {/*endLogic*/}
    ),
    testWorld: new GameWorld(
      new NamedArray([new PlayerEntity("Nowhere", {}, () => {})]),
      new NamedArray([/*rooms*/]),
      new NamedArray([/*entities*/]),
      new NamedArray([/*obstructions*/]),
      function() {
        IO.output("The test world has started"); this.register("garbage");
      },
      function() {/*endLogic*/}
    )
  },
  new NamedArray([/*cutscenes*/])
)
//Execution---------------------------------------------------------------------
Setup.setup();
