//Constants---------------------------------------------------------------------
var SYNONYMS = {
  look: ["look","examine"],
  attack: ["attack","kick","punch","fight","destroy","crush","break","smash"],
  move: ["move","go","walk","run","step"],
  throw: ["throw","toss"],
  use: ["use"],
  open: ["open","search"],
  close: ["close","shut"],
  talk: ["talk","ask","say","shout","speak"],
  take: ["take","pick up","steal"],
  unequip: ["unequip","take off"],
  equip: ["equip","put on","wear"],
  hang: ["hang","put"],
  snowdrift: ["snowdrift","snow"],
  toolbox: ["toolbox","tools","box"],
  snowshovel: ["snowshovel","shovel"],
  "blue ornament": ["blue", "ornament"],
  "red ornament": ["red", "ornament"],
  mailbox: ["mail"],
  fireplace: ["fire"],
  put: ["put","throw","toss"]
};
var USE_IMAGES = true;
var USE_SOUND = false;
var STARTING_ROOM = "home.livingroom";
//Player------------------------------------------------------------------------
var Player = new Entity("player",
  STARTING_ROOM,
  "you",
  {
    "do a barrel roll": function() {
      output("Press Z or R twice!");
    },
    zz: function() {
      output("You have done a barrel roll");
    },
    rr: function() {
      output("You have done a barrel roll");
    },
    inventory: function() {
      var inventory = findByName("Inventory", getRooms());
      var description = describeEntities(inventory);
      if (description.length > 0) {
        output("You have " + describeEntities(inventory));
      } else {
        output("You have nothing.");
      }
    },
    nothing: function() {
      var room = findByName(getPlayerLocation(), getRooms());
      var exits = Object.keys(getCurrentExits());
      exits = exits.concat(Object.keys(getInterceptorExits(room)));
      for (var i = 0; i < exits.length; i++) {
        var input = getInput().toLowerCase();
        var exit = exits[i].toLowerCase();
        if(input == exit) {
          var player = getPlayer();
          this.move();
          return;
        }
      }
      output("I'm afraid I don't understand.");
    },
    move: function() {
      var input = getInput();
      movePlayerByInput(input);
    },
    look: function() {
      var player = getPlayer();
      var currentRoom = findByName(player.location, getRooms());
      updateRoomDisplay(currentRoom);
    },
    use: function() {
      output("Use what?");
    },
    throw: function() {
      output("Throw what?");
    },
  },
  "player"
);
//Data Containers---------------------------------------------------------------
var roomArray = [
  //System
  new Room("Inventory",
    "https://goo.gl/LbCU99",
    "",
    "Somehow, you have managed to place *yourself* inside of that magical \
    non-space you call an inventory. All your items are here, but then, \
    aren't they in your bag? What happens now? Maybe you should submit a bug \
    report.",
    {
      "out": ["Inventory", "climb out of your bag"],
    },
    "Inventory"
  ),
  new Room("Nowhere",
    "https://goo.gl/thCGRv",
    "",
    "Somehow, you've made it to a secret room where entities are placed when \
    they aren't needed. Either you're a clever hacker, or something's gone \
    wrong. Maybe you should submit a bug report.",
    {
      "north": ["North of nowhere", "go north"],
      "south": ["South of nowhere", "south"]
    },
    "Nowhere in particular"
  ),
  //Home
  new Room("home.livingroom",
    "http://founterior.com/wp-content/uploads/2014/11/Christmas-fireplace-2-with-red-and-white-socks.jpg",
    "",
    "This is the living room, all set up and ready for Christmas.",
    {
      "kitchen": ["home.kitchen","go down the hall to the kitchen"],
      "reading room": ["home.readingroom","down the hall to the reading room"],
      "out": ["home.outside","out through the door"]
    },
    "Living Room"
  ),
  new Room("home.readingroom",
    "https://engagethepews.files.wordpress.com/2013/03/book-shelves.jpg?w=512&h=415",
    "",
    "The reading room is rather large; sometimes, you wonder why anyone \
    would ever dedicate that much space to something as boring as books.",
    {
      "out": ["home.livingroom","go out the door to the living room"]
    },
    "Reading Room"
  ),
  new Room("home.kitchen",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_IxkHLFHNPhaGN5Tj8K_yhr22PVWLHCOMlYcl9bjPpMKc-w-EXQ",
    "",
    "The kitchen is nicely decorated. You're still not sure how someone \
    managed to hang that plant from the ceiling.",
    {
      "living room": ["home.livingroom","go down the hall to the living room"],
      "garage": ["home.garage","through the door to the garage"]
    },
    "Kitchen"
  ),
  new Room("home.garage",
    "http://3.bp.blogspot.com/-Rz3_aplVzII/TVPoIoafgJI/AAAAAAAAEgs/krhJgtZjF68/s1600/car%2Bin%2Bgarage.jpg",
    "",
    "The garage is a little more drab than the rest of the house.",
    {
      "kitchen": ["home.kitchen","go in to the kitchen"],
      "out": ["home.outside","out through the garage door"]
    },
    "Garage"
  ),
  new Room("home.outside",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLwt2bg7aG2mv8GsLkPKqMmFx2cEQtWfD__yMtFWZ5KA8Q11cW",
    "",
    "Your exterior decorations are humble, but they're not the worst you've \
    ever seen. That honor goes to the inflatable pumpkin your family once \
    put up for Halloween and then forgot to take down by December.",
    {
      "inside": ["home.livingroom","go inside to the living room"],
      "garage": ["home.garage","step into the garage"]
    },
    "Outside"
  ),
  //Space
  new Room("space.junction",
    "https://mir-s3-cdn-cf.behance.net/project_modules/max_3840/f9ea4049763237.56086a279ef25.png",
    "",
    "You're flying high in sky on a Christmas tree rocket. Who needs cheap \
    thrills like skiing?",
    {
      "home": ["home.livingroom","fly home"],
      "north pole": ["northpole.landing","head to the north pole"]
    },
    "Flying on a Rocket Tree"
  ),
  //northpole
  new Room("northpole.landing",
    "http://www.lovethispic.com/uploaded_images/35074-Christmas-Tree-In-The-Snow.jpg",
    "",
    "This is where you've landed your rocket-tree. You're shocked by the sheer \
    number of other trees - how is there a forest in the north pole?",
    {
      "fly": ["space.junction","fly up on your rocket-tree"],
      "through": ["northpole.workshopout","you can head through the trees"]
    },
    "North Pole Landing"
  ),
  new Room("northpole.workshopout",
    "http://citycreekconstruction.com/wp-content/uploads/2016/12/santas-workshop-862x504.jpg",
    "",
    "This is the outside of some kind of workshop. Looking in, you think you \
    can see some red and white.",
    {
      "towards": ["northpole.alaskasign","head towards the workshop"],
      "back": ["northpole.landing","go back to your rocket-tree"]
    },
    "Workshop Exterior"
  ),
  new Room("northpole.alaskasign",
    "https://i1.wp.com/www.thedailychronic.net/wp-content/uploads/2015/06/North-Pole-Alaska.jpg?fit=1600%2C1200",
    "",
    "OH. THIS ISN'T WHERE YOU MEANT TO GO AT ALL.",
    {
      "back": ["northpole.workshopout","go back in the direction of your tree"]
    },
    "ALASKA SIGN"
  ),
  new Room("truenorth.landing",
    "https://ak0.picdn.net/shutterstock/videos/7750630/thumb/1.jpg",
    "",
    "If this sign is any indication, you've made it where you meant to go. \
    Granted, the *last* north pole sign you saw wasn't the most helpful.",
    {
      "fly": ["space.junction","fly up on your rocket-tree"],
      "south": ["truenorth.workshopout","go south. It is mathematically impossible to go in any other direction"]
    },
    "True North Pole Landing"
    )
];
var entityArray = [
  //inventory
  new Entity("inventory.coat",
    "Inventory",
    "a warm winter coat",
    {
      nothing: function() {
        output("What should I do with the coat?");
      },
      unequip: function() {
        if (this.parent.isOn) {
          output("It's too cold to do that!");
        } else {
          output("But you're not wearing your coat.")
        }
      },
      use: function() {
        this.equip
      },
      equip: function() {
        output("You put on your coat. You can probably go outside now.");
        this.parent.isOn = true
      }
    },
    "coat"
  ),
  //Home
  new Entity("home.tree",
    "home.livingroom",
    "a heavily ornamented tree",
    {
      nothing: function() {
        output("What should I do with the tree?");
      },
      look: function() {
        output("The tree really is quite beautiful. You feel proud of the \
          decorating job you did with the rest of the family. You even got to \
          put up a homemade paper candy cane.");
        output("Hey wait a minute... where's your candy cane?");
      },
      attack: function() {
        output("You summon all of your martial wisdom and engage the tree \
          in an honorable duel.");
        output("Nothing really happens.");
      },
      hang: function() {
        var input = getInput();
        if (inventoryContains("home.redornament")) {
          if (testForWord(input, "red ornament")) {
            var red = findByName("home.redornament", getInteractables());
            red.location = "Nowhere";
            this.parent.red = true;
            output("You hang the red ornament on the tree.");
          } else {
            alert("Don't have red");
            output("Hang what on the tree?");
          }
        } else if (testForWord(input, "blue ornament")) {
          if (inventoryContains("home.blueornament")) {
            var blue = findByName("home.blueornament", getInteractables());
            blue.location = "Nowhere";
            this.parent.blue = true;
            output("You hang the blue ornament on the tree.");
          } else {
            alert("Don't have blue");
            output("Hang what on the tree?");
          }
        } else {
          alert("Didn't say valid input");
          output("Hang what on the tree?");
        }
        if (this.parent.red && this.parent.blue) {
          output("A little banner pops up. It says, \"MISSILE-TOE COMMERCIAL \
            ROCKET - ON STANDBY\". A small button appears on the trunk of the \
            tree.");
          output("<em>If you want to see what's changed, you can \
            <strong>look</strong> around.</em>");
          var button = findByName("home.button", getInterceptors());
          button.location = "home.livingroom";
        }
      }
    },
    "tree"
  ),
  new Entity("home.presents",
    "home.livingroom",
    "a stack of presents",
    {
      nothing: function() {
        output("What should I do with the presents?");
        output("<em>If you want to take a closer look, you can use the \
        <strong>examine</strong> or <strong>look</strong> commands.</em>");
      },
      look: function() {
        output("You search and search, and eventually give up. None of these \
          presents have your name on them.")
      },
      attack: function() {
        output("Why would anyone *attack* presents?");
      }
    },
    "presents"
  ),
  new Entity("home.fireplace",
    "home.livingroom",
    "a depressingly empty fireplace",
    {
      nothing: function() {
        output("What should I do with the fireplace?");
        output("<em>If you want to take a closer look, you can use the \
        <strong>examine</strong> or <strong>look</strong> commands.</em>");
      },
      look: function() {
        output("The fireplace really needs some fire. You should <strong>\
          light</strong> it; you figure you can probably manage with a \
          <strong>lighter</strong> and two pieces of tinder.");
      },
      light: function() {
        if (inventoryContains("home.lighter")) {
          if (this.parent.letter && this.parent.book) {
            output("You get just enough of a spark going to light the fire. It \
              really changes the place, having a fire going--in fact, you're \
              almost certain that something's changed about the \
              <strong>tree</strong>.");
            var livingroom = findByName("home.livingroom", getRooms());
            this.parent.lit = true;
            this.parent.description = "a roaring fireplace";
            livingroom.image = "https://i.ytimg.com/vi/qQQtECJ-grI/maxresdefault.jpg";
            updateImageDisplay(livingroom.image);
          } else {
            output("You do your best to light the fire, but there's just not \
              enough material. Try finding something to put in it.");
          }
        } else {
          output("But you don't have a <strong>lighter</strong>!");
        }
      },
      put: function() {
        var input = getInput();
        if (inventoryContains("home.catalog")) {
          if (testForWord(input, "catalog")) {
            output("You toss the catalog into the fireplace.");
            var catalog = findByName("home.catalog", getEntities());
            catalog.location = "nowhere";
            this.parent.letter = true;
            return;
          }
        }
        if (inventoryContains("home.book")) {
          if (testForWord(input, "book")) {
            output("You toss the <em>Celsius 233</em> into the fireplace.");
            var book = findByName("home.book", getEntities());
            book.location = "nowhere";
            this.parent.book = true;
            return;
          }
        }
        output("That probably won't make very good tinder.");
        return;
      }
    },
    "fireplace"
  ),
  new Entity("home.elf",
    "home.kitchen",
    "an elf on the shelf",
    {
      nothing: function() {
        output("The elf smiles at you and waves.");
      },
      attack: function() {
        output("You do your best to catch the elf, but he's always one step \
          ahead of you.");
      },
      talk: function() {
        output("You ask the elf how you can get to Santa.");
        output("He smiles and mimes eating something.")
      },
      look: function() {
        output("Surely this elf knows how to get to Santa. You should ask \
          him about it.");
      },
      give: function() {
        if (inventoryContains("home.peppermint")) {
          var input = getInput();
          if (testForWord(input, "peppermint")) {
            output("He laughs, tosses you a <strong>red ornament</strong>, and \
              scampers off.");
            var ornament = findByName("home.redornament", getEntities());
            var peppermint = findByName("home.peppermint", getEntities());
            ornament.location = "Inventory";
            peppermint.location = "Nowhere";
            this.parent.location = "Nowhere";
          } else {
            output("He regards your gift and then shakes his head.");
          }
        }
      }
    },
    "elf"
  ),
  new Entity("home.peppermint",
    "home.readingroom",
    "a delicious peppermint",
    {
      nothing: function() {
        output("What should I do with the peppermint?");
      },
      take: function() {
        output("You take the peppermint.");
        this.parent.location = "Inventory";
      },
      eat: function() {
        output("You already brushed your teeth, though. It would taste gross!");
      }
    },
    "peppermint"
  ),
  new Entity("home.redornament",
    "Nowhere",
    "a shiny red ornament",
    {
      nothing: function() {
        output("What should I do with the ornament?");
      },
      hang: function() {
        output("Hang it on what?");
      }
    },
    "red ornament"
  ),
  new Entity("home.blueornament",
    "home.garage",
    "a dull blue ornament",
    {
      nothing: function() {
        output("What should I do with the ornament?");
      },
      take: function() {
        if (this.parent.location == "Inventory") {
          this.nothing();
        } else {
          output("You take the blue ornament");
          this.parent.location = "Inventory";
        }
      },
      hang: function() {
        output("Hang it on what?");
      }
    },
    "blue ornament"
  ),
  new Entity("home.toolbox",
    "home.garage",
    "a toolbox",
    {
      nothing: function() {
        output("This toolbox is really quite heavy.");
        output("Maybe you should try opening it.");
      },
      attack: function() {
        output("Well, that's one way to get it open.");
        this.open();
      },
      open: function() {
        if (inventoryContains("home.lighter")) {
          output("You find nothing else worthy of note in the toolbox.")
        } else {
          output("You rifle through the toolbox and find a <strong>lighter</strong>.");
          output("That might come in handy for the fireplace.");
          var lighter = findByName("home.lighter", getEntities());
          lighter.location = "Inventory";
        }
      }
    },
    "toolbox"
  ),
  new Entity("home.lighter",
    "Nowhere",
    "a red and black lighter",
    {
      nothing: function() {
        output("Do what with the lighter?");
      }
    },
    "lighter"
  ),
  new Entity("home.catalog",
    "Nowhere",
    "a catalog",
    {
      nothing: function() {
        output("Do what with the catalog?");
      }
    },
    "catalog"
  ),
  new Entity("home.snowdrift",
    "home.outside",
    "an enormous snowdrift",
    {
      nothing: function() {
        output("Do what with the snowdrift?");
      },
      attack: function() {
        output("You attack the snowdrift, but all you really succeed in doing \
          is getting snow inside your hood.");
      },
      shovel: function() {
        if (inventoryContains("home.shovel")) {
          output("You clear away the snow, revealing the <strong>mailbox</strong>");
          output("<em>If you want to see what's changed, you can \
            <strong>look</strong> around.</em>");
          var mailbox = findByName("home.mailbox", getEntities());
          mailbox.location = "home.outside";
          this.parent.location = "Nowhere";
        } else {
          output("But you don't have a snowshovel!");
        }
      }
    },
    "snowdrift"
  ),
  new Entity("home.shovel",
    "home.garage",
    "a snowshovel",
    {
      nothing: function() {
        output("Do what with the snowshovel?");
      },
      take: function() {
        output("You take the snowshovel with you.");
        this.parent.location = "Inventory";
      }
    },
    "snowshovel"
  ),
  new Entity("home.mailbox",
    "Nowhere",
    "the mailbox",
    {
      nothing: function() {
        output("Do what with the mailbox?");
      },
      open: function() {
        output("Inside the mailbox, you find a present <strong>catalog</strong>. \
          Looks flammable.");
        output("You take the catalog with you.");
        var catalog = findByName("home.catalog", getEntities());
        catalog.location = "Inventory";
      }
    },
    "mailbox"
  ),
  new Entity("home.book",
    "home.readingroom",
    "a book labeled <em>Celsius 233</em>",
    {
      nothing: function() {
        output("Do what with <em>Celsius 233</em>?");
      },
      look: function() {
        output("It's <em>Celsius 233</em>, by Bray Radberry.");
        output("You don't like it much, but the reviews are on fire.");
      },
      take: function() {
        output("You pick up <em>Celsius 233</em>. You would say it's a cool  \
          book, but the cover depicts flames.");
        this.parent.location = "Inventory";
      }
    },
    "book"
  ),
  //northpole
  new Entity("northpole.coordinates",
    "northpole.alaskasign",
    "a paper with the coordinates of the real north pole",
    {
      nothing: function() {
        output("Do what with the coordinates?");
      },
      look: function() {
        output("Longitude: 0, Latitude: 90");
        var interceptor = findByName("space.truenorth", getInterceptors());
        interceptor.location = "space.junction";
      },
      take: function() {
        output("You take the coordinates. You should be able to fly to the \
          real north pole now.");
        var interceptor = findByName("space.truenorth", getInterceptors());
        interceptor.location = "space.junction";
      }
    },
    "coordinates"
    )
];
var obstructionArray = [
  new Obstruction("home.livingroom.nocoat",
    "home.livingroom",
    {
      nothing: function() {
        var coat = findByName("inventory.coat", getEntities());
        if (coat.isOn) {
          this.parent.location = "Nowhere";
          movePlayerByInput(getInput());
        } else {
          output("You can't go <strong>out</strong> unless you're wearing \
            your coat.");
          output("<em>You can view your items with the \
            <strong>inventory</strong> command.");
        }
      }
    },
    {
      "out": ["home.outside","You can't go out unless you're wearing your coat"]
    },
    "out"
  ),
  new Obstruction("home.garage.nocoat",
    "home.garage",
    {
      nothing: function() {
        var coat = findByName("inventory.coat", getEntities());
        if (coat.isOn) {
          this.parent.location = "Nowhere";
          movePlayerByInput(getInput());
        } else {
          output("You can't go <strong>out</strong> unless you're wearing \
            your coat.");
          output("<em>You can view your items with the \
            <strong>inventory</strong> command.");
        }
      }
    },
    {
      "out": ["home.outside","You can't go out unless you're wearing your coat"]
    },
    "out"
    )
];
var interceptorArray = [
  //home
  new Obstruction("home.button",
    "Nowhere",
    {
      nothing: function() {
        var fireplace = findByName("home.fireplace", getEntities());
        output("You press the button.");
        if (fireplace.lit) {
          output("The tree turns into a rocket.");
          movePlayerByInput(getInput());
        } else {
          output("Another banner pops up. It says, \"LIGHT FIRE TO CONTINUE\".");
        }
      },
    },
    {
      "button": ["space.junction", "press the <strong>rocket button</strong>"]
    },
    "button"
  ),
  //space
  new Obstruction("space.truenorth",
    "Nowhere",
    {
      nothing: function() {
        movePlayerByInput(getInput());
      }
    },
    {
      "true north": ["truenorth.landing","fly to true north"]
    },
    "true north"
  )
];
//Functions---------------------------------------------------------------------
function init() {
  output("It's Christmas day, and you're feeling very excited to get \
    on with it. Unfortunately, you've been told that \"opening presents at \
    3 in the morning is ridiculous\". Well, fine, but that's not going to stop \
    you from waking up early to get a sneak peek. After some fumbling, you \
    manage to find the lightswitch.")
    output("As you look through the presents, you realize with rising \
      horror that none of them are labeled with your name. This is going to \
      require a visit to Santa.");
}
//Execution---------------------------------------------------------------------
setup();
