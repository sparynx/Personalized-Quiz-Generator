const API_URL = "https://opentdb.com/api.php";
const CATEGORY_URL = "https://opentdb.com/api_category.php";

const startQuizButton = document.querySelector(".start-quiz-button");
const questionCountInput = document.querySelector(".question-count");
const categorySelect = document.querySelector(".category");
const difficultySelect = document.querySelector(".difficulty");
const quizContainer = document.querySelector(".quiz-container");
const resultContainer = document.querySelector(".result");
const scoreDisplay = document.querySelector(".score");

let currentScore = 0;
let currentQuestionIndex = 0;
let questions = [];

// Load categories from API
async function loadCategories() {
  try {
    const response = await fetch(CATEGORY_URL);
    const data = await response.json();

    data.trivia_categories.forEach(category => {
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.name;
      categorySelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error loading categories:", error);
  }
}

// Fetch questions based on selected options
async function fetchQuestions() {
  const count = questionCountInput.value;
  const category = categorySelect.value;
  const difficulty = difficultySelect.value;

  const url = `${API_URL}?amount=${count}&category=${category}&difficulty=${difficulty}&type=multiple`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    questions = data.results;
    displayQuestion();
  } catch (error) {
    console.error("Error fetching questions:", error);
  }
}

// Display a question
function displayQuestion() {
  quizContainer.innerHTML = ""; // Clear previous question

  if (currentQuestionIndex < questions.length) {
    const questionData = questions[currentQuestionIndex];
    const questionText = questionData.question;
    const correctAnswer = questionData.correct_answer;
    const answers = [...questionData.incorrect_answers, correctAnswer].sort(() => Math.random() - 0.5);

    const questionElement = document.createElement("div");
    questionElement.classList.add("question");
    questionElement.innerHTML = `<p>${questionText}</p>`;

    answers.forEach(answer => {
      const answerButton = document.createElement("button");
      answerButton.textContent = answer;
      answerButton.addEventListener("click", () => checkAnswer(answer, correctAnswer));
      questionElement.appendChild(answerButton);
    });

    quizContainer.appendChild(questionElement);
  } else {
    showResult();
  }
}

// Check answer and update score
function checkAnswer(selectedAnswer, correctAnswer) {
  if (selectedAnswer === correctAnswer) {
    currentScore++;
  }
  currentQuestionIndex++;
  displayQuestion();
}

// Show final score
function showResult() {
  quizContainer.innerHTML = ""; // Clear questions
  resultContainer.style.display = "block";
  scoreDisplay.textContent = `${currentScore} / ${questions.length}`;
}

// Initialize quiz
startQuizButton.addEventListener("click", () => {
  currentScore = 0;
  currentQuestionIndex = 0;
  resultContainer.style.display = "none";
  fetchQuestions();
});

// Load categories when page loads
window.addEventListener("load", loadCategories);
