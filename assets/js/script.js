// ===============================
// SELECT ELEMENTS
// ===============================
const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const taskcounter = document.getElementById("task-counter");
let currentFilter = "all";


// ===============================
// LOAD TASKS FROM LOCAL STORAGE
// ===============================
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];


// ===============================
// SAVE TASKS FUNCTION
// ===============================
console.log("Loaded tasks:", tasks);
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


// ===============================
// RENDER TASKS FUNCTION
// ===============================
function renderTasks() {
    taskList.innerHTML = "";

    // 1️⃣ Filter tasks first
    const filteredTasks = tasks.filter(task => {
        if (currentFilter === "active") return !task.completed;
        if (currentFilter === "completed") return task.completed;
        return true; // all
    });

    // 2️⃣ Loop through filtered tasks
    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        // Checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        checkbox.addEventListener("change", function () {
            task.completed = this.checked;
            saveTasks();
            renderTasks();
        });

        // Task Text
        const span = document.createElement("span");
        span.textContent = task.text;

        if (task.completed) {
            span.style.textDecoration = "line-through";
        }

        // Edit Button
        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.classList.add("edit-btn");
        editBtn.addEventListener("click", function () {
            editTask(task.id);
        });

        // Delete Button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.addEventListener("click", function () {
            deleteTask(task.id);
        });

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);

        taskList.appendChild(li);
    });

    // 3️⃣ Update counter every render
    updateTaskCounter();
}


// ===============================
// ADD TASK
// ===============================
form.addEventListener("submit", function (e) {
    e.preventDefault();

    const taskText = input.value.trim();
    if (!taskText) return;

    const task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    tasks.push(task);
    saveTasks();
    renderTasks();

    input.value = "";
});

// ===============================
// edit TASK
// ===============================
function editTask(id) {

    const task = tasks.find(task => task.id === id);

    if (!task) return;

    const newText = prompt("Edit your task:", task.text);

    if (newText === null) return; // User pressed cancel

    if (newText.trim() === "") {
        alert("Task cannot be empty");
        return;
    }

    task.text = newText.trim();

    saveTasks();
    renderTasks();
}


// ===============================
// DELETE TASK
// ===============================
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}


// ===============================
// count TASKS
// ===============================
function updateTaskCounter() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const pendingTasks = totalTasks - completedTasks;

    if (totalTasks === 0) {
        taskcounter.textContent = "No tasks yet";
        return;
    }

    taskcounter.textContent =
        `${totalTasks} task${totalTasks > 1 ? "s" : ""} • ` +
        `${completedTasks} completed • ` +
        `${pendingTasks} remaining`;
}

const filterButtons = document.querySelectorAll(".filter-btn");

filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        currentFilter = btn.dataset.filter;

        // Update active button style
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        renderTasks();
    });
});


// ===============================
// SEARCH TASKS    
// ===============================
const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("search-input");

searchBtn.addEventListener("click", () => {
    const value = searchInput.value.toLowerCase();
    const listItems = document.querySelectorAll("#task-list li");

    listItems.forEach(li => {
        const text = li.textContent.toLowerCase();

        if (text.includes(value)) {
            li.style.display = "flex";
        } else {
            li.style.display = "none";
        }
    });
});

// ===============================
// INITIAL RENDER ON PAGE LOAD
// ===============================
renderTasks();
updateTaskCounter();
