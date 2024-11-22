// Global variables to keep track of the current quiz and question
let currentQuiz = '';
let currentQuestionIndex = 0;
let quizData = {};

// Function to load quizzes from the JSON file
function loadQuizzes() {
    fetch('quizzes.json') // Load the quizzes JSON file
        .then(response => response.json())
        .then(data => {
            quizData = data;  // Store the quiz data in the global variable
        })
        .catch(error => {
            console.error("Error loading quiz data:", error);
        });
}

// Call loadQuizzes when the page is loaded
window.onload = loadQuizzes;

function loadQuiz(quizType) {
    // Ensure that the quiz data has been loaded
    if (!quizData || !quizData[quizType]) {
        alert("Quiz data not found or not loaded yet!");
        return;
    }

    // Set the current quiz and reset question index
    currentQuiz = quizType;
    currentQuestionIndex = 0;

    // Clear any previous quiz content
    const quizContainer = document.getElementById("quizContainer");
    quizContainer.innerHTML = "";

    // Show the quiz container
    quizContainer.classList.remove("hidden");

    // Start the quiz
    showNextQuestion();
}

function showNextQuestion() {
    // Get the quiz questions for the selected quiz
    const quizQuestions = quizData[currentQuiz];
    if (!quizQuestions || currentQuestionIndex >= quizQuestions.length) {
        // End of quiz or no more questions
        document.getElementById("quizContainer").innerHTML = "<h2>Quiz Over! Well Done!</h2>";
        return;
    }

    // Get the current question and answer
    const currentQuestion = quizQuestions[currentQuestionIndex];

    // Display the question
    const quizContainer = document.getElementById("quizContainer");
    const questionElement = document.createElement("div");
    questionElement.classList.add("question");
    questionElement.innerHTML = `<strong>Q${currentQuestionIndex + 1}:</strong> ${currentQuestion.question}`;
    quizContainer.appendChild(questionElement);

    // Display the answer after a delay (example: 3 seconds)
    setTimeout(() => {
        const answerElement = document.createElement("div");
        answerElement.classList.add("answer");
        answerElement.innerHTML = `<strong>Answer:</strong> ${currentQuestion.answer}`;
        quizContainer.appendChild(answerElement);
        
        // Move to the next question after showing the answer for 3 seconds
        currentQuestionIndex++;
        setTimeout(() => {
            quizContainer.innerHTML = '';  // Clear the previous question and answer
            showNextQuestion();  // Load the next question
        }, 3000);  // Delay for next question (3 seconds)
    }, 3000); // Delay to show the answer (3 seconds)
}

// Handle home button click
document.getElementById("home").addEventListener("click", () => {
    // Hide quiz container and reset the quiz state
    document.getElementById("quizContainer").classList.add("hidden");
    currentQuiz = '';
    currentQuestionIndex = 0;  // Reset question index
});

