//Modules
const Setup = (function() {
  var nameSetup = function() {
    var nameDisplay = document.getElementById("roomNameDisplay");
    nameDisplay.addEventListener("webkitAnimationEnd", function(event) {
      nameDisplay.className = "";
    });
    nameDisplay.addEventListener("animationend", function(event) {
      nameDisplay.className = "";
    });
  }
  var inputSetup = function() {
    var inputBox = document.getElementById("inputBox");
    inputBox.onkeydown = function(event) {
      if (event.key == "Enter") {
        IO.enterHandler();
      }
    }
  }
  var imageSetup = function() {
    var imageDisplay = document.getElementById("imageDisplay");
    if (Configuration.useImages) {
      var room = getRooms()[getPlayer().locations[0]];
      Display.updateImageDisplay(room.image);
    } else {
      imageDisplay.style.display = "none";
    }
  }
  var startMainWorld = function() {
    var inputBox = document.getElementById("inputBox");
    inputBox.removeEventListener("click", startMainWorld);
    inputBox.value = "";
    getConfiguration().worlds["main"].start();
  }
  this.objectify = function(array) {
    var object = {};
    for (var i = 0; i < array.length; i++) {
      object[array[i].name ? array[i].name : i] = array[i];
    }
    return object;
  }
  this.addObjectNames = function(object) {
    var keys = Object.keys(object);
    for (var i = 0; i < keys.length; i++) {
      object[keys[i]].name = keys[i];
    }
    return object;
  }
  this.preloadImages = function(images) {
    for (var i = 0; i < images.length; i++) {
      if (typeof images[i] != "undefined" && images[i] != "") {
        new Image().src = images[i];
      }
    }
  }
  this.preloadAudio = function(audio) {
    for (var i = 0; i < audio.length; i++) {
      if (typeof audio[i] != "undefined" && audio[i] != "") {
        new Audio().src = audio[i];
      }
    }
  }
  this.setup = function() {
    document.getElementById("inputBox").addEventListener("click", startMainWorld);
    nameSetup();
    inputSetup();
    imageSetup();
    var worlds = getConfiguration().worlds;
    Object.keys(worlds).forEach(function(key) {
      worlds[key].preload();
    })
  }
  return this;
})();
const IO = (function() {
  this.enterHandler = function() {
    Parser.parseAndExecuteInput(Parser.getInput());
    var room = getRooms()[getPlayer().locations[0]];
    Display.updateImageDisplay(room.image);
    inputBox.value = "";
  }
  this.output = function(str) {
    str = str ? "<p>> " + str + "</p>" : "";
    var outputBox = document.getElementById("outputBox");
    outputBox.innerHTML += str;
    outputBox.scrollTop = outputBox.scrollHeight;
  }
  this.outputUserText = function(str) {
    var re = /<|>/g;
    sanitizedStr = str.replace(re, "");
    sanitizedStr = sanitizedStr ?
     "<span class=\"userText\">" + sanitizedStr + "</span>" : "";
    IO.output(sanitizedStr);
  }
  return this;
})();
const Parser = (function() {
  this.testForWord = function(input, word) {
    input = input.toLowerCase();
    word = word.toLowerCase();
    var synonyms = Parser.getSynonyms(word);
    if (input.includes(word)) {
      return true;
    }
    if (synonyms) {
      for (var i = 0; i < synonyms.length; i++) {
        if (input.includes(synonyms[i])) {
          return true;
        }
      }
    }
    return false;
  }
  this.getSynonyms = function(word) {
    if (word) {
      return Configuration.synonyms[word.toLowerCase()];
    } else {
      return Configuration.synonyms;
    }
  }
  this.addSynonyms = function(word, synonyms) {
    var synonymContainer = Parser.getSynonyms();
    if (typeof synonymContainer[word] == "undefined") {
      synonymContainer[word] = [];
    }
    synonymContainer[word] = synonymContainer[word].concat(synonyms);
  }
  this.getInput = function() {
    var inputBox = document.getElementById("inputBox");
    return inputBox.value;
  }
  var detectEntity = function(input, entities) {
    entities = Array.isArray(entities) ? entities : Object.values(entities);
    for (var i = 0; i < entities.length; i++) {
      var entity = entities[i];
      if (Parser.testForWord(input, entity.givenName)) {
        return entity;
      }
    }
    return getPlayer();
  }
  var detectAction = function(input, subject) {
    var methodKeys = Object.keys(subject.methods);
    for (var i = 0; i < methodKeys.length; i++) {
      var key = methodKeys[i];
      if(Parser.testForWord(input, key)) {
        if (key == "parent") {
          return "nothing";
        } else {
          return key;
        }
      }
    }
    return "nothing";
  }
  var parseInput = function(input) {
    var location = getPlayer().locations[0];
    var entities = getRooms()[location].localize(getInteractables());
    var subject = detectEntity(input, entities);
    if (subject == getPlayer()) {
      entities = getRooms()["Inventory"].localize(getInteractables());
      subject = detectEntity(input, entities);
    }
    var action = detectAction(input, subject);
    return [subject, action];
  }
  this.parseAndExecuteInput = function(input) {
    var parsedInput = parseInput(input);
    var subject = parsedInput[0];
    var action = parsedInput[1];
    IO.outputUserText(input);
    subject.methods[action]();
    if (subject.advanceTurn != false) {
      getWorld().nextTurn();
    }
  }
  return this;
})();
const Display = (function() {
  this.updateImageDisplay = function(image) {
    var imageDisplay = document.getElementById("imageDisplay");
    image = typeof image == "undefined" || image == "" ? imageDisplay.src
     : image;
    imageDisplay.src = image;
  }
  this.updateNameDisplay = function(str) {
    var nameDisplay = document.getElementById("roomNameDisplay");
    str = str ? str : nameDisplay.innerHTML
    nameDisplay.innerHTML = str;
    nameDisplay.className = "emphasizeName";
  }
  this.manageListGrammar = function(elements, delimiter) {
    var description = "";
    for (var i = 0; i < elements.length; i++) {
      if (i > 0 && elements.length > 2) {
        description += ", ";
      }
      if (i >= elements.length - 1 && elements.length > 1) {
        description += " " + delimiter + " ";
      }
      description += elements[i];
    }
    return description;
  }
  this.embolden = function(string, substr) {
    return this.addTag("strong", string, substr);
  }
  this.colorize = function(color, string, substr) {
    return this.addTag("span style=\"color: " + color + "\"", string, substr);
  }
  this.addTag = function(tagtext, string, substr) {
    if (substr[0].length > 1) {
      for (var i = 0; i < substr.length; i++) {
        this.addTag(substr[i]);
      }
    } else {
      substr = new RegExp(typeof substr == "undefined" || substr == "" ?
        string : substr, "i");
      return string.replace(substr, function(str) {
        return "<" + tagtext + ">" + str + "</" + tagtext + ">";
      });
    }
  }
  return this;
})();
//Object Constructors
const AudioChannel = function(HTMLProperties) {
  var HTMLAudio = document.createElement("audio");
  Object.entries(HTMLProperties).forEach(function(keyValuePair) {
    HTMLAudio[keyValuePair[0]] = keyValuePair[1];
  })
  var queue = [];
  var inProgress = false;
  var update = function() {
    var nextInQueue = queue.pop();
    if (nextInQueue) {
      new Promise(nextInQueue).then(update);
    } else {
      inProgress = false;
    }
  }
  var handleQueue = function() {
    if (inProgress) {
      return;
    } else {
      inProgress = true;
      update();
    }
  }
  this.play = function(sound) {
    sound = sound || HTMLAudio.src;
    queue.unshift(function(resolve, reject) {
    	if (HTMLAudio.src != sound) {
      	HTMLAudio.src = sound;
      }
      HTMLAudio.play().then(resolve);
    })
    handleQueue();
  }
  this.pause = function() {
    queue.unshift(function(resolve, reject) {
      HTMLAudio.pause();
      resolve();
    })
    handleQueue();
  }
  this.fade = function(target, interval, sound) {
    interval = interval || 40;
    this.play(sound);
    queue.unshift(function(resolve, reject) {
    	var fadeLoop = setInterval(function() {
      	HTMLAudio.volume += HTMLAudio.volume < target
        	? HTMLAudio.volume <= 0.99
          ? 0.01
          : 0.0
          : HTMLAudio.volume >= 0.01
          ? -0.01
          : 0.0;
      	if (Math.abs(HTMLAudio.volume - target) <= 0.01)  {
        	HTMLAudio.volume = target;
          clearInterval(fadeLoop);
        	resolve();
      	}
      }, 40);
    })
    handleQueue();
  }
  this.setVolume = function(volume) {
    queue.unshift(function(resolve, reject) {
      HTMLAudio.volume = volume < 0.0
        ? 0.0
        : volume > 1.0
        ? 1.0
        : volume;
      resolve();
    })
  }
  this.setCurrentTime = function(time) {
    queue.unshift(function(resolve, reject) {
      HTMLAudio.currentTime = time;
      resolve();
    })
  }
  return this;
}
const GameConfiguration = function(globals, synonyms, worlds, cutscenes,
 audioChannels) {
  this.globals = Object.assign({
    useImages: false
  }, globals);
  this.synonyms = synonyms;
  this.worlds = Object.keys(worlds).length > 0 ? worlds : {main: worlds};
  this.worldstack = [];
  this.cutscenes = cutscenes;
  this.getWorld = function(index) {
    index = index > -1 ? index : this.worldstack.length - 1;
    return this.worldstack[index];
  }
  this.getCutscenes = function() {
    return this.cutscenes;
  }
  this.type = "GameWorld";
  this.audioChannels = audioChannels;
  return this;
}
const GameWorld = function(player, rooms, entities, init, endLogic) {
  rooms = Object.assign(rooms, {
    "Inventory": new Room(
      "This is an inventory.",
      [],
      "Inventory"
    ),
    "Conversing": new Room(
      "",
      [],
      ""
    ),
    "Nowhere": new Room(
      "",
      [],
      ""
    )});
  this.player = player;
  this.rooms = Setup.addObjectNames(rooms);
  this.entities = Setup.addObjectNames(entities);
  this.init = init ? init : function() {};
  this.endLogic = endLogic ? endLogic : function() {};
  this.nextTurn = function() {
    var interactables = Object.values(getInteractables());
    interactables = interactables.filter(function(element) {
      return element.locations[0] != "Nowhere";
    });
    for (var i = 0; i < interactables.length; i++) {
      interactables[i].age += 1;
      if (interactables[i].turn) {
        interactables[i].turn();
      }
    }
  }
  this.preload = function() {
    Setup.preloadImages(this.getRoomImages());
    Setup.preloadAudio(this.getRoomAudio());
  }
  this.start = function(action) {
    action = action ? action : () => {};
    if (typeof getConfiguration() != "undefined") {
      getConfiguration().worldstack.push(this);
      this.init();
      action();
    } else {
      throw "Cannot start world when Configuration has not been initialized."
    }
  }
  this.end = function(action) {
    action = action ? action : () => {};
    if (getConfiguration().getWorld() == this) {
      getConfiguration().worldstack.pop();
      this.endLogic();
      action();
    } else {
      throw "Cannot end inactive world.";
    }
  }
  this.register = function(object) {
    object = typeof object == "string" ?
      (() => {
        var position = getConfiguration().worldstack.indexOf(this);
        var oldWorld = getConfiguration().getWorld(position - 1);
        return oldWorld.getAllObjects()[object];
      })() : object;
    if (!object) {
      throw "Cannot register nonexistent object with a GameWorld."
    }
    var collections = {
      "PlayerEntity": this.players,
      "Entity": this.entities,
      "Obstruction": this.obstructions,
      "Room": this.rooms
    }
    collections[object.type][object.name] = object;
  }
  this.getRoomImages = function() {
    var rooms = this.getRooms();
    var images = [];
    for (var i = 0; i < rooms.length; i++) {
      images.push(rooms[i].image);
    }
    return images;
  }
  this.getRoomAudio = function() {
    var rooms = this.getRooms();
    var audio = [];
    for (var i = 0; i < rooms.length; i++) {
      audio.push(rooms[i].music);
    }
    return audio;
  }
  this.getPlayer = function() {
    return this.player;
  }
  this.getRooms = function() {
    return this.rooms;
  }
  this.getCutscenes = function() {
    return this.conversations;
  }
  this.getInteractables = function() {
    var interactables = Object.assign({}, this.getEntities());
    interactables[getPlayer().name] = getPlayer();
    return interactables;
  }
  this.getEntities = function() {
    return this.entities;
  }
  this.getAllObjects = function() {
    return this.getInteractables().concat(getObstructions(), getRooms());
  }
  return this;
}
const PlayerEntity = function(location, methods, turn) {
  Object.assign(this, new Interactable(location, methods, "player", turn));
  this.name = "player";
  this.methods = Object.assign(this.methods, {
    nothing: function() {
      var exits = getRooms()[this.parent.locations[0]].getActiveExits();
      exits = Object.values(exits);
      for (var i = 0; i < exits.length; i++) {
        if (Parser.getInput().toLowerCase()
         == exits[i].givenName.toLowerCase()) {
          this.move();
          return;
        }
      }
      IO.output("I'm afraid I don't understand.");
    },
    inventory: function() {
      var inventory = getRooms()["Inventory"];
      var entities = Object.values(inventory.localize(getEntities()));
      if (entities.length > 0) {
        var description = inventory.describeEntities();
        IO.output("You have " + inventory.describeEntities());
      } else {
        IO.output("You have nothing.");
      }
    },
    move: function() {
      this.parent.moveByInput(Parser.getInput());
      getWorld().nextTurn();
    },
    look: function() {
      getRooms()[this.parent.locations[0]].updateDisplay();
    },
    help: function() {
      var keys = Object.keys(this.parent.methods).filter(function(key) {
        return (key !== "nothing" && key !== "parent");
      });
      var description = "Recognized commands include " +
       Display.manageListGrammar(keys, "and");
      for (var i in keys) {
        description = Display.embolden(description, keys[i]);
      }
      description += ". Other context-sensitive commands may also be \
      available.";
      IO.output(description);
    },
    wait: function() {
      IO.output("You wait around for a moment.");
      getWorld().nextTurn();
    }
  }, methods);
  this.advanceTurn = false;
  this.methods.parent = this;
  this.inventoryContains = function(name) {
    return getRooms()["Inventory"].contains(name);
  }
  this.moveByInput = function(input) {
    var direction = getRooms()[this.locations[0]].testForExits(input);
    if (direction) {
      getPlayer().move(direction);
    } else {
      IO.output("You can't go that way.");
    }
  }
  this.lose = function(message, undoMessage) {
    new Conversation(
      {
        "message": message ? message : "You have lost.",
        "nothing": Display.embolden(undoMessage ? undoMessage :
          "You can type undo to try again.", "undo"),
        "undo": () => {
          getWorld().end();
        }
      },
      function() {
        Display.updateNameDisplay("You Lose");
        IO.output(undoMessage);
      }
    ).start();
  }
  this.turn = turn;
  this.type = "PlayerEntity";
  return this;
}
const Room = function(description, exits, givenName, image, music) {
  this.name = "uninitialized";
  this.image = image ? image : "";
  this.music = music ? music : "";
  this.description = description;
  this.exits = exits;
  this.givenName = givenName;
  this.updateDisplay = function() {
    Display.updateNameDisplay(this.givenName);
    IO.output(this.buildCompleteDescription());
  }
  this.buildCompleteDescription = function() {
    var entities = Object.values(this.localize(getEntities()));
    var exits = this.getActiveExits();
    var description = "";
    description += this.description;
    if (entities.length > 0) {
      description += " You see " + this.describeEntities();
    }
    if (exits.length > 0) {
      description += this.describeExits();
    }
    return description;
  }
  this.localize = function(interactables) {
    interactableArray = Array.isArray(interactables) ? interactables :
     Object.values(interactables);
    return Setup.objectify(interactableArray.filter((element) => {
      return element.locations[0] == this.name;
    }));
  }
  this.describeEntities = function() {
    var descriptionArray = [];
    var entities = Object.values(this.localize(getEntities()));
    for (var i = 0; i < entities.length; i++) {
      var entity = entities[i];
      var entityDescription =
       Display.embolden(entity.description, entity.givenName);
      descriptionArray.push(entityDescription);
    }
    return Display.manageListGrammar(descriptionArray, "and") + ".";
  }
  this.describeExits = function() {
    var description = "";
    var exits = this.getActiveExits();
    exits[0].introduction = exits[0].introduction ? exits[0].introduction
     : "You can";
    var descriptionArray = [];
    for (var i = 0; i < exits.length; i++) {
      if (exits[i].introduction) {
        description += (descriptionArray.length > 0 ?
         Display.manageListGrammar(descriptionArray, "or") + "." : "")
         + " " + exits[i].introduction + " ";
        descriptionArray = [];
      }
      descriptionArray.push(Display.embolden(exits[i].description,
       exits[i].givenName));
    }
    return description +
     Display.manageListGrammar(descriptionArray, "or") + ".";
  }
  this.getExits = function() {
    return this.exits;
  }
  this.getActiveExits = function() {
    return this.exits.filter(function(exit) {
      return exit.active;
    });
  }
  this.testForExits = function(input) {
    var exits = this.getActiveExits();
    for (var i = 0; i < exits.length; i++) {
      var exit = exits[i];
      if (Parser.testForWord(input, exit.givenName)) {
        return exit.givenName;
      }
    }
    return false;
  }
  this.contains = function(name) {
    return this.localize(getInteractables())[name] ? true : false;
  }
  this.type = "Room";
  return this;
}
const Entity = function(location, description, methods, givenName, turn) {
  Object.assign(this, new Interactable(location, methods, givenName,
     turn));
  this.methods = Object.assign( {
    nothing: function() {
      IO.output("Do what with the " + givenName + "?");
    },
    look: function() {
      IO.output("It's " + description + ".");
    },
    attack: function() {
      IO.output("I don't think that's wise.");
    }
  }, this.methods);
  this.description = description;
  this.type = "Entity";
  return this;
}
const Conversation = function(topics, init, endLogic) {
  Object.assign(this, new Interactable("Nowhere", {}, "", function() {}),
    new Wrapping(), new Conversational(init, endLogic), new Topical(topics));
  this.type = "Conversation";
  return this;
}
const Sequence = function(array) {
  Object.assign(array, new Wrapping());
  array.advance = function() {
    array.position += 1;
    if (array[array.position]) {
      array[array.position]();
    } else {
      getWorld().end();
      array.position = -1;
    }
  }
  array.setPosition = function(position) {
    array.position = position - 1;
  }
  for (var i = 0; i < array.length; i++) {
    array[i] = array.wrap(array[i]);
  }
  array.position = -1;
  array.parent = null;
  array.type = "Sequence"
  return array;
}
const Monolog = function(sequence, init, endLogic) {
  Object.assign(this, new Conversational(init, endLogic),
   new Interactable(name, "Nowhere", {}, "", function() {}));
  this.methods = {
    nothing: function() {
      this.parent.sequence.advance();
    },
    goodbye: function() {
      this.nothing();
    }
  }
  this.methods.parent = this;
  this.sequence = sequence.advance ? new Sequence(sequence) : sequence;
  this.type = "Monolog"
  return this;
}
const Exit = function(givenName, take, description, active, introduction) {
  this.givenName = givenName;
  this.take = typeof take == "string" ? function(entity) {
    entity.warp(take);
    getRooms()[getPlayer().locations[0]].updateDisplay();
  } : take;
  this.description = description;
  this.active = active == false ? false : true;
  this.activate = function() {
    this.active = true;
  }
  this.deactivate = function() {
    this.active = false;
  }
  this.introduction = introduction ? introduction : "";
  this.type = "Exit";
  return this;
}
//Components
const Interactable = function(location, methods, givenName, turn) {
  Object.assign(this, new Moving(location));
  this.name = "uninitialized";
  this.methods = methods;
  this.methods.parent = this;
  this.givenName = givenName;
  this.turn = turn ? turn : function() {};
  this.age = 0;
  this.advanceTurn = true;
  this.type = "Interactable";
  return this;
}
const Moving = function(location) {
  this.locations = [location, "", "", "", ""];
  Object.seal(this.locations);
  this.warp = function(roomName) {
    if (roomName == this.locations[0]) {
      return;
    } else {
      for (i = this.locations.length - 1; i > 0; i--) {
        this.locations[i] = this.locations[i - 1];
      }
      this.locations[0] = roomName;
    }
  }
  this.inverseWarp = function() {
    var presentLocation = this.locations[0];
    for (i = 0; i < this.locations.length - 1; i++) {
      this.locations[i] = this.locations[i + 1];
    }
    this.locations[this.locations.length - 1] = presentLocation;
  }
  this.move = function(direction) {
    getRooms()[this.locations[0]].getActiveExits().find(function(exit) {
      return exit.givenName == direction;
    }).take(this);
  }
  return this;
}
const Wrapping = function() {
  this.wrap = (obj) => {
    switch(typeof obj) {
      case "string":
        return this.wrapString(obj);
        break;
      default:
        return obj;
    }
  }
  this.wrapString = function(string) {
    return function() {
      IO.output(string);
    }
  }
  return this;
}
const Conversational = function(init, endLogic) {
  this.start = function() {
    new GameWorld(
      new PlayerEntity("Nowhere", {}, () => {}),
      {},
      {"conversation": this},
      {},
      init ? init :
        () => {
          IO.output("**********");
          this.methods[Object.keys(this.methods)[0]]();
        },
      endLogic ? endLogic :
        () => {
          IO.output("**********");
          getRooms()[getPlayer().locations[0]].updateDisplay();
        }
    ).start();
  }
  this.gracefullyStart = function() {
    this.start();
  }
  return this;
}
const Topical = function(topics) {
  Object.assign(this, new Wrapping());
  this.addTopic = function(key, paragraph) {
    if (typeof paragraph == "string") {
      paragraph = this.wrap(paragraph);
    }
    this.methods[key] = paragraph;
  }
  this.methods = {};
  var keys = Object.keys(topics);
  for (var i = 0; i < keys.length; i++) {
    this.addTopic(keys[i], topics[keys[i]]);
  }
  return this;
}
//Context Accessors
function getConfiguration() {
  return Configuration;
}
function getAudioChannels() {
  return getConfiguration().audioChannels;
}
function getPlayer() {
  return getWorld().getPlayer();
}
function getRooms() {
  return getWorld().getRooms();
}
function getCutscenes() {
  return getConfiguration().getCutscenes();
}
function getWorld() {
  var worldstack = getConfiguration().worldstack;
  return worldstack[worldstack.length - 1];
}
function getInteractables() {
  return getWorld().getInteractables();
}
function getEntities() {
  return getWorld().getEntities();
}
