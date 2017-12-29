//Constants---------------------------------------------------------------------
var SYNONYMS = {
  look: ["look","examine"],
  attack: ["attack","kick","punch","fight","destroy","crush","break","smash"],
  move: ["move","go","walk","run","step","fly","head"],
  throw: ["throw","toss"],
  use: ["use"],
  open: ["open","search"],
  close: ["close","shut"],
  talk: ["talk","ask","say","shout","speak"],
  take: ["take","pick up","steal","get"],
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
  put: ["put","throw","toss"],
  "fishing pole": ["pole", "fish"],
  "space helmet": ["helmet"],
  "space worm": ["worm"],
  "fishing pole": ["pole"],
  "polar bear": ["bear"],
  "santa claus": ["santa"],
  "sugar plum": ["plum"]
};
var USE_IMAGES = false;
var USE_SOUND = false;
var STARTING_ROOM = "home.livingroom";
//Player------------------------------------------------------------------------
var Player = new Entity("player",
  STARTING_ROOM,
  "you",
  {
    inventory: function() {
      var inventory = findByName("Inventory", getRooms());
      var entities = narrowEntitiesByLocation(getEntities(), "Inventory");
      if (entities.length > 0) {
        var description = describeEntities(inventory);
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
      updateRoomDisplay(player.location);
    },
    use: function() {
      output("Use what?");
    },
  },
  "player"
);
//Data Containers---------------------------------------------------------------
var roomArray = [
  //System
  new Room("Inventory",
    "",
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
    "",
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
    "",
    "",
    "You're in the living room, which is set up for Christmas.",
    {
      "kitchen": ["home.kitchen","go down the hall to the kitchen"],
      "reading room": ["home.readingroom","down the hall to the reading room"],
      "out": ["home.outside","out through the door"]
    },
    "Living Room"
  ),
  new Room("home.readingroom",
    "",
    "",
    "The reading room is rather large; sometimes, you wonder why anyone \
    would ever dedicate that much space to something as boring as books.",
    {
      "out": ["home.livingroom","go out the door to the living room"]
    },
    "Reading Room"
  ),
  new Room("home.kitchen",
    "",
    "",
    "The kitchen is nicely decorated.",
    {
      "living room": ["home.livingroom","go down the hall to the living room"],
      "garage": ["home.garage","through the door to the garage"]
    },
    "Kitchen"
  ),
  new Room("home.garage",
    "",
    "",
    "The garage is a little more drab than the rest of the house.",
    {
      "kitchen": ["home.kitchen","go in to the kitchen"],
      "out": ["home.outside","out through the garage door"]
    },
    "Garage"
  ),
  new Room("home.outside",
    "",
    "",
    "You are outside. Your exterior decorations are humble, but they're not the worst you've \
    ever seen--that honor goes to the inflatable pumpkin your family once \
    put up for Halloween and then forgot to take down by December.",
    {
      "inside": ["home.livingroom","go inside to the living room"],
      "garage": ["home.garage","step into the garage"]
    },
    "Outside"
  ),
  //Space
  new Room("space.junction",
    "",
    "",
    "You're flying high in sky on a Christmas tree rocket. Who needs cheap \
    thrills like skiing?",
    {
      "home": ["home.livingroom","fly home"],
      "north pole": ["northpole.landing","head to the north pole"]
    },
    "Flying on a Rocket Tree"
  ),
  new Room("space.station",
    "",
    "",
    "You've made it to the International Space Station. Nifty.",
    {
      "in": ["space.stationin","head in to the station"],
      "down": ["space.junction","fly back down to earth"]
    },
    "International Space Station"
  ),
  new Room("space.stationin",
    "",
    "",
    "The inside of the space station is just as robotic and filled-with-computers \
    as you imagined it.",
    {
      "out": ["space.station","go out the hatch"]
    },
    "Inside the ISS"
  ),
  //northpole
  new Room("northpole.landing",
    "",
    "",
    "This is where you've landed your rocket-tree.",
    {
      "fly": ["space.junction","fly up on your rocket-tree"],
      "through": ["northpole.workshopout","you can head through the trees"]
    },
    "North Pole Landing"
  ),
  new Room("northpole.workshopout",
    "",
    "",
    "You seem to be standing near a village.",
    {
      "towards": ["northpole.alaskasign","head towards the village"],
      "back": ["northpole.landing","go back to your rocket-tree"]
    },
    "Village"
  ),
  new Room("northpole.alaskasign",
    "",
    "",
    "Okay. This is North Pole, Alaska. Probably not where Santa lives, but it \
    might be worth exploring.",
    {
      "in": ["northpole.fishingstore","in to a nearby store"],
      "back": ["northpole.workshopout","go back in the direction of your tree"]
    },
    "North Pole, Alaska"
  ),
  new Room("northpole.fishingstore",
    "",
    "",
    "Welcome to Fish Upon a Star, the greatest fishing utility shop in North \
    Pole, Alaska.",
    {
      "out": ["northpole.alaskasign","head out the door"]
    },
    "Fish Upon a Star"
  ),
  //truenorth
  new Room("truenorth.landing",
    "",
    "",
    "This is probably the right North Pole. Granted, your judgement was pretty \
    poor last time, so there's a very real and unfortunate possibility that it's not. \
    In any case, it doesn't look like Santa's Workshop is right here, so \
    you'll have to do some searching.",
    {
      "fly": ["space.junction","fly up on your rocket-tree"],
      "south": ["truenorth.bearroom","go south. It is mathematically impossible to go in any other direction"]
    },
    "True North Pole Landing"
  ),
  new Room("truenorth.bearroom",
    "",
    "",
    "As you walk out into the frozen tundra, you start to feel grateful for \
    your coat.",
    {
      "north": ["truenorth.landing","go north to the landing site"],
      "east": ["truenorth.oasis","east to a lake"],
      "west": ["truenorth.igloo","west to an igloo"],
      "south": ["truenorth.workshopout","south to what looks like Santa's Workshop"]
    },
    "Frozen Tundra"
  ),
  new Room("truenorth.igloo",
    "",
    "",
    "The inside of the igloo is surprisingly warm.",
    {
      "out": ["truenorth.bearroom","step out of the igloo"]
    },
    "Igloo"
  ),
  new Room("truenorth.oasis",
    "",
    "",
    "As it turns out, the north pole *isn't* just a big sheet of ice.",
    {
      "back": ["truenorth.bearroom","go back where you came from"]
    },
    "Lake"
  ),
  new Room("truenorth.workshopout",
    "",
    "",
    "This is it. Santa's workshop is right here.",
    {
      "in": ["truenorth.workshop","go in"],
      "back": ["truenorth.bearroom","head back"]
    },
    "Santa's Workshop"
  ),
  new Room("truenorth.workshop",
    "",
    "",
    "After all that work, you've made it.",
    {
      "out": ["truenorth.workshopout","go out if you want, but I don't see why you would"]
    },
    "Santa Claus"
  ),
  new Room("endroom",
    "",
    "",
    "Sure enough, there are presents there for you in the morning--not the \
    least of which is a text adventure game for your computer. Neat!",
    {
    },
    "THE END"
  ),
];
var entityArray = [
  //inventory
  new Entity("inventory.coat",
    "home.livingroom",
    "a warm winter coat",
    {
      nothing: function() {
        output("Do what with the coat?");
        output("<em>You can view your items with the \
          <strong>inventory</strong> command.");
      },
      unequip: function() {
        if (this.parent.isOn) {
          output("It's too cold to do that!");
        } else {
          output("But you're not wearing your coat.")
        }
      },
      use: function() {
        this.equip();
      },
      equip: function() {
        if (!inventoryContains("inventory.coat")) {
          this.take();
        }
        if (this.parent.isOn) {
          output("You're already wearing your coat!");
        } else {
          output("You put on your coat. You can probably go outside now.");
          this.parent.isOn = true;
        }
      },
      look: function() {
        output("It's a warm winter coat. It's blue, your favorite color.");
      },
      take: function() {
        if (inventoryContains("inventory.coat")) {
          output("I'm afraid I don't understand");
        } else {
          output("You pick up your coat.");
          this.parent.location = "Inventory";
        }
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
        output("Do what with the tree?");
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
            output("Hang what on the tree?");
          }
        } else if (testForWord(input, "blue ornament")) {
          if (inventoryContains("home.blueornament")) {
            var blue = findByName("home.blueornament", getInteractables());
            blue.location = "Nowhere";
            this.parent.blue = true;
            output("You hang the blue ornament on the tree.");
          } else {
            output("Hang what on the tree?");
          }
        } else {
          output("Hang what on the tree?");
        }
        if (this.parent.red && this.parent.blue) {
          output("A little banner pops up. It says, \"MISSILE-TOE COMMERCIAL \
            ROCKET--ON STANDBY\". A small button appears on the trunk of the \
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
        output("Do what with the presents?");
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
        output("Do what with the fireplace?");
        output("<em>If you want to take a closer look, you can use the \
        <strong>examine</strong> or <strong>look</strong> commands.</em>");
      },
      look: function() {
        if (this.parent.lit) {
          output("The fire is roaring now. That's much better.");
        } else {
          output("The fireplace really needs some fire. You should <strong>\
            light</strong> it; you figure you can probably manage with a \
            <strong>lighter</strong> and two pieces of tinder.");
        }
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
      "sugar plum": function() {
        if (inventoryContains("home.sugarplum")) {
          output("He laughs, tosses you a <strong>red ornament</strong>, and \
            scampers off.");
          var ornament = findByName("home.redornament", getEntities());
          var sugarplum = findByName("home.sugarplum", getEntities());
          ornament.location = "Inventory";
          sugarplum.location = "Nowhere";
          this.parent.location = "Nowhere";
        } else {
          output("You don't have a sugar plum!");
        }
      }
    },
    "elf"
  ),
  new Entity("home.sugarplum",
    "home.readingroom",
    "a delicious sugar plum",
    {
      nothing: function() {
        output("Do what with the sugar plum?");
      },
      take: function() {
        output("You take the sugar plum.");
        this.parent.location = "Inventory";
      },
      eat: function() {
        output("You already brushed your teeth, though. It would taste gross!");
      },
      look: function() {
        output("It's a sugar plum. Normally you'd eat this in a \
          heartbeat, but you've already brushed your teeth.")
      }
    },
    "sugar plum"
  ),
  new Entity("home.redornament",
    "Nowhere",
    "a shiny red ornament",
    {
      nothing: function() {
        output("Do what with the ornament?");
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
        output("Do what with the ornament?");
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
          output("You take the lighter. It might come in handy for the fireplace.");
          var lighter = findByName("home.lighter", getEntities());
          lighter.location = "Inventory";
        }
      },
      look: function() {
        output("It's a heavy, black-and-orange toolbox.");
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
      },
      look: function() {
        output("It's a catalog for the local toy store. There's not really a \
          whole lot of use for it now that Christmas is here.");
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
      },
      look: function() {
        output("It's a huge snowdrift, left here by the plows.");
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
      },
      look: function() {
        output("It's a snowshovel. The right edge is slightly chipped.");
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
        if (this.parent.empty) {
          output("You find nothing else worthy of note in the mailbox.");
        } else {
          output("Inside the mailbox, you find a present <strong>catalog</strong>. \
            Looks flammable.");
          output("You take the catalog with you.");
          var catalog = findByName("home.catalog", getEntities());
          catalog.location = "Inventory";
          this.parent.empty = true;
        }
      },
      look: function() {
        output("It's your mailbox. Once, one of your neighbors knocked it over \
          accidentally while distributing Christmas cookies. The mail had to \
          be delivered to your door for the next two weeks.");
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
        output("Knowing this, you should be able to fly to the real north \
          pole now.")
        var interceptor = findByName("space.truenorth", getInterceptors());
        interceptor.location = "space.junction";
      },
      take: function() {
        output("You take the coordinates. You should be able to fly to the \
          real north pole now.");
        var interceptor = findByName("space.truenorth", getInterceptors());
        this.parent.location = "Inventory";
        interceptor.location = "space.junction";
      }
    },
    "coordinates"
  ),
  new Entity("northpole.fishingcashier",
    "northpole.fishingstore",
    "a cashier at the counter",
    {
      nothing: function() {
        output("The cashier looks at you quizzically.");
      },
      talk: function() {
        output("Like any 10-year-old would, you ask for free stuff. He asks, \
          \"Do you have a coupon?\"");
      },
      coupon: function() {
        if (inventoryContains("space.coupon")) {
          output("He looks at your coupon and nods his head. \"I see you've \
            been to the ISS. It's pretty cool, huh? Anyways, here's your \
            complimentary fishing pole. Come to <em>Fish Upon a Star</em> \
            again!\"");
          output("\"Oh, and hey--if you need any <strong>bait</strong>, just \
            ask someone at the station. They've got space worms running out \
            their ears.\"")
          var fishingpole = findByName("northpole.fishingpole", getEntities());
          var coupon = findByName("space.coupon", getEntities());
          fishingpole.location = "Inventory";
          coupon.location = "Nowhere";
        } else {
          output("You don't have a coupon!");
        }
      }
    },
    "cashier"
  ),
  new Entity("northpole.fishingpole",
    "Nowhere",
    "a blue fishing pole",
    {
      nothing: function() {
        output("Do what with the fishing pole?");
      },
      fish: function() {
        output("Fish in what?");
      }
    },
    "fishing pole"
  ),
  //truenorth
  new Entity("truenorth.snowman",
    "truenorth.landing",
    "a snowman here",
    {
      nothing: function() {
        output("Do what with the snowman?");
      },
      look: function() {
        output("It's a snowman. It's got coal \
          eyes and a carrot nose--pretty standard fare, if you ask me.");
      },
      talk: function() {
        output("You ask the snowman where his friends are.");
        output("He says he has snow idea.");
      },
      attack: function() {
        output("The snowman tells you to take a chill pill.");
      }
    },
    "snowman"
  ),
  new Entity("truenorth.lake",
    "truenorth.oasis",
    "the lake, which remarkably isn't frozen over",
    {
      nothing: function() {
        output("Do what with the lake?");
      },
      attack: function() {
        output("Good luck with that, Caligula.");
        output("<em>Now you have to go look up Caligula. Ha.</em>");
      },
      fish: function() {
        if (inventoryContains("northpole.fishingpole") && inventoryContains("space.spaceworm")) {
          if (roomContains("Nowhere", "truenorth.fish")) {
            output("You stick your fishing pole in the water and wait. Before \
              too long, you get a nibble, and you expertly catch it.");
            output("You now have a <strong>fish</strong>.");
            var fish = findByName("truenorth.fish", getEntities());
            fish.location = "Inventory";
          } else {
            output("Despite your best efforts, you can't seem to catch \
              anything else.");
          }
        } else {
          output("You need a fishing pole and some bait.");
        }
      }
    },
    "lake"
  ),
  new Entity("truenorth.fish",
    "Nowhere",
    "a fish",
    {
      nothing: function() {
        output("Do what with the fish?");
      },
      look: function() {
        output("You're no fishing expert, but you're pretty sure this fish \
          isn't one that you'd find back home.");
      },
      eat: function() {
        output("I'm pretty sure they only eat raw fish in Japan.");
      },
      talk: function() {
        output("The fish just stares at you, like... well, like a dead fish.");
      }
    },
    "fish"
  ),
  new Entity("truenorth.spacehelmet",
    "truenorth.igloo",
    "a space helmet",
    {
      nothing: function() {
        output("Do what with the space helmet?");
      },
      take: function() {
        this.equip();
      },
      equip: function() {
        output("You put the space helmet on. If only you had a rocket to go to \
          space in. Oh, that's right--despite the astronomical odds, you do.");
        this.parent.location = "Inventory";
        this.parent.on = true;
        var hashelmet = findByName("space.hashelmet", getInterceptors());
        hashelmet.location = "space.junction";
      },
      look: function() {
        output("It's a black-and-white space helmet, straight out of 1969");
      }
    },
    "space helmet"
  ),
  new Entity("truenorth.santaclaus",
    "truenorth.workshop",
    "Santa Claus himself",
    {
      nothing: function() {
        output("Santa looks at you quizzically");
      },
      attack: function() {
        output("You do your best to attack Santa. He seems unharmed, but he \
          frowns and puts you on next year's naughty list.");
      },
      talk: function() {
        output("<br>>You ask Santa where all your presents went.");
        output("\"You don't have any presents?\" he asks. \"Well that's a concern! I'll \
          go talk to my elves and get this all sorted out. In the meantime, \
          you can go home. Your presents should be there in the morning.\"");
        warp(getPlayer(), "endroom");
        updateRoomDisplay(findByName("endroom", getRooms()));
      },
      look: function() {
        output("It's Santa Claus, with a full white beard and a jolly red cap.");
      }
    },
    "Santa Claus"
  ),
  //space
  new Entity("space.cosmonaut",
    "space.station",
    "a cosmonaut",
    {
      nothing: function() {
        output("The cosmonaut just mumbles something in Russian.");
      },
      talk: function() {
        output("You can't understand the cosmonaut. For whatever reason, he \
          gives you a <strong>space worm</strong> and mimes a fish swimming \
          with his hand.");
        var worm = findByName("space.spaceworm", getEntities());
        worm.location = "Inventory";
      },
      look: function() {
        output("It's a Russian cosmonaut. You can tell he's Russian because \
          you can't understand a word he says.");
      }
    },
    "cosmonaut"
  ),
  new Entity("space.spaceworm",
    "Nowhere",
    "a space worm",
    {
      nothing: function() {
        output("Do what with the space worm?");
      },
      put: function() {
        if (inventoryContains("northpole.fishingpole")) {
          output("You attach the space worm to your fishing pole.");
        } else {
          this.nothing();
        }
      },
      eat: function() {
        output("Um... no.");
      },
      look: function() {
        output("The space worm is just like a regular worm, but it has an \
          antenna. Quite frankly, an antenna in space doesn't seem very \
          practical, but who are you to judge?");
      }
    },
    "space worm"
  ),
  new Entity("space.coupon",
    "space.stationin",
    "a coupon for a fishing pole",
    {
      nothing: function() {
        output("Do what with the coupon?");
      },
      take: function() {
        output("You take the coupon. It says it's for a place called \"Fish \
          Upon a Star\".");
        this.parent.location = "Inventory";
      },
      use: function() {
        output("Give the coupon to who?");
      },
      give: function() {
        output("Give the coupon to who?");
      },
      look: function() {
        output("It's a coupton for a fishing pole, redeemable at Fish Upon a \
          Star in North Pole, Alaska.");
      }
    },
    "coupon"
  ),
  new Entity("space.sign",
    "space.stationin",
    "a sign that says \"Take one\"",
    {
      output: function() {
        output("Do what with the sign?");
      },
      take: function() {
        output("That seems annoying to carry.");
        output("<em>Says the person carrying a snowshovel everywhere.</em>");
      },
      attack: function() {
        output("Fortunately for the ISS, it's actually really difficult to \
          attack things when you're floating in space.");
      },
      look: function() {
        output("The sign is old and weathered, but it still clearly says that \
          you're in Alaska.");
      }
    },
    "sign"
    )
];
var obstructionArray = [
  //home
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
  ),
  //truenorth
  new Obstruction("truenorth.polarbear",
    "truenorth.bearroom",
    {
      nothing: function() {
        output("Do what with the bear?");
      },
      attack: function() {
        output("I'm not sure attacking a *polar bear* is a good idea.");
      },
      fish: function() {
        if (inventoryContains("truenorth.fish")) {
          output("You throw the fish at the bear, and it lumbers away.");
          var bearroom = findByName("truenorth.bearroom", getRooms());
          this.parent.location = "Nowhere";
        } else {
          output("You don't have a fish!");
        }
      }
    },
    {
      "south": ["truenorth.workshopout","you cannot go south because a polar bear is blocking your path"]
    },
    "polar bear"
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
      look: function() {
        output("It's a large red button, clearly labled \"LAUNCH ROCKET\".")
      }
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
  ),
  new Obstruction("space.hashelmet",
    "Nowhere",
    {
      nothing: function() {
        movePlayerByInput(getInput());
      }
    },
    {
      "space": ["space.station","go to space"]
    },
    "space"
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
    horror that none of them are labeled with your name. Pragmatic \
    10-year-old that you are, you decide that this will require a visit to \
    Santa.");
  updateRoomDisplay(STARTING_ROOM);
}
//Execution---------------------------------------------------------------------
setup();
