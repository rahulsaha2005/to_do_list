const addToList = document.querySelector("#push");
const taskInput = document.querySelector("#taskinput");

// Auto-expand textarea height
taskInput.addEventListener("input", () => {
  taskInput.style.height = "auto";
  taskInput.style.height = taskInput.scrollHeight + "px";
});

// Add task
function addTask() {
  const task = document.querySelector("#taskinput");
  if (task.value.trim().length === 0) {
    alert("Please Enter a Task");
  } else {
    const formattedTask = task.value.replace(/\n/g, "<br>");
    document.querySelector("#tasks").innerHTML += `
     <div class="task">
       <span class="taskname">${formattedTask}</span>
       <button class="delete"><img src='./delete.png' id="img"/></button>
     </div>
     `;
    task.value = "";
    task.style.height = "45px";
  }
}
addToList.addEventListener("click", addTask);

// Event delegation for delete and complete
let clickTimer = null;
const taskContainer = document.querySelector("#tasks");
taskContainer.addEventListener("click", (e) => {
  if (clickTimer) clearTimeout(clickTimer);
  if (e.target.closest(".editing")) return;
  if (e.target.closest(".delete")) {
    e.target.closest(".task").remove();
    return;
  }

  clickTimer = setTimeout(() => {
    if (e.target.closest(".task")) {
      e.target.closest(".task").classList.toggle("completed");
    }
    clickTimer = null;
  }, 500);
});

taskContainer.addEventListener("dblclick", (e) => {
  if (clickTimer) clearTimeout(clickTimer);
  clickTimer = null;
  if (e.target.closest(".editing")) return;

  const taskClick = e.target.closest(".task");
  if (
    e.target.closest(".delete") ||
    (taskClick && taskClick.classList.contains("completed"))
  )
    return;

  if (taskClick) {
    const span = taskClick.querySelector(".taskname");
    span.contentEditable = true;
    span.focus();
    span.classList.add("editing");

    span.addEventListener(
      "blur",
      () => {
        span.contentEditable = false;
        span.classList.remove("editing");
      },
      { once: true }
    );

    span.addEventListener(
      "keypress",
      (ev) => {
        if (ev.key === "Enter") {
          ev.preventDefault();
          span.contentEditable = false;
          span.blur();
          span.classList.remove("editing");
        }
      },
      { once: true }
    );
  }
});

let touchStartTime = 0;

taskContainer.addEventListener("touchstart", (e) => {
  const taskClick = e.target.closest(".task");
  if (!taskClick || taskClick.classList.contains("completed")) return;
  const span = taskClick.querySelector(".taskname");
  if (!span || span.classList.contains("editing")) return;
  touchStartTime = Date.now();
});

taskContainer.addEventListener("touchend", (e) => {
  const taskClick = e.target.closest(".task");
  if (!taskClick || taskClick.classList.contains("completed")) return;
  const span = taskClick.querySelector(".taskname");
  if (!span || span.classList.contains("editing")) return;

  const duration = Date.now() - touchStartTime;

  if (duration > 500) {
    // Trigger edit on long press (500ms)
    span.contentEditable = true;
    span.focus();
    span.classList.add("editing");

    span.addEventListener(
      "blur",
      () => {
        span.contentEditable = false;
        span.classList.remove("editing");
      },
      { once: true }
    );
  }
});
