
// var buttonEl = document.querySelector("#save-task"); 
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do"); 

var createTaskHandler = function(event) {

  event.preventDefault();
  var taskNameInput = document.querySelector("input[name='task-name']").value;
  var taskTypeInput = document.querySelector("select[name='task-type']").value;
  // console.dir(taskNameInput);

  //create list item
  var listItemEl = document.createElement("li");
  listItemEl.className = "task-item";

  //Create div to hold task info and add to list item
  var taskInfoEl = document.createElement("div");

  //give it a class name
  taskInfoEl.className = "task-info";

  //add html content to div
  taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskNameInput + "</h3><span class='task-type'>" + taskTypeInput + "</span>";

  listItemEl.appendChild(taskInfoEl);

  //add entire list item to list
  tasksToDoEl.appendChild(listItemEl);

//this code created a task item without type
  // var listItemEl = document.createElement("li");
  // listItemEl.className = "task-item";
  // listItemEl.textContent = taskNameInput;;
  // tasksToDoEl.appendChild(listItemEl);
};

//old event listener b/c its a form instead of a button
// buttonEl.addEventListener("click", createTaskHandler);
formEl.addEventListener("submit", createTaskHandler);
