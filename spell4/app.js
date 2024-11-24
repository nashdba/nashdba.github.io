// Initialize empty object for word data
let wordData = {};

// Fetch the terms/terms.json file
fetch('terms/terms.json')
  .then(response => response.json())
  .then(data => {
    wordData = data;  // Store the fetched JSON data into wordData
    loadWords();       // Once data is loaded, call loadWords to display them
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

// Load words for the selected week
function loadWords() {
  const week = weekSelector.value;
  if (wordData[week]) {
    currentWords = wordData[week];
  } else {
    currentWords = [];
  }

  wordListDiv.innerHTML = '';
  currentWords.forEach((item, index) => {
    const wordDiv = document.createElement('div');
    wordDiv.classList.add('word-item');
    wordDiv.id = `word-${index}`;
    wordDiv.innerHTML = `<b>${item.word}</b>`;
    wordDiv.addEventListener('click', () => showDefinition(index));
    wordListDiv.appendChild(wordDiv);
  });
}

// Show definition of the highlighted word
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

      // Text-to-Speech
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(`The word is ${word}`);
      synth.speak(utterance);
      utterance.onend = function () {
        // Spell the word
        const spellUtterance = new SpeechSynthesisUtterance(`Spelling: ${word.split('').join(' ')}`);
        synth.speak(spellUtterance);
        spellUtterance.onend = function () {
          // Repeat the word
          const repeatUtterance = new SpeechSynthesisUtterance(word);
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
  synth.speak(testAnnounce);
  
  testAnnounce.onend = function () {
    function askWord() {
      if (currentWordIndex < wordsToTest.length) {
        const word = wordsToTest[currentWordIndex].word;

        // Speak the word and ask user to spell it
        const wordUtterance = new SpeechSynthesisUtterance(`Please spell the word ${word}`);
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
weekSelector.addEventListener('change', loadWords);
readWordsBtn.addEventListener('click', readWordList);
testInOrderBtn.addEventListener('click', () => startSpellingTest(false));
testRandomBtn.addEventListener('click', () => startSpellingTest(true));

// Initialize the app

