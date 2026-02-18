// Select elements
const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const taskList = document.getElementById("task-list");

// Add Task
form.addEventListener("submit", function (e) {
    e.preventDefault(); // prevent page reload

    const taskText = input.value.trim();

    if (taskText === "") return; // avoid empty tasks

    const li = document.createElement("li");
    li.innerHTML = `
        <input type="checkbox">
        <span>${taskText}</span>
    `;

    taskList.appendChild(li);

    // Clear input
    input.value = "";
});
