function onClick(event){
  var id=event.data.id;
  event.data.runFunc(id)
  
}
  for (let index = 0; index < 6; index++) {
  $(".tasks").append("<div id=item-"+ index+"></div>");
  $("#item-"+index).addClass("d-flex algn-items-center bg-dark text-white gap-3");
    $("#item-"+index).append("<p>Name -  "+index + ".</p>");
    $("#item-"+index).append("<btn id=deleteBtn-"+index+" class='btn btn-danger'>Delete</btn>");
    $("#item-"+index).append("<btn id=editBtn-"+index+" class='btn btn-primary'>Edit</btn>");
    $("#editBtn-"+index).on("click",{id:index,runFunc:editTask},onClick);
    $("#deleteBtn-"+index).on("click",{id:index,runFunc:deleteTask},onClick);
}

function deleteTask(id){
  console.log("need to delete task number:"+id);
  
}
function editTask(id){
  console.log("need to edit task number:"+id);
  
}

