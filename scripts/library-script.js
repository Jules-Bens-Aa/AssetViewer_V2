const assetNames = [];


const startingInA = startingWith("a");


// $roots keeps previous parent properties as they will be added as a prefix for each prop.
// $sep is just a preference if you want to seperate nested paths other than dot.
const flatten = (obj, roots = [], sep = '.') => Object
  // find props of given object
  .keys(obj)
  // return an object by iterating props
  .reduce((memo, prop) => Object.assign(
    // create a new object
    {},
    // include previously returned object
    memo,
    Object.prototype.toString.call(obj[prop]) === '[object Object]'
      // keep working if value is an object
      ? flatten(obj[prop], roots.concat([prop]), sep)
      // include current prop and value and prefix prop with the roots
      : {[roots.concat([prop]).join(sep)]: obj[prop]}
), {})

// removes specific key property from an object
function filterObject(obj, key) {
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (i == key) {
            delete obj[key];
        } else if (typeof obj[i] == 'object') {
            filterObject(obj[i], key);
        }
    }
    return obj;
  }

//const patreonFlat = flatten(Object.fromEntries(Object.entries(patreonDatabase).filter(([key]) => !key.includes('_template'))));
const patreonFlat = flatten(filterObject(patreonDatabase, '_template'));
const freeFlat = flatten(filterObject(freeDatabase, '_template'));
let patreonList = [];
let freeList = [];

// fill an array of all the filepaths in the database
for(let value of Object.values(patreonFlat)){
    if(!Array.isArray(value)){
        patreonList.push(value)
    }
    else{
        for(let element of value){
            patreonList.push(element);
        }

    }
}
// same array for the free database
for(let value of Object.values(freeFlat)){
    if(!Array.isArray(value)){
        freeList.push(value)
    }
    else{
        for(let element of value){
            freeList.push(element);
        }

    }
}
//console.log(freeList)


//console.log(patreonList);


function checkValues(entry){
    if(typeof(entry) === 'object'){
        let values = Object.values(entry);
        for(let value of values){
            if(!Array.isArray(value)){
            assetNames.push(value);
            checkValues(value);
            }
            else{
            for(let element of value){
                assetNames.push(element);
            }
        }
        }
    }
    else{
        return assetNames.push(entry);
    }
}
//checkValues(patreonDatabase);
//console.log(assetNames);

function startingWith(letter){
    return assetNames.filter(e => e.startsWith(letter));
}

function assetList(){
    return {
    searchText: "",
    assetList: patreonList,
    visibleAssetList: [],
    init(){
        this.visibleAssetList = this.assetList;
    },
    searchChanged(){
        this.visibleAssetList = this.assetList.filter(asset => asset.includes(this.searchText));
    }
    }
}


function videoPlayer() {
    return {
        playing: true,
        looping: true,
        darkTheme: true,
        data: {
            video: 'modules/jb2a_patreon/Library/5th_Level/Arcane_Hand/ArcaneHand_Human_01_Idle_Blue_400x400.webm'
        },
        togglePlaying() {
            if (!this.playing) {
                this.$refs.video.play();
            } else {
                this.$refs.video.pause();
            }
            this.playing = !this.playing;
        },
        setSrc: function (filepath){
            this.$refs.video.src = filepath;
        }
    }
}