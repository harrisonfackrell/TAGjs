//Player------------------------------------------------------------------------
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
  output(input);
  //Get the player's location.
  var playerLocation = getPlayerLocation();
  //Parse and execute input.
  var parsedInput = parseInput(input, playerLocation);
  executeParsedInput(parsedInput);
  //Blank the input box.
  inputBox.value = "";
}
function output(str) {
  //Outputs a string to the output box.

  //Get the output box
  var outputBox = document.getElementById("outputBox");
  //Append the string onto the output box's content and scroll to the bottom.
  outputBox.innerHTML += "<br>>" + str;
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
  var entities = getEntities().concat(getObstructions());
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
function executeParsedInput(parsedInput) {
  //Executes parsed input.

  //Extract the subject and the action
  var subject = parsedInput[0];
  var action = parsedInput[1];
  //Run subject.methods.action
  subject.methods[action]();
}
//Setup-------------------------------------------------------------------------
function inputSetup() {
  //Finds the inputBox and assigns the necessary handler to it.
  var inputBox = document.getElementById("inputBox");
  inputBox.onkeydown = function() {listenForKey(event, "Enter", enterHandler);};
  inputBox.focus();
}
function imageSetup(room) {
  //Finds the imageDisplay and configures it according to USE_IMAGES
  var image = document.getElementById("imageDisplay");
  //If USE_IMAGES is true
  if (USE_IMAGES) {
    //Update it.
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
    musicControls.onclick = function() {musicControlsClick();};
    soundControls.onclick = function() {soundControlsClick();};
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
function setup() {
  //Runs necessary setup functions.
  var startingRoom = findByName(STARTING_ROOM, getRooms());
  inputSetup();
  imageSetup(startingRoom);
  audioSetup();
  //init() is defined in game.js
  init();
  updateRoomDisplay(startingRoom);
  changeMusic(startingRoom.music);
  addMethodParents();
}
//Sound-------------------------------------------------------------------------
function musicControlsClick() {
  var musicControls = document.getElementById("musicControls");
  if (musicControls.muted) {
    musicControls.muted = 0;
    musicControls.src = "../../Sound.png";
    var music = document.getElementById("music");
    music.volume = 1;
  } else {
    musicControls.muted = 1;
    musicControls.src = "../../Muted.png";
    var music = document.getElementById("music");
    music.volume = 0;
  }
}
function changeMusic(song) {
  var music = document.getElementById("music");
  var currentSong = music.currentSong;
  if (song == currentSong || song == "") {
    return;
  } else {
    music.src = song;
    music.currentSong = song;
  }
}
function soundControlsClick() {
  var soundControls = document.getElementById("soundControls");
  if (soundControls.muted) {
    soundControls.muted = 0;
    soundControls.src = "../../Sound.png";
    var sound = document.getElementById("sound");
    sound.volume = 1;
  } else {
    soundControls.muted = 1;
    soundControls.src = "../../Muted.png";
    var sound = document.getElementById("sound");
    sound.volume = 0;
  }
}
function playSound(sound) {
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
}
function updateRoomDisplay(room) {
  var givenName = room.givenName;
  var image = room.image;
  updateNameDisplay(givenName);
  updateImageDisplay(image);
  var entities = narrowEntitiesByLocation(getEntities(), room.name);
  var exits = getCurrentExits();
  var exitKeys = Object.keys(exits);
  var obstructions = narrowEntitiesByLocation(getObstructions(), room.name);
  var interceptorExits = getInterceptorExits(room);
  var interceptorKeys = Object.keys(interceptorExits);
  var description = "";
  description += describe(room);
  if (entities.length > 0) {
    description += " There's " + describeEntities(room);
  }
  if (exitKeys.length > 0) {
    description += " You can " + describeExits(exitKeys, exits);
  }
  if (obstructions.length > 0) {
    description += " However, " + describeObstructions(room);
  }
  if (interceptorKeys.length > 0) {
    description += " You can also " + describeExits(interceptorKeys, interceptorExits);
  }
  output(description);
}
function describe(room) {
  return room.description;
}
function describeEntities(room) {
  var description = ""
  var entities = getEntities();
  var playerLocation = getPlayerLocation();
  var narrowedEntities = narrowEntitiesByLocation(entities, room.name);
  for (var i = 0; i < narrowedEntities.length; i++) {
    var entity = narrowedEntities[i];
    var entityDescription = embolden(entity.description, entity.givenName);
    description += manageEntityGrammar(entityDescription, narrowedEntities.length, i);
  }
    return description;
}
function describeExits(keys, exits) {
  var description = "";
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var exitDescription = embolden(exits[key][1], key);
    if (i == 0) {
      description += exitDescription;
    } else if (i < keys.length - 1) {
      description += ", " + exitDescription;
    } else if (i >= keys.length - 1) {
      description += " or " + exitDescription;
    }
  }
  return(description);
}
function describeObstructions(room) {
  var description = ""
  var entities = getObstructions();
  var playerLocation = getPlayerLocation();
  var narrowedEntities = narrowEntitiesByLocation(entities, room.name);
  for (var i = 0; i < narrowedEntities.length; i++) {
    var entity = narrowedEntities[i];
    var entityDescription = embolden(entity.exit[1], entity.givenName);
    if (testForWord(entityDescription, entity.exit[0])) {
      var entityDescription = embolden(entityDescription, entity.exit[0]);
    }
    description += manageEntityGrammar(entityDescription, length, i);
  }
  return description;
}
function manageEntityGrammar(entityDescription, length, i) {
  if (i == 0) {
    return entityDescription;
  } else if (i < length - 1) {
    return ", " + entityDescription;
  } else if (i >= length - 1) {
    return " and " + entityDescription;
  }
}
function embolden(string, substr) {
  //Bolds a substring within a string. If the string does not contain the
  //substring, it returns the original string.

  //Test for substring within string.
  if (string.includes(substr)) {
    //Convert string into a RegExp
    var re = new RegExp(substr, "i");
    //Find the position of the substring
    var index = string.search(re);
    //Split the string into two strings around the substring.
    var strA = string.slice(0, index);
    var strB = string.slice(index + substr.length);
    //Reconstruct the string, but with strong tags around the substring.
    var description = strA + "<strong>" + substr + "</strong>" + strB;
    //Return the reconstructed string.
    return description;
  }
  return string;
}
//Rooms-------------------------------------------------------------------------
function Room(name, image, music, description, exits, givenName) {
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
  return ROOM_ARRAY;
}
//Movement----------------------------------------------------------------------
function warp(entity, roomName) {
  if (roomName) {
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
  var player = getPlayer();
  var currentRoom = findByName(player.location, getRooms());
  var obstruction = testForObstructions(getInput(), currentRoom);
  var direction = testForExits(getInput(), currentRoom);
  if (obstruction) {
    var description = embolden(obstruction.exit[1], obstruction.exit[0]);
    description = embolden(description, obstruction.givenName);
    output(description);
    return;
  }
  if (direction) {
    moveEntity(player, direction);
    var newRoom = findByName(player.location, getRooms());
    updateRoomDisplay(newRoom);
    changeMusic(newRoom.music);
    return;
  }
  output("You can't go that way.");
}
function testForObstructions(input, room) {
  var obstructions = getObstructions();
  obstructions = narrowEntitiesByLocation(obstructions, room.name);
  for (var i = 0; i < obstructions.length; i++) {
    var exit = obstructions[i].exit[0];
    if (testForWord(getInput(), exit)) {
      return obstructions[i];
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
//Objects-----------------------------------------------------------------------
//Entities----------------------------------------------------------------------
function Entity(name, location, description, methods, givenName) {
  this.name = name;
  this.description = description;
  this.location = location;
  this.methods = methods;
  this.givenName = givenName;
}
function getEntities() {
  return entityArray;
}
function narrowEntitiesByLocation(entities, location) {
  var narrowedEntities = [];
  for (var i = 0; i < entities.length; i++) {
    var entity = entities[i];
    if (entity.location == location) {
      narrowedEntities.push(entity);
    }
  }
  return narrowedEntities;
}
function addMethodParents() {
  var entities = getEntities();
  var obstructions = getObstructions();
  var player = getPlayer();
  var interactables = entities.concat(obstructions);
  interactables.push(player);
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
function Obstruction(name, location, methods, exit, givenName) {
  this.name = name;
  this.location = location;
  this.methods = methods;
  this.exit = exit;
  this.givenName = givenName;
}
function getObstructions() {
  return obstructionArray;
}
//Interceptors------------------------------------------------------------------
function Interceptor(name, location, exits) {
  this.name = name;
  this.location = location;
  this.exits = exits;
}
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
