//unique id creator
var taskIdCounter = 0



// var buttonEl = document.querySelector("#save-task"); 
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do"); 

var taskFormHandler = function(event) {

  event.preventDefault();
  var taskNameInput = document.querySelector("input[name='task-name']").value;
  var taskTypeInput = document.querySelector("select[name='task-type']").value;
  // console.dir(taskNameInput);

//code moved to new function for refactoring
  // //create list item
  // var listItemEl = document.createElement("li");
  // listItemEl.className = "task-item";

  // //Create div to hold task info and add to list item
  // var taskInfoEl = document.createElement("div");

  // //give it a class name
  // taskInfoEl.className = "task-info";

  // //add html content to div
  // taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskNameInput + "</h3><span class='task-type'>" + taskTypeInput + "</span>";

  // listItemEl.appendChild(taskInfoEl);

  // //add entire list item to list
  // tasksToDoEl.appendChild(listItemEl);

//this code created a task item without type, b4 refactor
  // var listItemEl = document.createElement("li");
  // listItemEl.className = "task-item";
  // listItemEl.textContent = taskNameInput;;
  // tasksToDoEl.appendChild(listItemEl);

//new refactor data

//check if input values are empty strings
if (!taskNameInput || !taskTypeInput) {
  formEl.reset();
  alert("You need to fill out the task form!");
  return false;
}

  //package up data as an object
  var taskDataObj = {
    name: taskNameInput,
    type: taskTypeInput
  }

  //set it as an argument to createTaskEl
  createTaskEl(taskDataObj);
};

var createTaskEl = function (taskDataObj) {
    //create list item
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";

    //dd task id as a custom attribute
    listItemEl.setAttribute("data-task-id", taskIdCounter);
  
    //Create div to hold task info and add to list item
    var taskInfoEl = document.createElement("div");
  
    //give it a class name
    taskInfoEl.className = "task-info";
  
    //add html content to div
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
  
    listItemEl.appendChild(taskInfoEl);

    //creating a variable that is the product of creating a task with the correct ID
    var taskActionsEl = createTaskActions(taskIdCounter);
    
    //sticks this variable into list items before list items is stuck into another element
    listItemEl.appendChild(taskActionsEl);
  
    //add entire list item to list
    tasksToDoEl.appendChild(listItemEl);

    //increase task counter for next unique id
    taskIdCounter++;
}

//creating dynamic buttons to dynamically added elements
var createTaskActions = function(taskId) {
  var actionContainerEl = document.createElement("div");
  actionContainerEl.className = "task-actions";

  //dynamically create edit buttons
  var editButtonEl = document.createElement("button");
  editButtonEl.textContent = "Edit";
  editButtonEl.className = "btn edit-btn";
  editButtonEl.setAttribute("data-task-id", taskId);

  //stick this edit button insude action container element
  actionContainerEl.appendChild(editButtonEl);

  //dyanimically create delete button
  var deleteButtonEl = document.createElement("button");
  deleteButtonEl.textContent = "Delete";
  deleteButtonEl.className = "btn delete-btn";
  deleteButtonEl.setAttribute("data-task-id", taskId);

  //stick this button inside action container element
  actionContainerEl.appendChild(deleteButtonEl);

  //dyanmically create a dropdown menu to move the task from one column to another
  var statusSelectEl = document.createElement("select");
  statusSelectEl.className = "select-status";
  statusSelectEl.setAttribute("name", "status-change");
  statusSelectEl.setAttribute("data-task-id", taskId);

  //choices for the drop down to select the status of the task
  var statusChoices = ["To Do", "In Progress", "Compelted"];

  //for loop will help with DRY to ensure we can run the code efficiently? 
  //i think it sets the status of the task, which should trigger it to move?
  //as long as i < array length (2), keep running the loop to check against the iterator
  for (var i = 0; i < statusChoices.length; i++) {
    //create option element
    var statusOptionEl = document.createElement("option")
    statusOptionEl.textContent = statusChoices[i];
    //statusChoices[i] returns the value of the array at the given index 
    statusOptionEl.setAttribute("value", statusChoices[i]);

    //append to select
    statusSelectEl.appendChild(statusOptionEl);
  }


  //put this dropdown insude the dynamically created container div
  actionContainerEl.appendChild(statusSelectEl);

  return actionContainerEl;
}


//old event listener b/c its a form instead of a button
// buttonEl.addEventListener("click", createTaskHandler);
formEl.addEventListener("submit", taskFormHandler);
