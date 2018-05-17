//Classes
const Interactable = function(name, location, methods, givenName, turn) {
  this.methods = methods;
  this.methods.parent = this;

  this.name = name;
  this.locations = [location, "", "", "", ""];
  Object.seal(this.locations);
  this.givenName = givenName;

  this.turn = turn ? turn : function() {};

  this.advanceTurn = true;
  this.displayInput = true;

  this.warp = function(roomName) {
    if (roomName == this.locations[0]) {
      return;
    } else {
      this.locations[0] = roomName;
      for (i = this.locations.length - 1; i > 0; i--) {
        this.locations[i] = this.locations[i - 1];
      }
    }
  }
  this.inverseWarp = function() {
    var presentLocation = this.locations[0];
    for (i = 0; i < this.locations.length - 1; i++) {
      this.locations[i] = this.locations[i + 1];
    }
    this.locations[this.locations.length - 1] = presentLocation;
  }

  return this;
}
const Entity = function(name, location, description, methods, givenName, turn) {
  Object.assign(this, new Interactable(name, location, methods, givenName, turn));
  methods = Object.assign( {
    nothing: function() {
      output("Do what with the " + givenName + "?");
    },
    look: function() {
      output("It's " + description + ".");
    },
    attack: function() {
      output("I don't think that's wise.");
    }
  }, methods);
  this.description = description;
  return this;
}
const PlayerEntity = function(location, methods, turn) {
  Object.assign(this, new Interactable("player", location, methods, "player", turn));
  this.methods = Object.assign(this.methods, {
    nothing: function() {
      var exits = findByName(this.parent.locations[0], getRooms()).getExits();
      for (var i = 0; i < exits.length; i++) {
        if (getInput().toLowerCase() == exits[i].name.toLowerCase()) {
          this.move();
          return;
        }
      }
      output("I'm afraid I don't understand.");
    },
    inventory: function() {
      var entities = findByName("Inventory", getRooms()).localize(getEntities());
      if (entities.length > 0) {
        var description = describeEntities("Inventory");
        output("You have " + describeEntities("Inventory"));
      } else {
        output("You have nothing.");
      }
    },
    move: function() {
      movePlayerByInput(getInput());
      nextTurn();
    },
    look: function() {
      findByName(this.parent.locations[0], getRooms()).updateDisplay();
    },
    help: function() {
      var player = getPlayer();
      var description = "Recognized commands include ";
      var keys = Object.keys(player.methods);
      keys = keys.filter( function(key) {
        return (key !== "nothing" && key !== "parent");
      });
      description += manageListGrammar(keys, "and");
      for (var i in keys) {
        description = embolden(description, keys[i]);
      }
      description += ". Other context-sensitive commands may also be \
      available.";
      output(description);
    },
    wait: function() {
      output("You wait around for a moment");
      nextTurn();
    }
  }, methods);

  this.advanceTurn = false;
  this.displayInput = true;
  this.methods.parent = this;
  this.inventoryContains = function() {
    //Tests for an entity with a given name in the "Inventory" location. This is
    //Really just a specialized shorthand for roomContains.
    return roomContains("Inventory", name);
  }

  this.turn = turn;
  return this;
}
const Obstruction = function(name, location, methods, exits, givenName, turn) {

  Object.assign(this, new Interactable(name, location, methods, givenName, turn));
  this.describe = function() {
    var description = "";
    for (var i = 0; i < this.exits.length; i++) {
      description += embolden(this.exits[i].description, this.givenName);
      if (testForWord(description, this.exits[i].name)) {
        var description = embolden(description, this.exits[i].name);
      }
    }
    return description
  }
  this.exits = exits;
  return this;
}
const Conversation = function(name, topics, methods) {
  //A conversation is a special entity. The "topics" parameter is an object
  //with string/string pairs, which gets converted into methods that output the
  //value. The "methods" parameter is optional, and works as expected.

  Object.assign(this, new Interactable(name, "Nowhere", {}, "", function() {}),
    new Wrapping(), new Conversational(), new Topical(topics));
  this.methods = Object.assign(this.methods, {
    goodbye: function() {
      this.parent.gracefullyEnd();
    }
  }, methods);

  this.advanceTurn = false;
  this.methods.parent = this;
  return this;
}
const Sequence = function(array) {
  Object.assign(this, new Wrapping());

  this.advance = function() {
    if (this.functions[this.position]) {
      this.functions[this.position]();
      this.position += 1;
    } else {
      this.parent.gracefullyEnd();
      this.position = 0;
    }
  }

  this.setPosition = function(position) {
    this.position = position;
  }

  this.functions = [];
  for (var i = 0; i < array.length; i++) {
    this.functions[i] = this.wrap(array[i]);
  }

  this.position = 0;
  this.parent = null;
  return this;
}
const Monolog = function(name, sequence, displayInput, advanceTurn) {
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

  this.sequence = new Sequence(sequence);
  this.sequence.parent = this;

  this.displayInput = displayInput === true ? true : false;
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
      updateImageDisplay(imgPath);
      playSound(sndPath);
      sequence.advance();
    }
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
    //Updates the name window, the image, the output box and the music to
    //reflect the given location.

    //Update the roomDisplay field
    updateNameDisplay(this.givenName);
    changeMusic(this.music);
    //Build and output a description of the room.
    output(this.buildCompleteDescription());
  }
  this.buildCompleteDescription = function() {
    //Builds a complete description of a room.

    //Initialize all of the necessary variables.
    var entities = this.localize(getEntities());
    var exits = this.exits;
    var interceptors = this.localize(getInterceptors());
    var obstructions = this.localize(getObstructions());
    //Set a blank description and add each element if it applies.
    var description = "";
    description += this.description;
    if (entities.length > 0) {
      description += " You see " + this.describeEntities();
    }
    if (exits.length > 0) {
      description += " You can " + this.describeExits();
    }
    if (obstructions.length > 0) {
      description += " However, " + this.describeObstructions();
    }
    //Return the description.
    return description;
  }
  this.localize = function(interactables) {
    return interactables.filter((element) => {
      return element.locations[0] == this.name;
    });
  }
  this.describeEntities = function() {
    var descriptionArray = [];
    var entities = this.localize(getEntities());
    for (var i = 0; i < entities.length; i++) {
      var entity = entities[i];
      var entityDescription = embolden(entity.description, entity.givenName);
      descriptionArray.push(entityDescription);
    }
    return manageListGrammar(descriptionArray, "and") + ".";
  }
  this.describeExits = function() {
    var descriptionArray = []
    var exits = this.getExits();
    for (var i = 0; i < exits.length; i++) {
      descriptionArray.push(embolden(exits[i].description, exits[i].name));
    }
    return manageListGrammar(descriptionArray, "or") + ".";
  }
  this.describeObstructions = function() {
    var descriptionArray = [];
    var obstructions = this.localize(getObstructions());
    for (var i = 0; i < obstructions.length; i++) {
      descriptionArray.push(obstructions[i].describe());
    }
    return manageListGrammar(descriptionArray, "and") + ".";
  }
  this.describeSingularObstruction = function(obstruction) {

  }
  this.getInterceptorExits = function() {
    var interceptors = this.localize(getInterceptors());
    var exitArray = [];
    for (var i = 0; i < interceptors.length; i++) {
      var exits = interceptors[i].exits;
      for (var j = 0; j < exits.length; j++) {
        exitArray.push(exits[i]);
      }
    }
    return exitArray;
  }
  this.getExits = function() {
    return this.exits.concat(this.getInterceptorExits());
  }
}
const Exit = function(name, location, description) {
  this.name = name;
  this.location = location;
  this.description = description;
  return this;
}
const GameWorld = function(player, rooms, entities, obstructions, interceptors,
 conversations) {
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
    )]);
  this.entities = entities;
  this.obstructions = obstructions;
  this.interceptors = interceptors;
  this.conversations = conversations.concat([
    (function() {
      Object.assign(this, new Conversation("Lose",
        {
          message: "",
          nothing: ""
        },
        {
          "undo": () => {
            this.gracefullyEnd();
          },
          "goodbye": () => {
            this.methods.nothing();
          }
        }
      ));
      this.displayInput = false;
      return this;
    })()
  ]);
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
      output(string);
    }
  }
  return this;
}
const Conversational = function() {
  this.start = function() {
    clearConversations();
    getPlayer().warp("Conversing");
    this.warp("Conversing");
  }
  this.gracefullyStart = function() {
    this.start();
    output("**********");
    //Display the first topic or statement.
    var key = Object.keys(this.methods)[0];
    this.methods[key]();
  }
  this.end = function() {
    if (this.locations[0] == "Conversing") {
      var player = getPlayer();
      player.inverseWarp();
      this.warp("Nowhere");
    }
  }
  this.gracefullyEnd = function() {
    this.end();
    output("**********");
    findByName(getPlayer().locations[0], getRooms()).updateDisplay();
  }
  return this;
}
const Topical = function(topics) {
  Object.assign(this, new Wrapping());

  this.addTopic = function(key, paragraph) {
    this.methods[key] = this.wrap(paragraph);
  }

  this.methods = {};

  var keys = Object.keys(topics);
  for (var i = 0; i < keys.length; i++) {
    this.addTopic(keys[i], topics[keys[i]]);
  }

  return this;
}
//Player------------------------------------------------------------------------
function getPlayer() {
  //Returns the global Player object.
    return getWorld().player;
}
//IO----------------------------------------------------------------
function enterHandler() {
  //Enter handler for the input box that sets instruction execution into motion.

  //Parse and execute input
  parseAndExecuteInput(getInput());
  //Update the image display to that of the player's locations[0]
  var room = findByName(getPlayer().locations[0], getRooms());
  updateImageDisplay(safelyGetProperty(room, "image"));
  //Reset imageDisplay.calls
  var imageDisplay = document.getElementById("imageDisplay");
  imageDisplay.calls = 0;
  //Blank the input box.
  inputBox.value = "";
}
function output(str) {
  //Outputs a string to the output box.

  //Get the output box
  var outputBox = document.getElementById("outputBox");
  //Append the string onto the output box's content and scroll to the bottom.
  outputBox.innerHTML += "<p>> " + str + "</p>";
  outputBox.scrollTop = outputBox.scrollHeight;
}
function outputUserText(str) {
  //Sanitizes text and applies a span with the class "userText" before
  //outputting its string.

  var re = /<|>/g;
  sanitizedStr = str.replace(re, "");
  output("<span class=\"userText\">" + sanitizedStr + "</span>");
}
function listenForKey(e, key, callback) {
  //Listens for a key. "e" is an event. This function is intended to be used as
  //a keydown handler for an element.

  if (e.key == key) {
    callback();
  }
}
//Parser--------------------------------------------------------------
function testForWord(input, word) {
  //Returns true if the given input contains the given word or one of its
  //synonyms, defined in game.js. Case insensitive.

  //Convert both the input and the word to lowercase
  input = input.toLowerCase();
  word = word.toLowerCase();
  //Get synonyms
  var synonyms = getSynonyms(word);
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
function getSynonyms(word) {
  //Returns the synonyms of a word, as defined in game.js.
  if (word) {
    return Configuration.synonyms[word.toLowerCase()];
  } else {
    return Configuration.synonyms;
  }
}
function addSynonyms(word, synonyms) {
  //Adds an array of synonyms to the synonyms object.
  var synonymContainer = getSynonyms();
  if (typeof synonymContainer[word] == "undefined") {
    synonymContainer[word] = [];
  }
  synonymContainer[word] = synonymContainer[word].concat(synonyms);
}
function getInput() {
  //Returns the current input. Useful in entity methods.
  var inputBox = document.getElementById("inputBox");
  return inputBox.value;
}
function detectEntity(input, entities) {
  //Returns the first entity referenced by the input that is contained in
  //"entities". This is according to the order of the entities array, not the
  //input itself. If no entity is found, it returns the player.

  //Iterate through the entites
  for (var i = 0; i < entities.length; i++) {
    var entity = entities[i];
    var entityName = entity.givenName;
    //If the input contains the entity's name (or a synonym)
    if (testForWord(input, entityName)) {
      //Return it.
      return entity;
    }
  }
  //If nothing is referenced, return the player.
  return getPlayer();
}
function detectAction(input, subject) {
  //Tests the input for an action attached to the given "subject" entity.

  //Get the keys for the subject's methods
  var methodKeys = Object.keys(subject.methods);
  //Iterate through these keys
  for (var i = 0; i < methodKeys.length; i++) {
    var key = methodKeys[i];
    //If the input contains the key (or a synonym)
    if(testForWord(input, key)) {
      //Make sure the key is not "parent" - the parent property of the
      //subject.methods object is not a function.
      if (testForWord("parent", key)) {
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
function parseInput(input) {
  //Parses input, returning a subject entity and an action attached to that
  //entity.

  //Get the interactable entities here.
  var location = getPlayer().locations[0];
  var entities = findByName(location, getRooms()).localize(getInteractables());
  //Find the subject.
  var subject = detectEntity(input, entities);
  //If it's the player (default for finding none)
  if (subject == getPlayer()) {
    //Try again with inventory items.
    entities = findByName("Inventory", getRooms()).localize(getInteractables());
    subject = detectEntity(input, entities);
  }
  //Find an action
  var action = detectAction(input, subject);
  //Return parsed input.
  return [subject, action];
}
function parseAndExecuteInput(input) {
  //Parses and executes input, with a few additional effects depending on
  //advanceTurn and displayInput.

  //Parse the input.
  var parsedInput = parseInput(input);
  var subject = parsedInput[0];
  var action = parsedInput[1];
  //Unless the subject's displayInput is false
  if (subject.displayInput != false) {
    //Output the player's input
    outputUserText(input);
  }
  subject.methods[action]();
  //Unless the subject's advanceTurn is false
  if (subject.advanceTurn != false) {
    nextTurn();
  }
  //Execute the input.
}
//Setup-------------------------------------------------------------------------
function nameSetup() {
  var nameDisplay = document.getElementById("roomNameDisplay");
  nameDisplay.addEventListener("webkitAnimationEnd", function(event) {
    nameDisplay.className = "";
  });
  nameDisplay.addEventListener("animationend", function(event) {
    nameDisplay.className = "";
  });
}
function inputSetup() {
  //Finds the inputBox and assigns the necessary handler to it.
  var inputBox = document.getElementById("inputBox");
  inputBox.onkeydown = function(event) {listenForKey(event, "Enter",
  enterHandler);};
  inputBox.focus();
}
function imageSetup() {
  //Finds the imageDisplay and configures it according to useImages
  var imageDisplay = document.getElementById("imageDisplay");
  //If useImages is true

  if (Configuration.useImages) {
    //Update it.
    var room = findByName(getPlayer().locations[0], getRooms());
    updateImageDisplay(room.image);
  } else {
    //If not make the imageDisplay disappear.
    imageDisplay.style.display = "none";
  }
  //Initialize imageDisplay.calls. This is used to ensure that
  //updateImageDisplay is only called once per call of enterHandler.
  imageDisplay.calls = 0;
}
function audioSetup() {
  //Sets up the audio buttons.

  //Find the Buttons
  var musicButton = document.getElementById("musicButton");
  var soundButton = document.getElementById("soundButton");
  //Apply handlers to them.
  musicButton.onclick = function() {toggleSoundElement("music");};
  soundButton.onclick = function() {toggleSoundElement("sound");};
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
function init() {
  //This function exists to support game.js files with no init function.

  updateRoomDisplay(getPlayer().locations[0]);
}
function preloadImages(images) {
  //Preloads images.
  for (var i = 0; i < images.length; i++) {
    if (typeof images[i] != "undefined" && images[i] != "") {
      new Image().src = images[i];
    }
  }
}
function preloadAudio(audio) {
  for (var i = 0; i < audio.length; i++) {
    if (typeof audio[i] != "undefined" && audio[i] != "") {
      new Audio().src = audio[i];
    }
  }
}
function setup() {
  //Runs necessary setup functions.
  nameSetup();
  inputSetup();
  imageSetup();
  audioSetup();
  preloadImages(getRoomImages());
  //init() is defined in game.js
  init();
}
//Sound-------------------------------------------------------------------------
function toggleSoundElement(elementName) {
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
function changeMusic(song) {
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
function playSound(sound) {
  //Plays a sound effect
  var soundPlayer = document.getElementById("sound");
  soundPlayer.src = sound;
  soundPlayer.play();
}
//Display-----------------------------------------------------------------------
function updateImageDisplay(image) {
  //Updates the image display. Because of imageDisplay.calls, it can only be
  //used effectively once per call of enterHandler, excepting the call in
  //imageSetup before imageDisplay.calls is initialized.

  var imageDisplay = document.getElementById("imageDisplay");
  if (typeof image == "undefined" || image == "") {
    image = imageDisplay.src;
  }
  if (imageDisplay.calls == 0 || typeof imageDisplay.calls == "undefined") {
    imageDisplay.src = image;
  }
  imageDisplay.calls += 1;
}
function updateNameDisplay(str) {
  var nameDisplay = document.getElementById("roomNameDisplay");
  nameDisplay.innerHTML = str;
  nameDisplay.className = "emphasizeName";
}
function manageListGrammar(elements, delimiter) {
  var description = "";
  for (var i = 0; i < elements.length; i++) {
    if (i == 0) {
      description += elements[i];
    } else if (i < elements.length - 1) {
      description += ", " + elements[i];
    } else if (i >= elements.length - 1) {
      description += " " + delimiter + " " + elements[i];
    }
  }
  return description;
}
function embolden(string, substr) {
  //Bolds a substring within a string. Actually just a special call of addTag.
  if (typeof substr == "undefined") {
    substr = string;
  }
  return addTag("strong", string, substr);
}
function colorize(color, string, substr) {
  if (typeof substr == "undefined") {
    substr = string;
  }
  return addTag("span style=\"color: " + color + "\"", string, substr);
}
function addTag(tagtext, string, substr) {
  //Replaces every instance of a substring within a string with an identical
  //copy surrounded by HTML tags with the given tagtext. If no string is
  //provided, it simply surrounds the string with tags.

  if (typeof substr == "undefined") {
    substr = string;
  }
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
//Rooms-------------------------------------------------------------------------
function getRoomImages() {
  var rooms = getRooms();
  var images = [];
  for (var i = 0; i < rooms.length; i++) {
    images.push(rooms[i].image);
  }
  return images;
}
function roomContains(roomName, name) {
  //Checks the room with the given roomName for the entity with the given name.

  //Get all the entities in the room
  var entities = findByName(roomName, getRooms()).localize(getEntities());
  //Find the entity you're looking for
  var item = findByName(name, entities);
  //If it exists
  if (typeof item == "object") {
    return true;
  } else {
    return false;
  }
}
function findByName(name, arr) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].name == name) {
      return arr[i];
    }
  }
}
function getCurrentExits() {
  var rooms = getRooms();
  var location = getPlayer().locations[0];
  var room = findByName(location, rooms);
  return room.exits;
}
function getRooms() {
  return getWorld().rooms;
}
//Movement----------------------------------------------------------------------
function moveEntity(entity, direction) {
  //Moves an entity in the given direction. If there is no such direction, it
  //will fail loudly.

  var exits = findByName(entity.locations[0], getRooms()).getExits();
  var obstruction = testForObstructions(direction, entity.locations[0]);
  //Make sure there's not an obstruction
  if (obstruction) {
    //Only announce the obstruction if the entity is the player.
    if (entity == getPlayer()) {
      output(obstruction.describe());
    }
  //If there isn't an obstruction, move them.
  } else {
    entity.warp(findByName(direction, exits).location);
    findByName(getPlayer().locations[0], getRooms()).updateDisplay();
  }
}
function movePlayerByInput(input) {
  //Moves the player according to their input.

  //Gather information on the player's movement.
  var direction = testForExits(getInput(), getPlayer().locations[0]);
  //See if they entered a valid direction
  if (direction) {
    moveEntity(getPlayer(), direction);

  //If they didn't enter a valid direction, tell them.
  } else {
    output("You can't go that way.");
  }
}
function testForObstructions(input, roomName) {
  obstructions = findByName(roomName, getRooms()).localize(getObstructions());
  for (var i = 0; i < obstructions.length; i++) {
    var exits = obstructions[i].exits;
    for (var j = 0; j < exits.length; j++) {
      if (testForWord(input, exits[j].name)) {
        return obstructions[i];
      }
    }
  }
  return false;
}
function testForExits(input, roomName) {
  var room = findByName(roomName, getRooms());
  var exits = room.getExits();
  for (var i = 0; i < exits.length; i++) {
    var exit = exits[i];
    if (testForWord(input, exit.name)) {
      return exit.name;
    }
  }
  return false;
}
//Conversations-----------------------------------------------------------------
function getConversations() {
  return getWorld().conversations;
}
function clearConversations() {
  //Clears all conversations. Normally, there should only ever be one.

  var activeConvs = findByName("Conversing", getRooms()).localize(getConversations());
  for (var i = 0; i < activeConvs.length; i++) {
    endConversation(activeConvs[i].name);
  }
}
//World-------------------------------------------------------------------------
function getWorld() {
  return World;
}
function getInteractables() {
  return getEntities().concat(getObstructions(), getInterceptors(),
   getConversations());
}
//Entities----------------------------------------------------------------------
function getEntities() {
  return getWorld().entities;
}
function isPresent(name) {
  if(roomContains(getPlayer().locations[0], name)) {
    return true;
  }
  return false;
}
//Obstructions------------------------------------------------------------------
function getObstructions() {
  return getWorld().obstructions;
}
//Interceptors------------------------------------------------------------------
function getInterceptors() {
  return getWorld().interceptors;
}
//Time--------------------------------------------------------------------------
function nextTurn() {
  var interactables = getInteractables();
  interactables = interactables.filter(function(element) {
    return element.locations[0] != "Nowhere";
  });
  for (i in interactables) {
    if (interactables[i].turn) {
      interactables[i].turn();
    }
  }
}
//Sequences---------------------------------------------------------------------
function makeSequence(array) {
  //Takes an array and makes everything in that array a function.

}
function wrapSequenceString(string) {
  //Wraps a string from a sequence.
  return function() {
    output(string);
  }
}
//Losing------------------------------------------------------------------------
function lose(message, undoMessage) {
  message = message ? message : "You have lost.";
  undoMessage = undoMessage ? embolden(undoMessage, "undo") : "You can type\
   <strong>undo</strong> to try again.";
  var loseConversation = findByName("Lose", getConversations());
  loseConversation.addTopic("message", message);
  loseConversation.addTopic("nothing", undoMessage);
  loseConversation.gracefullyStart();
  updateNameDisplay("You Lose");
  output(embolden(undoMessage, "undo"));
}
//Movies------------------------------------------------------------------------
function preloadMovie(movieName) {
  //Preloads a movie.

  //Get the movie and its folder
  var movie = findByName(movieName, getConversations());
  var folder = "movies/" + movie.name;
  //initialize image and audio arrays.
  var images = [];
  var audio = [];
  //For every frame
  for (var i = 0; i < movie.sequence.length; i++) {
    //Add its its image and audio to the correct array
    images.push(folder + "/images/" + i + "." + movie.imgSuffix);
    audio.push(folder + "/audio/" + i + "." + movie.sndSuffix);
  }
  //preload the images and audio
  preloadImages(images);
  preloadAudio(audio);
}
//Unsorted----------------------------------------------------------------------
function safelyGetProperty(object, property) {
  if (typeof object == "undefined") {
    return object;
  } else {
    return object[property];
  }
}
