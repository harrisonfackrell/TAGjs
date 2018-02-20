//Player------------------------------------------------------------------------
function PlayerEntity(location, methods, turn) {
  this.name = "player";
  this.location = location;
  this.methods = {
    nothing: function() {
      var room = findByName(this.parent.location, getRooms());
      var exits = Object.keys(room.exits);
      exits = exits.concat(
        Object.keys(getInterceptorExits(this.parent.location)));
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
    inventory: function() {
      var entities = narrowEntitiesByLocation(getEntities(), "Inventory");
      if (entities.length > 0) {
        var description = describeEntities("Inventory");
        output("You have " + describeEntities("Inventory"));
      } else {
        output("You have nothing.");
      }
    },
    move: function() {
      var input = getInput();
      movePlayerByInput(input);
      advanceTurn();
    },
    look: function() {
      var player = getPlayer();
      updateRoomDisplay(player.location);
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
      advanceTurn();
    }
  }
  this.methods.parent = this;
  Object.assign(this.methods, methods);
  this.prevLocation = this.location;
  this.givenName = "player";
  this.advanceTurn = false;
  if (turn) {
    this.turn = turn;
  }
}
function getPlayer() {
  //Returns the global Player object.
    return getWorld().player;
}
function inventoryContains(name) {
  //Tests for an entity with a given name in the "Inventory" location. This is
  //Really just a specialized shorthand for roomContains.

  var contains = roomContains("Inventory", name);
  return contains;
}
//I/O Processing----------------------------------------------------------------
function enterHandler() {
  //Enter handler for the input box that sets instruction execution into motion.

  //Parse and execute input
  parseAndExecuteInput(getInput());
  //Update the image display to that of the player's location
  var room = findByName(getPlayer().location, getRooms());
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
//Input Processing--------------------------------------------------------------
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
  var location = getPlayer().location;
  var entities = getInteractables();
  entities = narrowEntitiesByLocation(entities, location);
  //Find the subject.
  var subject = detectEntity(input, entities);
  //If it's the player (default for finding none)
  if (subject == getPlayer()) {
    //Try again with inventory items.
    entities = narrowEntitiesByLocation(getEntities(), "Inventory");
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
    advanceTurn();
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
    var room = findByName(getPlayer().location, getRooms());
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

  updateRoomDisplay(getPlayer().location);
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
  addLoseConversation();
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
function updateRoomDisplay(roomName) {
  //Updates the name window, the image, the output box and the music to
  //reflect the given location.

  //Get the room
  var room = findByName(roomName, getRooms());
  //Update the roomDisplay field
  updateNameDisplay(room.givenName);
  changeMusic(room.music);
  //Build and output a description of the room.
  var description = buildCompleteDescription(room);
  output(description);
}
function describe(room) {
  return room.description;
}
function describeEntities(roomName) {
  var descriptionArray = [];
  var entities = getEntities();
  var narrowedEntities = narrowEntitiesByLocation(entities, roomName);
  for (var i = 0; i < narrowedEntities.length; i++) {
    var entity = narrowedEntities[i];
    var entityDescription = embolden(entity.description, entity.givenName);
    descriptionArray.push(entityDescription);
  }
  description = manageListGrammar(descriptionArray, "and") + ".";
  return description;
}
function describeExits(keys, exits) {
  var descriptionArray = []
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var exitDescription = embolden(exits[key][1], key);
    descriptionArray.push(exitDescription);
  }
  description = manageListGrammar(descriptionArray, "or") + ".";
  return description;
}
function describeObstructions(obstructions, delimiter) {
  var descriptionArray = [];
  for (var i = 0; i < obstructions.length; i++) {
    var entity = obstructions[i];
    var exitKeys = Object.keys(entity.exits);
    for (var j = 0; j < exitKeys.length; j++) {
      var exit = entity.exits[exitKeys[j]];
      var entityDescription = embolden(exit[1], entity.givenName);
      if (testForWord(entityDescription, exitKeys[j])) {
        var entityDescription = embolden(entityDescription, exitKeys[j]);
      }
      descriptionArray.push(entityDescription);
    }
  }
  description = manageListGrammar(descriptionArray, delimiter) + ".";
  return description;
}
function buildCompleteDescription(room) {
  //Builds a complete description of a room.

  //Initialize all of the necessary variables.
  var entities = narrowEntitiesByLocation(getEntities(), room.name);
  var exits = room.exits;
  var exitKeys = Object.keys(exits);
  var interceptors = narrowEntitiesByLocation(getInterceptors(), room.name);
  var obstructions = narrowEntitiesByLocation(getObstructions(), room.name);
  //Set a blank description and add each element if it applies.
  var description = "";
  description += describe(room);
  if (entities.length > 0) {
    description += " You see " + describeEntities(room.name);
  }
  if (exitKeys.length > 0) {
    description += " You can " + describeExits(exitKeys, exits);
  }
  if (obstructions.length > 0) {
    description += " However, " + describeObstructions(obstructions, "and");
  }
  if (interceptors.length > 0) {
    description += " You can also " + describeObstructions(interceptors, "or");
  }
  //Return the description.
  return description;
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
function Room(name, description, exits, givenName, image, music) {
  if (typeof image == "undefined") {
    var image = "";
  }
  if (typeof music == "undefined") {
    var music = "";
  }
  this.name = name;
  this.image = image;
  this.music = music;
  this.description = description;
  this.exits = exits;
  this.givenName = givenName;
}
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
  var entities = narrowEntitiesByLocation(getEntities(), roomName);
  //Find the entity you're looking for
  var item = findByName(name, entities);
  //If it exists
  if (typeof item == "object") {
    return true;
  }
  return false;
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
  var location = getPlayer().location;
  var room = findByName(location, rooms);
  return room.exits;
}
function getRooms() {
  return getWorld().rooms;
}
//Movement----------------------------------------------------------------------
function warp(entity, roomName) {
  if (roomName != entity.prevLocation) {
    entity.prevLocation = entity.location;
  }
  entity.location = roomName;
}
function moveEntity(entity, direction) {
  //Moves an entity in the given direction. If there is no such direction, it
  //will fail loudly.

  var currentRoom = findByName(entity.location, getRooms());
  var exits = Object.assign(getInterceptorExits(entity.location),
    currentRoom.exits);
  var interceptors = narrowEntitiesByLocation(getInterceptors, entity.location);
  var obstructedExit = testForObstructions(direction, entity.location);
  //Make sure there's not an obstruction
  if (obstructedExit) {
    //Only announce the obstruction if the entity is the player.
    if (entity == getPlayer()) {
      var description = obstructedExit[1] + ".";
      output(description);
    }
  //If there isn't an obstruction, move them.
  } else {
    warp(entity, exits[direction][0]);
  }
}
function movePlayerByInput(input) {
  //Moves the player according to their input.

  //Gather information on the player's movement.
  var player = getPlayer();
  var direction = testForExits(getInput(), player.location);
  //See if they entered a valid direction
  if (direction) {
    moveEntity(player, direction);
    updateRoomDisplay(player.location);
  //If they didn't enter a valid direction, tell them.
  } else {
    output("You can't go that way.");
  }
}
function testForObstructions(input, roomName) {
  //Returns the exit that prevented movement.
  var player = getPlayer();
  var obstructions = getObstructions();
  obstructions = narrowEntitiesByLocation(obstructions, roomName);
  for (var i = 0; i < obstructions.length; i++) {
    var exits = Object.keys(obstructions[i].exits);
    for (var j = 0; j < exits.length; j++) {
      var exit = exits[j]
      if (testForWord(input, exit)) {
        return obstructions[i].exits[exit];
      }
    }
  }
  return false;
}
function testForExits(input, roomName) {
  var player = getPlayer();
  var room = findByName(roomName, getRooms());
  var exits = Object.keys(room.exits);
  exits = exits.concat(Object.keys(getInterceptorExits(room.name)));
  for (var i = 0; i < exits.length; i++) {
    var exit = exits[i]
    if (testForWord(input, exit)) {
      return exit;
    }
  }
  return false;
}
//Conversations-----------------------------------------------------------------
function Conversation(name, topics, methods) {
  //A conversation is a special entity. The "topics" parameter is an object
  //with string/string pairs, which gets converted into methods that output the
  //value. The "methods" parameter is optional, and works as expected.

  if (typeof methods == "undefined") {
    var methods = {};
  }
  this.name = name;
  this.location = "Nowhere";
  var keys = Object.keys(topics);
  this.methods = {};
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var paragraph = topics[key];
    addTopic(this, key, paragraph);
  }
  this.methods.goodbye = function() {
    endConversation(name);
    var player = getPlayer();
    output("**********");
    updateRoomDisplay(player.location);
  }
  Object.assign(this.methods, methods);
  this.methods.parent = this;
  this.givenName = "";
  this.advanceTurn = false;
}
function Monolog(name, sequence, displayInput, advanceTurn) {
  //A sequence is a special conversation that moves along regardless of input.
  //Instead of a dialog tree, it's a dialog railroad.
  this.name = name;
  this.location = "Nowhere";
  this.methods = {
    nothing: function() {
      var sequence = this.parent.sequence;
      sequence.i += 1;
      //If all of the sequence has been exhausted
      if (sequence.i - 1 == sequence.length) {
        //End the conversation.
        endConversation(name);
        var player = getPlayer();
        output("**********");
        updateRoomDisplay(player.location);
      //Otherwise
      } else {
        //display the next statement.
        sequence[sequence.i - 1]();
      }
    }
  }
  this.methods.parent = this;
  this.sequence = makeSequence(sequence);
  this.sequence.parent = this;
  this.givenName = "";
  if (displayInput) {
    this.displayInput = true;
  } else {
    this.displayInput = false;
  }
  if (advanceTurn) {
    this.advanceTurn = true;
  } else {
    this.advanceTurn = false;
  }
}
function getConversations() {
  return getWorld().conversations;
}
function startConversation(conversationName) {
  //Starts a conversation. It also clears out any conversations that were
  //already there, allowing you to start a conversation from within a
  //conversation.

  clearConversations();
  //get the player and conversation
  var player = getPlayer();
  var conversation = findByName(conversationName, getConversations());
  //warp them both to "Conversing". This room doesn't actually have to be
  //defined, as none of its properties will be displayed.
  warp(player, "Conversing");
  warp(conversation, "Conversing");
  output("**********");
  //Display the first topic or statement.
  var key = Object.keys(conversation.methods)[0];
  conversation.methods[key]();
}
function endConversation(conversationName) {
  //Ends a conversation. This is done silently, though it does move the player.

  var conversation = findByName(conversationName, getConversations());
  if (conversation.location == "Conversing") {
    if (conversation.sequence) {
      conversation.sequence.i = 0;
    }
    var player = getPlayer();
    warp(player, player.prevLocation);
    warp(conversation, "Nowhere");
  }
}
function clearConversations() {
  //Clears all conversations. Normally, there should only ever be one.

  var activeConvs = narrowEntitiesByLocation(getConversations(), "Conversing");
  for (var i = 0; i < activeConvs.length; i++) {
    endConversation(activeConvs[i].name);
  }
}
function addTopic(conversation, key, paragraph) {
  conversation.methods[key] = function() {
    output(paragraph);
  }
}
//World-------------------------------------------------------------------------
function getWorld() {
  return World;
}
function getInteractables() {
  return getEntities().concat(getObstructions(), getInterceptors(),
   getConversations(), getPlayer());
}
//Entities----------------------------------------------------------------------
function Entity(name, location, description, methods, givenName, turn) {
  this.methods = {
    nothing: function() {
      output("Do what with the " + givenName + "?");
    },
    look: function() {
      output("It's " + description + ".");
    },
    attack: function() {
      output("I don't think that's wise.");
    }
  }
  Object.assign(this.methods, methods);
  this.methods.parent = this;
  this.name = name;
  this.description = description;
  this.location = location;
  this.prevLocation = location;
  this.givenName = givenName;
  if (turn) {
    this.turn = turn;
  }
}
function getEntities() {
  return getWorld().entities;
}
function narrowEntitiesByLocation(entities, roomName) {
  var narrowedEntities = [];
  for (var i = 0; i < entities.length; i++) {
    var entity = entities[i];
    if (entity.location == roomName) {
      narrowedEntities.push(entity);
    }
  }
  return narrowedEntities;
}
function isPresent(name) {
  if(roomContains(getPlayer().location, name)) {
    return true;
  }
  return false;
}
//Obstructions------------------------------------------------------------------
function Obstruction(name, location, methods, exits, givenName, turn) {
  this.methods = {
    nothing: function() {
      output("Do what with the " + givenName + "?");
    }
  }
  Object.assign(this.methods, methods);
  this.methods.parent = this;
  this.name = name;
  this.location = location;
  this.prevLocation = location;
  this.exits = exits;
  this.givenName = givenName;
  if (turn) {
    this.turn = turn;
  }
}
function getObstructions() {
  return getWorld().obstructions;
}
//Interceptors------------------------------------------------------------------
function getInterceptors() {
  return getWorld().interceptors;
}
function getInterceptorExits(roomName) {
  var interceptors = narrowEntitiesByLocation(getInterceptors(), roomName);
  var exitArray = {};
  for (var i = 0; i < interceptors.length; i++) {
    var interceptor = interceptors[i];
    var exitKeys = Object.keys(interceptor.exits);
    for (var j = 0; j < exitKeys.length; j++) {
      var exitKey = exitKeys[j];
      exitArray[exitKey] = interceptor.exits[exitKey];
    }
  }
  return exitArray;
}
//Time--------------------------------------------------------------------------
function advanceTurn() {
  var interactables = getInteractables();
  interactables = interactables.filter(function(element){
    return element.location != "Nowhere"
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
  for (var i = 0; i < array.length; i++) {
    if (typeof array[i] == "string") {
      array[i] = wrapSequenceString(array[i]);
    }
  }
  array.i = 0;
  return array;
}
function wrapSequenceString(string) {
  //Wraps a string from a sequence.
  return function() {
    output(string);
  }
}
//Losing------------------------------------------------------------------------
function lose(message, undoMessage) {
  if (typeof undoMessage == "undefined") {
    var undoMessage = "You can type <strong>undo</strong> to try again.";
  }
  var player = getPlayer();
  var loseConversation = findByName("Lose", getConversations());
  addTopic(loseConversation, "message", message);
  addTopic(loseConversation, "nothing", undoMessage);
  startConversation("Lose");
  updateNameDisplay("You Lose");
  output(undoMessage);
}
function addLoseConversation() {
  //Adds the "lose" conversation to the world.
  var world = getWorld();
  var lose = new Conversation("Lose",
    {
      message: "",
      nothing: ""
    },
    {
      "undo": function() {
        endConversation("Lose");
        output("**********");
        updateRoomDisplay(getPlayer().location);
      },
      "goodbye": function() {
        this.nothing();
      }
    }
  )
  lose.displayInput = false;
  lose.advanceTurn = false;
  world.conversations.push(lose);
}
//Movies------------------------------------------------------------------------
function Movie(name, sequence, imgSuffix, sndSuffix) {
  //A movie is a special kind of monolog that draws images and sound effects
  //from a dedicated folder

  if (typeof imgSuffix == "undefined") {
    var imgSuffix = "jpg";
  }
  if (typeof sndSuffix == "undefined") {
    sndSuffix = "wav";
  }
  var monolog = new Monolog(name, sequence);
  monolog.methods.nothing = function() {
    var sequence = this.parent.sequence;
    sequence.i += 1;
    //If all of the sequence has been exhausted
    if (sequence.i - 1 == sequence.length) {
      //End the conversation.
      endConversation(name);
    //Otherwise
    } else {
      //display the next statement, display the next image, and play the next
      //sound file.
      var folder = "movies/" + this.parent.name;
      var imgPath = folder + "/images/" + (sequence.i - 1) + "." + imgSuffix;
      var sndPath = folder + "/audio/" + (sequence.i - 1) + "." + sndSuffix;
      updateImageDisplay(imgPath);
      playSound(sndPath);
      sequence[sequence.i - 1]();
    }
  }
  monolog.imgSuffix = imgSuffix;
  monolog.sndSuffix = sndSuffix;
  return monolog;
}
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
