let wordsData = [];  // Holds the word lists for each term
let currentWordIndex = 0;
let correctCount = 0;
let incorrectCount = 0;
let currentWeekWords = [];

// Initialize speech recognition
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-US';

// Load words data from a JSON file
async function loadWords() {
    const weekNumber = document.getElementById("weekSelect").value;
    
    // Load the JSON file for the selected term
    let termFile = `terms/term1.json`;  // Default to term 1
    if (weekNumber > 5) {
        termFile = `terms/term2.json`; // Load term 2 for weeks 6-10
    }

    try {
        const response = await fetch(termFile);
        const data = await response.json();
        wordsData = data;
        currentWeekWords = wordsData[`week${weekNumber}`]; // Set words for the selected week
        currentWordIndex = 0;
        displayWordList();
    } catch (error) {
        console.error("Error loading words data:", error);
    }
}

// Display all the words for the selected week
function displayWordList() {
    const wordListContainer = document.getElementById("wordList");
    wordListContainer.innerHTML = '';  // Clear previous list

    currentWeekWords.forEach((wordObj, index) => {
        const wordItem = document.createElement('li');
        wordItem.textContent = wordObj.word;
        wordItem.onclick = () => highlightWord(index);
        wordListContainer.appendChild(wordItem);
    });
}

// Highlight the current word in the list
function highlightWord(index) {
    const wordListContainer = document.getElementById("wordList");
    const wordItems = wordListContainer.getElementsByTagName('li');
    
    // Remove highlight from all items
    for (let i = 0; i < wordItems.length; i++) {
        wordItems[i].classList.remove('highlight');
    }
    
    // Highlight the selected word
    wordItems[index].classList.add('highlight');
    currentWordIndex = index;
    displayWord(currentWeekWords[currentWordIndex]);
}

// Display the current word and spell it aloud
function displayWord(wordObj) {
    const wordDisplay = document.getElementById("wordDisplay");
    wordDisplay.innerHTML = `Spell the word: <strong>${wordObj.word}</strong>`;
    
    // Use speech synthesis to read out the word
    speakWord(wordObj.word);
}

// Use the SpeechSynthesis API to read out the word
function speakWord(word) {
    const speech = new SpeechSynthesisUtterance(word);
    window.speechSynthesis.speak(speech);
    
    // Spell out the word
    spellWord(word);
}

// Spell the word aloud letter by letter
function spellWord(word) {
    const letters = word.split('');
    let index = 0;
    
    const spellInterval = setInterval(() => {
        if (index < letters.length) {
            const speech = new SpeechSynthesisUtterance(letters[index]);
            window.speechSynthesis.speak(speech);
            index++;
        } else {
            clearInterval(spellInterval);
            setTimeout(() => askToSpell(), 500); // After spelling out, ask the child to spell it
        }
    }, 700);
}

// Ask the child to spell the word
function askToSpell() {
    const resultElement = document.getElementById("result");
    resultElement.innerHTML = "Now, spell the word aloud!";

    // Start listening for the child's spelling
    recognition.start();
    recognition.onresult = (event) => {
        const spokenWord = event.results[0][0].transcript.trim().toLowerCase();
        checkSpelling(spokenWord);
    };

    recognition.onerror = (event) => {
        console.error("Error with speech recognition:", event);
    };
}

// Check the spelling (either typed or spoken)
function checkSpelling(spokenWord) {
    const correctWord = currentWeekWords[currentWordIndex].word.toLowerCase();
    const resultElement = document.getElementById("result");
    
    if (spokenWord === correctWord) {
        correctCount++;
        resultElement.innerHTML = `<span style="color: green;">Correct! You spelled the word correctly.</span>`;
        document.getElementById("correctCount").textContent = correctCount;
    } else {
        incorrectCount++;
        resultElement.innerHTML = `<span style="color: red;">Incorrect! Try again.</span>`;
        document.getElementById("incorrectCount").textContent = incorrectCount;
    }

    // Move to next word after a short delay
    setTimeout(() => {
        currentWordIndex++;
        if (currentWordIndex < currentWeekWords.length) {
            displayWord(currentWeekWords[currentWordIndex]);
        } else {
            resultElement.innerHTML += "<br><strong>Test Completed! Good Job!</strong>";
        }
    }, 1000);
}

// Start the spelling test from the first word
function startSpellingTest() {
    currentWordIndex = 0;
    displayWord(currentWeekWords[currentWordIndex]);
}

// Show a random word from the current week's list
function getRandomWord() {
    const randomIndex = Math.floor(Math.random() * currentWeekWords.length);
    highlightWord(randomIndex);
}

