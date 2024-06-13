import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://daily-journal-600ab-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const journalListInDB = ref(database, "journalList")

const textAreaEl = document.getElementById("daily-input")
const publishButtonEl = document.getElementById("publish-button")
const thoughtListEl = document.getElementById("thought-list")

onValue(journalListInDB, function(snapshot) {
    
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
        
        clearThoughtListEl()
        
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            
            appendItemToThoughtListEl(currentItem)
        }
    } else {
        thoughtListEl.innerHTML = "Nothing to display"
    }
})

publishButtonEl.addEventListener("click", function() {
    let inputValue = textAreaEl.value 
    
    push(journalListInDB, inputValue)
    
    clearTextAreaEl()
})

function clearThoughtListEl() {
    thoughtListEl.innerHTML = ""
}

function clearTextAreaEl() {
    textAreaEl.value = ""
}

function appendItemToThoughtListEl(item) {
    let itemID = item[0]
    let itemValue = item[1]
 
    let newEl = document.createElement("li")
    
    let removeIconEl = document.createElement("span");

    newEl.textContent = itemValue
    
    newEl.append(removeIconEl)
    
    removeIconEl.addEventListener("click", function() {
        let exactLocationOfItemInDB = ref(database, `journalList/${itemID}`)
        
        remove(exactLocationOfItemInDB)
    })
    
    thoughtListEl.append(newEl)
}