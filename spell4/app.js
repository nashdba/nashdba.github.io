// Initialize empty object for word data
let wordData = {};

// Fetch the terms/terms.json file
fetch('terms/terms.json')
  .then(response => response.json())
  .then(data => {
    wordData = data;  // Store the fetched JSON data into wordData
    loadWeeks();       // Load the weeks in the dropdown
    loadWords();       // Display words for the selected week
  })
  .catch(error => {
    console.error('Error loading the terms data:', error);
  });

// References to DOM elements
const wordListDiv = document.getElementById('wordList');
const weekSelector = document.getElementById('weekSelector');
const readWordsBtn = document.getElementById('readWordsBtn');
const testInOrderBtn = document.getElementById('testInOrderBtn');
const testRandomBtn = document.getElementById('testRandomBtn');
const scoreDiv = document.getElementById('score');
const definitionText = document.getElementById('definitionText');

let currentWords = [];

// Load weeks into the dropdown
function loadWeeks() {
  for (const week in wordData) {
    const option = document.createElement('option');
    option.value = week;
    option.textContent = week;
    weekSelector.appendChild(option);
  }
}

// Load words for the selected week
function loadWords() {
  const selectedWeek = weekSelector.value;

  if (selectedWeek) {
    currentWords = wordData[selectedWeek];

    // Clear the current word list and display the words for the selected week
    wordListDiv.innerHTML = '';
    currentWords.forEach((item, index) => {
      const wordDiv = document.createElement('div');
      wordDiv.classList.add('word-item');
      wordDiv.id = `word-${index}`;
      wordDiv.innerHTML = `<b>${item.word}</b>`;
      wordDiv.addEventListener('click', () => showDefinition(index));
      wordListDiv.appendChild(wordDiv);
    });
  } else {
    wordListDiv.innerHTML = 'Please select a week to display the words.';
  }
}

// Show definition of the highlighted word and read it aloud
function showDefinition(index) {
  const word = currentWords[index].word;
  const meaning = currentWords[index].meaning;
  definitionText.innerHTML = `<strong>${word}:</strong> ${meaning}`;

  // Highlight the clicked word
  const wordDiv = document.getElementById(`word-${index}`);
  wordDiv.classList.add('highlighted');

  // Remove highlight from other words
  const otherWords = document.querySelectorAll('.word-item');
  otherWords.forEach((div) => {
    if (div !== wordDiv) {
      div.classList.remove('highlighted');
    }
  });

  // Use speech synthesis to say the word, spell it, and say it again
  const synth = window.speechSynthesis;

  // Say the word (in British English)
  const wordUtterance = new SpeechSynthesisUtterance(word);
  wordUtterance.lang = 'en-GB';  // Set the language to British English
  synth.speak(wordUtterance);

  wordUtterance.onend = function () {
    // Spell the word (slow down the pace by adjusting the rate)
    const spellUtterance = new SpeechSynthesisUtterance(`Spelling: ${word.split('').join(' ')}`);
    spellUtterance.lang = 'en-GB';  // Set the language to British English
    spellUtterance.rate = 0.7;      // Slow down the pace
    synth.speak(spellUtterance);

    spellUtterance.onend = function () {
      // Repeat the word
      const repeatUtterance = new SpeechSynthesisUtterance(word);
      repeatUtterance.lang = 'en-GB';  // Set the language to British English
      synth.speak(repeatUtterance);
    };
  };
}

// Speak the word, spell it, and repeat the word
function readWordList() {
  let index = 0;
  function speakNextWord() {
    if (index < currentWords.length) {
      const word = currentWords[index].word;
      const wordMeaning = currentWords[index].meaning;

      // Highlight the word and show meaning
      const wordDiv = document.getElementById(`word-${index}`);
      wordDiv.classList.add('highlighted');
      definitionText.innerHTML = `<strong>${word}:</strong> ${wordMeaning}`;

      // Text-to-Speech (say the word)
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(`The word is ${word}`);
      utterance.lang = 'en-GB';  // Set the language to British English
      synth.speak(utterance);

      utterance.onend = function () {
        // Spell the word (slow down the pace)
        const spellUtterance = new SpeechSynthesisUtterance(`Spelling: ${word.split('').join(' ')}`);
        spellUtterance.lang = 'en-GB';  // Set the language to British English
        spellUtterance.rate = 0.7;      // Slow down the pace
        synth.speak(spellUtterance);

        spellUtterance.onend = function () {
          // Repeat the word
          const repeatUtterance = new SpeechSynthesisUtterance(word);
          repeatUtterance.lang = 'en-GB';  // Set the language to British English
          synth.speak(repeatUtterance);

          repeatUtterance.onend = function () {
            // Move to the next word
            wordDiv.classList.remove('highlighted');
            index++;
            speakNextWord();
          };
        };
      };
    }
  }

  speakNextWord();
}

// Function to test spelling in order or randomly
function startSpellingTest(isRandom = false) {
  let wordsToTest = [...currentWords];
  if (isRandom) {
    wordsToTest = wordsToTest.sort(() => Math.random() - 0.5); // Shuffle words
  }
  
  let currentWordIndex = 0;
  let score = 0;
  
  // Announce the test
  const synth = window.speechSynthesis;
  const testAnnounce = new SpeechSynthesisUtterance("The test is about to begin.");
  testAnnounce.lang = 'en-GB';  // Set the language to British English
  synth.speak(testAnnounce);
  
  testAnnounce.onend = function () {
    function askWord() {
      if (currentWordIndex < wordsToTest.length) {
        const word = wordsToTest[currentWordIndex].word;

        // Speak the word and ask user to spell it
        const wordUtterance = new SpeechSynthesisUtterance(`Please spell the word ${word}`);
        wordUtterance.lang = 'en-GB';  // Set the language to British English
        synth.speak(wordUtterance);

        // Start speech recognition
        recognizeSpelling(word);
      } else {
        // End test and show score
        showScore(score);
      }
    }

    function recognizeSpelling(correctWord) {
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.lang = 'en-US';
      recognition.start();

      recognition.onresult = function (event) {
        const userAnswer = event.results[0][0].transcript.toLowerCase();
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
        alert('Error recognizing speech. Please try again.');
      };
    }

    function showCorrectAnswer(index, isCorrect) {
      const wordDiv = document.getElementById(`word-${index}`);
      if (isCorrect) {
        wordDiv.classList.add('correct');
      } else {
        wordDiv.classList.add('incorrect');
      }
    }

    askWord();
  }
}

// Show score and feedback
function showScore(correctAnswers) {
  scoreDiv.innerHTML = `You got ${correctAnswers} out of ${currentWords.length} correct!`;
  const feedback = correctAnswers === currentWords.length ? 'Great job!' : 'Keep practicing!';
  scoreDiv.innerHTML += `<br>${feedback}`;
}

// Event listeners
weekSelector.addEventListener('change', loadWords);  // Load words when week changes
readWordsBtn.addEventListener('click', readWordList); // Read the words aloud
testInOrderBtn.addEventListener('click', () => startSpellingTest(false));  // Test in order
testRandomBtn.addEventListener('click', () => startSpellingTest(true));  // Test randomly

// Initialize the app

