document.addEventListener('DOMContentLoaded', loadTasks);

document.getElementById('taskForm').addEventListener('submit', function(event) {
    event.preventDefault();
    addTask();
});

function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => displayTask(task));
}

function addTask() {
    const taskName = document.getElementById('taskName').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const responsible = document.getElementById('responsible').value;

    if (!validateDates(startDate, endDate)) {
        alert('La fecha de fin debe ser mayor o igual a la fecha de inicio.');
        return;
    }

    const task = { taskName, startDate, endDate, responsible, completed: false, expired: isExpired(endDate) };

    displayTask(task);
    saveTask(task);

    document.getElementById('taskForm').reset();
}

function displayTask(task) {
    const taskList = document.getElementById('taskList');
    const taskItem = document.createElement('li');
    taskItem.className = `list-group-item task-item ${task.completed ? 'completed' : ''} ${task.expired ? 'expired' : ''}`;
    taskItem.innerHTML = `
        <div class="task-info">
            ${task.taskName} (Inicio: ${task.startDate}, Fin: ${task.endDate}, Responsable: ${task.responsible})
        </div>
        <div class="task-actions">
            ${!task.completed && !task.expired ? `<button class="btn btn-success btn-sm" onclick="resolveTask(this)">Resolver</button>` : ''}
            ${task.completed ? `<button class="btn btn-warning btn-sm" onclick="unresolveTask(this)">Desmarcar</button>` : ''}
            <button class="btn btn-danger btn-sm" onclick="deleteTask(this)">Eliminar</button>
        </div>
    `;
    taskList.appendChild(taskItem);
}

function saveTask(task) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function resolveTask(button) {
    const taskItem = button.closest('.task-item');
    taskItem.classList.add('completed');
    updateTask(taskItem, true);
    button.remove();
    taskItem.querySelector('.task-actions').insertAdjacentHTML('afterbegin', '<button class="btn btn-warning btn-sm" onclick="unresolveTask(this)">Desmarcar</button>');
}

function unresolveTask(button) {
    const taskItem = button.closest('.task-item');
    taskItem.classList.remove('completed');
    updateTask(taskItem, false);
    button.remove();
    taskItem.querySelector('.task-actions').insertAdjacentHTML('afterbegin', '<button class="btn btn-success btn-sm" onclick="resolveTask(this)">Resolver</button>');
}

function deleteTask(button) {
    if (confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
        const taskItem = button.closest('.task-item');
        taskItem.remove();
        removeTask(taskItem);
    }
}

function updateTask(taskItem, completed) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskText = taskItem.querySelector('.task-info').textContent;
    const taskIndex = tasks.findIndex(task => taskText.includes(task.taskName));
    if (taskIndex > -1) {
        tasks[taskIndex].completed = completed;
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}

function removeTask(taskItem) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskText = taskItem.querySelector('.task-info').textContent;
    tasks = tasks.filter(task => !taskText.includes(task.taskName));
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function isExpired(endDate) {
    const today = new Date().toISOString().split('T')[0];
    return endDate < today;
}

function validateDates(startDate, endDate) {
    return endDate >= startDate;
}
