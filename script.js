let lists=JSON.parse(localStorage.getItem("scrabbleLists")||"{}")

let currentList=[]
let queue=[]
let currentItem=null

function saveLists(){
localStorage.setItem("scrabbleLists",JSON.stringify(lists))
}

function refreshListSelector(){

let select=document.getElementById("listSelect")

select.innerHTML=""

Object.keys(lists).forEach(name=>{
let opt=document.createElement("option")
opt.value=name
opt.textContent=name
select.appendChild(opt)
})

}

function jumble(word){

let vowels="aeiou"
let v=[]
let c=[]

word.split("").forEach(l=>{
if(vowels.includes(l))v.push(l)
else c.push(l)
})

v.sort()
c.sort()

return [...v,...c].join("").toUpperCase()

}

function groupAnagrams(words){

let groups={}

words.forEach(w=>{

let key=w.split("").sort().join("")

if(!groups[key])groups[key]=[]

groups[key].push(w)

})

return Object.values(groups)

}

document.getElementById("saveList").onclick=function(){

let name=document.getElementById("listName").value.trim()

let words=document.getElementById("wordInput").value
.toLowerCase()
.split("\n")
.map(w=>w.trim())
.filter(w=>w.length>0)

if(!name||words.length===0)return

lists[name]=groupAnagrams(words)

saveLists()

refreshListSelector()

}

document.getElementById("loadList").onclick=function(){

let name=document.getElementById("listSelect").value

currentList=lists[name]

queue=currentList.map(item=>({

answers:item,

hiddenUntil:0

}))

nextItem()

}

function nextItem(){

let now=Date.now()

let available=queue.filter(x=>x.hiddenUntil<=now)

if(available.length===0){
document.getElementById("letters").innerText="No available words yet"
return
}

currentItem=available[Math.floor(Math.random()*available.length)]

let j=jumble(currentItem.answers[0])

document.getElementById("letters").innerText=j.split("").join(" ")

document.getElementById("anagramCount").innerText=
currentItem.answers.length+" anagrams"

document.getElementById("feedback").innerText=""

document.getElementById("answer").value="" 
}

document.getElementById("submitBtn").onclick=function(){

let input=document.getElementById("answer").value
.toLowerCase()
.split(" ")
.filter(x=>x)

let correct=input.filter(w=>currentItem.answers.includes(w))

if(correct.length===currentItem.answers.length){

document.getElementById("feedback").innerText="Correct"

currentItem.hiddenUntil=Date.now()+5*24*60*60*1000

}else{

document.getElementById("feedback").innerText=
correct.length+" correct"

let pos=Math.min(queue.length,Math.floor(Math.random()*20))

queue.splice(pos,0,currentItem)

}

}

document.getElementById("revealBtn").onclick=function(){

document.getElementById("feedback").innerText=
"Answers: "+currentItem.answers.join(", ")

let pos=Math.min(queue.length,Math.floor(Math.random()*20))

queue.splice(pos,0,currentItem)

}

document.getElementById("nextBtn").onclick=nextItem

refreshListSelector() j=jumble(current[0])

document.getElementById("letters").innerText=j.split("").join(" ")
document.getElementById("anagramCount").innerText=current.length+" anagrams"

speakLetters(j,current.length)

document.getElementById("feedback").innerText=""
document.getElementById("answer").value=""

}

function speakLetters(letters,count){

let msg=" "+letters.split("").join(" ")+" "+count+" anagrams"

let live=document.getElementById("letters")

live.setAttribute("aria-label",msg) }

function playCorrect(){

let audio=new Audio("data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQgAAAAA")

audio.play()

}

function playWrong(){

let audio=new Audio("data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQgAAAAA")

audio.play()

}

document.getElementById("submitBtn").onclick=function(){

let input=document.getElementById("answer").value.toLowerCase().split(" ")

let correct=input.filter(w=>current.includes(w))

if(correct.length===current.length){

document.getElementById("feedback").innerText="Correct!"
playCorrect()
stats.correct++

}else{

stats.wrong++

document.getElementById("feedback").innerText="You got "+correct.length+" correct"
playWrong()

}

updateStats()

}

document.getElementById("revealBtn").onclick=function(){

document.getElementById("feedback").innerText="Answers: "+current.join(", ")
stats.wrong++
updateStats()

}

document.getElementById("nextBtn").onclick=nextWord

function updateStats(){ document.getElementById("stats").innerText=
"Correct: "+stats.correct+" Wrong: "+stats.wrong

}

nextWord()
