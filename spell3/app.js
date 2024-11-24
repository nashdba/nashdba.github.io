let wordsData = [];  // Holds the word lists for each term
let currentWordIndex = 0;
let correctCount = 0;
let incorrectCount = 0;
let currentWeekWords = [];
let timer;  // To store the countdown timer
let testRunning = false;  // To track if a test is running
let currentWordTimer; // Timer for each word

// Initialize speech recognition
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-US';  // Set the language for recognition
recognition.continuous = false; // Don't listen continuously
recognition.interimResults = false; // Only return final results

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

// Start the spelling test (in order)
function startSpellingTest() {
    testRunning = true;
    document.getElementById("wordList").style.display = "none"; // Hide the word list
    document.getElementById("wordDisplay").style.display = "none"; // Hide current word display

    correctCount = 0;
    incorrectCount = 0;
    document.getElementById("correctCount").textContent = correctCount;
    document.getElementById("incorrectCount").textContent = incorrectCount;
    
    currentWordIndex = 0;
    runTest();
}

// Start the spelling test (random order)
function startRandomTest() {
    testRunning = true;
    document.getElementById("wordList").style.display = "none"; // Hide the word list
    document.getElementById("wordDisplay").style.display = "none"; // Hide current word display

    correctCount = 0;
    incorrectCount = 0;
    document.getElementById("correctCount").textContent = correctCount;
    document.getElementById("incorrectCount").textContent = incorrectCount;

    // Shuffle the words for random order
    currentWeekWords = shuffleArray(currentWeekWords);
    currentWordIndex = 0;
    runTest();
}

// Shuffle the words array to get a random order
function shuffleArray(arr) {
    return arr.sort(() => Math.random() - 0.5);
}

// Run the test through all the words
function runTest() {
    if (currentWordIndex < currentWeekWords.length) {
        const wordObj = currentWeekWords[currentWordIndex];
        displayWord(wordObj);
        setTimer();
    } else {
        endTest();
    }
}

// Display the current word and start speech recognition
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

// Ask the child to spell the word (via voice)
function askToSpell() {
    const resultElement = document.getElementById("result");
    resultElement.innerHTML = "Now, spell the word aloud!";
    
    // Start listening for the child's spelling
    recognition.start();

    recognition.onresult = (event) => {
        const spokenWord = event.results[0][0].transcript.trim().toLowerCase();
        document.getElementById("inputField").value = spokenWord;  // Fill the text box with spoken word
        checkSpelling(spokenWord);  // Check if the spoken word matches
    };

    recognition.onerror = (event) => {
        console.error("Error with speech recognition:", event);
        document.getElementById("result").innerHTML = "Sorry, I couldn't understand that. Please try again!";
    };
}

// Check if the word typed or spoken matches
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
        runTest();
    }, 2000);
}

// Set a 15-second timer for the current word
function setTimer() {
    clearTimeout(currentWordTimer);
    currentWordTimer = setTimeout(() => {
        document.getElementById("result").innerHTML = "Time's up! Moving to next word.";
        currentWordIndex++;
        runTest();
    }, 15000); // 15 seconds to spell
}

// End the test and show results
function endTest() {
    testRunning = false;
    document.getElementById("result").innerHTML = `<strong>Test Completed!</strong> Correct: ${correctCount}, Incorrect: ${incorrectCount}`;
    document.getElementById("wordList").style.display = "block"; // Show the word list
    document.getElementById("wordDisplay").style.display = "block"; // Show the word display
}

