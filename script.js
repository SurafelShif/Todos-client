$( ".tasks" ).css( "border", "2px solid red" )
  .css( "background", "yellow" );
var text ="dsfd";
for (let index = 0; index < 6; index++) {
    $(".tasks").append("<p>Name -  "+index + ".</p>");
    $(".tasks").append("<btn class='btn btn-danger'>Delete</btn>");
}