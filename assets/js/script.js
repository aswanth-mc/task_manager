// Select elements
const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const taskList = document.getElementById("task-list");

// Add Task
form.addEventListener("submit", function (e) {
    e.preventDefault(); // prevent page reload

    const taskText = input.value.trim();

    if (taskText === "") return; // avoid empty tasks

    // Create task item
    const li = document.createElement("li");

    // create checkbox
    const checkbox =document.createElement("input");
    checkbox.type = "checkbox";

    // create task text
    const span = document.createElement("span");
    span.textcontent = taskText;

    //append elements
    li.appendChild(checkbox);
    li.appendChild(span);
    taskList.appendChild(li);

    // Clear input
    input.value = "";
});
