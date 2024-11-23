let wordsData = [];  // Holds the word lists for each term
let currentWordIndex = 0;
let correctCount = 0;
let incorrectCount = 0;
let currentWeekWords = [];

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
        displayWord(currentWeekWords[currentWordIndex]);
    } catch (error) {
        console.error("Error loading words data:", error);
    }
}

// Display a word on the screen
function displayWord(wordObj) {
    const wordDisplay = document.getElementById("wordDisplay");
    wordDisplay.innerHTML = `Spell the word: <strong>${wordObj.word}</strong>`;
    
    // Use speech synthesis to pronounce the word
    speakWord(wordObj.word);
}

// Use the SpeechSynthesis API to read out the word
function speakWord(word) {
    const speech = new SpeechSynthesisUtterance(word);
    window.speechSynthesis.speak(speech);
}

// Check the spelling of the word typed by the user
function checkSpelling() {
    const typedWord = document.getElementById("inputField").value.trim();
    const correctWord = currentWeekWords[currentWordIndex].word;

    const resultElement = document.getElementById("result");
    
    if (typedWord.toLowerCase() === correctWord.toLowerCase()) {
        correctCount++;
        resultElement.innerHTML = `<span style="color: green;">Correct! You spelled the word correctly.</span>`;
        document.getElementById("correctCount").textContent = correctCount;
    } else {
        incorrectCount++;
        resultElement.innerHTML = `<span style="color: red;">Incorrect! Try again.</span>`;
        document.getElementById("incorrectCount").textContent = incorrectCount;
    }

    currentWordIndex++;
    if (currentWordIndex < currentWeekWords.length) {
        setTimeout(() => displayWord(currentWeekWords[currentWordIndex]), 1000);
    } else {
        resultElement.innerHTML += "<br><strong>Test Completed! Good Job!</strong>";
    }
}

// Start the spelling test from the first word
function startSpellingTest() {
    currentWordIndex = 0;
    displayWord(currentWeekWords[currentWordIndex]);
}

// Show a random word from the current week's list
function getRandomWord() {
    const randomIndex = Math.floor(Math.random() * currentWeekWords.length);
    displayWord(currentWeekWords[randomIndex]);
}

