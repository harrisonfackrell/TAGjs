//Constants---------------------------------------------------------------------
var Configuration = {
  synonyms: {
    look: ["look","list","element","what","combination"],
    nothing: ["nothing","help","move","inventory"]
  },
  useImages: false,
  useMusicControls: false,
  useSoundControls: false
}
var World = new GameWorld(
  new PlayerEntity("Expanse",
    {
      nothing: function() {
        combine();
      },
      look: function() {
        listElements();
      },
      restart: function() {
        location.reload();
      },
    },
  ),
  [
    new Room("Expanse",
      "",
      [],
      "Combine"
    )
  ],
  [
    new Entity("Water","Expanse",
      "Water",
      {
        nothing: function() {
          combine();
        }
      },
      "Water"
    ),
    new Entity("Earth","Expanse",
      "Earth",
      {
        nothing: function() {
          combine();
        }
      },
      "Earth"
    ),
    new Entity("Fire","Expanse",
      "Fire",
      {
        nothing: function() {
          combine();
        }
      },
      "Fire"
    ),
    new Entity("Air","Expanse",
      "Air",
      {
        nothing: function() {
          combine();
        }
      },
      "Air"
    ),
    new Entity("Wisdom","Expanse",
      "Wisdom",
      {
        nothing: function() {
          combine();
        }
      },
      "Wisdom"
    ),
  ],
  [],
  [],
  []
);
//Functions---------------------------------------------------------------------
function init() {
  updateNameDisplay("Combine");
  output("Welcome to Combine! You can combine two elements by typing their \
  names, try again by typing <strong>restart</strong>, or see which elements \
  you have by typing <strong>list</strong>. There are 97 elements to create - \
  good luck!");
  output("You have " + findByName(getPlayer().locations[0], getRooms()).describeEntities());
  var elements = ["Ocean","Stone","Explosion","Wind","Genius","Clay","Steam",
                  "Mist","Lava","Sky","Volcano","Wave","Brick","Pottery",
                  "Cloud","Rain","Plant","Crop","Fog","Snow","House",
                  "Civilization","Philosophy","Logic","Math","Einstein",
                  "Physics","Quantum Theory","Tree","Tectonics","Mountain",
                  "Tool","Wood","Mining","Metal","Smithing","Plank",
                  "Raft","Boat","Cooking","Artistry",
                  "Astronomy","Oil","Gasoline","Lantern","Wire","Lightning",
                  "Electronics","Motor","Rocket","Plane","Computer",
                  "Programmer","Text Adventure Game","Eruption","Engraving",
                  "Vehicle","Diplomacy","Hypercomputing","Autopilot",
                  "Sand","Glass","Lightbulb","Smoke","Irrigation","Charcoal",
                  "Grill","Papyrus","Writing","Literature","Email","Telegraph",
                  "Postal Service","Pencil","Satellite","GPS","Internet",
                  "Cave Painting","Cavern","Flower","Boquet","Masonry",
                  "Railroad","Carpentry","Cuisine","Music","Synthetic Instrument",
                  "Printer","Wheel","Sound","Telephone","Cell Phone",
                  "Neighborhood","Paper","Audio Book","Ebook","Trade"
                  ];
  for (var i = 0; i < elements.length; i++) {
    getEntities().push(new Element(elements[i]));
  }
  World.combinations = [
    ["Water","Water","Ocean"],
    ["Earth","Earth","Stone"],
    ["Fire","Fire","Explosion"],
    ["Air","Air","Wind"],
    ["Wisdom","Wisdom","Genius"],
    ["Water","Earth","Clay"],
    ["Water","Fire","Steam"],
    ["Water","Air","Mist"],
    ["Earth","Fire","Lava"],
    ["Earth","Air","Sky"],
    ["Stone","Stone","Mountain"],
    ["Mountain","Lava","Volcano"],
    ["Ocean","Wind","Wave"],
    ["Fire","Clay","Brick"],
    ["Steam","Steam","Cloud"],
    ["Cloud","Water","Rain"],
    ["Rain","Earth","Plant"],
    ["Plant","Wisdom","Crop"],
    ["Mist","Mist","Fog"],
    ["Mountain","Rain","Snow"],
    ["Brick","Brick","House"],
    ["Crop","House","Civilization"],
    ["Civilization","Wisdom","Philosophy"],
    ["Philosophy","Philosophy","Logic"],
    ["Logic","Logic","Math"],
    ["Civilization","Genius","Einstein"],
    ["Math","Genius","Physics"],
    ["Physics","Einstein","Quantum Theory"],
    ["Plant","Plant","Tree"],
    ["Mountain","Mountain","Tectonics"],
    ["Stone","Civilization","Tool"],
    ["Tool","Tree","Wood"],
    ["Tool","Mountain","Mining"],
    ["Mining","Mountain","Metal"],
    ["Metal","Fire","Smithing"],
    ["Wood","Tool","Plank"],
    ["Plank","Water","Raft"],
    ["Raft","Wind","Boat"],
    ["Plank","Ocean","Raft"],
    ["Math","Sky","Astronomy"],
    ["Artistry","Clay","Pottery"],
    ["Mining","Earth","Oil"],
    ["Oil","Civilization","Gasoline"],
    ["Gasoline","Fire","Lantern"],
    ["Cloud","Cloud","Lightning"],
    ["Lightning","Metal","Wire"],
    ["Metal","Wire","Electronics"],
    ["Metal","Gasoline","Motor"],
    ["Motor","Metal","Vehicle"],
    ["Vehicle","Astronomy","Rocket"],
    ["Gasoline","Genius","Motor"],
    ["Vehicle","Sky","Plane"],
    ["Gasoline","Civilization","Motor"],
    ["Electronics","Logic","Computer"],
    ["Electronics","Math","Computer"],
    ["Computer","Civilization","Programmer"],
    ["Programmer","Computer","Text Adventure Game"],
    ["Volcano","Explosion","Eruption"],
    ["Metal","Tool","Engraving"],
    ["Metal","Artistry","Engraving"],
    ["Water","Wisdom","Irrigation"],
    ["Fire","Air","Smoke"],
    ["Fire","Wisdom","Cooking"],
    ["Lava","Water","Stone"],
    ["Vehicle","Ocean","Boat"],
    ["Vehicle","Water","Boat"],
    ["Civilization","Civilization","Diplomacy"],
    ["Diplomacy","Vehicle","Trade"],
    ["Diplomacy","Boat","Trade"],
    ["Quantum Theory","Computer","Hypercomputing"],
    ["Computer","Vehicle","Autopilot"],
    ["Computer","Plane","Autopilot"],
    ["Diplomacy","Plane","Trade"],
    ["Wave","Stone","Sand"],
    ["Sand","Fire","Glass"],
    ["Glass","Wire","Lightbulb"],
    ["Fire","Plant","Smoke"],
    ["Fire","Tree","Charcoal"],
    ["Lightning","Tree","Charcoal"],
    ["Lava","Tree","Charcoal"],
    ["Fire","Wood","Charcoal"],
    ["Charcoal","Metal","Grill"],
    ["Plant","Stone","Papyrus"],
    ["Charcoal","Wood","Pencil"],
    ["Papyrus","Pencil","Writing"],
    ["Writing","Genius","Literature"],
    ["Computer","Writing","Email"],
    ["Wire","Diplomacy","Telegraph"],
    ["Artistry","Writing","Literature"],
    ["Writing","Diplomacy","Postal Service"],
    ["Writing","Metal","Engraving"],
    ["Rocket","Computer","Satellite"],
    ["Satellite","Earth","GPS"],
    ["Computer","Diplomacy","Internet"],
    ["Charcoal","Stone","Cave Painting"],
    ["Charcoal","Mountain","Cave Painting"],
    ["Explosion","Mountain","Cavern"],
    ["Cavern","Crop","Civilization"],
    ["Cavern","Charcoal","Cave Painting"],
    ["Explosion","Earth","Cavern"],
    ["Cave Painting","Civilization","Artistry"],
    ["Cave Painting","Genius","Artistry"],
    ["Plant","Water","Flower"],
    ["Artistry","Flower","Boquet"],
    ["Flower","Flower","Boquet"],
    ["Artistry","Clay","Pottery"],
    ["Irrigation","Plant","Crop"],
    ["Tool","Stone","Wheel"],
    ["Artistry","Stone","Masonry"],
    ["Vehicle","Earth","Railroad"],
    ["Railroad","Diplomacy","Trade"],
    ["Artistry","Cooking","Cuisine"],
    ["Genius","Cooking","Cuisine"],
    ["Math","Artistry","Music"],
    ["Music","Computer","Synthetic Instrument"],
    ["Papyrus","Civilization","Paper"],
    ["Computer","Paper","Printer"],
    ["Computer","Telegraph","Email"],
    ["Computer","Postal Service","Email"],
    ["Motor","Wheel","Vehicle"],
    ["Air","Wisdom","Sound"],
    ["Telegraph","Sound","Telephone"],
    ["Telephone","Computer","Cell Phone"],
    ["Sound","Artistry","Music"],
    ["Einstein","Genius","Lightbulb"],
    ["House","House","Neighborhood"],
    ["Paper","Paper","Literature"],
    ["Literature","Sound","Audio Book"],
    ["Literature","Computer","Ebook"],
    ["Literature","Electronics","Ebook"],
    ["Clay","Wheel","Pottery"],
    ["Artistry","Wood","Carpentry"],
    ["Paper","Pencil","Writing"],
    ["Wire","Wire","Electronics"],
    ["Wire","Genius","Electronics"],
    ["Tool","Charcoal","Pencil"],
    ["Cavern","Writing","Cave Painting"],
    ["Diplomacy","Sound","Telephone"],
    ["Postal Service","Internet","Email"],
    ["Sky","Water","Rain"],
    ["Sky","Mist","Cloud"],
    ["Sky","Fog","Cloud"],
    ["Cloud","Earth","Fog"],
    ["Sky","Steam","Cloud"]
  ]
}
function Element(name) {
  Object.assign(this, new Entity(name, "Nowhere", name, {}, name));
  this.methods = {};
  this.methods.nothing = function() {combine();};
  return this;
}
function getCombos() {
  return World.combinations;
}
function combine() {
  var input = getInput();
  var combos = getCombos();
  for(var i = 0; i < combos.length; i++) {
    var combo = combos[i];
    if (testForWord(input, combo[0])) {
      var firstIngredient = new RegExp(combo[0], "i");
      var filteredInput = input.replace(firstIngredient, "");
      if (testForWord(filteredInput, combo[1])) {
        create(combo);
        return;
      }
    }
  }
  output("That's not a valid combination.");
}
function create(combo) {
  if (findByName(combo[0], getEntities()).locations[0] == "Expanse" && findByName(combo[0], getEntities()).locations[0] == "Expanse") {
    output("<strong>" + combo[0] + "</strong> and <strong>" + combo[1] +
    "</strong> makes <strong>" + combo[2] + "</strong>!");
    var element = findByName(combo[2], getEntities());
    element.warp("Expanse");
  } else {
    output("You don't have both of those elements.")
  }
}
function listElements() {
  var currentRoom = findByName(getPlayer().locations[0], getRooms());
  var undiscovered = findByName("Nowhere", getRooms()).localize(getEntities());
  output(currentRoom.describeEntities() + " Elements Remaining: " + undiscovered.length);
}
//Execution---------------------------------------------------------------------
setup();
