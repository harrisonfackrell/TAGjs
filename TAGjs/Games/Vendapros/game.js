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
    move: ["move","go","walk","run","step","fly","head"],
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
    inventory: ["inventory","item"]
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
        new Exit("north","spaceport.venadapros","go north to the \
        <em>Venadapros</em>, the spaceliner you'll be flying on")
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
    new Currency("spaceport.atmcoli","spaceport.atmroom",
      {},
      "coli",
      15
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
      )
  ]),
  new NamedArray([/*Obstructions*/
    new Obstruction("spaceport.noticket","spaceport.ticketdesk",
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
      [
        new Exit("north","spaceport.venadapros","security won't let you go \
        north without a ticket")
      ],
      "security"
      )
  ]),
  new NamedArray([/*Interceptors*/]),
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
      false,
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
            this.setPosition(1);
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
          if (deposit > playerColi.balance) {
            IO.output("You don't have enough coli on-hand to complete this \
            transaction");
          } else {
            playerColi.debit(deposit);
            atmColi.credit(deposit);
          }
          this.setPosition(6);
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
          if (withdrawal > atmColi.balance) {
            IO.output("You don't have enough coli in your account to complete \
            this transaction");
          } else {
            atmColi.debit(withdrawal);
            playerColi.credit(withdrawal);
          }
          this.setPosition(6);
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
      true,
      false
    ),
    new Monolog("buymeal",
      [
        function() {
          var meal = getEntities().findByName("spaceport.meal");
          if (meal.location == "Inventory") {
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
              getEntities().findByName("inventory.coli").debit(5);
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
      false,
      false
    ),
    new Monolog("security",
      [
        "\"Move along, citizen.\"",
        "\"And enjoy your day.\"",
        "\"You have nothing to worry about when spaceport security is on the \
        job.\""
      ],
      false,
      false
      )
  ]),
  function() {
    Display.updateNameDisplay("The Venadapros Incident");
    getConversations().findByName("opening").gracefullyStart();
  }
);
//Execution---------------------------------------------------------------------
Setup.setup();
