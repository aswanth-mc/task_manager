// ===============================
// SELECT ELEMENTS
// ===============================
const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const clearAllBtn = document.getElementById("clear-all");


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

    tasks.forEach(task => {
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

        editBtn.addEventListener("click", function () {
            editTask(task.id);
        });
        // Delete Button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";

        deleteBtn.addEventListener("click", function () {
            deleteTask(task.id);
        });

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);

        taskList.appendChild(li);
    });
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
// INITIAL RENDER ON PAGE LOAD
// ===============================
renderTasks();
