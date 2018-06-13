//Globals-----------------------------------------------------------------------
var Configuration = {
  synonyms: {
    look: ["look","examine"],
    attack: ["attack","kick","punch","fight","destroy","crush","break","smash","kill","bite"],
    move: ["move","go","walk","run","step","fly","head"],
    throw: ["throw","toss"],
    use: ["use"],
    open: ["open","search","check"],
    close: ["close","shut"],
    talk: ["talk","ask","say","shout","speak"],
    take: ["take","pick up","steal","get","keep"],
    unequip: ["unequip","take off"],
    equip: ["equip","put on","wear"],
    insult: ["stupid","dumb","idiot","hate","awful"],
    praise: ["cool","awesome","nerd"],
    inventory: ["inventory","item"]
  },
  useImages: false,
  useMusicControls: false,
  useSoundControls: false
}
var World = new GameWorld(
  new PlayerEntity("home.livingroom",
    {

    },
    function() {  }
  ),
  new NamedArray([/*Rooms*/]),
  new NamedArray([/*Entities*/]),
  new NamedArray([/*Obstructions*/]),
  new NamedArray([/*Interceptors*/]),
  new NamedArray([/*Conversations*/]),
  function() {

  }
);
//Execution---------------------------------------------------------------------
Setup.setup();
