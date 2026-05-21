$("#addTask-btn").on("click", addTask);
$("#saveChanges-btn").on("click", saveChanges);

$.ajax({
  url: "http://localhost:8000/api/todos",
  method: "GET",
  success: function (response) {
    console.log("Tasks fetched successfully:", response.length);
    renderTasks(response);
  },
});

function renderTasks(tasks) {
  console.log("Rendering tasks:", tasks);
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
      { id: id, runFunc: editTask, value: name },
      onClick,
    );
    $("#deleteBtn-" + id).on("click", { id: id, runFunc: deleteTask }, onClick);
  }
}

function deleteTask(data) {
  console.log("deleting task number:" + data.id);
  $.ajax({
    url: "http://localhost:8000/api/todos/" + data.id,
    method: "DELETE",
    onSuccess: function (response) {
      console.log("Task deleted successfully:", response);
      $("#item-" + data.id).remove();
    },
  });
  console.log("need to delete task number:" + data.id);
}
function editTask(data) {
  $(".modal-title").text("Edit Task");
  $("#taskInput").val(data.value);
  console.log("need to edit task number:" + data.id, data.value);
}
function addTask() {
  console.log("Adding a new task...");
  $(".modal-title").text("Add Task");
  $("#taskInput").val("");
}
function onClick(event) {
  event.data.runFunc(event.data);
}
function saveChanges() {
  console.log("saving");
  $.ajax({
    url: "http://localhost:8000/api/todos",
    method: "POST",
    data: { name: $("#taskInput").val() },
    success: function (response) {
      console.log("Task added successfully:", response);
      renderTasks(response);
    },
    onError: function (error) {
      console.error("Error adding task:", error);
    },
  });
}
function toggleTask(data) {
  console.log("toggling task number:" + data.id);
}
