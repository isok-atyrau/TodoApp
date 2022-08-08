const form = document.querySelector("#form");
const taskInput = document.querySelector("#taskInput");
const tasksList = document.querySelector("#tasksList");
const emptyList = document.querySelector("#emptyList");

form.addEventListener("submit", addTask);
tasksList.addEventListener("click", deleteTask);
tasksList.addEventListener("click", doneTask);

let tasks = [];

if (localStorage.getItem("tasks")) {
  tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks.forEach((task) => renderTask(task));
}

checkEmptyList();

// Функции
function addTask(e) {
  //Отменяем отпавку формы
  e.preventDefault();

  // Получаем данные у инпута
  const tasktext = taskInput.value;

  // Описываем задачу в виде объекта
  const newTask = {
    id: Date.now(),
    text: tasktext,
    done: false,
  };

  //Доюавляем задачу в массив с задачами
  tasks.push(newTask);

  //Добавляем задачу в Local Storage
  saveToLocalStorage();

  renderTask(newTask);

  // Очищаем форму
  taskInput.value = "";

  //Вернем фокус на инпут
  taskInput.focus();

  checkEmptyList();
}

function deleteTask(e) {
  // Проверка если клик не был по кнопке "удалить задачу"
  if (e.target.dataset.action !== "delete") return;

  const parentNode = e.target.closest(".list-group-item");

  // Найдем id задачи
  const id = parentNode.id;

  // Удаляем задачу из массива задачи
  tasks = tasks.filter((task) => task.id !== +id);

  //Добавляем задачу в Local Storage
  saveToLocalStorage();

  //удаляем задачу из разметки
  parentNode.remove();

  checkEmptyList();
}

function doneTask(e) {
  // Проверка на клик был не по кнопке "Добавить задачу"
  if (e.target.dataset.action !== "done") return;

  const parentNode = e.target.closest(".list-group-item");

  // Найдем id задачи
  const id = parentNode.id;

  //Найдем в массиве задач
  const task = tasks.find((task) => task.id === +id);

  //Поменяем статус задачи
  task.done = !task.done;

  //Добавляем задачу в Local Storage
  saveToLocalStorage();

  //Добавляем класс task-title--done
  const taskTitle = parentNode.querySelector(".task-title");
  taskTitle.classList.toggle("task-title--done");
}

function checkEmptyList() {
  if (tasks.length === 0) {
    const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
    <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3" />
    <div class="empty-list__title">Список дел пуст</div>
  </li>`;
    tasksList.insertAdjacentHTML("afterbegin", emptyListHTML);
  }

  if (tasks.length > 0) {
    const emptyListEl = document.querySelector("#emptyList");
    emptyListEl ? emptyListEl.remove() : null;
  }
}

function saveToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTask(task) {
  // Формируем css класс
  const cssClass = task.done ? "task-title task-title--done" : "task-title";

  // Создаеам разметку HTML
  const taskHTML = `
                <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
                                    <span class="${cssClass}">${task.text}</span>
                                    <div class="task-item__buttons">
                                        <button type="button" data-action="done" class="btn-action">
                                            <img src="./img/tick.svg" alt="Done" width="18" height="18">
                                        </button>
                                        <button type="button" data-action="delete" class="btn-action">
                                            <img src="./img/cross.svg" alt="Done" width="18" height="18">
                                        </button>
                                    </div>
                                </li>`;

  // Добавляем в разметку
  tasksList.insertAdjacentHTML("beforeend", taskHTML);
}
