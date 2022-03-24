const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");
const todoListContainer = document.querySelector(".todo-list-container");

//add todo
todoButton.addEventListener("click", addTodo);

function addTodo(e) {
  e.preventDefault();
  todoInput.classList.toggle("alert");
  todoInput.placeholder = "To do";
  if (todoInput.value == "") {
    todoInput.classList.add("alert");
    todoInput.placeholder = "Please write something";
    return;
  }
  const newlist = `<li>${todoInput.value}<span class="close">×</span></li>`;
  //   addCloseBtn(newlist);
  todoList.insertAdjacentHTML("afterbegin", newlist);
  todoInput.value = "";
  todoInput.classList.remove("alert");
}

//add close button
let myNodelist = document.querySelectorAll("LI");
function addCloseBtn(e) {
  const span = document.createElement("SPAN");
  const txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  e.appendChild(span);
}

myNodelist.forEach((element) => {
  addCloseBtn(element);
});

//add checked when click on
todoList.addEventListener("click", addChecked);
function addChecked(e) {
  e.target.classList.toggle("checked");
}

// let closeBtn = document.querySelectorAll(".close");
// console.log(closeBtn);
// closeBtn.forEach((element) => element.addEventListener("click", close));
// function close(e) {
//   const closeLi = e.target.parentElement;
//   closeLi.style.display = "none";
// }

//close the list
document.addEventListener("click", function close(e) {
  if (e.target.classList.contains("close"))
    e.target.parentElement.style.display = "none";
});
