let words=[
["retain","retina","train"],
["alerts","alters","artels","estral","laster","ratels","salter","slater","staler","stelar","talers"],
["rescue","secure","recuse"]
]

let current
let solved=[]
let stats={
correct:0,
wrong:0
}

function jumble(word){

let vowels="aeiou"
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

function nextWord(){

current=words[Math.floor(Math.random()*words.length)]

let j=jumble(current[0])

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
