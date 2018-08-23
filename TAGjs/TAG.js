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
    //Finds the inputBox and assigns the necessary handler to it.
    var inputBox = document.getElementById("inputBox");
    inputBox.onkeydown = function(event) {IO.listenForKey(event, "Enter",
    IO.enterHandler);};
    inputBox.focus();
  }
  var imageSetup = function() {
    //Finds the imageDisplay and configures it according to useImages
    var imageDisplay = document.getElementById("imageDisplay");
    //If useImages is true

    if (Configuration.useImages) {
      //Update it.
      var room = getRooms()[getPlayer().locations[0]];
      Display.updateImageDisplay(room.image);
    } else {
      //If not make the imageDisplay disappear.
      imageDisplay.style.display = "none";
    }
  }
  var audioSetup = function() {
    //Sets up the audio buttons.

    //Find the Buttons
    var musicButton = document.getElementById("musicButton");
    var soundButton = document.getElementById("soundButton");
    //Apply handlers to them.
    musicButton.onclick = function() {Sound.toggleElement("music");};
    soundButton.onclick = function() {Sound.toggleElement("sound");};
    //If USE_SOUND is true
    if (getConfiguration().globals.useMusicControls == false) {
      var musicControls = document.getElementById("musicControls");
      musicControls.style.display = "none";
    }
    if (getConfiguration().globals.useSoundControls == false) {
      var soundControls = document.getElementById("soundControls");
      soundControls.style.display = "none";
    }
  }
  this.objectify = function(array) {
    var object = {};
    for (var i = 0; i < array.length; i++) {
      object[array[i].name ? array[i].name : i] = array[i];
    }
    return object;
  }
  this.preloadImages = function(images) {
    //Preloads images.
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
    //Runs necessary setup functions.
    nameSetup();
    inputSetup();
    imageSetup();
    audioSetup();

    var movies = getCutscenes();
    for (var i = 0; i < movies.length; i++) {
      if (typeof movies[i].preload != "undefined") {
        movies[i].preload();
      }
    }
    var worlds = getConfiguration().worlds;
    Object.keys(worlds).forEach(function(key) {
      worlds[key].preload();
    })
    worlds["main"].start();
  }
  return this;
})();
const IO = (function() {
  this.enterHandler = function() {
    //Enter handler for the input box that sets instruction execution into motion.
    //Parse and execute input
    Parser.parseAndExecuteInput(Parser.getInput());
    //Update the image display to that of the player's locations[0]
    var room = getRooms()[getPlayer().locations[0]];
    Display.updateImageDisplay(room.image);
    //Blank the input box.
    inputBox.value = "";
  }
  this.output = function(str) {
    //outputs a string to the output box.

    str = str ? "<p>> " + str + "</p>" : "";
    var outputBox = document.getElementById("outputBox");
    outputBox.innerHTML += str;
    outputBox.scrollTop = outputBox.scrollHeight;
  }
  this.outputUserText = function(str) {
    //Sanitizes text and applies a span with the class "userText" before
    //outputting its string.

    var re = /<|>/g;
    sanitizedStr = str.replace(re, "");
    sanitizedStr = sanitizedStr ?
     "<span class=\"userText\">" + sanitizedStr + "</span>" : "";
    IO.output(sanitizedStr);
  }
  this.listenForKey = function(e, key, callback) {
    //Listens for a key. "e" is an event. This function is intended to be used as
    //a keydown handler for an element.

    if (e.key == key) {
      callback();
    }
  }
  return this;
})();
const Parser = (function() {
  this.testForWord = function(input, word) {
    //Returns true if the given input contains the given word or one of its
    //synonyms, defined in game.js. Case insensitive.
    //Convert both the input and the word to lowercase
    input = input.toLowerCase();
    word = word.toLowerCase();
    //Get synonyms
    var synonyms = Parser.getSynonyms(word);
    //If the input includes the word
    if (input.includes(word)) {
      return true;
    }
    //If there are synonyms
    if (synonyms) {
      //Iterate through them.
      for (var i = 0; i < synonyms.length; i++) {
        if (input.includes(synonyms[i])) {
          return true;
        }
      }
    }
    //If we've made it to here, the input does not contain the word.
    return false;
  }
  this.getSynonyms = function(word) {
    //Returns the synonyms of a word, as defined in game.js.
    if (word) {
      return Configuration.synonyms[word.toLowerCase()];
    } else {
      return Configuration.synonyms;
    }
  }
  this.addSynonyms = function(word, synonyms) {
    //Adds an array of synonyms to the synonyms object.
    var synonymContainer = Parser.getSynonyms();
    if (typeof synonymContainer[word] == "undefined") {
      synonymContainer[word] = [];
    }
    synonymContainer[word] = synonymContainer[word].concat(synonyms);
  }
  this.getInput = function() {
    //Returns the current input. Useful in entity methods.
    var inputBox = document.getElementById("inputBox");
    return inputBox.value;
  }
  var detectEntity = function(input, entities) {
    //Returns the first entity referenced by the input that is contained in
    //"entities". This is according to the order of the entities array, not the
    //input itself. If no entity is found, it returns the player.
    entities = Array.isArray(entities) ? entities : Object.values(entities);
    //Iterate through the entites
    for (var i = 0; i < entities.length; i++) {
      var entity = entities[i];
      //If the input contains the entity's name (or a synonym)
      if (Parser.testForWord(input, entity.givenName)) {
        //Return it.
        return entity;
      }
    }
    //If nothing is referenced, return the player.
    return getPlayer();
  }
  var detectAction = function(input, subject) {
    //Tests the input for an action attached to the given "subject" entity.

    //Get the keys for the subject's methods
    var methodKeys = Object.keys(subject.methods);
    //Iterate through these keys
    for (var i = 0; i < methodKeys.length; i++) {
      var key = methodKeys[i];
      //If the input contains the key (or a synonym)
      if(Parser.testForWord(input, key)) {
        //Make sure the key is not "parent" - the parent property of the
        //subject.methods object is not a function.
        if (key == "parent") {
          return "nothing";
        } else {
          //As long as it's not "parent", return the key.
          return key;
        }
      }
    }
    //If nothing matches, return "nothing".
    return "nothing";
  }
  var parseInput = function(input) {
    //Parses input, returning a subject entity and an action attached to that
    //entity.

    //Get the interactable entities here.
    var location = getPlayer().locations[0];
    var entities = getRooms()[location].localize(getInteractables());
    //Find the subject.
    var subject = detectEntity(input, entities);
    //If it's the player (default for finding none)
    if (subject == getPlayer()) {
      //Try again with inventory items.
      entities = getRooms()["Inventory"].localize(getInteractables());
      subject = detectEntity(input, entities);
    }
    //Find an action
    var action = detectAction(input, subject);
    //Return parsed input.
    return [subject, action];
  }
  this.parseAndExecuteInput = function(input) {
    //Parses and executes input, with a few additional effects depending on
    //advanceTurn.

    //Parse the input.
    var parsedInput = parseInput(input);
    var subject = parsedInput[0];
    var action = parsedInput[1];
    IO.outputUserText(input);
    subject.methods[action]();
    //Unless the subject's advanceTurn is false
    if (subject.advanceTurn != false) {
      getWorld().nextTurn();
    }
    //Execute the input.
  }
  return this;
})();
const Display = (function() {
  this.updateImageDisplay = function(image) {
    //Updates the image display.

    var imageDisplay = document.getElementById("imageDisplay");
    image = typeof image == "undefined" || image == "" ? imageDisplay.src : image;
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
    //Bolds a substring within a string. Actually just a special call of addTag.
    return this.addTag("strong", string, substr);
  }
  this.colorize = function(color, string, substr) {
    return this.addTag("span style=\"color: " + color + "\"", string, substr);
  }
  this.addTag = function(tagtext, string, substr) {
    //Replaces every instance of a substring within a string with an identical
    //copy surrounded by HTML tags with the given tagtext. If no string is
    //provided, it simply surrounds the string with tags.

    //If substr is an array of strings, perform this method for each
    //individually.
    if (substr[0].length > 1) {
      for (var i = 0; i < substr.length; i++) {
        this.addTag(substr[i]);
      }
    } else {
      //Convert the substr to a regex; if it's empty, make a regex out of string.
      substr = new RegExp(typeof substr == "undefined" || substr == "" ?
        string : substr, "i");
      //Use string.replace to add tags around the substring.
      return string.replace(substr, function(str) {
        return "<" + tagtext + ">" + str + "</" + tagtext + ">";
      });
    }
  }
  return this;
})();
const Sound = (function() {
  this.toggleElement = function(elementName) {
    //Toggles the given sound Button

    //Get the music Button
    var musicButton = document.getElementById(elementName + "Button");
    //If they're muted
    if (musicButton.muted) {
      //unmute them
      musicButton.muted = false;
      musicButton.src = "../../Sound.png";
      var music = document.getElementById(elementName);
      music.volume = 1;
    //otherwise
    } else {
      //mute them
      musicButton.muted = true;
      musicButton.src = "../../Muted.png";
      var music = document.getElementById(elementName);
      music.volume = 0;
    }
  }
  this.changeMusic = function(song) {
    //Changes the currently playing song

    //Get the music player
    var music = document.getElementById("music");
    var currentSong = music.currentSong;
    //If its current song matches the song we want
    if (song == currentSong) {
      //don't interrupt it
      return;
    //Otherwise
    } else {
      //Change the song
      music.src = song;
      music.currentSong = song;
    }
  }
  this.playEffect = function(sound) {
    //Plays a sound effect
    var soundPlayer = document.getElementById("sound");
    soundPlayer.src = sound;
    soundPlayer.play();
  }
  return this;
})();
//Classes
const Interactable = function(name, location, methods, givenName, turn) {
  Object.assign(this, new Moving(name, location));

  this.methods = methods;
  this.methods.parent = this;

  this.givenName = givenName;

  this.turn = turn ? turn : function() {};

  this.age = 0;

  this.advanceTurn = true;
  this.type = "Interactable";
  return this;
}
const Entity = function(name, location, description, methods, givenName, turn) {
  Object.assign(this, new Interactable(name, location, methods, givenName,
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
const PlayerEntity = function(location, methods, turn) {
  Object.assign(this, new Interactable("player", location, methods, "player",
   turn));
  this.methods = Object.assign(this.methods, {
    nothing: function() {
      var exits = getRooms()[this.parent.locations[0]].getExits();
      exits = Object.values(exits);
      for (var i = 0; i < exits.length; i++) {
        if (Parser.getInput().toLowerCase() == exits[i].name.toLowerCase()) {
          this.move();
          return;
        }
      }
      IO.output("I'm afraid I don't understand.");
    },
    inventory: function() {
      var inventory = getRooms()["Inventory"];
      var entities = inventory.localize(getEntities());
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
    //Tests for an entity with a given name in the "Inventory" location. This is
    return getRooms()["Inventory"].contains(name);
  }
  this.moveByInput = function(input) {
    //Moves the player according to their input.
    var oldLocation = this.locations[0];

    var direction = getRooms()[this.locations[0]].testForExits(input);
    if (direction) {
      getPlayer().move(direction);
    } else {
      IO.output("You can't go that way.");
    }

    if (oldLocation != this.locations[0]) {
      getRooms()[this.locations[0]].updateDisplay();
    }
  }
  this.lose = function(message, undoMessage) {
    new Conversation("Lose",
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
const Obstruction = function(name, location, exits, additive) {
  Object.assign(this, new Moving(name, location));
  this.describe = function() {
    var description = "";
    for (var i = 0; i < this.exits.length; i++) {
      description += Display.embolden(this.exits[i].description, this.givenName);
      if (Parser.testForWord(description, this.exits[i].name)) {
        var description = Display.embolden(description, this.exits[i].name);
      }
    }
    return description
  }
  this.exits = exits;
  this.additive = additive ? true : false;
  this.type = "Obstruction"
  return this;
}
const Conversation = function(name, topics, init, endLogic) {

  Object.assign(this, new Interactable(name, "Nowhere", {}, "", function() {}),
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
const Monolog = function(name, sequence, init, endLogic) {
  //A Monolog is a special conversation that moves along regardless of input.
  //Instead of a dialog tree, it's a dialog railroad.

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
const Movie = function(name, sequence, init, endLogic, imgSuffix, sndSuffix) {
  //A movie is a special kind of monolog that draws images and sound effects
  //from a dedicated folder

  Object.assign(this, new Monolog(name, sequence, init, endLogic));

  this.imgSuffix = imgSuffix ? imgSuffix : "jpg";
  this.sndSuffix = sndSuffix ? sndSufix : "wav";

  this.methods = {
    nothing: function() {
      var sequence = this.parent.sequence;
      var folder = "movies/" + this.parent.name;
      var imgPath = folder + "/images/" + (sequence.position) + "." + imgSuffix;
      var sndPath = folder + "/audio/" + (sequence.position) + "." + sndSuffix;
      Display.updateImageDisplay(imgPath);
      Sound.playEffect(sndPath);
      sequence.advance();
    }
  }
  this.methods.parent = this;
  this.preload = function() {
    //Preloads a movie.

    //Get the movie and its folder
    var folder = "movies/" + this.name;
    //initialize image and audio arrays.
    var images = [];
    var audio = [];
    //For every frame
    for (var i = 0; i < this.sequence.length; i++) {
      //Add its its image and audio to the correct array
      images.push(folder + "/images/" + i + "." + this.imgSuffix);
      audio.push(folder + "/audio/" + i + "." + this.sndSuffix);
    }
    //preload the images and audio
    Setup.preloadImages(images);
    Setup.preloadAudio(audio);
  }
  this.type = "Movie"
  return this;
}
const Room = function(name, description, exits, givenName, image, music) {
  this.name = name;
  this.image = image ? image : "";
  this.music = music ? music : "";
  this.description = description;
  this.exits = Setup.objectify(exits);
  this.givenName = givenName;
  this.updateDisplay = function() {
    //Updates the name window, the image, the IO.output box and the music to
    //reflect the given location.

    //Update the roomDisplay field
    Display.updateNameDisplay(this.givenName);
    Sound.changeMusic(this.music);
    //Build and IO.output a description of the room.
    IO.output(this.buildCompleteDescription());
  }
  this.buildCompleteDescription = function() {
    //Builds a complete description of a room.

    //Initialize all of the necessary variables.
    var entities = Object.values(this.localize(getEntities()));
    var exits = Object.values(this.getExits());

    //Set a blank description and add each element if it applies.
    var description = "";
    description += this.description;
    if (entities.length > 0) {
      description += " You see " + this.describeEntities();
    }
    if (exits.length > 0) {
      description += " You can " + this.describeExits();
    }
    //Return the description.
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
      var entityDescription = Display.embolden(entity.description, entity.givenName);
      descriptionArray.push(entityDescription);
    }
    return Display.manageListGrammar(descriptionArray, "and") + ".";
  }
  this.describeExits = function() {
    var descriptionArray = []
    var exits = Object.values(this.getExits());
    for (var i = 0; i < exits.length; i++) {
      descriptionArray.push(Display.embolden(exits[i].description, exits[i].name));
    }
    return Display.manageListGrammar(descriptionArray, "or") + ".";
  }
  this.getObstructionExits = function(obstructions) {
    obstructions = Array.isArray(obstructions) ? obstructions : Object.values(obstructions);
    var exitObject = [];
    for (var i = 0; i < obstructions.length; i++) {
      var exits = obstructions[i].exits;
      for (var j = 0; j < exits.length; j++) {
        exitObject[exits[j].name] = exits[j];
      }
    }
    return exitObject;
  }
  this.getExits = function() {
    var obstructed = this.getObstructionExits(this.localize(getObstructions()));
    obstructed = Object.values(obstructed);

    var intercepted = Object.values(this.localize(getObstructions())).filter(
      function(obstruction) {
        return obstruction.additive;
    });
    intercepted = this.getObstructionExits(Setup.objectify(intercepted));
    intercepted = Object.values(intercepted);

    //remove exits colliding with *any* obstructions
    var exits = Object.values(this.exits).filter(function(exit) {
      var collisions = 0;
      for (var i = 0; i < obstructed.length; i++) {
        if (obstructed[i].name == exit.name) {
          collisions += 1;
        }
      }
      return collisions < 1;
    });
    //add exits belonging to additive obstructions ("interceptors")
    return Setup.objectify(exits.concat(intercepted));
  }
  this.testForExits = function(input) {
    var exits = Object.values(this.getExits());
    for (var i = 0; i < exits.length; i++) {
      var exit = exits[i];
      if (Parser.testForWord(input, exit.name)) {
        return exit.name;
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
const Exit = function(name, take, description) {
  this.name = name;
  this.take = typeof take == "string" ? function(entity) {
    entity.warp(take);
  } : take;
  this.description = description;
  this.type = "Exit";
  return this;
}
const Moving = function(name, location) {
  this.name = name;
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
    //Moves an entity in the given direction. If there is no such direction, it
    //will fail loudly.
    var exits = getRooms()[this.locations[0]].getExits();
    exits[direction].take(this);
  }
  return this;
}
const GameWorld = function(player, rooms, entities, obstructions,
 init, endLogic) {
  rooms = rooms.concat([
    new Room("Inventory",
      "This is an inventory.",
      [],
      "Inventory"
    ),
    new Room("Conversing",
      "",
      [],
      ""
    ),
    new Room("Nowhere",
      "",
      [],
      ""
    )]);
  this.player = player;
  this.rooms = Setup.objectify(rooms);
  this.entities = Setup.objectify(entities);
  this.obstructions = Setup.objectify(obstructions);
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
    //Convert object names to corresponding objects
    object = typeof object == "string" ?
      (() => {
        var position = getConfiguration().worldstack.indexOf(this);
        var oldWorld = getConfiguration().getWorld(position - 1);
        return oldWorld.getAllObjects()[object];
      })() : object;
    //Throw an error if the specified object does not exist
    if (!object) {
      throw "Cannot register nonexistent object with a GameWorld."
    }
    //Add the object to the appropriate collection
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
    //Returns the global Player object.
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
  this.getObstructions = function() {
    return this.obstructions;
  }
  this.getAllObjects = function() {
    return this.getInteractables().concat(getObstructions(), getRooms());
  }
  return this;
}
const GameConfiguration = function(globals, synonyms, worlds, cutscenes) {
  this.globals = Object.assign({
    useImages: false,
    useMusicControls: false,
    useSoundControls: false
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
      [],
      [this],
      [],
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
function getObstructions() {
  return getWorld().getObstructions();
}
