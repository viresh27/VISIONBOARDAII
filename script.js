 let goals = JSON.parse(localStorage.getItem("goals")) || [];

    const quotes = [
      "Believe you can and you're halfway there.",
      "Success is the sum of small efforts repeated daily.",
      "Your limitation—it's only your imagination.",
      "Push yourself, because no one else is going to do it for you.",
      "Great things never come from comfort zones.",
      "Dream it. Wish it. Do it.",
      "Stay focused and never give up."
    ];

    async function getAffirmation(goalTitle) {
  try {
    const response = await fetch('https://api.quotable.io/random');
    if (!response.ok) throw new Error('Network response not ok');
    const data = await response.json();
    return `"${data.content}" —${data.author}`;
  } catch {
    return "Keep going, you can do it!";
  }
}


  async function addGoal() {
  const titleInput = document.getElementById("goal-title");
  const imageInput = document.getElementById("goal-image");
  const title = titleInput.value.trim();

  if (!title || !imageInput.files.length) {
    alert("Please enter a goal and select an image.");
    return;
  }

  const file = imageInput.files[0];

  // Convert image file to base64 string
  const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });

  try {
    const base64Image = await toBase64(file);

    // Call backend to get affirmation
    const affirmation = await getAffirmation(title);

    const newGoal = {
      title,
      image: base64Image,
      progress: 0,
      affirmation,
    };

    goals.push(newGoal);
    localStorage.setItem("goals", JSON.stringify(goals));

    titleInput.value = "";
    imageInput.value = "";

    renderBoard();
  } catch (err) {
    console.error("Error adding goal:", err);
    alert("Failed to add goal. Try again.");
  }
}



    function updateProgress(index, increment) {
      goals[index].progress = Math.min(100, goals[index].progress + increment);
      localStorage.setItem("goals", JSON.stringify(goals));
      
      renderBoard();
      if (goals[index].progress === 100) {
    showCongratsAnimation(index);
  }
    }
    function showCongratsAnimation(index) {
  const board = document.getElementById("vision-board");
  const card = board.children[index];

  // Create animation element
  const animation = document.createElement("div");
  animation.className = "congrats-animation";
  animation.innerText = "🌸🎉 Congrats! Goal Completed! 🎉🌸";

  card.appendChild(animation);

  // Remove animation after 2 seconds
  setTimeout(() => {
    animation.remove();
  }, 2000);
}

    function renderBoard() {
      const board = document.getElementById("vision-board");
      board.innerHTML = "";
      goals.forEach((goal, index) => {
        const card = document.createElement("div");
        card.className = "goal-card";

        card.innerHTML = `
          <img src="${goal.image}" alt="Goal Image" />
          <h3>${goal.title}</h3>
          <progress value="${goal.progress}" max="100"></progress>
          <p class="affirmation">💬 ${goal.affirmation || 'No affirmation yet'}</p>
          <div style="margin-top:0.5rem;">
            <button onclick="updateProgress(${index}, 10)">+10%</button>
          </div>
        `;

        board.appendChild(card);
      });
    }

    function showQuote() {
      const box = document.getElementById("quote-box");
      const quote = quotes[Math.floor(Math.random() * quotes.length)];
      box.innerText = `💬 "${quote}"`;
    }
    showQuote();  // Show random quote initially

// Optional: change quote every 10 seconds
setInterval(showQuote, 10000);


    renderBoard();