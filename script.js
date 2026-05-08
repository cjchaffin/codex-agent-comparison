const comparisonData = {
  beginner: {
    codex: [
      "Smoother first step if you already live in ChatGPT and have GitHub connected.",
      "The Windows desktop app gives you a visual place to review work, diffs, and agent progress.",
      "Cloud delegation is useful when you want to ask for work from a phone and inspect results later."
    ],
    claude: [
      "Very capable, but the core Claude Code experience is terminal-centered.",
      "Best once you are comfortable with commands, project folders, and basic Git habits.",
      "A good second opinion tool after you know what safe code changes look like."
    ]
  },
  mobile: {
    codex: [
      "Works well with a ChatGPT account flow and GitHub-connected cloud tasks.",
      "Windows desktop support is documented, which matches your home setup.",
      "Best mobile pattern: describe tasks on iOS, then review changes on Windows."
    ],
    claude: [
      "Claude has an iOS app, but Claude Code itself is documented as a terminal tool.",
      "Remote GitHub Actions can respond to issue or PR comments when configured.",
      "Best mobile pattern: create GitHub issues, then use configured automation."
    ]
  },
  github: {
    codex: [
      "Good fit for learning branches, pull requests, and reviewable changes inside GitHub.",
      "Can connect to selected repositories through the ChatGPT GitHub app.",
      "Useful for code review workflows without needing to memorize many commands."
    ],
    claude: [
      "Strong GitHub Actions story: mention @claude in issues or PRs after setup.",
      "Requires repository secrets and workflow configuration for the automation path.",
      "Great for teams or power users who want GitHub-native automation."
    ]
  },
  risk: {
    codex: [
      "Main risk is over-trusting generated changes before you understand what changed.",
      "Mitigation: use small tasks, branches, and PRs as checkpoints.",
      "Best when you want a guided environment while learning."
    ],
    claude: [
      "Main risk is terminal power: it can edit files and run commands quickly.",
      "Mitigation: keep projects in Git, review diffs, and avoid secrets in prompts.",
      "Best when you want control and are ready to understand the command flow."
    ]
  }
};

const weights = {
  comfort: { beginner: [30, 8], learning: [20, 18], terminal: [10, 32] },
  mobile: { review: [28, 16], "hands-on": [16, 16], rare: [14, 20] },
  home: { windows: [26, 14], ide: [18, 20], terminal: [8, 28] },
  github: { simple: [24, 12], prs: [22, 20], actions: [14, 30] }
};

const controls = ["comfort", "mobile", "home", "github"].map((id) => document.getElementById(id));
const winner = document.getElementById("winner");
const reason = document.getElementById("reason");
const codexScore = document.getElementById("codexScore");
const claudeScore = document.getElementById("claudeScore");
const codexBar = document.getElementById("codexBar");
const claudeBar = document.getElementById("claudeBar");
const codexList = document.getElementById("codexList");
const claudeList = document.getElementById("claudeList");

function clampScore(value) {
  return Math.max(5, Math.min(98, value));
}

function calculateScores() {
  let codex = 0;
  let claude = 0;
  controls.forEach((control) => {
    const [codexWeight, claudeWeight] = weights[control.id][control.value];
    codex += codexWeight;
    claude += claudeWeight;
  });
  codex = clampScore(codex);
  claude = clampScore(claude);
  codexScore.textContent = codex;
  claudeScore.textContent = claude;
  codexBar.style.width = `${codex}%`;
  claudeBar.style.width = `${claude}%`;
  if (codex >= claude + 8) {
    winner.textContent = "Start with OpenAI Codex";
    reason.textContent = "Codex is the better first home base for a non-coder who wants Windows support, ChatGPT familiarity, and cloud tasks connected to GitHub.";
  } else if (claude >= codex + 8) {
    winner.textContent = "Claude Code may fit your workflow";
    reason.textContent = "Claude Code becomes more attractive when you are comfortable in a terminal or want GitHub Actions automation driven by issues and PR comments.";
  } else {
    winner.textContent = "Use Codex first, add Claude Code later";
    reason.textContent = "The tools are close for this setup. Codex is easier to start with, while Claude Code is a strong addition once terminal and GitHub Actions workflows feel normal.";
  }
}

function renderComparison(tabName) {
  const data = comparisonData[tabName];
  codexList.innerHTML = data.codex.map((item) => `<li>${item}</li>`).join("");
  claudeList.innerHTML = data.claude.map((item) => `<li>${item}</li>`).join("");
}

document.querySelectorAll(".tab").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((tab) => tab.classList.remove("active"));
    button.classList.add("active");
    renderComparison(button.dataset.tab);
  });
});

controls.forEach((control) => control.addEventListener("change", calculateScores));
renderComparison("beginner");
calculateScores();
