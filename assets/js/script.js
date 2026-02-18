// Select elements
const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const taskList = document.getElementById("task-list");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Add Task
form.addEventListener("submit", function (e) {
    e.preventDefault(); // prevent page reload

    const taskText = input.value.trim();
    if (taskText === "") return; // avoid empty tasks

    const task ={
        id: Date.now(),
        text: taskText,
        completed: false
    };
    tasks.push(task);

    saveTasks();
    renderTasks();
    input.value = "";
});


    function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function renderTasks() {
    taskList.innerHTML = "";

    tasks.forEach(task => {
        const li = document.createElement("li");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        checkbox.addEventListener("change", function () {
            task.completed = this.checked;
            saveTasks();
            renderTasks();
        });

        const span = document.createElement("span");
        span.textContent = task.text;

        if (task.completed) {
            span.style.textDecoration = "line-through";
        }

        li.appendChild(checkbox);
        li.appendChild(span);

        taskList.appendChild(li);
    });
}

renderTasks();