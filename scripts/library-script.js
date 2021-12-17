/**
 **************** OBJECTIVES ********************************************
 *  - Have Letters in the sidebar collapse and show all entries
 *  - Underneath the video, have a dropdown for each entry corresponding to the selected letter with asset name
 *  - A second dropdown for all variations of the asset selected in the first dropdown
 *  - Have a number of indicators/Buttons for each entry and an indicator showing the current asset selected
 *  - Shows the free - Patreon, Maybe a Button to switch Database
 *  - Maybe a Previous and Next Button
 *  - Then a copy to Clipboard function
 *  - And a search bar 
 *  - Enter a specific adress to directly find the asset based on search
 * 
 */



/********************** DECLARE VARIABLES ************************************/
const video = document.getElementById('video');
const videoSrc = video.src;
const playButton = document.getElementById('playBtn');
const currentLetter = "";
let isFreeDB = true;
let DB = freeDatabase;

document.getElementById("video").loop = false;
document.getElementById("looped").src = "../artwork/buttons/No-Loop_Yellow.png";
document.getElementById("free-switch").src = "../artwork/buttons/Loop_Yellow.png";

/****************** MAIN FUNCTIONS *****************************************/

//Populate first dropdown from the first key, which is the name of the asset
function dropdownInit(clicked_id) {

  let currentLetter = clicked_id;
  let currentKeys = Object.keys(DB).filter(e => e.startsWith(currentLetter.toLowerCase())); //get the asset names starting with letter corresponding to id

  removeOptions(document.getElementById('asset-names'));//clear the first dropdown
  for (let entry of currentKeys) {

    document.getElementById('asset-names').options.add(new Option(entry, entry));//add each asset in the first dropdown
    let data = entry.replace(/['"]+/g, '');//Removes the "" or the '' from a string
    let allLevel1 = dbReduce(DB[data]); //get all db properties after the asset name
  }
  let firstEntries = dbReduce(DB[currentKeys[0]]);
  removeOptions(document.getElementById('attribute-01'));
  for (firstEntry of firstEntries) {
    document.getElementById('attribute-01').options.add(new Option(firstEntry, firstEntry));
  }
  firstDropdownChange()
}

function firstDropdownChange() {
  let selectedIndex = document.getElementById('asset-names').value;
  let firstEntries = dbReduce(DB[selectedIndex]);
  removeOptions(document.getElementById('attribute-01'));
  for (firstEntry of firstEntries) {
    document.getElementById('attribute-01').options.add(new Option(firstEntry, firstEntry));
  }
  secondDropdownChange()
}

function secondDropdownChange() {
  let selectedFirst = document.getElementById('asset-names').value;
  let selectedSecondIndex = document.getElementById('attribute-01').selectedIndex;
  let firstEntries = dbReduce(DB[selectedFirst]);

  let finalPath = selectedFirst + "." + firstEntries[selectedSecondIndex];
  let finalDBPath = Object.byString(DB, finalPath);
  if (isFreeDB === true) {
    finalDBPath = finalDBPath.replace("JB2A_DnD5e", "jb2a_patreon")
  }
  document.getElementById('video').src = finalDBPath;

  //Display name under the Video
  let aName = capitalizeTheFirstLetterOfEachWord(selectedFirst.replace(/_/g, " "));
  document.getElementById(`assetName`).innerHTML = `${aName}`;
}

//Switch between the free/patreon database
function freeSwitch() {
  if (isFreeDB == true) {
    log("setting to false");
    isFreeDB = false;
    DB = patreonDatabase;
    //  log(isFreeDB);
    //  log(DB);
    document.getElementById("free-switch").src = "../artwork/buttons/No-Loop_Yellow.png";// Placeholder image
    if (document.getElementById('attribute-01').selectedIndex > -1) {
      firstDropdownChange()
    }

  }
  else {
    log("setting to true");
    isFreeDB = true;
    DB = freeDatabase;
    //  log(isFreeDB);
    //  log(DB);
    document.getElementById("free-switch").src = "../artwork/buttons/Loop_Yellow.png";// Placeholder image

  }
  if (document.getElementById('attribute-01').selectedIndex > -1) {
    firstDropdownChange()
  }
}





function LoopedIcon() {
  if (document.getElementById("video").loop == true) {
    document.getElementById("video").loop = false;
    document.getElementById("looped").src = "../artwork/buttons/No-Loop_Yellow.png";

  }
  else {
    document.getElementById("video").loop = true;
    document.getElementById("looped").src = "../artwork/buttons/Loop_Yellow.png";
  }

}

function togglePlay() {
  if (video.paused || video.ended) {
    video.play();
  } else {
    video.pause();
  }
}

//Making Sure The Video Controls are off
const videoWorks = !!document.createElement('video').canPlayType;
if (videoWorks) {
  video.controls = false;
}

playButton.addEventListener('click', togglePlay);


const themeMap = {
  dark: "light",
  light: "dark",
};


const current = localStorage.getItem('theme');
const theme = localStorage.getItem('theme')
  || (tmp = Object.keys(themeMap)[0],
    localStorage.setItem('theme', tmp),
    tmp);
const bodyClass = document.body.classList;
bodyClass.add(theme);


if (current == "light") {
  document.getElementById("themeIcon").src = "../artwork/buttons/Sun_Yellow.png";
}
else {
  document.getElementById("themeIcon").src = "../artwork/buttons/Moon_Yellow.png";
}



function toggleTheme() {
  const current = localStorage.getItem('theme');
  const next = themeMap[current];


  if (current == "dark") {
    document.getElementById("themeIcon").src = "../artwork/buttons/Sun_Yellow.png";
  }
  else {
    document.getElementById("themeIcon").src = "../artwork/buttons/Moon_Yellow.png";
  }


  bodyClass.replace(current, next);
  localStorage.setItem('theme', next);
}

document.getElementById('themeButton').onclick = toggleTheme;



/************ HELPER FUNCTIONS *********************************************************/

function log(e) {
  console.log(e);
}

//Helper Function to add or rewrite html content from its divselector which is the id of a tag
async function writeContent(divSelector, value) {
  document.querySelector(divSelector).innerHTML += value;
}
async function rewriteContent(divSelector, value) {
  document.querySelector(divSelector).innerHTML = value;
}

//clear dropdown function
function removeOptions(selectElement) {
  var i, L = selectElement.options.length - 1;
  for (i = L; i >= 0; i--) {
    selectElement.remove(i);
  }
}


function dbReduce(obj) {

  const isObject = val =>
    val && typeof val === 'object' && !Array.isArray(val);

  const addDelimiter = (a, b) =>
    a ? `${a}.${b}` : b;

  const paths = (obj = {}, head = '') => {
    return Object.entries(obj)
      .reduce((product, [key, value]) => {
        let fullPath = addDelimiter(head, key)
        return isObject(value) ?
          product.concat(paths(value, fullPath))
          : product.concat(fullPath)
      }, []);
  }

  return paths(obj);
}


Object.byString = function (o, s) {
  s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
  s = s.replace(/^\./, '');           // strip a leading dot
  var a = s.split('.');
  for (var i = 0, n = a.length; i < n; ++i) {
    var k = a[i];
    if (k in o) {
      o = o[k];
    } else {
      return;
    }
  }
  return o;
}

function capitalizeTheFirstLetterOfEachWord(words) {
  var separateWord = words.toLowerCase().split(' ');
  for (var i = 0; i < separateWord.length; i++) {
     separateWord[i] = separateWord[i].charAt(0).toUpperCase() +
     separateWord[i].substring(1);
  }
  return separateWord.join(' ');
}


/******************NEEDS UPDATING TO NEW VERSION ******************************************/

//NOTE : NEEDS UPDATING
//Clipboard Functionality
function copy(id) {
  str1 = "#";
  copyTextId = str1.concat(id);
  var copyText = document.querySelector(`${copyTextId}`);
  copyText.select();
  document.execCommand("copy");
  if (id === 'input-free') {
    document.getElementById(`${id}`).value = "Path to the free asset - Copy Successful !";
  }
  else {
    document.getElementById(`${id}`).value = "Path to the Patreon asset - Copy Successful !";
  }
}
// document.querySelector('#copy-free').addEventListener("click", copy('input-free'));
// document.querySelector('#copy-patreon').addEventListener("click", copy('input-patreon'));








/*****************BONUS CONTENT !! :) ******************************************/
//Bonus Content
document.getElementById('ee-link').addEventListener("mouseover", function ee() {
  document.getElementById('ee-link').style = 'display: flex; justify-content: center; align-items:center; width: 150px; height: 100px; text-align: center; ';
  document.getElementById('ee-link').innerHTML = '<img id="ee" style = "width: 50px; height: 50px;" src="../artwork/buttons/stairs-cake.png"/>The cake is a lie !'

});





