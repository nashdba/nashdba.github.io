// File: script.js

let currentWords = [];
let selectedWeek = 'week1';  // Default week

// DOM Elements
const weekSelector = document.getElementById('weekSelector');
const readWordsBtn = document.getElementById('readWordsBtn');
const testInOrderBtn = document.getElementById('testInOrderBtn');
const testRandomBtn = document.getElementById('testRandomBtn');
const wordListContainer = document.getElementById('wordListContainer');
const definitionText = document.getElementById('definitionText');
const scoreDiv = document.getElementById('score');

// Function to load words from the external JSON file
async function loadWords() {
  try {
    const response = await fetch('terms/terms.json');
    const data = await response.json();

    // Set the selected words for the current week
    currentWords = data[selectedWeek];

    // Clear previous list
    wordListContainer.innerHTML = '';

    // Generate the word list for the selected week
    currentWords.forEach((wordData, index) => {
      const wordDiv = document.createElement('div');
      wordDiv.classList.add('word-item');
      wordDiv.id = `word-${index}`;
      wordDiv.textContent = wordData.word;
      
      // When the word is clicked, speak it
      wordDiv.addEventListener('click', () => speakWord(wordData.word, wordData.meaning));

      wordListContainer.appendChild(wordDiv);
    });
  } catch (error) {
    console.error('Error loading word data:', error);
  }
}

// Function to populate the week selector dropdown dynamically
async function populateWeekSelector() {
  try {
    const response = await fetch('terms/terms.json');
    const data = await response.json();

    // Get the week keys dynamically
    const weeks = Object.keys(data);
    weekSelector.innerHTML = ''; // Clear any previous options

    // Add a default "Please Select" option
    const defaultOption = document.createElement('option');
    defaultOption.textContent = 'Select Week';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    weekSelector.appendChild(defaultOption);

    // Add an option for each week in the JSON file
    weeks.forEach(week => {
      const option = document.createElement('option');
      option.value = week;
      option.textContent = week;
      weekSelector.appendChild(option);
    });

    // Set the default selection based on the current selectedWeek
    weekSelector.value = selectedWeek;
  } catch (error) {
    console.error('Error loading week data:', error);
  }
}

// Function to get a default British English voice (en-GB)
function getBritishVoice() {
  const synth = window.speechSynthesis;
  const voices = synth.getVoices();

  // Find a British English voice (not specifying female or male)
  return voices.find(voice => voice.lang === 'en-GB') || voices[0];  // Default if none found
}

// Function to speak the word (say word, spell it, then say word again)
function speakWord(word, meaning) {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance();
  utterance.lang = 'en-GB'; // Set the language to British English

  // Set the voice to a British English voice
  utterance.voice = getBritishVoice();

  // Speak the word
  utterance.text = `The word is ${word}`;
  synth.speak(utterance);

  // Wait for a moment, then spell it
  utterance.onend = function() {
    utterance.text = `Spelling: ${word.split('').join(' ')}`;
    utterance.rate = 0.7;  // Slow down the spelling
    synth.speak(utterance);

    // After spelling, say the word again
    utterance.onend = function() {
      utterance.text = word;
      utterance.rate = 1;  // Reset to normal rate
      synth.speak(utterance);

      // Display the word meaning
      definitionText.innerHTML = `<strong>${word}:</strong> ${meaning}`;
    };
  };
}

// Function to start the spelling test (in order or random)
function startSpellingTest(isRandom) {
  let wordsToTest = [...currentWords];
  if (isRandom) {
    wordsToTest = wordsToTest.sort(() => Math.random() - 0.5); // Shuffle words
  }

  let currentWordIndex = 0;
  let score = 0;

  // Announce the test
  speakText("The test is about to begin.", 1);

  function askWord() {
    if (currentWordIndex < wordsToTest.length) {
      const word = wordsToTest[currentWordIndex].word;

      // Ask user to spell the word
      speakText(`Please spell the word ${word}`, 1);

      // Start speech recognition
      recognizeSpelling(word);
    } else {
      // End test and show score
      showScore(score);
    }
  }

  function recognizeSpelling(correctWord) {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-GB'; // British English
    recognition.continuous = false; // Stops after one result
    recognition.interimResults = false; // Only final results

    // Start recognizing
    recognition.start();

    recognition.onresult = function (event) {
      const userAnswer = event.results[0][0].transcript.trim().toLowerCase();
      console.log('User said:', userAnswer);

      if (userAnswer === correctWord.toLowerCase()) {
        score++;
        showCorrectAnswer(currentWordIndex, true);
      } else {
        showCorrectAnswer(currentWordIndex, false);
      }

      currentWordIndex++;
      askWord();
    };

    recognition.onerror = function () {
      alert("Sorry, I couldn't understand that. Please try again.");
      recognition.stop();
    };
  }

  function showCorrectAnswer(index, isCorrect) {
    const wordDiv = document.getElementById(`word-${index}`);
    if (isCorrect) {
      wordDiv.classList.add('correct');
      wordDiv.classList.remove('incorrect');
    } else {
      wordDiv.classList.add('incorrect');
      wordDiv.classList.remove('correct');
    }
  }

  askWord();
}

// Function to speak text
function speakText(text, rate = 1) {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-GB'; // British English
  utterance.voice = getBritishVoice(); // Set voice to British English
  utterance.rate = rate; // Slow down the rate of speech for better comprehension
  synth.speak(utterance);
}

// Show score and feedback
function showScore(correctAnswers) {
  scoreDiv.innerHTML = `You got ${correctAnswers} out of ${currentWords.length} correct!`;
  const feedback = correctAnswers === currentWords.length ? 'Great job!' : 'Keep practicing!';
  scoreDiv.innerHTML += `<br>${feedback}`;
}

// Event listeners
weekSelector.addEventListener('change', () => {
  selectedWeek = weekSelector.value;
  loadWords();
});  // Load words when week changes

readWordsBtn.addEventListener('click', loadWords);   // Read the words aloud
testInOrderBtn.addEventListener('click', () => startSpellingTest(false));  // Test in order
testRandomBtn.addEventListener('click', () => startSpellingTest(true));  // Test randomly

// Initial population of the week selector
populateWeekSelector();

// Load words for the default selected week
loadWords();

