//Player------------------------------------------------------------------------
function getPlayer() {
  return Player;
}
function getPlayerLocation() {
  var player = getPlayer();
  return player.location;
}
function inventoryContains(name) {
  var inventory = narrowEntitiesByLocation(getEntities(), "Inventory");
  var item = findByName(name, inventory);
  if (typeof item == "object") {
    return true;
  }
  return false;
}
//I/O Processing----------------------------------------------------------------
function enterHandler() {
  var outputBox = document.getElementById("outputBox");
  var inputBox = document.getElementById("inputBox");
  var input = inputBox.value;
  output(input);
  var player = getPlayer();
  var playerLocation = player.location;
  var parsedInput = parseInput(input, playerLocation);
  executeParsedInput(parsedInput);
  inputBox.value = "";
}
function output(str) {
  var outputBox = document.getElementById("outputBox");
  outputBox.innerHTML += "<br>>" + str;
  outputBox.scrollTop = outputBox.scrollHeight;
}
function listenForKey(e, key, callback) {
  if (e.key == key) {
    callback();
  }
}
//Input Processing--------------------------------------------------------------
function testForWord(input, word) {
  input = input.toLowerCase();
  word = word.toLowerCase();
  var synonyms = getSynonyms(word);
  if (synonyms) {
    for (var j = 0; j < synonyms.length; j++) {
      if (input.includes(synonyms[j])) {
        return true;
      }
    }
  } else if (input.includes(word)) {
    return true;
  } else {
    return false;
  }
}
function getSynonyms(word) {;
  return SYNONYMS[word];
}
function getInput() {
  var inputBox = document.getElementById("inputBox");
  return inputBox.value;
}
function detectEntity(input, entities) {
  for (var i = 0; i < entities.length; i++) {
    var entity = entities[i];
    var entityName = entity.givenName;
    if (testForWord(input, entityName)) {
      return entity;
    }
  }
  return getPlayer();
}
function detectAction(input, subject) {
  var methodKeys = Object.keys(subject.methods);
  for (var i = 0; i < methodKeys.length; i++) {
    var key = methodKeys[i];
    if(testForWord(input, key)) {
      if (testForWord("parent", key)) {
        return "nothing";
      } else {
        return key;
      }
    }
  }
  return "nothing";
}
function parseInput(input) {
  var location = getPlayerLocation();
  var entities = getEntities().concat(getObstructions());
  entities = narrowEntitiesByLocation(entities, location);
  var subject = detectEntity(input, entities);
  if (subject == getPlayer()) {
    entities = narrowEntitiesByLocation(getEntities(), "Inventory");
    subject = detectEntity(input, entities);
  }
  var action = detectAction(input, subject);
  return [subject, action];
}
function executeParsedInput(parsedInput) {
  var subject = parsedInput[0];
  var action = parsedInput[1];
  subject.methods[action]();
}
//Setup-------------------------------------------------------------------------
function inputSetup() {
  var inputBox = document.getElementById("inputBox");
  inputBox.onkeydown = function() {listenForKey(event, "Enter", enterHandler);};
  inputBox.focus();
}
function imageSetup(room) {
  var image = document.getElementById("imageDisplay");
  if (USE_IMAGES == true) {
    updateImageDisplay(room.image);
  } else {
    var outputBox = document.getElementById("outputBox");
    outputBox.style.height = "75%";
    image.style.width = 0;
    image.style.height = 0;
  }
}
function audioSetup() {
  if (USE_SOUND) {
    var musicControls = document.getElementById("musicControls");
    var soundControls = document.getElementById("soundControls");
    musicControls.onclick = function() {musicControlsClick();};
    soundControls.onclick = function() {soundControlsClick();};
  } else {
    var audio = document.getElementById("audio");
    var music = document.getElementById("music");
    var sound = document.getElementById("sound");
    music.volume = 0;
    sound.volume = 0;
    audio.style.display = "none";
  }
}
function setup() {
  var startingRoom = findByName(STARTING_ROOM, getRooms());
  inputSetup();
  imageSetup(startingRoom);
  audioSetup();
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
    description += " There's " + describeEntities(room) + ".";
  }
  if (exitKeys.length > 0) {
    description += " You can " + describeExits(exitKeys, exits) + ".";
  }
  if (obstructions.length > 0) {
    description += " However, " + describeObstructions(room) + ".";
  }
  if (interceptorKeys.length > 0) {
    description += " You can also " + describeExits(interceptorKeys, interceptorExits) + ".";
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
    entityDescription = embolden(entityDescription, entity.exit[0]);
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
  var re = new RegExp(substr, "i");
  var index = string.search(re);
  var strA = string.slice(0, index);
  var strB = string.slice(index + substr.length);
  var substrings = string.split(re);
  var description = strA + "<strong>" + substr + "</strong>" + strB;
  return description;
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
    output(description + ".");
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
