// File: script.js

let currentWords = [];

// Example word list data (can be replaced with a JSON file in a real-world scenario)
const wordData = {
  "week1": [
    { "word": "apple", "meaning": "A fruit that is typically round and red, green, or yellow in color." },
    { "word": "ball", "meaning": "A spherical object used in games and sports." }
  ],
  "week2": [
    { "word": "cat", "meaning": "A small domesticated carnivorous mammal with soft fur." },
    { "word": "dog", "meaning": "A domesticated carnivorous mammal with a barking sound." }
  ]
};

// DOM Elements
const weekSelector = document.getElementById('weekSelector');
const readWordsBtn = document.getElementById('readWordsBtn');
const testInOrderBtn = document.getElementById('testInOrderBtn');
const testRandomBtn = document.getElementById('testRandomBtn');
const wordListContainer = document.getElementById('wordListContainer');
const definitionText = document.getElementById('definitionText');
const scoreDiv = document.getElementById('score');

// Function to load words based on the selected week
function loadWords() {
  const selectedWeek = weekSelector.value;
  currentWords = wordData[selectedWeek];

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
}

// Function to speak the word (say word, spell it, then say word again)
function speakWord(word, meaning) {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance();
  utterance.lang = 'en-GB'; // Set the language to British English

  // Select British English voice
  const voices = synth.getVoices();
  utterance.voice = voices.find(voice => voice.lang === 'en-GB') || voices[0];

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
      const userAnswer = event.results[0][0].transcript.toLowerCase();
      console.log('User said:', userAnswer);

      if (userAnswer === correctWord) {
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
  utterance.voice = synth.getVoices().find(voice => voice.lang === 'en-GB') || synth.getVoices()[0];
  utterance.rate = rate; // Slow rate if needed
  synth.speak(utterance);
}

// Show score and feedback
function showScore(correctAnswers) {
  scoreDiv.innerHTML = `You got ${correctAnswers} out of ${currentWords.length} correct!`;
  const feedback = correctAnswers === currentWords.length ? 'Great job!' : 'Keep practicing!';
  scoreDiv.innerHTML += `<br>${feedback}`;
}

// Event listeners
weekSelector.addEventListener('change', loadWords);  // Load words when week changes
readWordsBtn.addEventListener('click', loadWords);   // Read the words aloud
testInOrderBtn.addEventListener('click', () => startSpellingTest(false));  // Test in order
testRandomBtn.addEventListener('click', () => startSpellingTest(true));  // Test randomly

// Load words on initial page load
loadWords();

