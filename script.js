var tasks = [];
var mode;
var currentEditedTaskId;
var currentEditedTaskIndex;

$("#addTask-btn").on("click", addTask);
$("#saveChanges-btn").on("click", saveChanges);
$("#filter").on("change", function (event) {
  setFilter(event.target.value);
  renderTasks();
});

//intial render of the tasks
getTasks();

//function used to render the tasks in the ui
function renderTasks() {
  //clear the previous ui to avoid duplicates
  $(".tasks").empty();

  for (let index = 0; index < tasks.length; index++) {
    var id = tasks[index].id;
    var name = tasks[index].name;
    var isFinished = tasks[index].is_finished;

    $(".tasks").append("<div id=item-" + id + "></div>");
    $("#item-" + id).addClass(
      "d-flex algn-items-center bg-dark text-white gap-3",
    );
    $("#item-" + id).append(
      "<p id=name-" +
        id +
        " class='" +
        (isFinished ? "text-decoration-line-through" : "") +
        "'>" +
        name +
        "</p>",
    );
    $("#name-" + id).on(
      "click",
      { id: id, runFunc: toggleTask, isFinished: isFinished, index: index },
      onClick,
    );
    $("#item-" + id).append(
      "<btn id=deleteBtn-" + id + " class='btn btn-danger'>Delete</btn>",
    );
    $("#item-" + id).append(
      "<btn id=editBtn-" +
        index +
        " class='btn btn-primary' data-bs-toggle='modal' data-bs-target='#exampleModal' >Edit</btn>",
    );
    $("#editBtn-" + index).on(
      "click",
      { id: id, runFunc: editTask, value: name, index: index },
      onClick,
    );
    $("#deleteBtn-" + id).on(
      "click",
      { id: id, runFunc: deleteTask, index: index },
      onClick,
    );
  }
}

function deleteTask(data) {
  $.ajax({
    url: "http://localhost:8000/api/todos/" + data.id,
    method: "DELETE",
    success: function (response) {
      //remove the deleted task from the tasks array and re-render the tasks
      tasks.splice(data.index, 1);
      renderTasks();
    },
    error: function (error) {
      console.error("Error deleting task:", error);
    },
  });
}
function editTask(data) {
  $(".modal-title").text("Edit Task");
  $("#taskInput").val(data.value);
  mode = "edit";
  currentEditedTaskId = data.id;
  currentEditedTaskIndex = data.index;
}
function addTask() {
  $(".modal-title").text("Add Task");
  $("#taskInput").val("");
  mode = "add";
}
function onClick(event) {
  event.data.runFunc(event.data);
}
function saveChanges() {
  // Depending on the mode, either save a new task or save the edited task
  if (mode === "add") {
    saveNewTask();
  } else if (mode === "edit") {
    saveEditedTask();
  }
}
function toggleTask(data) {
  $.ajax({
    url: "http://localhost:8000/api/todos/" + data.id,
    method: "PATCH",
    data: {
      is_finished: data.isFinished ? 0 : 1,
    },
    success: function (response) {
      console.log("Task toggled successfully:", response);
      tasks[data.index].is_finished = !data.isFinished;
      getTasks();
      renderTasks();
    },
    error: function (err) {
      console.error("Toggle failed:", err);
    },
  });
}
function saveNewTask() {
  $.ajax({
    url: "http://localhost:8000/api/todos",
    method: "POST",
    data: { name: $("#taskInput").val() },
    success: function (response) {
      console.log("Task added successfully:", response);
      tasks.push(response);
      getTasks();
      renderTasks();
    },
    onError: function (error) {
      console.error("Error adding task:", error);
    },
  });
}
function saveEditedTask() {
  $.ajax({
    url: "http://localhost:8000/api/todos/" + currentEditedTaskId,
    method: "PATCH",
    data: { name: $("#taskInput").val() },
    success: function (response) {
      //find the index of the edited task , and update it accordignly

      tasks[currentEditedTaskIndex].name = $("#taskInput").val();
      renderTasks();
    },
    onError: function (error) {
      console.error("Error editing task:", error);
    },
  });
}

function getTasks() {
  const filter = getFilter();

  $.ajax({
    url: "http://localhost:8000/api/todos/" + filter,
    method: "GET",

    success: function (response) {
      console.log(response);

      tasks = response;

      renderTasks();
    },
  });
}

function setFilter(filter) {
  const url = new URL(window.location.href);
  url.searchParams.set("filter", filter);
  window.history.pushState({}, "", url);

  getTasks();
  renderTasks();
}
function getFilter() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("filter") || "all";
}
