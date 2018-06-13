//Modules
const Setup = (function() {
  this.nameSetup = function() {
    var nameDisplay = document.getElementById("roomNameDisplay");
    nameDisplay.addEventListener("webkitAnimationEnd", function(event) {
      nameDisplay.className = "";
    });
    nameDisplay.addEventListener("animationend", function(event) {
      nameDisplay.className = "";
    });
  }
  this.inputSetup = function() {
    //Finds the inputBox and assigns the necessary handler to it.
    var inputBox = document.getElementById("inputBox");
    inputBox.onkeydown = function(event) {IO.listenForKey(event, "Enter",
    IO.enterHandler);};
    inputBox.focus();
  }
  this.imageSetup = function() {
    //Finds the imageDisplay and configures it according to useImages
    var imageDisplay = document.getElementById("imageDisplay");
    //If useImages is true

    if (Configuration.useImages) {
      //Update it.
      var room = getRooms().findByName(getPlayer().locations[0]);
      Display.updateImageDisplay(room.image);
    } else {
      //If not make the imageDisplay disappear.
      imageDisplay.style.display = "none";
    }
  }
  this.audioSetup = function() {
    //Sets up the audio buttons.

    //Find the Buttons
    var musicButton = document.getElementById("musicButton");
    var soundButton = document.getElementById("soundButton");
    //Apply handlers to them.
    musicButton.onclick = function() {Sound.toggleElement("music");};
    soundButton.onclick = function() {Sound.toggleElement("sound");};
    //If USE_SOUND is true
    if (Configuration.useMusicControls == false) {
      var musicControls = document.getElementById("musicControls");
      musicControls.style.display = "none";
    }
    if (Configuration.useSoundControls == false) {
      var soundControls = document.getElementById("soundControls");
      soundControls.style.display = "none";
    }
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
  this.getRoomImages = function() {
    var rooms = getRooms();
    var images = [];
    for (var i = 0; i < rooms.length; i++) {
      images.push(rooms[i].image);
    }
    return images;
  }
  this.getRoomAudio = function() {
    var rooms = getRooms();
    var audio = [];
    for (var i = 0; i < rooms.length; i++) {
      audio.push(rooms[i].music);
    }
    return audio;
  }
  this.setup = function() {
    //Runs necessary setup functions.
    this.nameSetup();
    this.inputSetup();
    this.imageSetup();
    this.audioSetup();

    this.preloadImages(this.getRoomImages());
    this.preloadAudio(this.getRoomAudio());

    var movies = getConversations();
    for (var i = 0; i < movies.length; i++) {
      if (typeof movies[i].preload != "undefined") {
        movies[i].preload();
      }
    }

    //init() is defined in game.js
    getWorld().init();
  }
  return this;
})();
const IO = (function() {
  this.enterHandler = function() {
    //Enter handler for the input box that sets instruction execution into motion.
    //Parse and execute input
    Parser.parseAndExecuteInput(Parser.getInput());
    //Update the image display to that of the player's locations[0]
    var room = getRooms().findByName(getPlayer().locations[0]);
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
  this.detectEntity = function(input, entities) {
    //Returns the first entity referenced by the input that is contained in
    //"entities". This is according to the order of the entities array, not the
    //input itself. If no entity is found, it returns the player.

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
  this.detectAction = function(input, subject) {
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
  this.parseInput = function(input) {
    //Parses input, returning a subject entity and an action attached to that
    //entity.

    //Get the interactable entities here.
    var location = getPlayer().locations[0];
    var entities = getRooms().findByName(location).localize(getInteractables());
    //Find the subject.
    var subject = this.detectEntity(input, entities);
    //If it's the player (default for finding none)
    if (subject == getPlayer()) {
      //Try again with inventory items.
      entities = getRooms().findByName("Inventory").localize(getInteractables());
      subject = this.detectEntity(input, entities);
    }
    //Find an action
    var action = this.detectAction(input, subject);
    //Return parsed input.
    return [subject, action];
  }
  this.parseAndExecuteInput = function(input) {
    //Parses and executes input, with a few additional effects depending on
    //advanceTurn.

    //Parse the input.
    var parsedInput = this.parseInput(input);
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
    if (typeof image == "undefined" || image == "") {
      image = imageDisplay.src;
    }
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
    substr = typeof substr == "undefined" || substr == "" ? string : substr;
    return this.addTag("strong", string, substr);
  }
  this.colorize = function(color, string, substr) {
    substr = typeof substr == "undefined" || substr == "" ? string : substr;
    return this.addTag("span style=\"color: " + color + "\"", string, substr);
  }
  this.addTag = function(tagtext, string, substr) {
    //Replaces every instance of a substring within a string with an identical
    //copy surrounded by HTML tags with the given tagtext. If no string is
    //provided, it simply surrounds the string with tags.

    substr = typeof substr == "undefined" || substr == "" ? string : substr;
    //Test for substring within string.

    if (string.includes(substr)) {
      //Use string.replace to add tags around the substring.
      var description = string.replace(substr, function(str) {
        return "<" + tagtext + ">" + str + "</" + tagtext + ">";
      });
      return description;
    } else {
      return string;
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
  return this;
}
const PlayerEntity = function(location, methods, turn) {
  Object.assign(this, new Interactable("player", location, methods, "player",
   turn));
  this.methods = Object.assign(this.methods, {
    nothing: function() {
      var exits = getRooms().findByName(this.parent.locations[0]).getExits();
      for (var i = 0; i < exits.length; i++) {
        if (Parser.getInput().toLowerCase() == exits[i].name.toLowerCase()) {
          this.move();
          return;
        }
      }
      IO.output("I'm afraid I don't understand.");
    },
    inventory: function() {
      var inventory = getRooms().findByName("Inventory")
      var entities = inventory.localize(getEntities());
      if (entities.length > 0) {
        var description = inventory.describeEntities("Inventory");
        IO.output("You have " + inventory.describeEntities("Inventory"));
      } else {
        IO.output("You have nothing.");
      }
    },
    move: function() {
      getPlayer().moveByInput(Parser.getInput());
      getWorld().nextTurn();
    },
    look: function() {
      getRooms().findByName(this.parent.locations[0]).updateDisplay();
    },
    help: function() {
      var player = getPlayer();
      var description = "Recognized commands include ";
      var keys = Object.keys(player.methods);
      keys = keys.filter( function(key) {
        return (key !== "nothing" && key !== "parent");
      });
      description += Display.manageListGrammar(keys, "and");
      for (var i in keys) {
        description = Display.embolden(description, keys[i]);
      }
      description += ". Other context-sensitive commands may also be \
      available.";
      IO.output(description);
    },
    wait: function() {
      IO.output("You wait around for a moment");
      getWorld().nextTurn();
    }
  }, methods);

  this.advanceTurn = false;
  this.methods.parent = this;
  this.inventoryContains = function(name) {
    //Tests for an entity with a given name in the "Inventory" location. This is
    return getRooms().findByName("Inventory").contains(name);
  }
  this.moveByInput = function(input) {
    //Moves the player according to their input.
    var oldLocation = this.locations[0];

    var direction = getRooms().findByName(this.locations[0]).testForExits(input);
    if (direction) {
      getPlayer().move(direction);
    } else {
      IO.output("You can't go that way.");
    }

    if (oldLocation != this.locations[0]) {
      getRooms().findByName(this.locations[0]).updateDisplay();
    }
  }
  this.lose = function(message, undoMessage) {
    message = message ? message : "You have lost.";
    undoMessage = undoMessage ? Display.embolden(undoMessage, "undo") : "You can type\
     <strong>undo</strong> to try again.";
    var loseConversation = getConversations().findByName("Lose");
    loseConversation.addTopic("message", message);
    loseConversation.addTopic("nothing", undoMessage);
    loseConversation.gracefullyStart();
    Display.updateNameDisplay("You Lose");
    IO.output(undoMessage);
  }
  this.turn = turn;
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
  return this;
}
const Conversation = function(name, topics) {
  //A conversation is a special entity. The "topics" parameter is an object
  //with string/string pairs, which gets converted into methods that IO.output the
  //value. The "methods" parameter is optional, and works as expected.

  Object.assign(this, new Interactable(name, "Nowhere", {}, "", function() {}),
    new Wrapping(), new Conversational(), new Topical(topics));
  this.methods = Object.assign(this.methods, {
    goodbye: function() {
      this.parent.gracefullyEnd();
    }
  }, this.methods);

  this.advanceTurn = false;
  this.methods.parent = this;
  return this;
}
const Sequence = function(array) {
  Object.assign(array, new Wrapping());

  array.advance = function() {
    array.position += 1;
    if (array[array.position]) {
      array[array.position]();
    } else {
      array.parent.gracefullyEnd();
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
  return array;
}
const Monolog = function(name, sequence, advanceTurn) {
  //A Monolog is a special conversation that moves along regardless of input.
  //Instead of a dialog tree, it's a dialog railroad.

  Object.assign(this, new Conversational(),
   new Interactable(name, "Nowhere", {}, "", function() {}));

  this.methods = {
    nothing: function() {
      this.parent.sequence.advance();
    },
    goodbye: function() {
      this.nothing();
    }
  }

  this.end = function() {
    this.warp("Nowhere");
    if (getPlayer().locations[0] == "Conversing") {
      getPlayer().inverseWarp();
    }
    this.sequence.setPosition(0);
  }
  this.sequence = sequence.length >= 0 ? new Sequence(sequence) : sequence;

  this.sequence.parent = this;
  this.advanceTurn = advanceTurn === true ? true : false;
  this.methods.parent = this;
  return this;
}
const Movie = function(name, sequence, imgSuffix, sndSuffix) {
  //A movie is a special kind of monolog that draws images and sound effects
  //from a dedicated folder

  Object.assign(this, new Monolog(name, sequence));

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
  return this;
}
const Room = function(name, description, exits, givenName, image, music) {
  this.name = name;
  this.image = image ? image : "";
  this.music = music ? music : "";
  this.description = description;
  this.exits = exits;
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
    var entities = this.localize(getEntities());
    var exits = this.exits;
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
    return new NamedArray(interactables.filter((element) => {
      return element.locations[0] == this.name;
    }));
  }
  this.describeEntities = function() {
    var descriptionArray = [];
    var entities = this.localize(getEntities());
    for (var i = 0; i < entities.length; i++) {
      var entity = entities[i];
      var entityDescription = Display.embolden(entity.description, entity.givenName);
      descriptionArray.push(entityDescription);
    }
    return Display.manageListGrammar(descriptionArray, "and") + ".";
  }
  this.describeExits = function() {
    var descriptionArray = []
    var exits = this.getExits();
    for (var i = 0; i < exits.length; i++) {
      descriptionArray.push(Display.embolden(exits[i].description, exits[i].name));
    }
    return Display.manageListGrammar(descriptionArray, "or") + ".";
  }
  this.getObstructionExits = function(obstructions) {
    obstructions = this.localize(obstructions);
    var exitArray = [];
    for (var i = 0; i < obstructions.length; i++) {
      var exits = obstructions[i].exits;
      for (var j = 0; j < exits.length; j++) {
        exitArray.push(exits[j]);
      }
    }
    return exitArray;
  }
  this.getExits = function() {
    var obstructed = this.getObstructionExits(getObstructions());
    var intercepted = this.getObstructionExits(getObstructions().filter(
      function(obstruction) {
        return obstruction.additive;
    }));
    //remove exits colliding with *any* obstructions
    var exits = new NamedArray(this.exits.filter(function(exit) {
      var collisions = 0;
      for (var i = 0; i < obstructed.length; i++) {
        if (obstructed[i].name == exit.name) {
          collisions += 1;
        }
      }
      return collisions < 1;
    }));
    //add exits belonging to additive obstructions ("interceptors")
    return exits.concat(intercepted);
  }
  this.testForExits = function(input) {
    var exits = this.getExits();
    for (var i = 0; i < exits.length; i++) {
      var exit = exits[i];
      if (Parser.testForWord(input, exit.name)) {
        return exit.name;
      }
    }
    return false;
  }
  this.contains = function(name) {
    //Checks the room with the given roomName for the entity with the given name.
    //Get all the entities in the room
    var entities = this.localize(getInteractables());
    //Find the entity you're looking for
    var item = entities.findByName(name);
    //If it exists
    if (typeof item == "object") {
      return true;
    } else {
      return false;
    }
  }
  return this;
}
const Exit = function(name, take, description) {
  this.name = name;
  this.take = typeof take == "string" ? function(entity) {
    entity.warp(take);
  } : take;
  this.description = description;
  return this;
}
const NamedArray = function(array) {
  array.findByName = function(name) {
    for (var i = 0; i < this.length; i++) {
      if (this[i].name == name) {
        return this[i];
      }
    }
  }
  array.concat = function(...args) {
    var newArray = this.slice();

    for (var i = 0; i < args.length; i++) {
      var arg = args[i];
      if (typeof arg.length != "undefined") {
        for (var j = 0; j < arg.length; j++) {
          newArray.push(arg[j]);
        }
      } else {
        newArray.push(arg);
      }
    }

    return new NamedArray(newArray);
  }
  return array;
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
    var exits = getRooms().findByName(this.locations[0]).getExits();
    exits.findByName(direction).take(this);
  }
  return this;
}
const GameWorld = function(player, rooms, entities, obstructions, conversations,
 init) {
  this.player = player;
  this.rooms = rooms.concat([
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
  this.entities = entities;
  this.obstructions = obstructions;
  this.conversations = conversations.concat([
    (function() {
      Object.assign(this, new Conversation("Lose",
        {
          message: "",
          nothing: "",
          "undo": () => {
            this.parent.gracefullyEnd();
          },
          "goodbye": () => {
            this.nothing();
          }
        }
      ));
      return this;
    })()
  ]);
  this.init = init ? init : function() {};

  this.nextTurn = function() {
    var interactables = getInteractables();
    interactables = new NamedArray(interactables.filter(function(element) {
      return element.locations[0] != "Nowhere";
    }));
    for (var i = 0; i < interactables.length; i++) {
      interactables[i].age += 1;
      if (interactables[i].turn) {
        interactables[i].turn();
      }
    }
  }
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
const Conversational = function() {
  this.start = function() {
    var activeConvs = getRooms().findByName("Conversing").localize(getConversations());
    for (var i = 0; i < activeConvs.length; i++) {
      getConversations().findByName(activeConvs[i].name).end();
    }
    getPlayer().warp("Conversing");
    this.warp("Conversing");
  }
  this.gracefullyStart = function() {
    this.start();
    IO.output("**********");
    //Display the first topic or statement.
    var key = Object.keys(this.methods)[0];
    this.methods[key]();
  }
  this.end = function() {
    this.warp("Nowhere");
    if (getPlayer().locations[0] == "Conversing") {
      getPlayer().inverseWarp();
    }
  }
  this.gracefullyEnd = function() {
    this.end();
    IO.output("**********");
    getRooms().findByName(getPlayer().locations[0]).updateDisplay();
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
function getPlayer() {
  //Returns the global Player object.
    return getWorld().player;
}
function getRooms() {
  return getWorld().rooms;
}
function getConversations() {
  return getWorld().conversations;
}
function getWorld() {
  return World;
}
function getInteractables() {
  return getEntities().concat(getConversations(), getPlayer());
}
function getEntities() {
  return getWorld().entities;
}
function getObstructions() {
  return getWorld().obstructions;
}
