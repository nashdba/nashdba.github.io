let quizData = []; // Store quiz data (an array of quiz objects)
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
    currentQuiz = quizName;
    currentQuestionIndex = 0; // Reset question index

    // Find the quiz data based on the quiz name
    const selectedQuiz = quizData.find(quiz => quiz.name === quizName);

    // If the selected quiz doesn't exist, show an error
    if (!selectedQuiz || !selectedQuiz.questions || selectedQuiz.questions.length === 0) {
        alert("No questions available for this quiz.");
        return;
    }

    // Log the selected quiz to ensure the correct one is chosen
    console.log(`Starting quiz: ${currentQuiz}`);
    console.log("Questions:", selectedQuiz.questions);

    // Hide the quiz tiles and show the quiz container
    document.getElementById('mainContent').classList.add('hidden');
    document.getElementById('quizContainer').classList.remove('hidden');
    
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
    questionArea.innerHTML = `<div class="question"><strong>Q${currentQuestionIndex + 1}:</strong> ${question.question}</div>`;

    // Display the answer after a short delay (3 seconds)
    setTimeout(() => {
        questionArea.innerHTML += `<div class="answer"><strong>Answer:</strong> ${question.answer}</div>`;
        
        // Move to the next question after a short delay
        currentQuestionIndex++; // Increment the question index
        setTimeout(() => showNextQuestion(questions), 3000); // Show next question after 3 seconds
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
}

// Reset the app to the main screen
function resetApp() {
    document.getElementById('mainContent').classList.remove('hidden');
    document.getElementById('quizContainer').classList.add('hidden');
    currentQuiz = '';
    currentQuestionIndex = 0; // Reset question index to 0
}

