const ADMIN_PASSWORD = "fluentspeak123";
let chapters = JSON.parse(localStorage.getItem("chapters")) || [
    { order: 1, title: "Greetings & Introduction", content: `<h3>Lesson Overview</h3><p>Learn how to introduce yourself confidently.</p><ul><li>My name is Rahul.</li><li>I am from Delhi.</li><li>Nice to meet you.</li></ul>` }
];
let currentChapter = null;
let completedChapters = JSON.parse(localStorage.getItem("completedChapters")) || [];
let isAdmin = false;

function login() {
    const username = document.getElementById("usernameInput").value.trim();
    if (!username) return;
    if (username === ADMIN_PASSWORD) {
        isAdmin = true;
        localStorage.setItem("username", "Admin");
    } else {
        localStorage.setItem("username", username);
    }
    showApp();
}

function logout() {
    localStorage.clear();
    location.reload();
}

function showApp() {
    document.getElementById("loginPage").classList.add("hidden");
    document.getElementById("app").classList.remove("hidden");
    document.getElementById("welcomeUser").textContent = "Hello, " + localStorage.getItem("username");
    loadChapters();
    updateProgress();
    if (isAdmin) {
        showAdminPanel();
    }
}

function loadChapters() {
    const chapterList = document.getElementById("chapterList");
    chapterList.innerHTML = "";
    chapters
        .sort((a, b) => a.order - b.order)
        .forEach((chapter) => {
            const li = document.createElement("li");
            li.textContent = chapter.order + ". " + chapter.title;
            const isUnlocked = chapter.order === 1 || completedChapters.includes(chapter.order - 1) || isAdmin;
            if (!isUnlocked) {
                li.style.opacity = "0.5";
                li.textContent += " 🔒";
            } else {
                li.onclick = () => showChapter(chapter);
            }
            if (completedChapters.includes(chapter.order)) {
                li.classList.add("completed");
            }
            chapterList.appendChild(li);
        });
}

function showChapter(chapter) {
    currentChapter = chapter;
    document.getElementById("chapterTitle").textContent = chapter.title;
    document.getElementById("chapterContent").innerHTML = chapter.content;
    document.getElementById("completeBtn").classList.remove("hidden");
    if (isAdmin) {
        addEditButton();
    }
}

function markComplete() {
    if (!completedChapters.includes(currentChapter.order)) {
        completedChapters.push(currentChapter.order);
        localStorage.setItem("completedChapters", JSON.stringify(completedChapters));
    }
    loadChapters();
    updateProgress();
}

function updateProgress() {
    const total = chapters.length;
    const done = completedChapters.length;
    document.getElementById("progressText").textContent = `Progress: ${done} / ${total} chapters completed`;
}

function showAdminPanel() {
    const sidebar = document.querySelector(".sidebar");
    const addBtn = document.createElement("button");
    addBtn.textContent = "➕ Add Chapter";
    addBtn.style.marginTop = "10px";
    addBtn.onclick = addChapter;
    sidebar.appendChild(addBtn);
}

function addChapter() {
    const title = prompt("Enter chapter title:");
    if (!title) return;
    const content = prompt("Enter chapter content (HTML allowed):");
    if (!content) return;
    const newChapter = { order: chapters.length + 1, title: title, content: content };
    chapters.push(newChapter);
    saveChapters();
    loadChapters();
}

function addEditButton() {
    const contentDiv = document.getElementById("chapterContent");
    const editBtn = document.createElement("button");
    editBtn.textContent = "✏ Edit Chapter";
    editBtn.style.marginTop = "15px";
    editBtn.onclick = editChapter;
    contentDiv.appendChild(editBtn);
}

function editChapter() {
    const newTitle = prompt("Edit title:", currentChapter.title);
    const newContent = prompt("Edit content:", currentChapter.content);
    if (newTitle) currentChapter.title = newTitle;
    if (newContent) currentChapter.content = newContent;
    saveChapters();
    loadChapters();
    showChapter(currentChapter);
}

function saveChapters() {
    localStorage.setItem("chapters", JSON.stringify(chapters));
}

if (localStorage.getItem("username")) {
    showApp();
}