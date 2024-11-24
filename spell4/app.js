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

        wordUtterance.onend = function () {
          // Start speech recognition after speaking the word
          recognizeSpelling(word);
        };
      } else {
        // End test and show score
        showScore(score);
      }
    }

    function recognizeSpelling(correctWord) {
      // Initialize SpeechRecognition if not already initialized
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.lang = 'en-GB';  // Set the language to British English
      recognition.continuous = false;  // Stops after one result
      recognition.interimResults = false; // No interim results, only final answer

      // Start listening for the user's input
      recognition.start();

      recognition.onresult = function (event) {
        const userAnswer = event.results[0][0].transcript.toLowerCase();
        console.log('User said:', userAnswer);

        // Check if the answer is correct
        if (userAnswer === correctWord) {
          score++;
          showCorrectAnswer(currentWordIndex, true);
        } else {
          showCorrectAnswer(currentWordIndex, false);
        }
        
        // Move to the next word
        currentWordIndex++;
        askWord();
      };

      recognition.onerror = function (event) {
        console.error("Recognition error: ", event.error);
        alert("Sorry, I couldn't understand that. Please try again.");
        recognition.stop();  // Stop recognition if there's an error
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

    askWord();  // Start asking the first word
  };
}

// Function to show score and feedback
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

