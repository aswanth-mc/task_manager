// ===============================
// SELECT ELEMENTS
// ===============================
const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const taskcounter = document.getElementById("task-counter");
let currentFilter = "all";


// ===============================
// INITIALIZE STORAGE SYSTEM
// ===============================
let appState = {};

function initializeStorage() {
    const oldTasks = localStorage.getItem("tasks");
    const newData = localStorage.getItem("appData");
    
    if (newData) {
        // New structure already exists
        appState = JSON.parse(newData);
    } else if (oldTasks) {
        // Migrate from old structure to new
        const tasks = JSON.parse(oldTasks);
        appState = {
            tasks: tasks,
            learningPaths: []
        };
        saveData();
        // Remove old localStorage key
        localStorage.removeItem("tasks");
        console.log("✓ Migrated old tasks to new structure");
    } else {
        // Fresh start
        appState = {
            tasks: [],
            learningPaths: []
        };
        saveData();
    }
    
    console.log("Current app state:", appState);
}

// ===============================
// STORAGE FUNCTIONS
// ===============================
function saveData() {
    localStorage.setItem("appData", JSON.stringify(appState));
}

function loadData() {
    return appState;
}

// Initialize storage on page load
initializeStorage();


// ===============================
// RENDER TASKS FUNCTION
// ===============================
function renderTasks() {
    taskList.innerHTML = "";
    const tasks = appState.tasks;

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
            saveData();
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

    appState.tasks.push(task);
    saveData();
    renderTasks();

    input.value = "";
});

// ===============================
// edit TASK
// ===============================
function editTask(id) {

    const task = appState.tasks.find(task => task.id === id);

    if (!task) return;

    const newText = prompt("Edit your task:", task.text);

    if (newText === null) return; // User pressed cancel

    if (newText.trim() === "") {
        alert("Task cannot be empty");
        return;
    }

    task.text = newText.trim();

    saveData();
    renderTasks();
}


// ===============================
// DELETE TASK
// ===============================
function deleteTask(id) {
    appState.tasks = appState.tasks.filter(task => task.id !== id);
    saveData();
    renderTasks();
}


// ===============================
// count TASKS
// ===============================
function updateTaskCounter() {
    const tasks = appState.tasks;
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

// ===============================
// LEARNING PATHS MODULE
// ===============================
const LearningPathsModule = {
    createCourse(courseName) {
        if (!courseName.trim()) return;
        
        const course = {
            id: Date.now(),
            courseName: courseName.trim(),
            modules: []
        };
        
        appState.learningPaths.push(course);
        saveData();
        this.renderCourses();
    },

    deleteCourse(courseId) {
        if (!confirm("Delete this course and all its modules?")) return;
        
        appState.learningPaths = appState.learningPaths.filter(c => c.id !== courseId);
        saveData();
        this.renderCourses();
    },

    addModule(courseId, moduleTitle) {
        if (!moduleTitle.trim()) return;
        
        const course = appState.learningPaths.find(c => c.id === courseId);
        if (!course) return;
        
        const module = {
            id: Date.now(),
            title: moduleTitle.trim(),
            completed: false
        };
        
        course.modules.push(module);
        saveData();
        this.renderCourses();
    },

    deleteModule(courseId, moduleId) {
        const course = appState.learningPaths.find(c => c.id === courseId);
        if (!course) return;
        
        course.modules = course.modules.filter(m => m.id !== moduleId);
        saveData();
        this.renderCourses();
    },

    toggleModuleComplete(courseId, moduleId) {
        const course = appState.learningPaths.find(c => c.id === courseId);
        if (!course) return;
        
        const module = course.modules.find(m => m.id === moduleId);
        if (!module) return;
        
        module.completed = !module.completed;
        saveData();
        this.renderCourses();
    },

    calculateProgress(courseId) {
        const course = appState.learningPaths.find(c => c.id === courseId);
        if (!course || course.modules.length === 0) return 0;
        
        const completed = course.modules.filter(m => m.completed).length;
        return Math.round((completed / course.modules.length) * 100);
    },

    renderCourses() {
        const coursesContainer = document.getElementById("courses-container");
        coursesContainer.innerHTML = "";

        const courses = appState.learningPaths;

        if (courses.length === 0) {
            coursesContainer.innerHTML = "<p style='text-align: center; color: #9ca3af; padding: 20px;'>No courses yet. Create one to get started!</p>";
            return;
        }

        courses.forEach(course => {
            const courseCard = document.createElement("div");
            courseCard.className = "course-card";

            const progress = this.calculateProgress(course.id);
            const completedModules = course.modules.filter(m => m.completed).length;
            const totalModules = course.modules.length;

            // Course Header
            const courseHeader = document.createElement("div");
            courseHeader.className = "course-header";

            const courseTitle = document.createElement("span");
            courseTitle.className = "course-title";
            courseTitle.textContent = course.courseName;

            const courseMeta = document.createElement("div");
            courseMeta.className = "course-meta";

            const moduleCount = document.createElement("span");
            moduleCount.className = "module-count";
            moduleCount.textContent = `${totalModules} module${totalModules !== 1 ? "s" : ""}`;

            const toggleBtn = document.createElement("button");
            toggleBtn.className = "course-toggle";
            toggleBtn.textContent = "▼";

            const deleteBtn = document.createElement("button");
            deleteBtn.className = "delete-course-btn";
            deleteBtn.textContent = "Delete";
            deleteBtn.addEventListener("click", () => this.deleteCourse(course.id));

            courseMeta.appendChild(moduleCount);
            courseMeta.appendChild(toggleBtn);
            courseMeta.appendChild(deleteBtn);

            courseHeader.appendChild(courseTitle);
            courseHeader.appendChild(courseMeta);

            // Progress Bar
            const progressContainer = document.createElement("div");
            progressContainer.className = "progress-container";

            const progressBar = document.createElement("div");
            progressBar.className = "progress-bar";

            const progressFill = document.createElement("div");
            progressFill.className = "progress-fill";
            progressFill.style.width = progress + "%";

            progressBar.appendChild(progressFill);

            const progressText = document.createElement("div");
            progressText.className = "progress-text";
            progressText.textContent = `${completedModules}/${totalModules} modules • ${progress}%`;

            progressContainer.appendChild(progressBar);
            progressContainer.appendChild(progressText);

            // Modules List
            const modulesList = document.createElement("div");
            modulesList.className = "modules-list";

            course.modules.forEach(module => {
                const moduleItem = document.createElement("div");
                moduleItem.className = "module-item";

                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.checked = module.completed;
                checkbox.addEventListener("change", () => {
                    this.toggleModuleComplete(course.id, module.id);
                });

                const label = document.createElement("label");
                label.className = "module-label";
                label.textContent = module.title;
                label.addEventListener("click", () => checkbox.click());

                const deleteModuleBtn = document.createElement("button");
                deleteModuleBtn.className = "delete-module-btn";
                deleteModuleBtn.textContent = "Delete";
                deleteModuleBtn.addEventListener("click", () => this.deleteModule(course.id, module.id));

                moduleItem.appendChild(checkbox);
                moduleItem.appendChild(label);
                moduleItem.appendChild(deleteModuleBtn);
                modulesList.appendChild(moduleItem);
            });

            // Add Module Form
            const addModuleForm = document.createElement("form");
            addModuleForm.className = "add-module-form";

            const moduleInput = document.createElement("input");
            moduleInput.type = "text";
            moduleInput.placeholder = "Add module...";

            const addBtn = document.createElement("button");
            addBtn.type = "submit";
            addBtn.textContent = "Add";

            addModuleForm.addEventListener("submit", (e) => {
                e.preventDefault();
                this.addModule(course.id, moduleInput.value);
                moduleInput.value = "";
            });

            addModuleForm.appendChild(moduleInput);
            addModuleForm.appendChild(addBtn);
            modulesList.appendChild(addModuleForm);

            // Toggle modules visibility
            toggleBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                modulesList.classList.toggle("visible");
                toggleBtn.classList.toggle("expanded");
                toggleBtn.textContent = modulesList.classList.contains("visible") ? "▲" : "▼";
            });

            courseHeader.addEventListener("click", () => {
                modulesList.classList.toggle("visible");
                toggleBtn.classList.toggle("expanded");
                toggleBtn.textContent = modulesList.classList.contains("visible") ? "▲" : "▼";
            });

            courseCard.appendChild(courseHeader);
            courseCard.appendChild(progressContainer);
            courseCard.appendChild(modulesList);

            coursesContainer.appendChild(courseCard);
        });
    }
};

// ===============================
// TAB NAVIGATION
// ===============================
const tabButtons = document.querySelectorAll(".tab-btn");
const tabSections = document.querySelectorAll(".tab-section");

tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const targetTab = btn.dataset.tab;

        // Remove active class from all tabs and sections
        tabButtons.forEach(b => b.classList.remove("active"));
        tabSections.forEach(s => s.classList.remove("active"));

        // Add active class to clicked tab and corresponding section
        btn.classList.add("active");
        document.getElementById(targetTab).classList.add("active");

        // Render the section when clicked
        if (targetTab === "learning-section") {
            LearningPathsModule.renderCourses();
        }
    });
});

// ===============================
// LEARNING PATHS EVENT LISTENERS
// ===============================
const courseForm = document.getElementById("course-form");
const courseInput = document.getElementById("course-input");

courseForm.addEventListener("submit", (e) => {
    e.preventDefault();
    LearningPathsModule.createCourse(courseInput.value);
    courseInput.value = "";
});

// ===============================
// INITIAL RENDER ON PAGE LOAD
// ===============================
renderTasks();
updateTaskCounter();
