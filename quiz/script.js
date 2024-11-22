let currentQuiz = '';
let currentQuestionIndex = 0;
let quizData = {};

// Fetch quizzes from the JSON file when the page loads
window.onload = loadQuizzes;

function loadQuizzes() {
    fetch('quizzes.json')
        .then(response => response.json())
        .then(data => {
            quizData = data;  // Store quiz data in global variable
        })
        .catch(error => {
            console.error("Error loading quiz data:", error);
        });
}

function loadQuiz(quizType) {
    // Check if the quiz data is loaded
    if (!quizData || !quizData[quizType]) {
        alert("Quiz data not found or not loaded yet!");
        return;
    }

    // Set the current quiz and reset the question index
    currentQuiz = quizType;
    currentQuestionIndex = 0;

    // Clear previous quiz content
    const quizContainer = document.getElementById("quizContainer");
    quizContainer.innerHTML = "";

    // Show the quiz container
    quizContainer.classList.remove("hidden");

    // Start showing questions
    showNextQuestion();
}

function showNextQuestion() {
    const quizQuestions = quizData[currentQuiz];
    if (!quizQuestions || currentQuestionIndex >= quizQuestions.length) {
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

    // Display the answer after a delay (e.g., 3 seconds)
    setTimeout(() => {
        const answerElement = document.createElement("div");
        answerElement.classList.add("answer");
        answerElement.innerHTML = `<strong>Answer:</strong> ${currentQuestion.answer}`;
        quizContainer.appendChild(answerElement);

        // Move to the next question after displaying the answer
        currentQuestionIndex++;
        setTimeout(() => {
            quizContainer.innerHTML = '';  // Clear the previous question and answer
            showNextQuestion();  // Show the next question
        }, 3000);  // Delay for 3 seconds before showing next question
    }, 3000);  // Delay to show the answer
}

document.getElementById("home").addEventListener("click", () => {
    // Hide quiz container and reset quiz state
    document.getElementById("quizContainer").classList.add("hidden");
    currentQuiz = '';
    currentQuestionIndex = 0;  // Reset the question index
});

