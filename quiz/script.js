let quizData = []; // Store quiz data (an array of quiz objects)
let currentQuiz = ''; // Track which quiz is currently selected
let currentQuestionIndex = 0; // Track current question index
let isQuizInProgress = false; // Flag to track if a quiz is in progress
let questionTimeout; // Store the timeout ID to clear it when ending the quiz
let answerTimeout; // Store the timeout ID for showing the answer

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
        utterance.lang = 'en-GB';
        
        utterance.voice = synth.getVoices()[0]; // Select a voice
        synth.speak(utterance);
    }
}


// Load quiz data when the page loads
window.onload = () => {
    loadQuizzes();
    document.getElementById('homeBtn').addEventListener('click', resetApp);
};

// Load quiz data from quizzes.json
function loadQuizzes() {
    fetch('quizzes.json')
        .then(response => response.json())
        .then(data => {
            quizData = data; // Store quiz data
            console.log("Quiz data loaded:", quizData); // Debugging line to check quiz data
            renderQuizTiles();
        })
        .catch(error => console.error("Error loading quiz data:", error));
}

// Render quiz tiles dynamically
function renderQuizTiles() {
    const mainContent = document.getElementById("mainContent");
    const tileTemplate = quizData.map(quiz => {
        return `<div class="tile" onclick="startQuiz('${quiz.name}')">${quiz.name}</div>`;
    }).join('');
    
    mainContent.innerHTML = tileTemplate; // Insert tiles into mainContent
}

// Start the selected quiz
function startQuiz(quizName) {
    // Prevent starting a new quiz if one is already in progress
    if (isQuizInProgress) {
        alert("You are already taking a quiz. Please finish it first.");
        return;
    }

    isQuizInProgress = true; // Set the flag to true indicating quiz is in progress
    currentQuiz = quizName;
    currentQuestionIndex = 0; // Reset question index

    // Find the quiz data based on the quiz name
    const selectedQuiz = quizData.find(quiz => quiz.name === quizName);

    // If the selected quiz doesn't exist, show an error
    if (!selectedQuiz || !selectedQuiz.questions || selectedQuiz.questions.length === 0) {
        alert("No questions available for this quiz.");
        isQuizInProgress = false; // Reset the flag in case of error
        return;
    }

    // Log the selected quiz to ensure the correct one is chosen
    console.log(`Starting quiz: ${currentQuiz}`);
    console.log("Questions:", selectedQuiz.questions);

    // Hide the quiz tiles and show the quiz container
    document.getElementById('mainContent').classList.add('hidden');
    document.getElementById('quizContainer').classList.remove('hidden');
    
    // Show the "End Quiz" button
    document.getElementById('endQuizBtn').style.display = 'inline-block';

    // Start showing questions
    showNextQuestion(selectedQuiz.questions);
}

// Show the next question
function showNextQuestion(questions) {
    // Check if we've reached the end of the quiz
    if (currentQuestionIndex >= questions.length) {
        showQuizOverMessage();
        return;
    }

    const question = questions[currentQuestionIndex]; // Get the current question
    const questionArea = document.getElementById("questionArea");

    // Set initial answer placeholder text
    questionArea.innerHTML = `<div class="question"><strong>Q${currentQuestionIndex + 1}:</strong> ${question.question}</div>
                              <div class="answer"><strong>Answer:</strong> ? ? ?</div>`;

    // Speak the question if speech is enabled
    speak(question.question);

    // Display the answer after a short delay (3 seconds)
    answerTimeout = setTimeout(() => {
        questionArea.innerHTML = `<div class="question"><strong>Q${currentQuestionIndex + 1}:</strong> ${question.question}</div>
                                  <div class="answer"><strong>Answer:</strong> ${question.answer}</div>`;

        // Speak the answer if speech is enabled
        speak(question.answer);
        
        // Move to the next question after a short delay
        currentQuestionIndex++; // Increment the question index
        questionTimeout = setTimeout(() => showNextQuestion(questions), 3000); // Show next question after 3 seconds
    }, 3000); // Show answer after 3 seconds
}

// Show a message when the quiz is over
function showQuizOverMessage() {
    const questionArea = document.getElementById("questionArea");
    questionArea.innerHTML = "<h2>Quiz Over! Well Done!</h2>";

    // Optionally, you could add a button to restart the quiz or go back to the home screen
    const restartButton = document.createElement('button');
    restartButton.textContent = "Start a New Quiz";
    restartButton.onclick = resetApp;
    questionArea.appendChild(restartButton);

    // Reset the flag to allow starting a new quiz
    isQuizInProgress = false;
}

// Handle the "End Quiz" button click
function endQuiz() {
    // Stop the current quiz and reset the state
    showQuizOverMessage(); // Show the "Quiz Over" message
    isQuizInProgress = false; // Reset the flag to allow starting a new quiz

    // Clear any timeouts to stop question progression
    clearTimeout(questionTimeout);
    clearTimeout(answerTimeout);

    // Remove the "End Quiz" button
    document.getElementById('endQuizBtn').style.display = 'none';
}

// Reset the app to the main screen
function resetApp() {
    document.getElementById('mainContent').classList.remove('hidden');
    document.getElementById('quizContainer').classList.add('hidden');
    currentQuiz = '';
    currentQuestionIndex = 0; // Reset question index to 0
    isQuizInProgress = false; // Reset the flag to allow starting a new quiz

    // Optionally, you can reset the question display area (in case a previous quiz is still open)
    document.getElementById("questionArea").innerHTML = '';
}

