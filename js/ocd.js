const die_colors = ["red", "gray", "black", "white"];
const roll_mod = document.getElementById("rollmodifiers");
const lock_mod = document.getElementById("lockmodifiers");
const move_rslt = document.getElementById("move-result");
const dng = new Map();
const dngtile = new Map();
const mnstrtypes = new Map();
const hero = new Hero("Hero", "", 2, 1, 1, 1, 2);
var curtiles;
var heroelement;
var currentLevel = 1;
var gamesetup;
document.addEventListener("DOMContentLoaded", (event) => {
  console.log("DOM fully loaded and parsed");
  setupBoard(currentLevel);
  roll_mod.addEventListener("click", (event) => {
    rollModifiers();
  });
  lock_mod.addEventListener("click", (event) => {
    lockModifiers();
  });
});
function Hero(name, hero_class, base_health, base_atk, base_def, base_move, base_rng) {
  (this.name = name), (this.Health = base_health), (this.class = hero_class), (this.Attack = base_atk), (this.Defense = base_def), (this.Move = base_move), (this.Range = base_rng);
}
function Monster(monster_type, monster_img, base_health, base_atk, base_def, base_move, base_rng) {
  (this.Type = monster_type), (this.Image = monster_img), (this.Health = base_health), (this.Attack = base_atk), (this.Defense = base_def), (this.Move = base_move), (this.Range = base_rng);
}
function DungeonLevel(level, mnstrtype, ary) {
  (this.Level = level), (this.MonsterType = mnstrtype), (this.Layout = ary);
}
dngtile.set(
  1,
  new DungeonLevel(1, "SPIDER", [
    ["EMPTY", "EMPTY", "EMPTY", "SPIDER", "EXIT"],
    ["EMPTY", "EMPTY", "EMPTY", "WALL", "EMPTY"],
    ["EMPTY", "EMPTY", "EMPTY", "EMPTY", "SPIDER"],
    ["EMPTY", "WALL", "EMPTY", "WALL", "EMPTY"],
    ["ENTER", "EMPTY", "EMPTY", "EMPTY", "EMPTY"],
  ])
);
dngtile.set(
  2,
  new DungeonLevel(2, "SKELETON", [
    ["EXIT", "EMPTY", "SKELETON", "EMPTY", "EMPTY"],
    ["SKELETON", "EMPTY", "EMPTY", "EMPTY", "EMPTY"],
    ["WALL", "EMPTY", "EMPTY", "WALL", "EMPTY"],
    ["EMPTY", "EMPTY", "EMPTY", "WALL", "EMPTY"],
    ["EMPTY", "EMPTY", "EMPTY", "EMPTY", "ENTER"],
  ])
);
dngtile.set(
  3,
  new DungeonLevel(3, "OGRE", [
    ["EMPTY", "EMPTY", "EMPTY", "EMPTY", "EXIT"],
    ["EMPTY", "WALL", "EMPTY", "WALL", "OGRE"],
    ["EMPTY", "EMPTY", "EMPTY", "EMPTY", "EMPTY"],
    ["EMPTY", "WALL", "EMPTY", "EMPTY", "EMPTY"],
    ["ENTER", "EMPTY", "EMPTY", "EMPTY", "EMPTY"],
  ])
);
dngtile.set(
  4,
  new DungeonLevel(4, "DRAGON", [
    ["EXIT", "DRAGON", "EMPTY", "EMPTY", "EMPTY"],
    ["EMPTY", "WALL", "EMPTY", "EMPTY", "EMPTY"],
    ["EMPTY", "WALL", "EMPTY", "EMPTY", "WALL"],
    ["EMPTY", "EMPTY", "EMPTY", "EMPTY", "EMPTY"],
    ["EMPTY", "EMPTY", "EMPTY", "EMPTY", "ENTER"],
  ])
);
dngtile.set(
  5,
  new DungeonLevel(5, "SPIDER", [
    ["EMPTY", "SPIDER", "EMPTY", "EMPTY", "EXIT"],
    ["EMPTY", "EMPTY", "EMPTY", "WALL", "SPIDER"],
    ["EMPTY", "EMPTY", "EMPTY", "EMPTY", "EMPTY"],
    ["EMPTY", "WALL", "EMPTY", "WALL", "EMPTY"],
    ["ENTER", "EMPTY", "EMPTY", "EMPTY", "SPIDER"],
  ])
);
dngtile.set(
  6,
  new DungeonLevel(6, "SKELETON", [
    ["EXIT", "EMPTY", "SKELETON", "EMPTY", "EMPTY"],
    ["SKELETON", "EMPTY", "EMPTY", "EMPTY", "EMPTY"],
    ["WALL", "EMPTY", "EMPTY", "WALL", "EMPTY"],
    ["EMPTY", "EMPTY", "EMPTY", "WALL", "EMPTY"],
    ["EMPTY", "EMPTY", "EMPTY", "EMPTY", "ENTER"],
  ])
);
dngtile.set(
  7,
  new DungeonLevel(7, "OGRE", [
    ["EMPTY", "EMPTY", "EMPTY", "EMPTY", "EXIT"],
    ["EMPTY", "WALL", "EMPTY", "WALL", "OGRE"],
    ["EMPTY", "EMPTY", "EMPTY", "EMPTY", "EMPTY"],
    ["EMPTY", "WALL", "EMPTY", "EMPTY", "EMPTY"],
    ["ENTER", "EMPTY", "EMPTY", "EMPTY", "EMPTY"],
  ])
);
dngtile.set(
  8,
  new DungeonLevel(8, "DRAGON", [
    ["EXIT", "DRAGON", "EMPTY", "EMPTY", "EMPTY"],
    ["EMPTY", "WALL", "EMPTY", "EMPTY", "EMPTY"],
    ["EMPTY", "WALL", "EMPTY", "EMPTY", "WALL"],
    ["EMPTY", "EMPTY", "EMPTY", "EMPTY", "EMPTY"],
    ["EMPTY", "EMPTY", "EMPTY", "EMPTY", "ENTER"],
  ])
);
dngtile.set(
  9,
  new DungeonLevel(9, "SPIDER", [
    ["SPIDER", "EMPTY", "EMPTY", "EMPTY", "EXIT"],
    ["EMPTY", "WALL", "EMPTY", "WALL", "EMPTY"],
    ["EMPTY", "EMPTY", "SPIDER", "EMPTY", "EMPTY"],
    ["EMPTY", "WALL", "EMPTY", "EMPTY", "SPIDER"],
    ["ENTER", "EMPTY", "SPIDER", "EMPTY", "EMPTY"],
  ])
);
mnstrtypes.set("SPIDER", new Monster("SPIDER", "img/spider.svg", 2, 5, 4, 5, 3));
mnstrtypes.set("SKELETON", new Monster("SKELETON", "", 3, 4, 5, 4, 4));
mnstrtypes.set("DRAGON", new Monster("DRAGON", "img/dragon.svg", 5, 5, 5, 5, 5));
mnstrtypes.set("OGRE", new Monster("OGRE", "", 5, 3, 7, 7, 2));

// DRAG AND DROP EVENTS
var dragelem;
var prevtarget;
var dragsrc;
var dragtype;
var dragarea;
function dragStart(event) {
  event.dataTransfer.dropEffect = "move";
  event.dataTransfer.effectAllowed = "move";
  dragelem = event.target.id;
  dragsrc = event.target.parentElement;
  dragarea = dragsrc.parentElement;
  console.log("dragarea",dragarea);
  console.log("x","y", "")
  event.dataTransfer.setData("text/plain", event.target.id);
  setTimeout(function () {
    event.target.style.visibility = "hidden";
  }, 0);
}
function dragEnd(event) {
  event.target.style.visibility = "visible";
  dragarea = null;
}
function dungeonDragOver(event) {
  candrop = document.getElementById(dragelem).classList.contains("dungeon-movable");
  if (candrop){
    event.preventDefault();
  }
}
function modifierDragOver(event) {
  candrop = dragelem.includes("modifier");
  if (candrop){
    event.preventDefault();
  }
}
function dungeonTargetDragDrop(event) {
  var dropzone = getDungeonTarget(event.target);
  if (!event.target.classList.contains("dungeon-tile")) {
    dropzone = event.target.parentElement;
  }
  var id = event.dataTransfer.getData("text/plain");
  var draggable = document.getElementById(id);
  if (draggable.parentElement.id !== dropzone.id) {
    toggleChildren(draggable.parentElement, true);
    toggleChildren(dropzone, false);
    dropzone.appendChild(draggable);
    if (dropzone.classList.contains("exit-location")){
      currentLevel+=1;
      levelUp();
      setupBoard(currentLevel);
    }

  }
}
function getDungeonTarget(target) {
  if (target.classList.contains("dungeon-tile")) {
    return target;
  } else if (target.parentElement.classList.contains("dungeon-tile")) {
    return target.parentElement;
  }
}
function modifierDragDrop(event) {
  var draggedimg = document.getElementById(event.dataTransfer.getData("text/plain"));
  var droptarget = getModDropTarget(event.target);
  if (droptarget){
    draggedimg.parentElement.appendChild(droptarget.childNodes[0]);
    droptarget.appendChild(draggedimg);
  }
}
function getModDropTarget(target) {
  if (target.classList.contains("hero-tile")) {
    return target;
  } else if (target.parentElement.classList.contains("hero-tile")) {
    return target.parentElement;
  } else {
    return null;
  }
}
// END DRAG AND DROP EVENTS

function toggleChildren(elem, visible) {
  if (elem) {
    const children = elem.children;
    for (let i = 0; i < children.length; i++) {
      children[i].style.display = visible ? "grid" : "none";
    }
  }
}
function setupMonster(monstertype) {
  var mnstr = mnstrtypes.get(monstertype);
  var elem = createImageElement("monster-img", mnstr.Image, false);
  elem.classList.add("monster-icon");
  document.getElementById("monster-image").innerHTML = "";
  document.getElementById("monster-image").appendChild(elem);
  document.getElementById("monster-type").innerText = mnstr.Type;
  document.getElementById("monster-attack").innerText = mnstr.Attack;
  document.getElementById("monster-move").innerText = mnstr.Move;
  document.getElementById("monster-defense").innerText = mnstr.Defense;
  document.getElementById("monster-range").innerText = mnstr.Range;
}
function setupHero() {
  var hatk = document.getElementById("hero-attack");
  var hmv = document.getElementById("hero-move");
  var hdf = document.getElementById("hero-defense");
  var hrg = document.getElementById("hero-range");
  hatk.innerHTML = "";
  hmv.innerHTML = "";
  hdf.innerHTML = "";
  hrg.innerHTML = "";
  hatk.appendChild(createImageElement("hero-atk", getDieImage("white", hero.Attack), false));
  hmv.appendChild(createImageElement("hero-mv", getDieImage("white", hero.Move), false));
  hdf.appendChild(createImageElement("hero-df", getDieImage("white", hero.Defense), false));
  hrg.appendChild(createImageElement("hero-rg", getDieImage("white", hero.Range), false));
  hatk.addEventListener("click", heroElemClick);
  hmv.addEventListener("click", heroElemClick);
  hdf.addEventListener("click", heroElemClick);
  hrg.addEventListener("click", heroElemClick);
}
function heroElemClick(event) {
  switch (getHeroTarget(event.target).id) {
    case "hero-atk":
      break;
    case "hero-move":
      break;
    case "hero-defense":
      break;
    case "hero-range":
      break;
    default:
  }
}
function getHeroTarget(target) {
  if (target.classList.contains("hero-tile")) {
    return target;
  } else if (target.parentElement.classList.contains("hero-tile")) {
    return target.parentElement;
  }
}
function fillTiles(level) {
  var curmonsterid = 1;
  for (var i = 0; i <= 4; i++) {
    for (var j = 0; j <= 4; j++) {
      var tile = document.getElementById("dungeon-tile-" + (i + 1) + "-" + (j + 1));
      tile.innerHTML = "";
      switch (curtiles.Layout[i][j]) {
        case "WALL":
          tile.appendChild(createImageElement("wall", "img/wall.svg", false));
          break;
        case "EMPTY":
          tile.addEventListener("dragover", dungeonDragOver);
          tile.addEventListener("drop", dungeonTargetDragDrop);
          tile.addEventListener("dragend", dragEnd);
          break;
        case "ENTER":
          var elem = createImageElement("hero-element", getDieImage("white", hero.Health), true);
          elem.classList.add("dungeon-movable")
          elem.addEventListener("dragstart", dragStart);
          elem.addEventListener("dragend", dragEnd);
          var cls = document.createElement("div");
          cls.classList.add("center");
          cls.style.display = "none";
          cls.innerText = "enter";
          tile.appendChild(cls);
          heroelement = tile;
          tile.addEventListener("dragover", dungeonDragOver);
          tile.addEventListener("drop", dungeonTargetDragDrop);
          tile.addEventListener("dragend", dragEnd);
          tile.appendChild(elem);
          break;
        case "EXIT":
          tile.innerHTML = "";
          var cls = document.createElement("div");
          cls.classList.add("center");
          cls.innerText = "exit";
          tile.addEventListener("dragover", dungeonDragOver);
          tile.addEventListener("drop", dungeonTargetDragDrop);
          tile.addEventListener("dragend", dragEnd);
          tile.appendChild(cls);
          tile.classList.add("exit-location");
          break;
        default:
          tile.addEventListener("dragover", dungeonDragOver);
          tile.addEventListener("drop", dungeonTargetDragDrop);
          tile.addEventListener("dragend", dragEnd);
          if (mnstrtypes.has(curtiles.Layout[i][j])) {
            var mnstr = mnstrtypes.get(curtiles.Layout[i][j]);
            var mnstrelem = createImageElement(mnstr.Type + "-" + curmonsterid.toString(), getDieImage("red", mnstr.Health), true);
            mnstrelem.addEventListener("dragstart", dragStart);
            mnstrelem.addEventListener("dragend", dragEnd);
            mnstrelem.classList.add("dungeon-movable")
            tile.appendChild(mnstrelem);
            curmonsterid += 1;
          }
      }
    }
  }
}
function rollDie(diemax) {
  const rndInt = Math.floor(Math.random() * diemax) + 1;
  return rndInt;
}
function rollModifiers() {
  for (var i = 1; i <= 3; i++) {
    var mod = document.getElementById("modifier" + i);
    mod.addEventListener("dragstart", dragStart);
    mod.addEventListener("dragover", modifierDragOver);
    mod.addEventListener("drop", modifierDragDrop);
    mod.addEventListener("dragend", dragEnd);
    mod.replaceChildren(createImageElement("modifier-img" + i, getDieImage("black", rollDie(6)), true));
  }
}
function lockModifiers() {
  var modifierlocked = false;  
  if (lock_mod.classList.contains("bi-unlock")){
      lock_mod.classList.remove("bi-unlock");
      lock_mod.classList.add("bi-lock");
    } else {
      lock_mod.classList.remove("bi-lock");
      lock_mod.classList.add("bi-unlock");
      modifierlocked = true;
    }
    for (var i = 1; i <= 3; i++) {
      var mod = document.getElementById("modifier-img" + i);
      mod.setAttribute("draggable", modifierlocked);
      if (modifierlocked){
        mod.classList.add("can-drag");
      } else {
        mod.classList.remove("can-drag");
      }
    }
}
function digitToString(digit) {
  var str = "";
  if (typeof digit === "number") {
    switch (digit) {
      case 1:
        str = "one";
        break;
      case 2:
        str = "two";
        break;
      case 3:
        str = "three";
        break;
      case 4:
        str = "four";
        break;
      case 5:
        str = "five";
        break;
      case 6:
        str = "six";
        break;
      case 7:
        str = "seven";
        break;
      case 8:
        str = "eight";
        break;
      case 9:
        str = "nine";
        break;
      case 10:
        str = "ten";
        break;
    }
  }
  return str;
}
function getDieImage(color, roll) {
  var result = "";
  if (die_colors.includes(color)) {
    result = "img/" + color + "/" + digitToString(roll) + ".svg";
  }
  return result;
}
function createImageElement(id, src, draggable) {
  img = document.createElement("img");
  img.id = id;
  img.src = src;
  img.setAttribute("draggable", draggable);
  if (draggable) {
    img.classList.add("can-drag")
  }
  return img;
}
function canMove() {}
function getMoveCost(start, end) {
  var cost = 0;
  var startspl = start.split("-");
  var endspl = end.split("-");
  var xdiff = Math.abs(startspl[2] - endspl[2]);
  var ydiff = Math.abs(startspl[3] - endspl[3]);
  //console.log("start:", xdiff, "End:", ydiff);
  if (xdiff > 0 && ydiff > 0) {
  }
  if (xdiff > 0) {
    cost += xdiff * 2;
  }
  if (ydiff > 0) {
    cost = ydiff * 2;
  }
  console.log("start:", xdiff, "End:", ydiff, "Cost:", cost);
  // dungeon-tile-5-1
}
function setTitle(level) {
  var tile = document.getElementById("dungeon-title");
  tile.innerText = "DUNGEON LEVEL " + level;
}
function levelUp(){
  hero.Attack+=1;
}
function setupBoard(level) {
  if (dngtile.has(level)){
    curtiles = dngtile.get(level);
    fillTiles(curtiles.Level);
    setTitle(curtiles.Level);
    setupMonster(curtiles.MonsterType);
    setupHero();
    rollModifiers();
  }
}
