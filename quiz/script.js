let quizData = {}; // Store quiz data
let currentQuiz = ''; // Track which quiz is currently selected
let currentQuestionIndex = 0; // Track current question index

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
            renderQuizTiles();
        })
        .catch(error => console.error("Error loading quiz data:", error));
}

// Render quiz tiles dynamically
function renderQuizTiles() {
    const mainContent = document.getElementById("mainContent");
    const tileTemplate = `
        <div class="tile" onclick="startQuiz('generalKnowledge')">General Knowledge</div>
        <div class="tile" onclick="startQuiz('science')">Science</div>
        <div class="tile" onclick="startQuiz('math')">Math Quiz</div>
    `;
    mainContent.innerHTML = tileTemplate; // Insert tiles into mainContent
}

// Start the selected quiz
function startQuiz(quizType) {
    currentQuiz = quizType;
    currentQuestionIndex = 0;

    // Hide the quiz tiles and show the quiz container
    document.getElementById('mainContent').classList.add('hidden');
    document.getElementById('quizContainer').classList.remove('hidden');
    
    // Start showing questions
    showNextQuestion();
}

// Show the next question
function showNextQuestion() {
    const quizQuestions = quizData[currentQuiz];
    if (!quizQuestions || currentQuestionIndex >= quizQuestions.length) {
        showQuizOverMessage();
        return;
    }

    const question = quizQuestions[currentQuestionIndex];
    const questionArea = document.getElementById("questionArea");
    questionArea.innerHTML = `<div class="question"><strong>Q${currentQuestionIndex + 1}:</strong> ${question.question}</div>`;

    // Display the answer after a short delay
    setTimeout(() => {
        questionArea.innerHTML += `<div class="answer"><strong>Answer:</strong> ${question.answer}</div>`;
        currentQuestionIndex++;

        // Move to the next question after a delay
        setTimeout(showNextQuestion, 3000);
    }, 3000);
}

// Show a message when the quiz is over
function showQuizOverMessage() {
    const questionArea = document.getElementById("questionArea");
    questionArea.innerHTML = "<h2>Quiz Over! Well Done!</h2>";
}

// Reset the app to the main screen
function resetApp() {
    document.getElementById('mainContent').classList.remove('hidden');
    document.getElementById('quizContainer').classList.add('hidden');
    currentQuiz = '';
    currentQuestionIndex = 0;
}

