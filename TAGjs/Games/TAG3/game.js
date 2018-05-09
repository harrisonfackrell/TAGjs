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
  player: new PlayerEntity("testplane",
    {
      reflect: function() {
        findByName("testConversation", getConversations()).gracefullyStart();
      }
    }
  ),
  rooms: [
    new Room("testplane",
      "You are in a dev room. Cool.",
      [],
      "Test Plane"
    )
  ],
  entities: [],
  obstructions: [],
  interceptors: [],
  conversations: [
    new Monolog("testConversation",
      [
        "This is a sequence",
        "Hopefully it's working properly",
        "This is the third line of dialogue.",
        "Oh, look at that! My grammar's off."
      ]
    )
  ]
}
//Functions---------------------------------------------------------------------
function init() {
  updateRoomDisplay(getPlayer().locations[0]);
}
//Execution---------------------------------------------------------------------
setup();
