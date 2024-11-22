// quizApp.js or script.js

let currentQuizData = [];
let currentQuestionIndex = 0;
let speechEnabled = true; // Default state is speech enabled

// Speech synthesis initialization
const synth = window.speechSynthesis;

// Get the toggle element for enabling/disabling speech
const speechToggle = document.getElementById('speechToggle');

// Event listener to toggle speech on/off
speechToggle.addEventListener('change', (e) => {
    speechEnabled = e.target.checked;
});

// Function to speak text (question or answer)
function speak(text) {
    if (speechEnabled) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = synth.getVoices()[0]; // Select a voice
        synth.speak(utterance);
    }
}

// Function to load the quiz questions from the selected topic
function loadQuiz(topic) {
    // Get the data for the selected topic (this example assumes you have your questions in a JSON structure)
    fetch(`quizzes.json`)
        .then(response => response.json())
        .then(data => {
            currentQuizData = data[topic].questions;
            displayNextQuestion();
        })
        .catch(error => console.error('Error loading quiz data:', error));
}

// Function to display the next question
function displayNextQuestion() {
    if (currentQuestionIndex >= currentQuizData.length) {
        alert("Quiz Over! Well Done!");
        return;
    }

    const question = currentQuizData[currentQuestionIndex];
    const questionArea = document.getElementById('questionArea');
    questionArea.innerHTML = question.question;

    // Speak the question if speech is enabled
    speak(question.question);

    const answerArea = document.getElementById('answerArea');
    answerArea.innerHTML = "Answer: ? ? ?";
    document.getElementById('endQuizBtn').classList.remove('hidden');
}

// Function to display the answer after a delay
function showAnswer() {
    const question = currentQuizData[currentQuestionIndex];
    const answerArea = document.getElementById('answerArea');
    answerArea.innerHTML = "Answer: " + question.answer;

    // Speak the answer if speech is enabled
    speak(question.answer);

    // Move to the next question after a delay
    setTimeout(() => {
        currentQuestionIndex++;
        displayNextQuestion();
    }, 3000); // Change 3000 to the delay in milliseconds for the answer display
}

// Event listener for the End Quiz button
document.getElementById('endQuizBtn').addEventListener('click', () => {
    currentQuestionIndex = currentQuizData.length; // End the quiz
    document.getElementById('questionArea').innerHTML = "Quiz Over! Well Done!";
    document.getElementById('answerArea').innerHTML = "";
    document.getElementById('endQuizBtn').classList.add('hidden');
});

// Call this function when a question should be answered
function handleQuestionAnswered() {
    showAnswer();
}

// Simulate starting the quiz
loadQuiz('generalKnowledge'); // Load a quiz topic

