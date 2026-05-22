var tasks = [];
var mode;
var currentEditedTaskId;
var currentEditedTaskIndex;
$("#addTask-btn").on("click", addTask);
$("#saveChanges-btn").on("click", saveChanges);

$.ajax({
  url: "http://localhost:8000/api/todos",
  method: "GET",
  success: function (response) {
    console.log("Tasks fetched successfully:", response);
    tasks = response;
    renderTasks();
  },
});

function renderTasks() {
  console.log("Rendering tasks:", tasks);
  //clear the previous ui to avoid duplicates
  $(".tasks").empty();

  for (let index = 0; index < tasks.length; index++) {
    var id = tasks[index].id;
    var name = tasks[index].name;
    var isFinished = tasks[index].isFinished;

    $(".tasks").append("<div id=item-" + id + "></div>");
    $("#item-" + id).addClass(
      "d-flex algn-items-center bg-dark text-white gap-3",
    );
    $("#item-" + id).append("<p id=name-" + id + ">Name -  " + name + ".</p>");
    $("#name-" + id).on("click", { id: id, runFunc: toggleTask }, onClick);
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
  console.log("Adding a new task...");
  $(".modal-title").text("Add Task");
  $("#taskInput").val("");
  mode = "add";
}
function onClick(event) {
  event.data.runFunc(event.data);
}
function saveChanges() {
  console.log(mode);
  // Depending on the mode, either save a new task or save the edited task
  if (mode === "add") {
    saveNewTask();
  } else if (mode === "edit") {
    saveEditedTask();
  }
}
function toggleTask(data) {
  console.log("toggling task number:" + data.id);
}
function saveNewTask() {
  $.ajax({
    url: "http://localhost:8000/api/todos",
    method: "POST",
    data: { name: $("#taskInput").val() },
    success: function (response) {
      console.log("Task added successfully:", response);
      tasks.push(response);
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
      console.log("Task edited successfully:", response);
      //find the index of the edited task , and update it accordignly

      tasks[currentEditedTaskIndex].name = $("#taskInput").val();
      console.log("Updated tasks array:", tasks);
      renderTasks();
    },
    onError: function (error) {
      console.error("Error editing task:", error);
    },
  });
}
