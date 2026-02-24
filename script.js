"use strict";

document.addEventListener("DOMContentLoaded", () => {
  initPageEnterAnimation();
  initMemoryGame();
  initMovieQuiz();
  initHomeMood();
  initHomeScrollAnimation();
  initReviewsPosters();
});

function initPageEnterAnimation() {
  const items = document.querySelectorAll(".top-nav, .hero, .page-header, main > *, .site-footer");
  if (!items.length) return;

  document.body.classList.add("page-enter-ready");

  items.forEach((item, index) => {
    item.classList.add("page-enter-item");
    item.style.setProperty("--enter-delay", `${Math.min(index * 90, 720)}ms`);
  });

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.classList.add("page-enter-start");
    });
  });
}

function initMemoryGame() {
  const memoryGrid = document.getElementById("memory-grid");
  const memoryStart = document.getElementById("memory-start");
  const memoryReset = document.getElementById("memory-reset");
  const memoryTime = document.getElementById("memory-time");
  const memoryMoves = document.getElementById("memory-moves");
  const memoryMatches = document.getElementById("memory-matches");
  const memoryBest = document.getElementById("memory-best");
  const memoryMessage = document.getElementById("memory-message");

  if (!memoryGrid || !memoryStart) return;

  const posters = [
    "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=300&q=80"
  ];

  let firstCard = null;
  let secondCard = null;
  let lockBoard = false;
  let moves = 0;
  let matches = 0;
  let timer = 45;
  let interval = null;

  const shuffle = (array) => array.sort(() => Math.random() - 0.5);

  function createBoard() {
    memoryGrid.innerHTML = "";
    const cards = shuffle([...posters, ...posters]);

    cards.forEach((imgSrc) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "card memory-picture-card";
      card.dataset.image = imgSrc;
      card.setAttribute("aria-label", "Memory card");
      card.innerHTML = `
        <span class="card-back">🎞️</span>
        <span class="card-front"><img src="${imgSrc}" alt="Movie scene"></span>
      `;
      memoryGrid.appendChild(card);
    });
  }

  function startTimer() {
    clearInterval(interval);
    interval = setInterval(() => {
      timer -= 1;
      memoryTime.textContent = String(timer);

      if (timer <= 0) {
        clearInterval(interval);
        lockBoard = true;
        memoryMessage.textContent = "⏰ Time's up! Press Start to try again.";
      }
    }, 1000);
  }

  function resetGame() {
    clearInterval(interval);
    timer = 45;
    moves = 0;
    matches = 0;
    firstCard = null;
    secondCard = null;
    lockBoard = false;

    memoryTime.textContent = String(timer);
    memoryMoves.textContent = String(moves);
    memoryMatches.textContent = `${matches}/8`;
    memoryMessage.textContent = "Press Start Game to begin.";

    createBoard();
  }

  function freezeMatchedCards(a, b) {
    a.classList.add("is-matched");
    b.classList.add("is-matched");
    a.disabled = true;
    b.disabled = true;
    firstCard = null;
    secondCard = null;
  }

  function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
      firstCard.classList.remove("is-flipped");
      secondCard.classList.remove("is-flipped");
      firstCard = null;
      secondCard = null;
      lockBoard = false;
    }, 700);
  }

  memoryGrid.addEventListener("click", (event) => {
    const clicked = event.target.closest(".memory-picture-card");
    if (!clicked || lockBoard || clicked === firstCard || clicked.classList.contains("is-matched")) return;

    clicked.classList.add("is-flipped");

    if (!firstCard) {
      firstCard = clicked;
      return;
    }

    secondCard = clicked;
    moves += 1;
    memoryMoves.textContent = String(moves);

    if (firstCard.dataset.image === secondCard.dataset.image) {
      matches += 1;
      memoryMatches.textContent = `${matches}/8`;
      freezeMatchedCards(firstCard, secondCard);

      if (matches === 8) {
        clearInterval(interval);
        memoryMessage.textContent = "🎉 Perfect match! You cleared all cards.";
        const best = Number(localStorage.getItem("memoryBest") || 0);
        if (!best || moves < best) {
          localStorage.setItem("memoryBest", String(moves));
          memoryBest.textContent = String(moves);
        }
      }
    } else {
      unflipCards();
    }
  });

  memoryStart.addEventListener("click", () => {
    resetGame();
    startTimer();
    memoryMessage.textContent = "Game started! Match all picture pairs.";
  });

  if (memoryReset) memoryReset.addEventListener("click", resetGame);

  const bestScore = localStorage.getItem("memoryBest");
  if (memoryBest && bestScore) memoryBest.textContent = bestScore;
  createBoard();
}

function initMovieQuiz() {
  const quizStart = document.getElementById("quiz-start");
  const quizNext = document.getElementById("quiz-next");
  const quizQuestion = document.getElementById("quiz-question");
  const quizOptions = document.getElementById("quiz-options");
  const quizScore = document.getElementById("quiz-score");

  if (!quizStart || !quizNext || !quizQuestion || !quizOptions || !quizScore) return;

  const questions = [
    { question: "I'm going to make him an offer he can't refuse.", options: ["Titanic", "The Godfather", "Frozen", "Barbie"], answer: "The Godfather" },
    { question: "I’ll be back.", options: ["Terminator", "Harry Potter", "Spider-Man", "Avengers"], answer: "Terminator" },
    { question: "Why so serious?", options: ["Batman", "Joker", "The Dark Knight", "Superman"], answer: "The Dark Knight" },
    { question: "To infinity and beyond!", options: ["Toy Story", "Up", "Shrek", "Cars"], answer: "Toy Story" }
  ];

  let current = 0;
  let score = 0;

  quizOptions.style.display = "none";
  quizNext.style.display = "none";

  function loadQuestion() {
    const q = questions[current];
    quizQuestion.textContent = q.question;
    quizOptions.innerHTML = "";
    quizNext.disabled = true;

    q.options.forEach((option) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = option;

      btn.addEventListener("click", () => {
        const buttons = quizOptions.querySelectorAll("button");
        buttons.forEach((b) => {
          b.disabled = true;
          if (b.textContent === q.answer) b.classList.add("correct");
        });

        if (option === q.answer) {
          score += 1;
          quizScore.textContent = `Score: ${score} ✅`;
        } else {
          btn.classList.add("wrong");
          quizScore.textContent = `Score: ${score} ❌`;
        }

        quizNext.disabled = false;
      });

      quizOptions.appendChild(btn);
    });
  }

  quizStart.addEventListener("click", () => {
    quizStart.style.display = "none";
    quizOptions.style.display = "flex";
    quizNext.style.display = "inline-block";
    current = 0;
    score = 0;
    quizScore.textContent = "Score: 0";
    loadQuestion();
  });

  quizNext.addEventListener("click", () => {
    current += 1;
    if (current < questions.length) {
      loadQuestion();
      return;
    }
    quizQuestion.textContent = `🎉 Quiz Finished! Final Score: ${score}/${questions.length}`;
    quizOptions.innerHTML = "";
    quizNext.style.display = "none";
  });
}

function initHomeMood() {
  if (!document.body.classList.contains("home-page")) return;

  const moodItems = document.querySelectorAll(".mood-item");
  const moodDisplay = document.getElementById("mood-display");
  if (!moodItems.length || !moodDisplay) return;

  const moodMessages = {
    happy: "Romcoms always make me smile and feel warm inside ",
    inspired: "Motivational movies remind me to chase my dreams ",
    emotional: "Sometimes I cry... but it feels good ",
    motivated: "Strong characters make me want to work harder "
  };

  moodItems.forEach((item) => {
    item.addEventListener("click", () => {
      const mood = item.dataset.mood;
      moodDisplay.textContent = moodMessages[mood] || "Movies are magic ✨";
      moodItems.forEach((m) => m.classList.remove("active"));
      item.classList.add("active");
    });
  });
}

function initHomeScrollAnimation() {
  const sections = document.querySelectorAll(".home-page .section");
  if (!sections.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  }, { threshold: 0.2 });

  sections.forEach((section) => observer.observe(section));
}

function initReviewsPosters() {
  const posters = document.querySelectorAll(".poster");
  const display = document.getElementById("movie-display");
  const title = document.getElementById("movie-title");
  const category = document.getElementById("movie-category");
  const description = document.getElementById("movie-description");
  const link = document.getElementById("movie-link");
  const image = document.getElementById("display-image");

  if (!posters.length || !display || !title || !category || !description || !link || !image) return;

  posters.forEach((poster) => {
    poster.addEventListener("click", () => {
      posters.forEach((p) => p.classList.remove("active"));
      poster.classList.add("active");

      title.textContent = poster.dataset.title || "";
      category.textContent = poster.dataset.category || "";
      description.textContent = poster.dataset.description || "";
      link.href = poster.dataset.link || "#";
      image.src = poster.dataset.image || "";

      display.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${poster.dataset.image || ""})`;
      display.style.backgroundSize = "cover";
      display.style.backgroundPosition = "center";

      display.classList.remove("hidden");
      display.scrollIntoView({ behavior: "smooth" });
    });
  });
}
