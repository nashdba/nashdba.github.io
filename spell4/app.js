let wordsData = [];  // Holds the words for each week
let currentWeekWords = [];
let currentWordIndex = 0;
let correctCount = 0;
let incorrectCount = 0;
let testRunning = false;  // Track if test is running
let currentWordTimer; // Timer for each word

// Initialize speech recognition
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-US';
recognition.continuous = false;
recognition.interimResults = false;

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
}

// Start the test in order
function startSpellingTest() {
    testRunning = true;
    resetScores();
    document.getElementById("wordList").style.display = "none"; // Hide word list
    document.getElementById("inputField").style.display = "block"; // Show input field
    document.getElementById("result").style.display = "block"; // Show result box
    document.getElementById("stopTestButton").style.display = "inline-block"; // Show stop test button

    currentWordIndex = 0;
    runTest();
}

// Start the test in random order
function startRandomTest() {
    testRunning = true;
    resetScores();
    document.getElementById("wordList").style.display = "none"; // Hide word list
    document.getElementById("inputField").style.display = "block"; // Show input field
    document.getElementById("result").style.display = "block"; // Show result box
    document.getElementById("stopTestButton").style.display = "inline-block"; // Show stop test button

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
    resultElement.innerHTML = `How do you spell "${wordObj.word}"?`;

    // Start speech recognition to capture the user's response
    recognition.start();

    recognition.onresult = (event) => {
        const spokenWord = event.results[0][0].transcript.trim().toLowerCase();
        document.getElementById("inputField").value = spokenWord; // Display spoken word
        checkSpelling(spokenWord);
    };

    recognition.onerror = (event) => {
        console.error("Error with speech recognition:", event);
        document.getElementById("result").innerHTML = "Sorry, I couldn't hear you. Try again.";
    };
}

// Check the spelling of the word
function checkSpelling(spokenWord) {
    const correctWord = currentWeekWords[currentWordIndex].word.toLowerCase();
    const resultElement = document.getElementById("result");
    
    if (spokenWord === correctWord) {
        correctCount++;
        resultElement.innerHTML = `<span style="color: green;">Correct!</span>`;
        document.getElementById("correctCount").textContent = correctCount;
    } else {
        incorrectCount++;
        resultElement.innerHTML = `<span style="color: red;">Incorrect! The correct word was ${correctWord}.</span>`;
        document.get

