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
  useSoundControls: false
}
var World = {
  player: new PlayerEntity("Nowhere",
    {}
  ),
  rooms: [],
  entities: [],
  obstructions: [],
  interceptors: [],
  conversations: []
}
//Functions---------------------------------------------------------------------
function init() {
  updateRoomDisplay(getPlayer().location);
}
//Execution---------------------------------------------------------------------
setup();
