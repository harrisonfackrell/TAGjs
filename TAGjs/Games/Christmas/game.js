//Globals-----------------------------------------------------------------------
var Configuration = new GameConfiguration(
  {
    useImages: false,
    useMusicControls: false,
    useSoundControls: false
  },
  {
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
    hang: ["hang","put","place"],
    snowdrift: ["snowdrift","snow"],
    toolbox: ["toolbox","tools","box"],
    snowshovel: ["snowshovel","shovel"],
    "blue ornament": ["blue", "ornament"],
    "red ornament": ["red", "ornament"],
    mailbox: ["mail"],
    fireplace: ["fire"],
    put: ["put","throw","toss","place"],
    "space helmet": ["helmet"],
    "space crawdad": ["crawdad"],
    "polar bear": ["bear"],
    "santa claus": ["santa"],
    "sugar plum": ["plum"],
    book: ["book", "celsius"],
    enter: ["enter","type"],
    keypad: ["keypad","enter","type","45271836"],
    "space fish": ["fish"],
    "insult": ["stupid","dumb","idiot","hate","awful"],
    "praise": ["cool","awesome","nerd"],
    "inventory": ["inventory","item"],
    "rocket button": ["button"]
  },
  {
    main: new GameWorld(
      new PlayerEntity("home.livingroom",
        {
          hint: function() {
            IO.output("Hint: Typing 'HINT' will give you a helpful hint.");
            IO.output("Helpful, huh?");
          }
        },
        function() {  }
      ),
      {
        //Home
        "home.livingroom": new Room(
          "You're in the living room, which is set up for Christmas.",
          [
            new Exit("kitchen","home.kitchen","go down the hall to the kitchen"),
            new Exit("reading room","home.readingroom","down the hall to the reading room"),
            new Exit("out", function(entity) {
              if (getPlayer().inventoryContains("inventory.coat")) {
                entity.warp("home.outside");
              } else {
                IO.output("You step outside briefly, but it's too cold without \
                your <strong>coat</strong>.");
              }
            },"out through the door"),
            new Exit("button","space.junction","press the <strong>rocket button</strong>", false)
          ],
          "Living Room"
        ),
        "home.readingroom": new Room(
          "The reading room is rather large. Sometimes, you wonder why anyone \
          would ever dedicate that much space to something as boring as books.",
          [
            new Exit("out","home.livingroom","go out the door to the living room")
          ],
          "Reading Room"
        ),
        "home.kitchen": new Room(


          "The kitchen is nicely decorated.",
          [
            new Exit("living room","home.livingroom","go down the hall to the living room"),
            new Exit("garage","home.garage","through the door to the garage")
          ],
          "Kitchen"
        ),
        "home.garage": new Room(


          "The garage is a little more drab than the rest of the house.",
          [
            new Exit("kitchen","home.kitchen","go in to the kitchen"),
            new Exit("out","home.outside","out through the garage door")
          ],
          "Garage"
        ),
        "home.outside": new Room(


          "You are outside. Your exterior decorations are humble, but they're not the worst you've \
          ever seen--that honor goes to the inflatable pumpkin your family once \
          put up for Halloween and then forgot to take down by December.",
          [
            new Exit("inside","home.livingroom","go inside to the living room"),
            new Exit("garage","home.garage","step into the garage")
          ],
          "Outside"
        ),
        //Space
        "space.junction": new Room(


          "You're flying high in sky on a Christmas tree rocket. Who needs cheap \
          thrills like skiing?",
          [
            new Exit("home","home.livingroom","fly home"),
            new Exit("north pole","northpole.landing","head to the north pole"),
            new Exit("true north","truenorth.landing","fly to true north", false),
            new Exit("space","space.station","go to space", false)
          ],
          "Flying on a Rocket Tree"
        ),
        "space.station": new Room(


          "You've made it to the International Space Station. Nifty.",
          [
            new Exit("in","space.stationin","head in to the station"),
            new Exit("down","space.junction","fly back down to earth")
          ],
          "International Space Station"
        ),
        "space.stationin": new Room(


          "The inside of the space station is just as robotic and filled-with-computers \
          as you imagined it.",
          [
            new Exit("back","space.stationback","journey to the back of the station"),
            new Exit("out","space.station","go out the hatch")
          ],
          "Inside the ISS"
        ),
        "space.stationback": new Room(


          "The back of the station is also robotic and filled-with-computers.",
          [
            new Exit("front","space.stationin","go to the front of the station")
          ],
          "Back of the ISS"
        ),
        //northpole
        "northpole.landing": new Room(


          "This is where you've landed your rocket-tree.",
          [
            new Exit("fly","space.junction","fly up on your rocket-tree"),
            new Exit("through","northpole.workshopout","you can head through the trees")
          ],
          "North Pole Landing"
        ),
        "northpole.workshopout": new Room(


          "You seem to be standing near a village.",
          [
            new Exit("towards","northpole.alaskasign","head towards the village"),
            new Exit("back","northpole.landing","go back to your rocket-tree")
          ],
          "Village"
        ),
        "northpole.alaskasign": new Room(


          "Okay. This is North Pole, Alaska. Probably not where Santa lives, but it \
          might be worth exploring.",
          [
            new Exit("in","northpole.fishingstore","go in to a nearby store"),
            new Exit("back","northpole.workshopout","go back in the direction of your tree")
          ],
          "North Pole, Alaska"
        ),
        "northpole.fishingstore": new Room(


          "Welcome to <em>Star Fish</em>, the greatest fishing utility shop in North \
          Pole, Alaska. It's oddly space themed.",
          [
            new Exit("out","northpole.alaskasign","head out the door")
          ],
          "Star Fish Fishing Utility Shop"
        ),
        //truenorth
        "truenorth.landing": new Room(


          "This is probably the right North Pole. Granted, your judgement was pretty \
          poor last time, so there's a very real and unfortunate possibility that it's not. \
          In any case, it doesn't look like Santa's Workshop is right here, so \
          you'll have to do some searching.",
          [
            new Exit("fly","space.junction","fly up on your rocket-tree"),
            new Exit("south","truenorth.bearroom","go south. It is mathematically impossible to go in any other direction")
          ],
          "True North Pole Landing"
        ),
        "truenorth.bearroom": new Room(


          "As you walk out into the frozen tundra, you start to feel grateful for \
          your coat.",
          [
            new Exit("north","truenorth.landing","go north to the landing site"),
            new Exit("east","truenorth.oasis","east to a lake"),
            new Exit("west","truenorth.igloo","west to an igloo"),
            new Exit("south",function() {
              if (getRooms()["truenorth.bearroom"].contains("truenorth.polarbear")) {
                IO.output("The polar bear is blocking your way to the south.");
              } else {
                getPlayer().warp("truenorth.workshopout");
              }
            },"south to what looks like Santa's Workshop")
          ],
          "Frozen Tundra"
        ),
        "truenorth.igloo": new Room(


          "The inside of the igloo is surprisingly warm.",
          [
            new Exit("out","truenorth.bearroom","step out of the igloo")
          ],
          "Igloo"
        ),
        "truenorth.oasis": new Room(


          "As it turns out, the north pole *isn't* just a big sheet of ice.",
          [
            new Exit("back","truenorth.bearroom","go back where you came from")
          ],
          "Lake"
        ),
        "truenorth.workshopout": new Room(


          "This is it. Santa's workshop is right here.",
          [
            new Exit("in","truenorth.workshop","go in"),
            new Exit("back","truenorth.bearroom","head back")
          ],
          "Santa's Workshop"
        ),
        "truenorth.workshop": new Room(


          "After all that work, you've made it.",
          [
            new Exit("out","truenorth.workshopout","go out if you want, but I don't see why you would")
          ],
          "Santa Claus"
        ),
        "endroom": new Room(


          "Sure enough, there are presents there for you in the morning--not the \
          least of which is a text adventure game for your computer. Neat!",
          [
          ],
          "THE END"
        ),
      },
      {
        //inventory
        "inventory.coat": new Entity(
          "home.livingroom",
          "a warm winter coat",
          {
            nothing: function() {
              IO.output("Do what with the coat?");
            },
            unequip: function() {
              if (this.parent.isOn) {
                IO.output("It's too cold to do that!");
              } else {
                IO.output("But you're not wearing your coat.")
              }
            },
            use: function() {
              this.equip();
            },
            equip: function() {
              if (this.parent.locations[0] != "Inventory") {
                this.take();
              }
              if (this.parent.isOn) {
                IO.output("You're already wearing your coat!");
              } else {
                IO.output("You put on your coat. You can probably go outside now.");
                this.parent.isOn = true;
              }
            },
            look: function() {
              IO.output("It's a warm winter coat. It's blue, your favorite color.");
            },
            take: function() {
              if (getPlayer().inventoryContains("inventory.coat")) {
                IO.output("I'm afraid I don't understand");
              } else {
                IO.output("You pick up your coat. You can view your inventory items \
                  with the <strong>inventory</strong> command.");
                this.parent.warp("Inventory");
              }
            }
          },
          "coat"
        ),
        //Home
        "home.tree": new Entity(
          "home.livingroom",
          "a heavily ornamented tree",
          {
            nothing: function() {
              IO.output("Do what with the tree?");
            },
            look: function() {
              IO.output("The tree really is quite beautiful. You feel proud of the \
                decorating job you did with the rest of the family. You even got to \
                put up a homemade paper candy cane.");
              IO.output("Hey wait a minute... where's your candy cane?");
            },
            attack: function() {
              IO.output("You summon all of your martial wisdom and engage the tree \
                in an honorable duel.");
              IO.output("Nothing really happens.");
            },
            hang: function() {
              var input = getInput();
              if (getPlayer().inventoryContains("home.redornament")) {
                if (Parser.testForWord(input, "red ornament")) {
                  var red = getInteractables()["home.redornament"];
                  red.warp("Nowhere");
                  this.parent.red = true;
                  IO.output("You hang the <strong>red ornament</strong> on the tree.");
                } else {
                  IO.output("Hang what on the tree?");
                }
              } else if (Parser.testForWord(input, "blue ornament")) {
                if (getPlayer().inventoryContains("home.blueornament")) {
                  var blue = getInteractables()["home.blueornament"];
                  blue.warp("Nowhere");
                  this.parent.blue = true;
                  IO.output("You hang the <strong>blue ornament</strong> on the tree.");
                } else {
                  IO.output("Hang what on the tree?");
                }
              } else {
                IO.output("Hang what on the tree?");
              }
              if (this.parent.red && this.parent.blue) {
                IO.output("A little banner pops up. It says, \"MISSILE-TOE COMMERCIAL \
                  ROCKET--ON STANDBY\". A small <strong>button</strong> appears on \
                  the trunk of the tree.");
                IO.output("<em>If you want to see what's changed, you can \
                  <strong>look</strong> around.</em>");
                getRooms()["home.livingroom"].exits.find(function(exit) {
                  return exit.givenName == "button";
                }).activate();
              }
            }
          },
          "tree"
        ),
        "home.presents": new Entity(
          "home.livingroom",
          "a stack of presents",
          {
            nothing: function() {
              IO.output("Do what with the presents?");
              IO.output("<em>If you want to take a closer look, you can use the \
              <strong>examine</strong> or <strong>look</strong> commands.</em>");
            },
            look: function() {
              IO.output("You search and search, and eventually give up. None of these \
                presents have your name on them.")
            },
            attack: function() {
              IO.output("Why would anyone *attack* presents?");
            }
          },
          "presents"
        ),
        "home.fireplace": new Entity(
          "home.livingroom",
          "a depressingly empty fireplace",
          {
            nothing: function() {
              IO.output("Do what with the fireplace?");
              IO.output("<em>If you want to take a closer look, you can use the \
              <strong>examine</strong> or <strong>look</strong> commands.</em>");
            },
            look: function() {
              if (this.parent.lit) {
                IO.output("The fire is burning now. That's much better.");
              } else {
                IO.output("The fireplace really needs some fire. You should <strong>\
                  light</strong> it; you figure you can probably manage with a \
                  <strong>lighter</strong> and two pieces of tinder.");
              }
            },
            light: function() {
              if (getPlayer().inventoryContains("home.lighter")) {
                if (this.parent.letter && this.parent.book) {
                  IO.output("You get just enough of a spark going to light the fire. As \
                  the flames take hold, you hear a little jingle, kind of like a \
                  computer's startup sound.");
                  var livingroom = getRooms()["home.livingroom"];
                  this.parent.lit = true;
                  this.parent.description = "a roaring fireplace";
                } else {
                  IO.output("You do your best to light the fire, but there's just not \
                    enough material. Try finding something to put in it.");
                }
              } else {
                IO.output("But you don't have a <strong>lighter</strong>!");
              }
            },
            put: function() {
              var input = getInput();
              if (getPlayer().inventoryContains("home.catalog")) {
                if (Parser.testForWord(input, "catalog")) {
                  IO.output("You toss the catalog into the fireplace.");
                  var catalog = getEntities()["home.catalog"];
                  catalog.warp("Nowhere");
                  this.parent.letter = true;
                  return;
                }
              }
              if (getPlayer().inventoryContains("home.book")) {
                if (Parser.testForWord(input, "book")) {
                  IO.output("You toss <em>Celsius 233</em> into the fireplace.");
                  var book = getEntities()["home.book"];
                  book.warp("Nowhere");
                  this.parent.book = true;
                  return;
                }
              }
              IO.output("That probably won't make very good tinder.");
              return;
            }
          },
          "fireplace"
        ),
        "home.elf": new Entity(
          "home.kitchen",
          "an elf on the shelf",
          {
            nothing: function() {
              IO.output("The elf smiles at you and waves.");
            },
            take: function() {
              IO.output("That won't work. Shelf-elves are notoriously elusive.");
            },
            attack: function() {
              IO.output("You do your best to catch the elf, but he's always one step \
                ahead of you.");
            },
            talk: function() {
              IO.output("You ask the elf how you can get to Santa.");
              IO.output("He smiles and mimes eating something.")
            },
            look: function() {
              IO.output("Surely this elf knows how to get to Santa. You should ask \
                him about it.");
            },
            "sugar plum": function() {
              if (getPlayer().inventoryContains("home.sugarplum")) {
                IO.output("He laughs, tosses you a <strong>red ornament</strong>, and \
                  scampers off.");
                var ornament = getEntities()["home.redornament"];
                var sugarplum = getEntities()["home.sugarplum"];
                ornament.warp("Inventory");
                sugarplum.warp("Nowhere");
                this.parent.warp("Nowhere");
              } else {
                IO.output("You don't have a sugar plum!");
              }
            }
          },
          "elf"
        ),
        "home.sugarplum": new Entity(
          "home.readingroom",
          "a delicious sugar plum",
          {
            nothing: function() {
              IO.output("Do what with the sugar plum?");
            },
            take: function() {
              IO.output("You take the sugar plum.");
              this.parent.warp("Inventory");
            },
            eat: function() {
              IO.output("You already brushed your teeth, though. It would taste gross!");
            },
            look: function() {
              IO.output("It's a sugar plum. Normally you'd eat this in a \
                heartbeat, but you've already brushed your teeth.")
            }
          },
          "sugar plum"
        ),
        "home.redornament": new Entity(
          "Nowhere",
          "a shiny red ornament",
          {
            nothing: function() {
              IO.output("Do what with the ornament?");
            },
            hang: function() {
              IO.output("Hang it on what?");
            }
          },
          "red ornament"
        ),
        "home.blueornament": new Entity(
          "home.garage",
          "a dull blue ornament",
          {
            nothing: function() {
              IO.output("Do what with the ornament?");
            },
            take: function() {
              if (this.parent.locations[0] == "Inventory") {
                this.nothing();
              } else {
                IO.output("You take the blue ornament");
                this.parent.warp("Inventory");
              }
            },
            hang: function() {
              IO.output("Hang it on what?");
            }
          },
          "blue ornament"
        ),
        "home.toolbox": new Entity(
          "home.garage",
          "a toolbox",
          {
            nothing: function() {
              IO.output("This toolbox is really quite heavy.");
              IO.output("Maybe you should try opening it.");
            },
            attack: function() {
              IO.output("Well, that's one way to get it open.");
              this.open();
            },
            open: function() {
              if (getPlayer().inventoryContains("home.lighter")) {
                IO.output("You find nothing else worthy of note in the toolbox.")
              } else {
                IO.output("You rifle through the toolbox and find a <strong>lighter</strong>.");
                IO.output("You take the lighter. It might come in handy for the fireplace.");
                var lighter = getEntities()["home.lighter"];
                lighter.warp("Inventory");
              }
            },
            look: function() {
              IO.output("It's a heavy, black-and-orange toolbox.");
            }
          },
          "toolbox"
        ),
        "home.lighter": new Entity(
          "Nowhere",
          "a red and black lighter",
          {
            nothing: function() {
              IO.output("Do what with the lighter?");
            }
          },
          "lighter"
        ),
        "home.catalog": new Entity(
          "Nowhere",
          "a catalog",
          {
            nothing: function() {
              IO.output("Do what with the catalog?");
            },
            look: function() {
              IO.output("It's a catalog for the local toy store. There's not really a \
                whole lot of use for it now that Christmas is here.");
            }
          },
          "catalog"
        ),
        "home.snowdrift": new Entity(
          "home.outside",
          "an enormous snowdrift",
          {
            nothing: function() {
              IO.output("Do what with the snowdrift?");
            },
            attack: function() {
              IO.output("You attack the snowdrift, but all you really succeed in doing \
                is getting snow inside your hood.");
            },
            shovel: function() {
              if (getPlayer().inventoryContains("home.shovel")) {
                IO.output("You clear away the snow, revealing the <strong>mailbox</strong>");
                IO.output("<em>If you want to see what's changed, you can \
                  <strong>look</strong> around.</em>");
                var mailbox = getEntities()["home.mailbox"];
                mailbox.warp("home.outside");
                this.parent.warp("Nowhere");
              } else {
                IO.output("But you don't have a snowshovel!");
              }
            },
            look: function() {
              IO.output("It's a huge snowdrift, left here by the plows.");
            }
          },
          "snowdrift"
        ),
        "home.shovel": new Entity(
          "home.garage",
          "a snowshovel",
          {
            nothing: function() {
              IO.output("Do what with the snowshovel?");
            },
            take: function() {
              IO.output("You take the snowshovel with you.");
              this.parent.warp("Inventory");
            },
            look: function() {
              IO.output("It's a snowshovel. The right edge is slightly chipped.");
            }
          },
          "snowshovel"
        ),
        "home.mailbox": new Entity(
          "Nowhere",
          "the mailbox",
          {
            nothing: function() {
              IO.output("Do what with the mailbox?");
            },
            open: function() {
              if (this.parent.empty) {
                IO.output("You find nothing else worthy of note in the mailbox.");
              } else {
                IO.output("Inside the mailbox, you find a present <strong>catalog</strong>. \
                  Looks flammable.");
                IO.output("You take the catalog with you.");
                var catalog = getEntities()["home.catalog"];
                catalog.warp("Inventory");
                this.parent.empty = true;
              }
            },
            look: function() {
              IO.output("It's your mailbox. Once, one of your neighbors knocked it over \
                accidentally while distributing Christmas cookies. The mail had to \
                be delivered to your door for the next two weeks.");
            }
          },
          "mailbox"
        ),
        "home.book": new Entity(
          "home.readingroom",
          "a book labeled <em>Celsius 233</em>",
          {
            nothing: function() {
              IO.output("Do what with <em>Celsius 233</em>?");
            },
            look: function() {
              IO.output("It's <em>Celsius 233</em>, by Bray Radberry.");
              IO.output("You don't like it much, but the reviews are on fire.");
            },
            take: function() {
              IO.output("You pick up <em>Celsius 233</em>. You would say it's a cool  \
                book, but the cover depicts flames.");
              this.parent.warp("Inventory");
            }
          },
          "book"
        ),
        //northpole
        "northpole.coordinates": new Entity(
          "northpole.alaskasign",
          "a paper with the coordinates of the real north pole",
          {
            nothing: function() {
              IO.output("Do what with the coordinates?");
            },
            look: function() {
              IO.output("Longitude: 0, Latitude: 90");
              IO.output("Knowing this, you should be able to fly to the real north \
                pole now.")
              getRooms()["space.junction"].exits.filter(function(exit) {
                return exit.givenName == "true north";
              }).activate();
            },
            take: function() {
              IO.output("You take the coordinates.");
              this.parent.warp("Inventory");
              this.look();
            }
          },
          "coordinates"
        ),
        "northpole.fishingcashier": new Entity(
          "northpole.fishingstore",
          "a cashier at the counter",
          {
            nothing: function() {
              IO.output("The cashier looks at you quizzically.");
            },
            talk: function() {
              IO.output("Like any 10-year-old would, you ask for free stuff. He asks, \
                \"Do you have a coupon?\"");
            },
            coupon: function() {
              if (getPlayer().inventoryContains("space.coupon")) {
                IO.output("He looks at your coupon and nods his head. \"I see you've \
                been to the ISS. Here's your complimentary fishing pole. \
                If you need any <strong>bait</strong>, just ask one \
                of the cosmonauts. They always have a stock of space crawdad.\"");
                var fishingpole = getEntities()["northpole.fishingpole"];
                var coupon = getEntities()["space.coupon"];
                fishingpole.warp("Inventory");
                coupon.warp("Nowhere");
              } else {
                IO.output("You don't have a coupon!");
              }
            },
            attack: function() {
              IO.output("The cashier bends over to grab something and dodges your strike");
            }
          },
          "cashier"
        ),
        "northpole.fishingpole": new Entity(
          "Nowhere",
          "a blue fishing pole",
          {
            nothing: function() {
              IO.output("Do what with the fishing pole?");
            },
            fish: function() {
              IO.output("Fish in what?");
            }
          },
          "fishing pole"
        ),
        //truenorth
        "truenorth.snowman": new Entity(
          "truenorth.landing",
          "a snowman here",
          {
            nothing: function() {
              IO.output("Do what with the snowman?");
            },
            look: function() {
              IO.output("It's a snowman. It's got coal \
                eyes and a carrot nose--pretty standard fare, if you ask me.");
            },
            talk: function() {
              IO.output("You start a conversation. <em>You can type \
              <strong>goodbye</strong> to end it.");
              getCutscenes()["truenorth.snowman"].gracefullyStart();
            },
            attack: function() {
              IO.output("The snowman tells you to chill out.");
            },
            shovel: function() {
              this.attack();
            }
          },
          "snowman"
        ),
        "truenorth.lake": new Entity(
          "truenorth.oasis",
          "the lake, which remarkably isn't frozen over",
          {
            nothing: function() {
              IO.output("Do what with the lake?");
            },
            fish: function() {
              if (getPlayer().inventoryContains("northpole.fishingpole") && getPlayer().inventoryContains("space.spacecrawdad")) {
                if (getRooms()["Nowhere"].contains("truenorth.hints")) {
                  IO.output("You stick your fishing pole in the water and wait. Before \
                  too long, you get a nibble, and you expertly catch it.");
                  IO.output("You caught a... piece of paper. And it somehow ate your space crawdad. It's \
                  labeled \"ISS SECRET CODE <strong>CLUES</strong>\".");
                  var hints = getEntities()["truenorth.hints"];
                  var crawdad = getEntities()["space.spacecrawdad"];
                  hints.warp("Inventory");
                  crawdad.warp("Nowhere");
                } else {
                  IO.output("Despite your best efforts, you can't seem to catch \
                    anything else.");
                }
              } else {
                IO.output("You need a fishing pole and some bait.");
              }
            }
          },
          "lake"
        ),
        "truenorth.hints": new Entity(
          "Nowhere",
          "ISS SECRET CODE CLUES",
          {
            look: function() {
              IO.output("********************");
              IO.output("CLUE 1: The code consists of the numbers 1 through 8, with no repeats.");
              IO.output("CLUE 2: There is exactly one digit between 4 and 2.");
              IO.output("CLUE 3: The sum of the second and fifth digits is six.");
              IO.output("CLUE 4: The sum of the first and last digits is ten.");
              IO.output("CLUE 5: 6 is either the first digit or the last digit.");
              IO.output("CLUE 6: The product of the fifth and sixth digits is eight.");
              IO.output("CLUE 7: 7 is not next to a multiple of 3.");
            },
            read: function() {
              this.look();
            }
          },
          "CLUES"
        ),
        "truenorth.fish": new Entity(
          "Nowhere",
          "a space fish",
          {
            nothing: function() {
              IO.output("Do what with the space fish?");
            },
            look: function() {
              IO.output("You're no fishing expert, but you're pretty sure this space fish \
                isn't one that you'd find back home. It's remarkably fresh, and it \
                has an antenna. Quite frankly, an antenna in space doesn't seem very \
                practical, but who are you to judge?");
            },
            take: function() {
              if (getPlayer().inventoryContains("truenorth.fish")) {
                IO.output("I'm afraid I don't understand");
              } else {
                IO.output("You take the space fish along with you.");
                this.parent.warp("Inventory");
              }
            },
            eat: function() {
              IO.output("I'm pretty sure they only eat raw space fish in Japan.");
            },
            talk: function() {
              IO.output("The space fish just stares at you, like... well, like a dead fish.");
            },
            attack: function() {
              IO.output("The space fish is too intimidating to attack.");
            }
          },
          "space fish"
        ),
        "truenorth.spacehelmet": new Entity(
          "truenorth.igloo",
          "a space helmet",
          {
            nothing: function() {
              IO.output("Do what with the space helmet?");
            },
            take: function() {
              this.equip();
            },
            equip: function() {
              IO.output("You put the space helmet on. You can probably go to space now.");
              this.parent.warp("Inventory");
              this.parent.on = true;
              getRooms()["space.junction"].exits.find(function(exit) {
                return exit.givenName == "space";
              }).activate();
            },
            look: function() {
              IO.output("It's a black-and-white space helmet, straight out of 1969");
            }
          },
          "space helmet"
        ),
        "truenorth.santaclaus": new Entity(
          "truenorth.workshop",
          "Santa Claus himself",
          {
            nothing: function() {
              IO.output("Santa looks at you quizzically");
            },
            attack: function() {
              IO.output("You do your best to attack Santa. He seems unharmed, likely \
              due to some holiday magic, but he frowns and puts you on next year's \
              naughty list.");
            },
            talk: function() {
              IO.output("********************");
              IO.output("You ask Santa where all your presents went.");
              IO.output("\"You don't have any presents?\" he asks. \"Well that's a concern! I'll \
              go talk to my elves and get this all sorted out. In the meantime, \
              you can go home. Your presents should be there in the morning.\"");
              getPlayer().warp("endroom");
              getRooms()["endroom"].updateDisplay();
            },
            look: function() {
              IO.output("It's Santa Claus, with a full white beard and a jolly red cap.");
            }
          },
          "Santa Claus"
        ),
        //space
        "space.cosmonaut": new Entity(
          "space.station",
          "a cosmonaut",
          {
            nothing: function() {
              IO.output("The cosmonaut just mumbles something in Russian.");
            },
            talk: function() {
              IO.output("You can't understand the cosmonaut. For whatever reason, he \
                gives you a <strong>space crawdad</strong> and mimes a fish swimming \
                with his hand.");
              var crawdad = getEntities()["space.spacecrawdad"];
              crawdad.warp("Inventory");
            },
            look: function() {
              IO.output("It's a Russian cosmonaut. You can tell he's Russian because \
                you can't understand a word he says.");
            },
            bait: function() {
              this.talk();
            }
          },
          "cosmonaut"
        ),
        "space.spacecrawdad": new Entity(
          "Nowhere",
          "a space crawdad",
          {
            nothing: function() {
              IO.output("Do what with the space crawdad?");
            },
            put: function() {
              if (getPlayer().inventoryContains("northpole.fishingpole")) {
                IO.output("You attach the space crawdad to your fishing pole.");
              } else {
                this.nothing();
              }
            },
            eat: function() {
              IO.output("Um... no.");
            },
            look: function() {
              IO.output("The space crawdad is just like a regular crawdad, but it has an \
                antenna. Quite frankly, an antenna in space doesn't seem very \
                practical, but who are you to judge?");
            }
          },
          "space crawdad"
        ),
        "space.coupon": new Entity(
          "space.stationin",
          "a coupon for a fishing pole",
          {
            nothing: function() {
              IO.output("Do what with the coupon?");
            },
            take: function() {
              IO.output("You take the coupon. It says it's for a place called \
              \"Star Fish\".");
              this.parent.warp("Inventory");
            },
            use: function() {
              IO.output("Give the coupon to who?");
            },
            give: function() {
              IO.output("Give the coupon to who?");
            },
            look: function() {
              IO.output("It's a coupton for a fishing pole, redeemable at Star Fish \
              Fishing Utility Shop in North Pole, Alaska.");
            }
          },
          "coupon"
        ),
        "space.sign": new Entity(
          "space.stationin",
          "a sign that says \"Take one\"",
          {
            nothing: function() {
              IO.output("Do what with the sign?");
            },
            take: function() {
              IO.output("That seems annoying to carry.");
              IO.output("<em>Says the person carrying a snowshovel everywhere.</em>");
            },
            attack: function() {
              IO.output("Fortunately for the ISS, it's actually really difficult to \
                attack things when you're floating in space.");
            },
            look: function() {
              IO.output("The sign is old and weathered, but it still clearly says that \
                you're in Alaska.");
            }
          },
          "sign"
        ),
        "space.keypad": new Entity(
          "space.stationback",
          "a keypad with a label above it that says, \"TYPE THE SECRET CODE, WIN A \
          PRIZE!\" Beneath this label is a sticky note that says, \"The clues for \
          today's secret code have been lost. We apologize for the inconvenience.\" \
          That's too bad",
          {
            attack: function() {
              IO.output("Fortunately for the ISS, it's really difficult to attack \
              things in zero-gravity.");
            },
            nothing: function() {
              this.enter();
            },
            enter: function() {
              var input = getInput();
              if (Parser.testForWord(input, "45271836")) {
                IO.output("The keypad's display says, \"That's the code! here is your \
                prize!\"");
                IO.output("A small hatch opens, and a <strong>space fish</strong>, somehow \
                still fresh, floats out into the room. You take it with you.");
                var fish = getEntities()["truenorth.fish"];
                fish.warp("Inventory");
              } else {
                IO.output("The keypad's display says, \"That's not the code! Try again!\"");
              }
            },
            take: function() {
              IO.output("You do your best to dislodge it from the wall, but you can't \
              muster the leverage.");
            }
          },
          "keypad"
        ),
        "truenorth.polarbear": new Entity(
          "truenorth.bearroom",
          "a polar bear in your path",
          {
            nothing: function() {
              IO.output("Do what with the bear?");
            },
            attack: function() {
              lose("As you attack the polar bear, it shifts its head slightly. \
              You accidentally hit its teeth, injuring yourself.");
            },
            fish: function() {
              if (getPlayer().inventoryContains("truenorth.fish")) {
                IO.output("You throw the space fish at the bear, and it lumbers away.");
                var bearroom = getRooms()["truenorth.bearroom"];
                this.parent.warp("Nowhere");
              } else {
                IO.output("You don't have a fish!");
              }
            },
            talk: function() {
              IO.output("You start a conversation. <em>You can type \
              <strong>goodbye</strong> to end it.");
              getCutscenes()["truenorth.polarbear"].gracefullyStart();
            }
          },
          "polar bear"
        )
      },
      function() {
        console.log(getWorld());
        IO.output("It's Christmas day, and you're feeling very excited to get \
         on with it. Unfortunately, you've been told that \"opening presents at \
         3 in the morning is ridiculous\". Well, fine, but that's not going to stop \
         you from waking up early to get a sneak peek. After some fumbling, you \
         manage to find the lightswitch.");
        IO.output("As you look through the presents, you realize with rising \
         horror that none of them are labeled with your name. Pragmatic \
         10-year-old that you are, you decide that this will require a visit to \
         Santa.");
        getRooms()[getPlayer().locations[0]].updateDisplay();
      }
    )
  },
  {
    "truenorth.snowman": new Conversation(
      {
        "hello": "Hi! It's *ice* to meet you! Do you want to be my \
        <strong>friend</strong>? Everybody else is giving me the *cold* shoulder, and \
        I have *snow* idea why!",
        "insult": "I would cry, but my tears are frozen.",
        "friend": "You will be my friend? great! You're a *cool* person!",
        "yes": "You will be my friend? great! You're a *cool* person!",
        "praise": "Thanks!",
        "no": "That's not *cool*...",
        "pun": "I think puns are *cool*!",
        "nothing": "I'm afraid I don't understand! But that's okay!"
      },
    ),
    "truenorth.polarbear": new Conversation(
      {
        "hello": "ROARROARRRRGROWLROAR. (Hello, traveler; I am glad to meet your  \
          acquaintence. Unfortunately, however, I find my mood to be dampened, \
          as I am quite <strong>hungry</strong>.)",
        "hungry": "GROOOOWWLGROWWWLGROWWLLL. (I am hungry enough that the \
          rumblings of my yet-unsatiated stomach are nearly indistinguishable \
          from my true voice. I am sure that this condition would be cured by a \
          <strong>sugar plum</strong>)",
        "sugar plum": "ROARRRYOWWNLLAGROWL (I recognize that I am unlikely to \
          find a sugar plum at the north pole; I will eat a fish instead, if I \
          must.)",
        "insult": "ROOOOOOAOOAOAAAAARRRRR. (That is mean. Fortunately, I am of \
          an even temperment, and I do not take offense to your words.)",
        "praise": "SNARRRRRRRRLGROWLROAR. (I thank you for your compliment, \
          friend.)",
        "nothing": "SNARLROARGROWLLLLROAR (I'm afraid I lack the intellectual \
          capacity to understand your statements.)"
      }
    )
  }
)
//Execution---------------------------------------------------------------------
Setup.setup();
