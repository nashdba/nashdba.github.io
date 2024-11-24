let wordsData = [];  // Holds the words for each week
let currentWeekWords = [];
let currentWordIndex = 0;
let correctCount = 0;
let incorrectCount = 0;
let testRunning = false;  // Track if test is running
let currentWordTimer; // Timer for each word

// Initialize speech recognition
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-GB';  // Set to British English
recognition.continuous = false;
recognition.interimResults = false;

// Initialize speech synthesis
const synth = window.speechSynthesis;

// Load words data from a JSON file
async function loadWords() {
    const weekNumber = document.getElementById("weekSelect").value;
    
    // Load the JSON file for the selected term
    const termFile = `terms/terms.json`;  // Assuming the JSON file is called terms.json

    try {
        const response = await fetch(termFile);
        const data = await response.json();
        wordsData = data;
        currentWeekWords = wordsData[`week${weekNumber}`];
        currentWordIndex = 0;
        displayWordList();
    } catch (error) {
        console.error("Error loading words data:", error);
    }
}

// Display all words for the selected week
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

// Highlight word when clicked
function highlightWord(index) {
    const wordItems = document.querySelectorAll('#wordList li');
    wordItems.forEach(item => item.classList.remove('highlight'));
    wordItems[index].classList.add('highlight');
    document.getElementById("wordMeaning").textContent = `Meaning: ${currentWeekWords[index].meaning}`;
}

// Start the test in order
function startSpellingTest() {
    testRunning = true;
    resetScores();
    document.getElementById("wordList").style.display = "none"; // Hide word list
    document.getElementById("scoreBoard").style.display = "block"; // Show score board
    document.getElementById("inputField").style.display = "block"; // Show input field
    document.getElementById("answerLabel").style.display = "block"; // Show answer label
    document.getElementById("stopTestButton").style.display = "inline-block"; // Show stop test button
    document.getElementById("startTestBtn").style.display = "none"; // Hide "Start Test" button
    document.getElementById("startRandomTestBtn").style.display = "none"; // Hide "Start Random Test" button

    currentWordIndex = 0;
    runTest();
}

// Start the test in random order
function startRandomTest() {
    testRunning = true;
    resetScores();
    document.getElementById("wordList").style.display = "none"; // Hide word list
    document.getElementById("scoreBoard").style.display = "block"; // Show score board
    document.getElementById("inputField").style.display = "block"; // Show input field
    document.getElementById("answerLabel").style.display = "block"; // Show answer label
    document.getElementById("stopTestButton").style.display = "inline-block"; // Show stop test button
    document.getElementById("startTestBtn").style.display = "none"; // Hide "Start Test" button
    document.getElementById("startRandomTestBtn").style.display = "none"; // Hide "Start Random Test" button

    // Shuffle the words for random order
    currentWeekWords = shuffleArray(currentWeekWords);
    currentWordIndex = 0;
    runTest();
}

// Shuffle array function to randomize word order
function shuffleArray(arr) {
    return arr.sort(() => Math.random() - 0.5);
}

// Reset scores
function resetScores() {
    correctCount = 0;
    incorrectCount = 0;
    document.getElementById("correctCount").textContent = correctCount;
    document.getElementById("incorrectCount").textContent = incorrectCount;
}

// Run the test through all the words
function runTest() {
    if (currentWordIndex < currentWeekWords.length) {
        const wordObj = currentWeekWords[currentWordIndex];
        askToSpell(wordObj);
    } else {
        endTest();
    }
}

// Ask the child to spell the word
function askToSpell(wordObj) {
    const resultElement = document.getElementById("result");
    
    // Refresh the meaning of the word during the test
    document.getElementById("wordMeaning").textContent = `Meaning: ${wordObj.meaning}`;

    // Ask the child to spell the word using speech synthesis
    resultElement.innerHTML = `How do you spell "${wordObj.word}"?`;
    speakWord(`How do you spell ${wordObj.word}?`);

    // Start listening to the user's response
    recognition.start();
}

// Check if the spoken word matches the expected word
recognition.onresult = function(event) {
    const spokenWord = event.results[0][0].transcript.trim().toLowerCase();
    const currentWord = currentWeekWords[currentWordIndex].word.toLowerCase();

    // Display the spoken word in the input field

