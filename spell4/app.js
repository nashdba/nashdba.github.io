// Function to get a British English voice from available voices
function getBritishVoice() {
  const synth = window.speechSynthesis;
  const voices = synth.getVoices();
  
  // Try to find a British English voice (e.g., "Google UK English Male" or "Google UK English Female")
  for (let voice of voices) {
    if (voice.lang === 'en-GB') {
      return voice;
    }
  }

  // Fallback if no British voice is found (using the default voice)
  return voices[0];  // This should typically be a British English voice
}

// Function to speak text with slow rate
function speakText(text, rate = 1) {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-GB';  // Set the language to British English
  
  // Set the voice (ensure British accent is chosen)
  utterance.voice = getBritishVoice();

  // Adjust the speed of the speech
  utterance.rate = rate;  // Lower rate for slower speech

  synth.speak(utterance);
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
  speakText("The test is about to begin.", 1); // Normal speech rate

  function askWord() {
    if (currentWordIndex < wordsToTest.length) {
      const word = wordsToTest[currentWordIndex].word;

      // Speak the word and ask user to spell it
      speakText(`Please spell the word ${word}`, 1); // Normal speech rate

      // After speaking the word, start speech recognition
      recognizeSpelling(word);
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
}

// Function to read the words aloud in the list
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
      speakText(`The word is ${word}`, 1); // Normal speech rate

      // Slow down the spelling process
      speakText(`Spelling: ${word.split('').join(' ')}`, 0.7);  // Slow down the pace

      // Repeat the word
      speakText(word, 1); // Normal speech rate

      // Move to the next word after finishing the current word
      wordDiv.classList.remove('highlighted');
      index++;
      speakNextWord();
    }
  }

  speakNextWord();
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

