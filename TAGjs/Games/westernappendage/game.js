//Globals-----------------------------------------------------------------------
var Configuration = new GameConfiguration(
  {/*worlds*/
    main: new GameWorld(
      new PlayerEntity("driedgulch",{}),
      {/*rooms*/
        "driedgulch": new Room(
          "You are am standing the on empty plains for dried gulch. The ground \
          is cracked and dried, the and sunset is beautiful.",
          [
            new Exit("west","westerntown","west to Western Town")
          ],
          "Dried Gulch",
          "images/driedgulch.jpg",
          "music/trapezoid.ogg"
        ),
        "westerntown": new Room(
          "You are're the on main plaza for western town, that historic \
          site settled the by pioneers on 1847",
          [
            new Exit("east","driedgulch","east to Dried Gulch"),
            new Exit("west","saloon","west to the livestock saloon"),
            new Exit("north","military","north to the military"),
            new Exit("south","science","south to the science center")
          ],
          "Western Town",
          "images/westerntown.jpg",
          "music/trapezoid.ogg"
        ),
        "saloon": new Room(
          "You are're the on west livestock saloon. Everyone the for people \
          this place seem tough.",
          [
            new Exit("east","westerntown","east, out to town"),
            new Exit("west","kitchen","west, into the kitchen")
          ],
          "West Livestock Saloon",
          "images/saloon.jpg",
          "music/trapezoid.ogg"
        ),
        "kitchen": new Room(
          "That the is saloon kitchen.  It ran by cows.",
          [
            new Exit("east","saloon","east to the saloon")
          ],
          "West Livestock Kitchen",
          "images/kitchen.jpg",
          "music/trapezoid.ogg"
        ),
        "military": new Room(
          "That the is base the for west entire military. The military is \
          very empower.",
          [
            new Exit("south","westerntown","south to Western Town plaza"),
            new Exit("north","commander","north to the commander's house"),
            new Exit("west","flags","west in to a tent")
          ],
          "Base the For West Entire Military",
          "images/military.jpg",
          "music/march2.ogg"
        ),
        "commander": new Room(
          "The commander place is very small.  You are a with able to hardly \
          breath due to it is then cramped.",
          [
            new Exit("south","military","south, out the door")
          ],
          "The Commander Place",
          "images/commander.png",
          "music/march2.ogg"
        ),
        "flags": new Room(
          "This is where you can find all of the flags for the entire military \
          of the west.",
          [
            new Exit("east","military","east, out the tent flap")
          ],
          "The house taking that lot for flags",
          "images/flags.jpg",
          "music/march2.ogg"
        ),
        "science": new Room(
          "You are standing in the center for science for the entire west.",
          [
            new Exit("north","westerntown","north, out the door"),
            new Exit("west","redroom","west to the room of red")
          ],
          "center of science the of entire west",
          "images/science.jpg",
          "music/ZombiesAreComing.ogg"
        ),
        "redroom": new Room(
          "You have found the room of red.",
          [
            new Exit("east","science","east, out the door")
          ],
          "Room of red",
          "images/redroom.jpg",
          "music/ZombiesAreComing.ogg"
        )
      },
      {/*entities*/
        "westernappendage": new Entity("driedgulch",
          "The Western Appendage",
          {
            attack: function() {
              if (getPlayer().inventoryContains("nuke")) {
                this.nuke();
              } else if (getPlayer().inventoryContains("kalashnikov")) {
                this.kalashnikov();
              } else if (getPlayer().inventoryContains("pistol")) {
                this.pistol();
              } else {
                IO.output("You are a cannot the harmfully western appendage \
                unless you are a take one thing more empower");
              }
            },
            pistol: function() {
              if (getPlayer().inventoryContains("pistol")) {
                IO.output("You are a the shot western appendage taking yours \
                pistol");
                if (getEntities()["smalltreasure"].locations[0] != "Nowhere") {
                  IO.output("Yours shots will nothing")
                } else {
                  IO.output(Display.embolden("The western appendage drops that \
                  bite for <strong>small treasure</strong>, which you are a to take",
                  "small treasure"));
                  getEntities()["smalltreasure"].warp("Inventory");
                  this.parent.sprites["wounded"].render(1);
                  getAudioChannels()["sound"].play("sound/gun.ogg");
                }
              } else {
                this.nothing();
              }
            },
            kalashnikov: function() {
              if (getPlayer().inventoryContains("kalashnikov")) {
                IO.output("You are a the shot western appendage taking yours \
                kalashnikov");
                if (getEntities()["largetreasure"].locations[0] != "Nowhere") {
                  IO.output("Yours shots will nothing")
                } else {
                  IO.output(Display.embolden("The western appendage drops that \
                  bite for <strong>large treasure</strong>, which you are a to take",
                  "large treasure"));
                  getEntities()["largetreasure"].warp("Inventory");
                  this.parent.sprites["wounded"].render(1);
                  getAudioChannels()["sound"].play("sound/gun.ogg");
                }
              } else {
                this.nothing();
              }
            },
            nuke: function() {
              if (getPlayer().inventoryContains("nuke")) {
                getCutscenes()["ending"].start();
              } else {
                this.nothing();
              }
            }
          },
          "Western Appendage",
          {
            "world": new ImageChannel({
              "src": "images/westernappendage.png"
            }, {
              "z-index": "1",
              "top": "8%",
              "left": "35%",
              "height": "60%",
              "width": "30%",
              "display": "none"
            }),
            "wounded": new ImageChannel({
              "src": "images/bullet.png"
            }, {
              "z-index": "2",
              "top": "8%",
              "left": "35%",
              "height": "60%",
              "width": "30%",
              "display": "none"
            })
          }
        ),
        "pistol": new Entity("Nowhere",
          "a pistol",
          {},
          "pistol"
        ),
        "kalashnikov": new Entity("Nowhere",
          "a automatic Russion kalashnikov rifle",
          {},
          "kalashnikov"
        ),
        "nuke": new Entity("Nowhere",
          "a nuclear nuke",
          {},
          "nuke"
        ),
        "smalltreasure": new Entity("Nowhere",
          "a small treasure",
          {},
          "small treasure"
        ),
        "largetreasure": new Entity("Nowhere",
          "a large treasure",
          {},
          "large treasure"
        ),
        "food": new Entity("Nowhere",
          "food",
          {
            eat: function() {
              IO.output("You are am don't hungry enough to the eaten feed");
            }
          },
          "food"
        ),
        "chefcow": new Entity("kitchen",
          "the best chefcow",
          {
            talk: function() {
              IO.output("The chefcow gives you <strong>food</strong>.");
              IO.output("You take the food");
              getEntities()["food"].warp("Inventory");
            },
            attack: function() {
              IO.output("The chefcow becomes <strong>food</strong>.");
              IO.output("You take the food");
              getEntities()["food"].warp("Inventory");
              this.parent.warp("Nowhere");
              this.parent.sprites["world"].derender();
              this.parent.sprites["wounded"].render();
              getAudioChannels()["sound"].play("sound/cowdeath.ogg");
            }
          },
          "chefcow",
          {
            "world": new ImageChannel({
              "src": "images/chefcow.png"
            }, {
              "z-index": "1",
              "bottom": "4%",
              "left": "35%",
              "height": "60%",
              "width": "30%",
              "display": "none"
            }),
            "wounded": new ImageChannel({
              "src": "images/beef.png"
            }, {
              "z-index": "2",
              "bottom": "8%",
              "left": "35%",
              "height": "60%",
              "width": "30%",
              "display": "none"
            })
          }
        ),
        "mustachedman": new Entity("saloon",
          "that mans taking that mustache",
          {
            attack: function() {
              IO.output("The mans taking that mustache is a invincibrue");
            },
            talk: function() {
              IO.output("Brought my <strong>redden flag</strong> and \
              <strong>small treasure</strong>.  Myself given you are a \
              <strong>kalashnikov</strong>");
              if (getPlayer().inventoryContains("redflag") && getPlayer().inventoryContains("smalltreasure")) {
                IO.output(Display.embolden("The wordlessly, mans takes yours redden flag and \
                yours small treasure.  Himself gives you are a that \
                kalashnikov", ["redden flag", "small treasure", "kalashnikov"]));
                getEntities()["redflag"].warp("Nowhere");
                getEntities()["smalltreasure"].warp("Nowhere");
                getEntities()["kalashnikov"].warp("Inventory");
              }
            },
            flag: function() {
              this.talk();
            },
            treasure: function() {
              this.talk();
            }
          },
          "mans"
        ),
        "flag": new Entity("Nowhere",
          "a flag",
          {},
          "flag"
        ),
        "redflag": new Entity("Nowhere",
          "a redden flag",
          {},
          "flag"
        ),
        "flagpile": new Entity("flags",
          "a pile of blue flags",
          {
            attack: function() {
              IO.output("You are a cannot possibly destruction everyone for \
              these flags")
            },
            nothing: function() {
              IO.output("You have acquired a <strong>flag</strong>");
              getEntities()["flag"].warp("Inventory");
            }
          },
          "flags"
        ),
        "redmachine": new Entity("redroom",
          "that machine this creates things redness",
          {
            flag: function() {
              if (getPlayer().inventoryContains("flag")) {
                IO.output("Yours flag is currently redness");
                getEntities()["flag"].warp("Nowhere");
                getEntities()["redflag"].warp("Inventory");
              }
            },
            attack: function() {
              IO.output("You are am currently redden");
            },
            nothing: function() {
              IO.output("Used to what item the taking machine?");
            }
          },
          "machine"
        ),
        "commander": new Entity("commander",
          "The commander of the entire military of the west",
          {
            talk: function() {
              IO.output("Myself would do given you are a \
              <strong>pistol</strong> conditionally to you are a given me \
              <strong>food</strong>");
              if (getPlayer().inventoryContains("food")) {
                IO.output("The wordlessly, commander takes yours feed and \
                gives you are a that <strong>pistol</strong>");
                getEntities()["food"].warp("Nowhere");
                getEntities()["pistol"].warp("Inventory");
              }
            },
            food: function() {
              this.talk();
            },
            attack: function() {
              IO.output("The commander is invincibrue");
            }
          },
          "commander"
        ),
        "oppenheimer": new Entity("science",
          "nuclear Robert Oppenheimer",
          {
            attack: function() {
              IO.output("Robert oppenheimer is invincibrue");
            },
            talk: function() {
              IO.output("Given my that more than treasure, and myself would do \
              let you are a solved that puzzle.  The solved puzzle, and myself \
              would do given you are a that <strong>nuke</strong>");
              if (getPlayer().inventoryContains("largetreasure")) {
                IO.output("Robert oppenheimer takes yours more than treasure \
                and lets you are a solved that puzzle");
                getCutscenes()["puzzle"].start();
              }
            }
          },
          "Robert Oppenheimer"
          )
      },
      function() {/*init*/
        IO.output("The western appendage is steal yours treasure! have it \
        backward!");
        getAudioChannels()["music"].play("music/trapezoid.ogg");
        getConfiguration().globals.defaultRoomTransition();
      },
      function() {/*endLogic*/}
    )
  },
  {/*synonyms*/
    look: ["look","examine"],
    attack: ["attack","kick","punch","fight","destroy","crush","break","smash","kill","bite","shoot"],
    move: ["move","go","walk","run","step","fly","head","press"],
    throw: ["throw","toss"],
    use: ["use"],
    open: ["open","search","check"],
    close: ["close","shut"],
    talk: ["talk","ask","say","shout","speak"],
    take: ["take","pick up","steal","get","keep"],
    unequip: ["unequip","take off"],
    equip: ["equip","put on","wear"],
    mans: ["man"],
    flags: ["flag"],
    "robert oppenheimer": ["robert", "oppenheimer"],
    chefcow: ["chef","cow"],
    "western appendage": ["appendage"]
  },
  {/*cutscenes*/
    "puzzle": new Conversation({
      "what": function() {
        IO.output("If 3x = 3x = 3x = 3, what is x?");
      },
      "goodbye": function() {
        IO.output("no");
      },
      "nothing": function() {
        IO.output("no");
      },
      "3": function() {
        IO.output("Yes! take yours <strong>nuke</strong>");
        getWorld().end();
      }
    }, () => {
      IO.output("**********");
      IO.output("If 3x = 3x = 3x = 3, what is x?");
    }, function() {
      IO.output("**********");
      getEntities()["nuke"].warp("Inventory");
      getRooms()[getPlayer().locations[0]].updateDisplay();
    }),
    "ending": new Monolog([
      function() {
        Display.updateNameDisplay("Oblivion");
        getImageChannels()["background"].setSrc("images/ending.jpg");
        getAudioChannels()["music"].pause();
        var appendage = getEntities()["westernappendage"];
        for (i in appendage.sprites) {
          appendage.sprites[i].derender();
        }
        IO.output("And in one stroke, you are the destroyer of worlds.");
      },
      "You go down in history as a terrible, violent, self-interested man.",
      "The events of today are remembered as one of the world's \
      great tragedies by generations to come.",
      "The last thing you see, before the cleansing fire consumes you and the \
      entire west, is the inscription on the final piece of treasure:",
      "Hence nothing remains,",
      "except",
      "for our",
      "regrets.",
      "-Martin Georis",
      function() {
        Display.updateNameDisplay("You Defeated!");
        getImageChannels()["background"].setSrc("images/celebration.jpg");
        getAudioChannels()["music"].setProperties({"loop": false});
        getAudioChannels()["music"].play("music/fanfare.ogg");
        IO.output("Congratulations! you are a take the complete game! \
        <a href=https://www.humblebundle.com/gift?key=FzCEsPWXvUf4PnfV> \
        this place is yours reward. </a>");
        IO.inputBox.disabled = true;
      }
    ])
  },
  {
    unrecognizedCommandMessage: "Myself'm afraid myself no understood"
  },
)
//Execution---------------------------------------------------------------------
Setup.setup();
