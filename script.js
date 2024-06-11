document.addEventListener("DOMContentLoaded", function() {
    // Load tasks from local storage
    loadTasks();
});

function addTask() {
    var taskInput = document.getElementById("taskInput");
    var taskList = document.getElementById("taskList");

    if (taskInput.value.trim() === "") {
        alert("Please enter a task");
        return;
    }

    var task = {
        id: Date.now(),
        content: taskInput.value.trim(),
        completed: false
    };

    var li = document.createElement("li");
    li.innerHTML = `
        <span class="${task.completed ? 'completed' : ''}">${task.content}</span>
        <button onclick="toggleTask(${task.id})">${task.completed ? 'Uncomplete' : 'Complete'}</button>
        <button onclick="editTask(${task.id})">Edit</button>
        <button onclick="deleteTask(${task.id})">Delete</button>
    `;
    taskList.appendChild(li);

    // Save task to local storage
    saveTask(task);

    taskInput.value = "";
}

function toggleTask(id) {
    var taskList = document.getElementById("taskList");
    var taskItem = taskList.querySelector(`[data-id="${id}"]`);
    var taskContent = taskItem.querySelector("span");
    var taskCompleted = JSON.parse(taskItem.getAttribute("data-completed"));

    taskCompleted = !taskCompleted;
    taskContent.classList.toggle("completed");

    // Update task in local storage
    updateTask(id, { completed: taskCompleted });
}

function editTask(id) {
    var taskList = document.getElementById("taskList");
    var taskItem = taskList.querySelector(`[data-id="${id}"]`);
    var taskContent = taskItem.querySelector("span");
    var newContent = prompt("Edit task:", taskContent.innerText);

    if (newContent !== null && newContent.trim() !== "") {
        taskContent.innerText = newContent.trim();

        // Update task in local storage
        updateTask(id, { content: newContent.trim() });
    }
}

function deleteTask(id) {
    var confirmDelete = confirm("Are you sure you want to delete this task?");
    if (confirmDelete) {
        var taskList = document.getElementById("taskList");
        var taskItem = taskList.querySelector(`[data-id="${id}"]`);
        taskItem.remove();

        // Remove task from local storage
        removeTask(id);
    }
}

function loadTasks() {
    var tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    var taskList = document.getElementById("taskList");

    tasks.forEach(function(task) {
        var li = document.createElement("li");
        li.innerHTML = `
            <span class="${task.completed ? 'completed' : ''}">${task.content}</span>
            <button onclick="toggleTask(${task.id})">${task.completed ? 'Uncomplete' : 'Complete'}</button>
            <button onclick="editTask(${task.id})">Edit</button>
            <button onclick="deleteTask(${task.id})">Delete</button>
        `;
        taskList.appendChild(li);
    });
}

function saveTask(task) {
    var tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateTask(id, newData) {
    var tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    var updatedTasks = tasks.map(function(task) {
        if (task.id === id) {
            return { ...task, ...newData };
        }
        return task;
    });
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
}

function removeTask(id) {
    var tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    var filteredTasks = tasks.filter(function(task) {
        return task.id !== id;
    });
    localStorage.setItem("tasks", JSON.stringify(filteredTasks));
}
