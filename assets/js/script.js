//unique id creator
var taskIdCounter = 0

//Array for storing an array in strings to 
var tasks = [];

//to identify boxes to move tasks
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");

// var buttonEl = document.querySelector("#save-task"); 
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do"); 
//this variable os for the 'main' section to buble up the delete function to the whole item?
var pageContentEl = document.querySelector("#page-content");

var taskFormHandler = function(event) {

  event.preventDefault();
  var taskNameInput = document.querySelector("input[name='task-name']").value;
  var taskTypeInput = document.querySelector("select[name='task-type']").value;
  // console.dir(taskNameInput);

//check if input values are empty strings
  if (!taskNameInput || !taskTypeInput) {
    formEl.reset();
    alert("You need to fill out the task form!");
    return false;
  }

//tells us if we are editing something or not
  var isEdit = formEl.hasAttribute("data-task-id");

  // has data attribute, so get task id and call function to complete edit process
  if (isEdit) {
    var taskId = formEl.getAttribute("data-task-id");
    completeEditTask(taskNameInput, taskTypeInput, taskId);
  } 
  // no data attribute, so create object as normal and pass to createTaskEl function
  else {
    var taskDataObj = {
      name: taskNameInput,
      type: taskTypeInput,
      status: "to do"
    };

    createTaskEl(taskDataObj);
  }
};

var createTaskEl = function (taskDataObj) {
  var listItemEl = document.createElement("li");
  listItemEl.className = "task-item";
  listItemEl.setAttribute("data-task-id", taskIdCounter);

  var taskInfoEl = document.createElement("div");
  taskInfoEl.className = "task-info";
  taskInfoEl.innerHTML =
    "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
  listItemEl.appendChild(taskInfoEl);

  var taskActionsEl = createTaskActions(taskIdCounter);
  listItemEl.appendChild(taskActionsEl);

  switch (taskDataObj.status) {
    case "to do":
      taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 0;
      tasksToDoEl.append(listItemEl);
      break;
    case "in progress":
      taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 1;
      tasksInProgressEl.append(listItemEl);
      break;
    case "completed":
      taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 2;
      tasksCompletedEl.append(listItemEl);
      break;
    default:
      console.log("Something went wrong!");
  }

  // save task as an object with name, type, status, and id properties then push it into tasks array
  taskDataObj.id = taskIdCounter;

  tasks.push(taskDataObj);

  // save tasks to localStorage
  saveTasks();

  // increase task counter for next unique task id
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
  var statusChoices = ["To Do", "In Progress", "Completed"];

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


var completeEditTask = function(taskName, taskType, taskId) {
  // find the matching task list item
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

  // set new values
  taskSelected.querySelector("h3.task-name").textContent = taskName;
  taskSelected.querySelector("span.task-type").textContent = taskType;

    // loop through tasks array and task object with new content
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === parseInt(taskId)) {
      tasks[i].name = taskName;
      tasks[i].type = taskType;
    }
    //saves to local
    saveTasks()
  };

  alert("Task Updated!");

  //reset form
  formEl.removeAttribute("data-task-id");
  document.querySelector("#save-task").textContent = "Add Task";
  saveTasks();
};

//old event listener b/c its a form instead of a button
// buttonEl.addEventListener("click", createTaskHandler);


//buttonhandler is listening to be called by an event. then it will call the block of code
var taskButtonHandler = function(event) {

  //get target element from event
  var targetEl = event.target;

  //if taget element was edit, taskId will equal the data attribute, task ID and run editTask
  if (targetEl.matches(".edit-btn")) {
    var taskId = targetEl.getAttribute("data-task-id");
    editTask(taskId);
  }
  //if the button selected is the delete button, grab the element's taskID and run deleteTask
  else if (targetEl.matches(".delete-btn")) {
    var taskId = event.target.getAttribute ("data-task-id");
    deleteTask(taskId);
  }
};

//function to change subjects
var taskStatusChangeHandler = function(event) {
  // get the task item's id
  var taskId = event.target.getAttribute("data-task-id");

  // get the currently selected option's value and convert to lowercase
  var statusValue = event.target.value.toLowerCase();

  // find the parent task item element based on the id
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

  if (statusValue === "to do") {
    tasksToDoEl.appendChild(taskSelected);
  } 
  else if (statusValue === "in progress") {
    tasksInProgressEl.appendChild(taskSelected);
  } 
  else if (statusValue === "completed") {
    tasksCompletedEl.appendChild(taskSelected);
  }

  // update task's in tasks array
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === parseInt(taskId)) {
      tasks[i].status = statusValue;
    }
  }



  //saves to local
  saveTasks()
};


var editTask = function(taskId) {
  console.log("Editing task #" + taskId);

  //get task list item element
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

  //assign this variable to the content in the task selected
  var taskName = taskSelected.querySelector("h3.task-name").textContent;
  var taskType = taskSelected.querySelector("span.task-type").textContent;

  //selecting the input of the task-name ID from HTML to become the taskName, which prints from above code
  document.querySelector("input[name='task-name']").value = taskName;
  document.querySelector("select[name='task-type']").value = taskType;

  //?? not used yet
  document.querySelector("#save-task").textContent = "Save Task";

  //when edit task is clicked, we know which task id is selected
  formEl.setAttribute("data-task-id", taskId);
};

//functino deleteTask narrrows the search by looking for a .task-item that has 
//data-task-id equal to the argument we've passed through the function
//Also notice that there's no space between the .task-item and 
//the [data-task-id] attribute, which means that both properties must be on 
//the same element; a space would look for a element with the [data-task-id] 
//attribute somewhere inside a .task-item element.
var deleteTask = function(taskId) {
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
  taskSelected.remove();
  //saves to local 

    // create new array to hold updated list of tasks
  var updatedTaskArr = [];

  // loop through current tasks
  for (var i = 0; i < tasks.length; i++) {
    // if tasks[i].id doesn't match the value of taskId, let's keep that task and push it into the new array
    if (tasks[i].id !== parseInt(taskId)) {
      updatedTaskArr.push(tasks[i]);
    }
  }

  // reassign tasks array to be the same as updatedTaskArr
  tasks = updatedTaskArr;
  saveTasks()
}

//saves locally
var saveTasks = function() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

var loadTasks = function () {
  //   Gets task items from localStorage. get item
  // Converts tasks from the string format back into an array of objects. json
  // tasks = JSON.parse( localStorage.getItem("tasks"))
  var savedTasks = localStorage.getItem("tasks");
  
  //if there isnt anything in local storage, reassign to empty array
  if (tasks === null){
  tasks = []
  return false;
  }

  console.log(tasks);
  // Iterates through a tasks array and creates task elements on the page from it. loop

  // parse into array of objects
  savedTasks = JSON.parse(savedTasks);

  for (var i = 0; i < savedTasks.length; i++) { 
    // createTaskEl (i);
    console.log(tasks[i]);

  //   listItemEl = document.createElement("li");
  //   listItemEl.className = "task-item";
  //   listItemEl.setAttribute("data-task-id", tasks[i].id);
  //   console.log(listItemEl);

  //   taskInfoEl = document.createElement("div");
  //   taskInfoEl.className = "task-info";
    
  //   //add html content to div
  //   taskInfoEl.innerHTML = "<h3 class='task-name'>" + tasks[i].name + "</h3><span class='task-type'>" + tasks[i].type + "</span>";
    
  //   listItemEl.appendChild(taskInfoEl);

  //   taskActionsEl = createTaskActions(tasks[i].id);

  //   listItemEl.appendChild(taskActionsEl);

  //   console.log(listItemEl,"log");
    createTaskEl(savedTasks[i]);
  }
}

//   if (tasks[i].status === "to do") {
//     listItemEl.querySelector("select[name='status-change']").selctedIndex = 0;
//     tasksToDoEl.appendChild(listItemEl)
//   }

//   else if (tasks[i].status = tasksInProgressEl) {
//     listItemEl.querySelector("select[name='status-change']").selectedIndex = 1;
//     tasksInProgressEl.appendChild(listItemEl)
//   }
//   else if (tasks[i].status = tasksCompletedEl) {
//     listItemEl.querySelector("select[name='status-change']").selectedIndex = 2;
//     tasksCompletedEl.appendChild(listItemEl)
//   }
//   taskIdCounter = taskIdCounter + 1;
//   console.log(listItemEl);
// }

formEl.addEventListener("submit", taskFormHandler);

//when pagecontentEl is clicked, run taskbuttonhandler
pageContentEl.addEventListener("click", taskButtonHandler);

//when taskstatus on the page is changed, trigger event
pageContentEl.addEventListener("change", taskStatusChangeHandler);

loadTasks();