//Player------------------------------------------------------------------------
function PlayerEntity(methods) {
  this.methods = {
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
    move: function() {
      var input = getInput();
      movePlayerByInput(input);
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
      description += ". Other context-sensitive commands may also be available.";
      output(description);
    }

  }
  Object.assign(this.methods, methods);
  this.location = STARTING_ROOM;
  this.prevLocation = this.location;
}
function getPlayer() {
  //Returns the global Player object.
    return Player;

}
function getPlayerLocation() {
  //Returns the player's location. This is mostly for convenience.

  var player = getPlayer();
  return player.location;
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

  //Get the output box
  var outputBox = document.getElementById("outputBox");
  //Get and display input.
  var input = getInput();
  //Get the player's location.
  var playerLocation = getPlayerLocation();
  //Parse the input.
  var parsedInput = parseInput(input, playerLocation);
  var subject = parsedInput[0];
  var action = parsedInput[1];
  //Unless the subject is a sequence
  if (!subject.sequence) {
    //Output the player's input
    output(input);
  }
  //Execute the input.
  subject.methods[action]();
  //Blank the input box.
  inputBox.value = "";
}
function output(str) {
  //Outputs a string to the output box.

  //Get the output box
  var outputBox = document.getElementById("outputBox");
  //Append the string onto the output box's content and scroll to the bottom.
  outputBox.innerHTML += "<p>>" + str + "</p>";
  outputBox.scrollTop = outputBox.scrollHeight;
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
  return SYNONYMS[word];
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
  var location = getPlayerLocation();
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
  inputBox.onkeydown = function(event) {listenForKey(event, "Enter", enterHandler);};
  inputBox.focus();
}
function imageSetup() {
  //Finds the imageDisplay and configures it according to USE_IMAGES
  var image = document.getElementById("imageDisplay");
  //If USE_IMAGES is true
  if (USE_IMAGES) {
    //Update it.
    var room = findByName(STARTING_ROOM, getRooms());
    updateImageDisplay(room.image);
  } else {
    //If not make the imageDisplay disappear.
    var outputBox = document.getElementById("outputBox");
    image.style.display = "none";
  }
}
function audioSetup() {
  //Sets up the audio buttons.

  //If USE_SOUND is true
  if (USE_SOUND) {
    //Find the controls
    var musicControls = document.getElementById("musicControls");
    var soundControls = document.getElementById("soundControls");
    //Apply handlers to them.
    musicControls.onclick = function() {toggleSoundElement("music");};
    soundControls.onclick = function() {toggleSoundElement("sound");};
  } else {
    //Otherwise
    //Find the actual audio fields and their containing div
    var audio = document.getElementById("audio");
    var music = document.getElementById("music");
    var sound = document.getElementById("sound");
    //Set their volume to 0 and set the div's display to none.
    music.volume = 0;
    sound.volume = 0;
    audio.style.display = "none";
  }
}
function init() {
  //This function exists to support game.js files with no init function.

  updateRoomDisplay(STARTING_ROOM);
}
function preloadImages() {
  //Preloads images, if they exist.
  if (USE_IMAGES) {
    var rooms = getRooms();
    for (var i = 0; i < rooms.length; i++) {
      var room = rooms[i];
      new Image().src = room.image;
    }
  }
}
function setup() {
  //Runs necessary setup functions.
  var startingRoom = findByName(STARTING_ROOM, getRooms());
  nameSetup();
  inputSetup();
  imageSetup();
  audioSetup();
  changeMusic(startingRoom.music);
  addMethodParents();
  preloadImages();
  //init() is defined in game.js
  init();
}
//Sound-------------------------------------------------------------------------
function toggleSoundElement(elementName) {
  //Toggles the given sound controls

  //Get the music controls
  var musicControls = document.getElementById(elementName + "Controls");
  //If they're muted
  if (musicControls.muted) {
    //unmute them
    musicControls.muted = false;
    musicControls.src = "../../Sound.png";
    var music = document.getElementById(elementName);
    music.volume = 1;
  //otherwise
  } else {
    //mute them
    musicControls.muted = true;
    musicControls.src = "../../Muted.png";
    var music = document.getElementById(elementName);
    music.volume = 0;
  }
}
function changeMusic(song) {
  //Changes the currently playing song

  //Get the music player
  var music = document.getElementById("music");
  var currentSong = music.currentSong;
  //If it's current song matches the song we want
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
  var imageDisplay = document.getElementById("imageDisplay");
  if (USE_IMAGES == true) {
    imageDisplay.src = image;
  }
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
  updateImageDisplay(room.image);
  changeMusic(room.music);
  //Build and output a description of the room.
  var description = buildCompleteDescription(room);
  output(description);
}
function describe(room) {
  return room.description;
}
function describeEntities(room) {
  var descriptionArray = [];
  var entities = getEntities();
  var narrowedEntities = narrowEntitiesByLocation(entities, room.name);
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
  var exits = getCurrentExits();
  var exitKeys = Object.keys(exits);
  var interceptors = narrowEntitiesByLocation(getInterceptors(), room.name);
  var obstructions = narrowEntitiesByLocation(getObstructions(), room.name);
  //Set a blank description and add each element if it applies.
  var description = "";
  description += describe(room);
  if (entities.length > 0) {
    description += " You see " + describeEntities(room);
  }
  if (exitKeys.length > 0) {
    description += " You can " + describeExits(exitKeys, exits);
  }
  if (interceptors.length > 0) {
    description += " You can also " + describeObstructions(interceptors, "or");
  }
  if (obstructions.length > 0) {
    description += " However, " + describeObstructions(obstructions, "and");
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
  //Bolds a substring within a string. If the string does not contain the
  //substring, it returns the original string.

  //Test for substring within string.
  if (string.includes(substr)) {
    //Convert string into a RegExp
    var re = new RegExp(substr, "i");
    //Use string.replace to add strong tags around the substring.
    var description = string.replace(re, function(str) {
      return "<strong>" + str + "</strong>";
    });
    return description;
  } else {
    return string;
  }
}
//Rooms-------------------------------------------------------------------------
function Room(name, description, exits, givenName, image, music) {
  if (image === undefined) {
    var image = "";
  }
  if (music === undefined) {
    var music = "";
  }
  this.name = name;
  this.image = image;
  this.music = music;
  this.description = description;
  this.exits = exits;
  this.givenName = givenName;
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
  var location = getPlayerLocation();
  var room = findByName(location, rooms);
  return room.exits;
}
function getRooms() {
  return roomArray;
}
//Movement----------------------------------------------------------------------
function warp(entity, roomName) {
  if (roomName) {
    entity.prevLocation = entity.location;
    entity.location = roomName;
  };
}
function moveEntity(entity, direction) {
  var currentRoom = findByName(entity.location, getRooms());
  var exits = currentRoom.exits;
  var interceptors = narrowEntitiesByLocation(getInterceptors, entity.location);
  var interceptorExits = getInterceptorExits(currentRoom);
  if (interceptorExits[direction]) {
    warp(entity, interceptorExits[direction][0]);
  }
  if (exits[direction]) {
    warp(entity, exits[direction][0]);
  }
}
function movePlayerByInput(input) {
  //Moves the player according to their input.

  //Gather information on the player's movement.
  var player = getPlayer();
  var currentRoom = findByName(player.location, getRooms());
  var direction = testForExits(getInput(), currentRoom);
  var obstruction = testForObstructions(getInput(), currentRoom);
  //See if they entered a valid direction
  if (direction) {
    //Make sure there's not an obstruction
    if (obstruction) {
      var description = embolden(obstruction[1], direction);
      description = embolden(description, obstruction.givenName) + ".";
      output(description);
      return;
    //If there isn't an obstruction, move them.
    } else {
      moveEntity(player, direction);
      updateRoomDisplay(player.location);
      return;
    }
  //If they didn't enter a valid direction, tell them.
  } else {
    output("You can't go that way.");
  }
}
function testForObstructions(input, room) {
  //Returns the exit that prevented movement.
  var player = getPlayer();
  var obstructions = getObstructions();
  obstructions = narrowEntitiesByLocation(obstructions, room.name);
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
function testForExits(input, room) {
  var player = getPlayer();
  var exits = Object.keys(room.exits);
  exits = exits.concat(Object.keys(getInterceptorExits(room)));
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

  if (methods === undefined) {
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
  Object.assign(this.methods, methods);
  this.methods.goodbye = function() {
    endConversation(name);
  }
  this.givenName = "";
}
function Sequence(name, sequence) {
  //A sequence is a special conversation that moves along regardless of input.
  //Instead of a dialog tree, it's a dialog railroad.
  this.name = name;
  this.location - "Nowhere";
  this.methods = {
    nothing: function() {
      //If all of the sequence has been exhausted
      if (this.parent.i >= this.parent.sequence.length) {
        //End the conversation.
        this.parent.i = 0;
        endConversation(name);
      //Otherwise
      } else {
        //display the next statement.
        output("\"" + this.parent.sequence[this.parent.i] + "\"");
        this.parent.i += 1;
      }
    }
  };
  this.i = 0;
  this.sequence = sequence;
  this.givenName = "";
}
function getConversations() {
  return conversationArray;
}
function startConversation(conversationName) {
  //Starts a conversation

  //get the player and conversation
  var player = getPlayer();
  var conversation = findByName(conversationName, getConversations());
  //warp them both to "Conversing". This room doesn't actually have to be
  //defined, as none of its properties will be displayed.
  warp(player, "Conversing");
  warp(conversation, "Conversing");
  //If the conversation is a sequence
  if (conversation.sequence) {
    //Let the player know.
    output("You start a conversation. <em>Press ENTER to advance \
    dialog.</em>");
  } else {
    //instruct the player to say "goodbye".
    output("You start a conversation. <em>you can end it by saying \
    <strong>goodbye</strong>.</em>");
  }
  output("**********");
  //Display the first topic or statement.
  var key = Object.keys(conversation.methods)[0];
  conversation.methods[key]();
}
function endConversation(conversationName) {
  var player = getPlayer();
  var conversation = findByName(conversationName, getConversations());
  warp(player, player.prevLocation);
  warp(conversation, conversation.prevLocation);
  output("**********");
  updateRoomDisplay(player.location);
}
function addTopic(conversation, key, paragraph) {
  conversation.methods[key] = function() {
    output("\"" + paragraph + "\"");
  }
}
//Interactables-----------------------------------------------------------------
function getInteractables() {
  return getEntities().concat(getObstructions(), getInterceptors(), getConversations());
}
//Entities----------------------------------------------------------------------
function Entity(name, location, description, methods, givenName) {
  this.methods = {
    nothing: function() {
      output("Do what with the " + givenName + "?");
    },
    look: function() {
      output("It's " + description + ".");
    }
  }
  this.name = name;
  this.description = description;
  this.location = location;
  this.prevLocation = location;
  Object.assign(this.methods, methods);
  this.givenName = givenName;
}
function getEntities() {
  return entityArray;
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
function addMethodParents() {
  var interactables = getInteractables();
  for (var i = 0; i < interactables.length; i++) {
    var interactable = interactables[i];
    interactable.methods.parent = interactable;
  }
}
function isPresent(name) {
  var entities = getEntities();
  var player = getPlayer();
  var narrowedEntities = narrowEntitiesByLocation(entities, player.location);
  var entity = findByName(name, narrowedEntities);
  if(typeof entity == "object") {
    return true;
  }
  return false;
}
//Obstructions------------------------------------------------------------------
function Obstruction(name, location, methods, exits, givenName) {
  this.methods = {
    nothing: function() {
      output("Do what with the " + givenName + "?");
    }
  }
  this.name = name;
  this.location = location;
  this.prevLocation = location;
  Object.assign(this.methods, methods);
  this.exits = exits;
  this.givenName = givenName;
}
function getObstructions() {
  return obstructionArray;
}
//Interceptors------------------------------------------------------------------
function getInterceptors() {
  return interceptorArray;
}
function getInterceptorExits(room) {
  var interceptors = narrowEntitiesByLocation(getInterceptors(), room.name);
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
