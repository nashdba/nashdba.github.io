let words = [];
let currentTestIndex = 0;
let currentTestOrder = [];
let inTest = false;

// UI Elements
const wordListContainer = document.getElementById("word-list-container");
const wordDefinition = document.getElementById("word-definition");
const readWordsBtn = document.getElementById("read-words-btn");
const testInOrderBtn = document.getElementById("test-in-order-btn");
const testRandomOrderBtn = document.getElementById("test-random-order-btn");
const stopTestBtn = document.getElementById("stop-test-button");
const weekSelector = document.getElementById("week-selector");

// Fetch the terms from the terms.json file
async function fetchTerms() {
  try {
    const response = await fetch('terms/terms.json');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error loading terms:", error);
    alert("Failed to load spelling words.");
  }
}

// Load words for the selected week
async function loadWords() {
  const data = await fetchTerms();
  const selectedWeek = weekSelector.value;
  
  // Set the words for the selected week
  words = data[selectedWeek] || [];

  // Populate word list in UI
  wordListContainer.innerHTML = '';
  words.forEach((wordObj, index) => {
    const li = document.createElement("li");
    li.textContent = wordObj.word;
    li.id = `word-${index}`;
    wordListContainer.appendChild(li);
  });
  
  // Clear the definition box
  wordDefinition.textContent = '';
}

// Read the words aloud and spell them
function readWords() {
  let speech = new SpeechSynthesisUtterance();
  speech.lang = "en-US";

  function readWord(index) {
    if (index >= words.length) return;
    const wordObj = words[index];
    
    // Highlight the current word
    document.getElementById(`word-${index}`).classList.add('highlight');
    wordDefinition.textContent = wordObj.meaning;
    
    // Say the word, then spell it, then say the word again
    speech.text = wordObj.word;
    speechSynthesis.speak(speech);
    
    // Spell out the word
    speech.text = wordObj.word.split('').join(' ');
    speechSynthesis.speak(speech);
    
    // Say the word again
    speech.text = wordObj.word;
    speechSynthesis.speak(speech);

    // Remove highlight
    setTimeout(() => {
      document.getElementById(`word-${index}`).classList.remove('highlight');
      readWord(index + 1);
    }, 3000); // Wait for the full reading to complete before highlighting the next word
  }

  readWord(0);
}

// Start spelling test in order
function startTestInOrder() {
  currentTestIndex = 0;
  currentTestOrder = words.map((_, index) => index);
  inTest = true;
  runSpellingTest();
}

// Start spelling test in random order
function startTestRandomOrder() {
  currentTestIndex = 0;
  currentTestOrder = shuffleArray(words.map((_, index) => index));
  inTest = true;
  runSpellingTest();
}

// Shuffle an array (for random order)
function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Run the spelling test
function runSpellingTest() {
  if (currentTestIndex >= currentTestOrder.length) {
    endTest();
    return;
  }

  const currentWordIndex = currentTestOrder[currentTestIndex];
  const currentWordObj = words[currentWordIndex];

  // Ask the child to spell the word
  wordDefinition.textContent = `Spell the word: ${currentWordObj.word}`;
  askForSpelling(currentWordObj.word);
}

// Ask for spelling via voice recognition
function askForSpelling(word) {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "en-US";
  recognition.start();

  recognition.onresult = function(event) {
    const spokenWord = event.results[0][0].transcript.trim().toLowerCase();
    checkSpelling(spokenWord);
  };

  recognition.onerror = function(event) {
    alert('Error recognizing speech. Please try again.');
  };
}

// Check the spelling
function checkSpelling(spokenWord) {
  const currentWordObj = words[currentTestOrder[currentTestIndex]];
  if (spokenWord === currentWordObj.word.toLowerCase()) {
    wordDefinition.textContent = `Correct! The word was: ${currentWordObj.word}`;
  } else {
    wordDefinition.textContent = `Incorrect. The correct spelling was: ${currentWordObj.word}`;
  }

  currentTestIndex++;
  setTimeout(runSpellingTest, 2000); // Move to the next word after a short delay
}

// End the test
function endTest() {
  inTest = false;
  wordDefinition.textContent = "Test complete! Well done!";
  testButtonsVisible(true);
}

// Toggle test buttons visibility
function testButtonsVisible(visible) {
  testInOrderBtn.style.display = visible ? "block" : "none";
  testRandomOrderBtn.style.display = visible ? "block" : "none";
  stopTestBtn.style.display = visible ? "none" : "block";
}

// Stop the test
function stopTest() {
  inTest = false;
  wordDefinition.textContent = "Test stopped. You can review the words now.";
  testButtonsVisible(true);
}

// Event listeners for buttons
readWordsBtn.addEventListener("click", () => {
  if (!inTest) {
    readWords();
  }
});

testInOrderBtn.addEventListener("click", startTestInOrder);
testRandomOrderBtn.addEventListener("click", startTestRandomOrder);
stopTestBtn.addEventListener("click", stopTest);

// Initial UI setup
loadWords();
weekSelector.addEventListener("change", loadWords);

