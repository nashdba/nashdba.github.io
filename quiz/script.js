let currentQuizData = [];
let currentQuestionIndex = 0;
let questionTimer, answerTimer;
let config = { x: 5, y: 3 };  // default to 5 seconds for questions, 3 seconds for answers

// Fetch quiz data and config
async function loadQuizData() {
    try {
        const quizResponse = await fetch('quizzes.json');
        const configResponse = await fetch('config.json');
        const quizJson = await quizResponse.json();
        const configJson = await configResponse.json();
        
        currentQuizData = quizJson;
        config = configJson;
        renderTiles();
    } catch (error) {
        console.error('Error loading quiz data:', error);
    }
}

// Render quiz tiles on main page
function renderTiles() {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = ''; // clear previous content
    currentQuizData.forEach(quiz => {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        tile.textContent = quiz.name;
        tile.onclick = () => startQuiz(quiz);
        mainContent.appendChild(tile);
    });
}

// Start a quiz
function startQuiz(quiz) {
    document.getElementById('mainContent').classList.add('hidden');
    const quizContainer = document.getElementById('quizContainer');
    quizContainer.classList.remove('hidden');
    loadQuestion(quiz.questions);
}

// Load a question and start timers
function loadQuestion(questions) {
    if (currentQuestionIndex >= questions.length) {
        endQuiz();
        return;
    }
    
    const question = questions[currentQuestionIndex];
    const questionArea = document.getElementById('questionArea');
    questionArea.innerHTML = `<h2>${question.question}</h2>`;
    
    questionTimer = setTimeout(() => {
        showAnswer(question.answer);
    }, config.x * 1000); // Show question for X seconds
    
    currentQuestionIndex++;
}

// Show the answer
function showAnswer(answer) {
    const questionArea = document.getElementById('questionArea');
    questionArea.innerHTML += `<p><strong>Answer:</strong> ${answer}</p>`;
    
    answerTimer = setTimeout(() => {
        loadQuestion(currentQuizData[0].questions);
    }, config.y * 1000); // Show answer for Y seconds
}

// End the quiz and reset
function endQuiz() {
    const quizContainer = document.getElementById('quizContainer');
    quizContainer.classList.add('hidden');
    document.getElementById('mainContent').classList.remove('hidden');
    currentQuestionIndex = 0;
}

// Event Listener for Home button
document.getElementById('homeBtn').addEventListener('click', () => {
    document.getElementById('quizContainer').classList.add('hidden');
    document.getElementById('mainContent').classList.remove('hidden');
    currentQuestionIndex = 0;
});

// Load quiz data when the page loads
window.onload = loadQuizData;

