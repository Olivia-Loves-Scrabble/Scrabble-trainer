const STORAGE_KEY = "scrabbleTrainerLists"

let lists = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}")

let queue = []
let currentItem = null

function saveLists(){
localStorage.setItem(STORAGE_KEY, JSON.stringify(lists))
}

function refreshListSelector(){

const select = document.getElementById("listSelect")

select.innerHTML = ""

const names = Object.keys(lists)

if(names.length === 0){
const opt = document.createElement("option")
opt.textContent = "No lists yet"
opt.value = ""
select.appendChild(opt)
return
}

names.forEach(name=>{
const opt = document.createElement("option")
opt.value = name
opt.textContent = name
select.appendChild(opt)
})

}

function jumble(word){

const vowels = "aeiou"
let v=[]
let c=[]

word.split("").forEach(l=>{
if(vowels.includes(l)) v.push(l)
else c.push(l)
})

v.sort()
c.sort()

return [...v,...c].join("").toUpperCase()

}

function groupAnagrams(words){

let groups={}

words.forEach(w=>{

const key = w.split("").sort().join("")

if(!groups[key]) groups[key] = []

groups[key].push(w)

})

return Object.values(groups)

}

document.getElementById("saveList").onclick=function(){

const name = document.getElementById("listName").value.trim()

const words = document.getElementById("wordInput").value
.toLowerCase()
.split("\n")
.map(w=>w.trim())
.filter(w=>w.length>0)

if(!name){
announce("Please enter a list name")
return
}

if(words.length===0){
announce("Please enter at least one word")
return
}

lists[name] = groupAnagrams(words)

saveLists()

refreshListSelector()

announce("List saved")

}

document.getElementById("loadList").onclick=function(){

const name = document.getElementById("listSelect").value

if(!lists[name]){
announce("Please choose a list")
return
}

queue = lists[name].map(set => ({
answers:set,
hiddenUntil:0
}))

announce("List loaded")

nextItem()

}

function nextItem(){

if(queue.length===0){
announce("No words available")
return
}

const now = Date.now()

const available = queue.filter(x=>x.hiddenUntil<=now) if(available.length===0){
announce("All words hidden for now")
return
}

currentItem = available[Math.floor(Math.random()*available.length)]

const letters = jumble(currentItem.answers[0])

document.getElementById("letters").innerText = letters.split("").join(" ")

document.getElementById("anagramCount").innerText =
currentItem.answers.length + " anagrams"

document.getElementById("answer").value=""

speakLetters(letters)

}

document.getElementById("submitBtn").onclick=function(){

const input = document.getElementById("answer").value
.toLowerCase()
.split(" ")
.filter(x=>x)

const correct = input.filter(w => currentItem.answers.includes(w))

if(correct.length === currentItem.answers.length){

announce("Correct")

currentItem.hiddenUntil = Date.now() + (5*24*60*60*1000)

}else{

announce(correct.length + " correct")

const pos = Math.min(queue.length, Math.floor(Math.random()*20))

queue.splice(pos,0,currentItem)

}

}

document.getElementById("revealBtn").onclick=function(){ announce("Answers are " + currentItem.answers.join(", "))

const pos = Math.min(queue.length, Math.floor(Math.random()*20))

queue.splice(pos,0,currentItem)

}

document.getElementById("nextBtn").onclick = nextItem

function announce(msg){
document.getElementById("feedback").innerText = msg
}

function speakLetters(letters){

let spaced = letters.split("").join(" ")

let utter = new SpeechSynthesisUtterance(spaced)

speechSynthesis.speak(utter)

}

refreshListSelector()
