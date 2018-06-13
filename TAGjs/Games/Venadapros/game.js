//Extensions--------------------------------------------------------------------
const Currency = function(name, location, methods, givenName, balance, turn) {
  Object.assign(this, new Entity(name, location, "", methods, givenName, turn));

  this.redescribe = function() {
    this.description = this.balance + " " + this.givenName;
  }
  this.credit = function(balance) {
    this.balance += balance;
    this.redescribe();
  }
  this.debit = function(balance) {
    this.balance -= balance;
    this.redescribe();
  }

  this.balance = balance > 0 ? balance : 0;

  this.redescribe();
  this.methods.parent = this;
  return this;
}
//Globals-----------------------------------------------------------------------
var Configuration = {
  synonyms: {
    look: ["look","examine"],
    attack: ["attack","kick","punch","fight","destroy","crush","break","smash","kill","bite"],
    move: ["move","go","walk","run","step","fly","knock","open","enter"],
    throw: ["throw","toss"],
    use: ["use"],
    open: ["open","search","check"],
    close: ["close","shut"],
    talk: ["talk","ask","say","shout","speak","yell"],
    take: ["take","pick up","steal","get","keep"],
    unequip: ["unequip","take off"],
    equip: ["equip","put on","wear"],
    insult: ["stupid","dumb","idiot","hate","awful"],
    praise: ["cool","awesome","nerd"],
    inventory: ["inventory","item"],
    "space suit": ["suit"],
    wash: ["wash","clean"],
    faucet: ["faucet","wash","clean"],
    microwave: ["microwave","cook"],
    bed: ["bed","sleep"]
  },
  useImages: false,
  useMusicControls: false,
  useSoundControls: false
}
var World = new GameWorld(
  new PlayerEntity("spaceport.lobby",
    {

    },
    function() {  }
  ),
  new NamedArray([/*Rooms*/
    new Room("spaceport.lobby",
      "The lobby is, oddly, both bustling with activity and drained of energy. \
      Hundreds of strangers brush by you, most of them appearing extremely \
      tired.",
      [
        new Exit("north","spaceport.ticketdesk","go north to ticket services"),
        new Exit("east","spaceport.foodcourt","east to the food court")
      ],
      "Portunus Spaceport - Lobby"
    ),
    new Room("spaceport.ticketdesk",
      "There are five ticket distributors within immediate range.",
      [
        new Exit("south","spaceport.lobby","go south, back to the lobby,"),
        new Exit("north", function(entity) {
          if (getRooms().findByName("Inventory").contains("spaceport.ticket")) {
            entity.warp("spaceport.venadapros");
          } else {
            IO.output("You try to go north, but security stops you. \"You need \
            a <strong>ticket</strong>,\" they say.")
          }
        },"go north to the <em>Venadapros</em>, the spaceliner you'll be \
        flying on")
      ],
      "Portunus Spaceport - Ticket Services"
    ),
    new Room("spaceport.foodcourt",
      "The people in the food court seem a little more relaxed and a little \
      more alert than the people in the lobby.",
      [
        new Exit("west","spaceport.lobby","go west, back to the lobby"),
        new Exit("north", function() {
          getConversations().findByName("buymeal").gracefullyStart();
        }, "north to the Space-Fried Yenian Grill"),
        new Exit("east", function() {
          getConversations().findByName("buymeal").gracefullyStart();
        }, "east to Cuttania Dairy")

      ],
      "Portunus Spaceport - Food Court"
    ),
    new Room("spaceport.venadapros",
      "You're outside the <em>Venadapros</em>. It looks like you've spent \
      enough time strolling about that the flight is about to start.",
      [
        new Exit("south","spaceport.ticketdesk","go south to ticket services"),
        new Exit("on","venadapros.deck","get on the ship when \
         you're ready to leave")
      ],
      "Portunus Spaceport - Venadapros Exterior"
    ),
    new Room("venadapros.deck",
      "The <em>Venadapros</em> is a mid-class spaceliner. It's not the \
      pinnacle of luxury, but it's not the shabbiest ship, either. The floor \
      is lined with a nice, though notably synthetic, carpet, and the walls \
      are fully finished.",
      [],
      "Venadapros Interior"
    ),
    new Room("venadapros.302",
      "Your room is cozy, but it's still a personal room. It's certainly much \
      nicer than the cheaper communal quarters.",
      [
        new Exit("west", function() {
          if (getRooms().findByName("Inventory").contains("venadapros.suit")) {
            getPlayer().warp("venadapros.302.restroom");
          } else {
            getPlayer().lose("You step into the restroom and hear a click. \
             It's an airlock, but you don't know that--you're dead.");
          }
        }, "go west to your restroom"),
        new Exit("north","venadapros.302.kitchen","go north to your kitchen"),
        new Exit("east","venadapros.hallway","walk east, out into the hallway")
      ],
      "The Venadapros - Room 302"
    ),
    new Room("venadapros.302.kitchen",
      "Your room is equipped with a personal kitchen, which is more than you \
      can say for most budget spaceliners.",
      [
        new Exit("south","venadapros.302","go south")
      ],
      "The Venadapros - Room 302 - Kitchen"
    ),
    new Room("venadapros.302.restroom",
      "Every time you enter the bathroom, an airlock clicks, and all of the air is \
      violently sucked out through a hole in the wall. You're okay because of \
      your space suit, but you can't help but wonder who designed this. Is it \
      a trap? Is this standard fare for all rooms on the <em>Venadapros</em>?",
      [
        new Exit("east","venadapros.302","go east")
      ],
      "The Venadapros - Room 302 - Restroom"
    ),
    new Room("venadapros.hallway",
      "The hallway is filled with an out-of-place, rotten smell. As you look \
      towards the end of the hallway, you suddenly find the source.",
      [
        new Exit("west","venadapros.302","go west, back to your room"),
        new Exit("300", function() {
          IO.output("You burst into the room, and find a Roman Spartan. He \
           yells, shoves a <strong>spear</strong> and a <strong>shield</strong> \
           into your hands, and literally kicks you out the door.");
          getEntities().findByName("venadapros.spear").warp("Inventory");
          getEntities().findByName("venadapros.shield").warp("Inventory");
        },"in to room 300"),
        new Exit("301", function() {
          getPlayer().lose("You burst into the room, and are disintegrated by \
           the rays of a surprised group of aliens.");
        },"in to room 301")
      ],
      "The Venadapros - Hallway"
    ),
    new Room("demoend",
      "You have reached the end of the demo. The full game is coming soon, so \
      stay tuned!",
      [],
      "The End... For Now!"
      )
  ]),
  new NamedArray([/*Entities*/
    new Currency("inventory.coli","Inventory",
      {
        look: function() {
          this.parent.redescribe();
          IO.output("It's your coli pouch. At the moment, you have " +
          this.parent.description + ".");
        }
      },
      "coli",
      0
    ),
    new Currency("spaceport.atmcoli","spaceport.atmroom",
      {},
      "coli",
      15
    ),
    new Entity("spaceport.atm","spaceport.lobby",
      "an ATM machine next to the wall",
      {
        "attack": function() {
          getPlayer().lose("You attack the ATM machine, causing yourself minor \
          injury. Your efforts do little to harm the machine, but they do \
          summon security. They drag you to an improvised holding cell, and \
          you miss your flight. The fine they give you is \
          none-too-conservative, either.");
        },
        "use": function() {
          getConversations().findByName("atminteraction").gracefullyStart();
        }
      },
      "ATM"
    ),
    new Entity("spaceport.meal","Nowhere",
      "a bland-looking meal",
      {
        look: function() {
          IO.output("It's a meal in a brown, paper bag. Imprinted on the bag \
          are the words \"Famously Generic Meal\". ");
          IO.output("Unfortunately, the meal seems to be frozen.");
        },
        eat: function() {
          IO.output("You open the bag, ready to eat, only to find that the \
          contents are inexplicably frozen.");
        }
      },
      "meal"
    ),
    new Entity("spaceport.security","spaceport.ticketdesk",
      "a group of officers constituting spaceport security",
      {
        attack: function() {
          getPlayer().lose("You attack the highly-trained spaceport security. \
          Surprise is on your side, and you get a single strike in--but then \
          you're stopped in your tracks by a stun gun. Security drags you to \
          an improvised holding cell, and you miss your flight. The fine they \
          give you is none-too-conservative, either.");
        },
        look: function() {
          IO.output("Spaceport security is armed with the latest in non-lethal \
          weaponry and personal defenses. They've been keeping spaceports safe \
          for as long as anyone can remember.");
        },
        talk: function() {
          getConversations().findByName("security").gracefullyStart();
        }
      },
      "security"
    ),
    new Entity("spaceport.ticket","Nowhere",
      "a ticket for a flight on the Venadapros",
      {
        look: function() {
          IO.output("The Venadapros ticket is printed on a metallic, silver \
           paper. It says, \"Your room number is 302.\"");
        }
      },
      "ticket"
    ),
    new Entity("spaceport.ticketattendant","spaceport.ticketdesk",
      "one available ticket attendant",
      {
        talk: function() {
          getConversations().findByName("ticketdesk").gracefullyStart();
        }
      },
      "attendant"
    ),
    new Entity("venadapros.flightattendant","venadapros.deck",
      "a uniformed man",
      {
        talk: function() {
          getConversations().findByName("flightattendant").gracefullyStart();
        }
      },
      "man"
    ),
    new Entity("venadapros.roomkey","Nowhere",
      "your room key",
      {
        look: function() {
          IO.output("It's the key for <em>Venadapros</em> room 302. Like your \
           ticket, it's silvery in appearance.");
        }
      },
      "room key"
    ),
    new Entity("venadapros.drunk","venadapros.hallway",
      "a drunken, unkempt man, who has surprisingly evaded Security",
      {
        talk: function() {
          getConversations().findByName("drunk").gracefullyStart();
        }
      },
      "man"
    ),
    new Entity("venadapros.spear","Nowhere",
      "a spear",
      {},
      "spear"
    ),
    new Entity("venadapros.shield","Nowhere",
      "a shield",
      {},
      "shield"
    ),
    new Entity("venadapros.window","venadapros.302",
      "a large window",
      {
        look: function() {
          IO.output("You look out into the deep abyss of space. It never fails \
           to unsettle you when you consider just how <em>large</em> the \
           universe is.");
        }
      },
      "window"
    ),
    new Entity("venadapros.bed","venadapros.302",
      "a soft bed",
      {
        look: function() {
          IO.output("It's a plush, twin-size bed with a black blanket.");
        },
        use: function() {
          getConversations().findByName("sleep").gracefullyStart();
        },
        sleep: function() {
          this.use();
        }
      },
      "bed"
    ),
    new Entity("venadapros.caffeine","Nowhere",
      "a pouch of caffeine",
      {
        look: function() {
          IO.output("The caffeine has had the words \"space drugs\" scrawled \
           on it by an unpracticed hand.");
        },
        eat: function() {
          getPlayer().lose("You eat the caffeine. As it turns out, that much \
           caffeine is <em>really</em> unhealthy.");
        }
      },
      "caffeine"
    ),
    new Entity("venadapros.suit","venadapros.302",
      "a space suit",
      {
        look: function() {
          IO.output("It's a space suit. It looks to be about your size.");
        },
        take: function() {
          IO.output("You take the space suit and put it on.");
          this.parent.warp("Inventory");
        },
        equip: function() {
          this.take();
        }
      },
      "space suit"
    ),
    new Entity("venadapros.toilet","venadapros.302.restroom",
      "a toilet",
      {
        use: function() {
          IO.output("No. Compromising the seal on the space suit would kill you.");
        },
        look: function() {
          IO.output("You find a shiny, yet dirty, <strong>thing</strong> near \
           the base of the toilet. You take it with you; it's likely been \
           sterilized by the airlock.");
          getEntities().findByName("venadapros.thing").warp("Inventory");
        }
      },
      "toilet"
    ),
    new Entity("venadapros.thing","Nowhere",
      "a shiny, dirty thing",
      {
        wash: function() {
          IO.output("You should find a faucet");
        }
      },
      "thing"
    ),
    new Entity("venadapros.faucet","venadapros.302.restroom",
      "a faucet",
      {
        use: function() {
          var thing = getEntities().findByName("venadapros.thing");
          if (getRooms().findByName("Inventory").contains("venadapros.thing")) {
            IO.output("You wash off your dirty <strong>thing</strong>, \
             discovering that it is in fact a pile of ten coli.");
            getEntities().findByName("inventory.coli").credit(10);
            getEntities().findByName("venadapros.thing").warp("Nowhere");
          } else {
            IO.output("You try to wash your hands, but then you realize that \
             you are wearing a space suit.");
          }
        },
        wash: function() {
          this.use();
        }
      },
      "faucet"
    ),
    new Entity("venadapros.microwave","venadapros.302.kitchen",
      "a microwave",
      {
        look: function() {
          IO.output("The microwave has a label on it that says, \"Famously \
           Generic Microwave\".");
        },
        use: function() {
          var frozenMeal = getEntities().findByName("spaceport.meal");
          if (frozenMeal.locations[0] == "Inventory") {
            IO.output("You cook your Famously Generic Meal.");
            frozenMeal.warp("Nowhere");
            getEntities().findByName("venadapros.cookedmeal").warp("Inventory");
          } else {
            IO.output("But you have nothing to cook!");
          }
        },
        cook: function() {
          this.use();
        },
        meal: function() {
          this.use();
        }
      },
      "microwave"
    ),
    new Entity("venadapros.cookedmeal","Nowhere",
      "a cooked meal",
      {
        eat: function() {
          IO.output("You're not quite hungry yet. It may be best to save this \
           meal for later.");
        }
      },
      "meal"
    )
  ]),
  new NamedArray([/*Obstructions*/]),
  new NamedArray([/*Conversations*/
    new Monolog("opening",
      [
        "<em>BEEP</em>. The intercom ineloquently crackles as its operator \
        prepares to make an announcement.",
        "\"You're flying Portunus Spacelines,\" the operator drawls. He sounds \
        like he's trying to be enthusiastic, but his voice falls flat. He's \
        clearly just as bored as the patrons are, waiting for their flights.",
        "\"Here at Portunus, we are dedicated to our customers and their \
        satisfaction. Thank you for choosing our affordable flights.",
        "\"Unfortunately, Venadapros flight 1345 has been delayed . . .\" The \
        operator has more to say, but nobody is listening. You hear a \
        collective groan rise through the crowd.",
        "You yourself, however, are secretly glad for the slowdown. You were \
        running late, and this happening makes up for the fact."
      ],
      false
    ),
    new Monolog("atminteraction",
      [
        function() {
          var atmColi = getEntities().findByName("spaceport.atmcoli");
          IO.output("Welcome, Thomas T. Sidus. You have " + atmColi.balance +
           " coli in your account. Do you want to <strong>deposit</strong> or \
           <strong>withdraw</strong> coli?");
        },
        function() {
          if (Parser.testForWord(getInput(), "deposit")) {
            this.setPosition(2);
          } else if (Parser.testForWord(getInput(), "withdraw")) {
            this.setPosition(4);
          } else {
            IO.output("That is not a valid option. Please try again.");
            this.setPosition(0);
          }
          this.advance();
        },
        function() {
          var playerColi = getEntities().findByName("inventory.coli");
          IO.output("You have " + playerColi.description + " on-hand. How much \
          would you like to deposit?");
        },
        function() {
          var playerColi = getEntities().findByName("inventory.coli");
          var atmColi = getEntities().findByName("spaceport.atmcoli");
          var deposit = parseInt(getInput());
          if (deposit > playerColi.balance || isNaN(deposit)) {
            IO.output("Your input is invalid. Either you don't have enough \
            coli on-hand to complete this transaction, or the value you \
            entered was outside the domain of accepted inputs.");
            this.setPosition(2);
          } else {
            playerColi.debit(deposit);
            atmColi.credit(deposit);
            this.setPosition(6);
          }
          this.advance();
        },
        function() {
          var atmColi = getEntities().findByName("spaceport.atmcoli");
          IO.output("You have " + atmColi.description + " in your account. \
          How much would you like to withdraw?");
        },
        function() {
          var playerColi = getEntities().findByName("inventory.coli");
          var atmColi = getEntities().findByName("spaceport.atmcoli");
          var withdrawal = parseInt(getInput());
          if (withdrawal > atmColi.balance || isNaN(withdrawal)) {
            IO.output("Your input is invalid. Either you don't have enough \
            coli in your account to complete this transaction, or the value you \
            entered was outside the domain of accepted inputs.");
            this.setPosition(4);
          } else {
            atmColi.debit(withdrawal);
            playerColi.credit(withdrawal);
            this.setPosition(6);
          }
          this.advance();
        },
        function() {
          var playerColi = getEntities().findByName("inventory.coli");
          var atmColi = getEntities().findByName("spaceport.atmcoli");
          IO.output("You now have " + playerColi.description + " on-hand and " +
          atmColi.description + " in your account. You can see your on-hand \
          coli with the <em>Inventory</em> command. Press <em>Enter</em> to close \
          this dialogue.");
        }
      ],
      false
    ),
    new Monolog("buymeal",
      [
        function() {
          if (getRooms().findByName("Inventory").contains("spaceport.meal")) {
            IO.output("You begin talking to the cashier. He says, \"I'm sorry, \
            but we are fresh out of our famously generic meals. Come back \
            another time!\"");
            this.setPosition(2);
            this.advance();
          } else {
            IO.output("You begin talking to the cashier. He says, \"Hi! Would \
            you like to buy one of our famously generic meals? It's only 5 \
            coli!\"(Y/N)");
          }
        },
        function() {
          if (Parser.testForWord(getInput(), "Y")) {
            var playerColi = getEntities().findByName("inventory.coli");
            if (playerColi.balance >= 5) {
              IO.output("You hand over five coli, and the cahsier gives you a \
              brown bag. \"Remember, you can check your items with the \
              <em>inventory</em> command.\"");
              getEntities().findByName("spaceport.meal").warp("Inventory");
              playerColi.debit(5);
            } else {
              IO.output("\"I'm sorry,\" the cashier says, \"you don't seem to \
              have enough coli. If you need to get some, there's an ATM \
              machine in the lobby.\"");
            }
          } else {
            IO.output("The cashier says, \"Come back later if you change your \
            mind.\"");
          }
        },
        function() {
          IO.output("With that, the cashier waves you away.");
        }
      ],
      false
    ),
    new Monolog("security",
      [
        "\"Move along, citizen.\"",
        "\"And enjoy your day.\"",
        "\"You have nothing to worry about when spaceport security is on the \
        job.\""
      ],
      false
    ),
    new Monolog("ticketdesk",
      [
        function() {
          var ticket = getEntities().findByName("spaceport.ticket");
          if (ticket.location == "Inventory") {
            IO.output("You approach the ticket attendant. She says, \"I'm sorry, \
             but we don't have any flight available. Come back another time!\"");
            this.setPosition(2);
            this.advance();
          } else {
            IO.output("You approach the ticket attendant. \"Hello,\" she says, \"Welcome to \
             ticket services. The only flight we have available is Venadapros \
             flight 1345. Do you want to buy a ticket for 10 coli?\"(Y/N)");
          }
        },
        function() {
          if (Parser.testForWord(getInput(), "Y")) {
            var playerColi = getEntities().findByName("inventory.coli");
            if (playerColi.balance >= 10) {
              IO.output("You hand over ten coli, and the attendant gives you a \
               silver <strong>ticket</strong>. \"Your room number is \
               <strong>302</strong>. Don't forget it. If you need a reminder, \
               you can <strong>examine</strong> the ticket, or any item in \
               your inventory.\"");
              getEntities().findByName("spaceport.ticket").warp("Inventory");
              getEntities().findByName("inventory.coli").debit(10);
            } else {
              IO.output("\"I'm sorry,\" the attendant says, \"you don't seem to \
               have enough coli. If you need to get some, there's an ATM \
               machine in the lobby.\"");
            }
          } else {
            IO.output("The attendant says, \"Come back later if you change your \
             mind.\"");
          }
        },
        "The attendant turns her attention to another customer."
      ],
      false
    ),
    new Monolog("flightattendant",
      [
        "You approach the uniformed man. \"Hello sir!\" he says. \"I will be \
        your flight attendant on the <em>Venadapros</em> today.\"",
        "\"Allow me to check you in to your room. Tell me, what is your \
        appointed room number?\"",
        function() {
          if (parseInt(getInput())) {
            if (Parser.testForWord(getInput(), "302")) {
              IO.output("\"I see that matches your ticket,\" the \
               flight attendant says. \"Here is a <strong>room key</strong>; \
               please follow me to your quarters.\"");
              getEntities().findByName("venadapros.roomkey").warp("Inventory");
              this.setPosition(this.length - 1);
            } else {
              IO.output("\"Can't read the deliberately-shiny paper, huh?\" The \
               attendant mumbles something into a walkie-talkie.");
            }
          } else {
            IO.output("\"I'm sorry, I didn't catch that. What is your room \
             number?\"");
            this.setPosition(2);
          }
        },
        function() {
          getPlayer().lose("Two security agents burst into the room. \"He's \
           the robot imposter!\" the flight attendant yells, pointing at you. \
           \"Get him!\" You try to explain that no, you are not a robot \
           imposter, but Security doesn't seem to care. You spend the rest of \
           the day in an improvised detention cell.", "You have lost. You can \
           type undo to try again.");
        },
        function() {
          getPlayer().warp("venadapros.302");
          this.advance();
        }
      ]
    ),
    new Conversation("drunk",
      {
        "nothing": function() {
          IO.output("You approach the man. \"You haad better...\" he slurs. \" \
           Unless you have any... any <strong>coli</strong>... you had better \
           get OFF MY SLEEPING QUARTERS.\"");
          IO.output("Do you comply with his request?(Y/N)");
        },
        "n": function() {
          getPlayer().lose("\"You... YOU!\" The man's yell is punctuated with \
           a swing of a broken glass bottle. You have been stabbed, and you \
           find yourself in the med bay for the forseeable future.");
        },
        "y": function() {
          this.goodbye();
        },
        "coli": function() {
          IO.output("You pull out your coli, and instantly, the man's \
          composition changes. Before you can object, the man swipes your \
          coli.");
          var playerColi = getEntities().findByName("inventory.coli");
          if (playerColi.balance >= 2) {
            IO.output("He takes two of them, and gives you your pouch back. He \
             also tosses you another pouch labeled \"<strong>Caffeine</strong> \
             (space drugs)\"");
            playerColi.debit(2);
            getEntities().findByName("venadapros.caffeine").warp("Inventory");
          } else {
            IO.output("He growls and says, \"Not enough...\" Surprisingly, he \
             tosses your pouch back to you.");
          }
          this.goodbye();
        }
      }
    ),
    new Monolog("sleep",
      [
        "Are you sure you've done everything you want to do before you go to \
        sleep?(Y/N)",
        function() {
          if (Parser.testForWord(getInput(), "Y")) {
            getPlayer().warp("demoend");
          }
          this.parent.gracefullyEnd();
        }
      ]
    )
  ]),
  function() {
    Display.updateNameDisplay("The Venadapros Incident");
    getConversations().findByName("opening").gracefullyStart();
  }
);
//Execution---------------------------------------------------------------------
Setup.setup();
