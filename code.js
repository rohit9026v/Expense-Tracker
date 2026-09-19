import drawChart from "./chart.js";
const headerDateTime = document.querySelector("#pdate-time");
const inpTitle = document.querySelector("#inp-title");
const inpAmount = document.querySelector("#inp-amount");
const inpCategory = document.querySelector("#inp-category");
const addButton = document.querySelector("#add-btn");
const tAmount = document.querySelector(".tamount");
const tEntries = document.querySelector(".tentries");
const tMonth = document.querySelector(".tmonth");
const categoryFilt = document.querySelector("#fil-category");
const disWrapper = document.querySelector(".dis-wrapper");
const inpPaymentType = document.querySelector("#inp-type");
const inpComment = document.querySelector("#inp-comment");

//date and time Updation

setInterval(() => {
  headerDateTime.innerText = new Date().toLocaleString();
}, 1000);

//Getting data from Local Storage...
function getExpense() {
  return JSON.parse(localStorage.getItem("expense")) || [];
}
let expenseArr = getExpense();
//Setting data to Local STorage...

function setLocal(name, arr) {
  return localStorage.setItem(name, JSON.stringify(arr));
}

//Fn for updating UI

function updateUI() {
  totalExpdis();
  totalEntries();
  monthTExp();
  renderCategories(categoryFilt, true);
  renderCatCard();
  renderTotChart("bar"); //Total expense chart Updated
  renderCatChart("clothing"); //Category chart Updated
}

//dark mode

const darkBtn = document.querySelector("#dark-btn");

function getDark() {
  return JSON.parse(localStorage.getItem("isDark")) ?? null;
}

if (getDark()) {
  document.body.classList.add("dark-mode");
} else {
  document.body.classList.remove("dark-mode");
}

function setDark(dark) {
  setLocal("isDark", dark);
}

function toggleTheme() {
  document.body.classList.toggle("dark-mode");
  let dark = !getDark();
  setDark(dark);
}

darkBtn.addEventListener("click", toggleTheme);

//profile sec

//function on print button
const printBtn = document.querySelector("#printbtn");

printBtn.addEventListener("click", () => {
  window.print();
});

//function on upload input

//function on add button

const addSec = document.querySelector("#add-sec");

addButton.addEventListener("click", () => {
  const title = inpTitle.value.trim();
  const expense = Number(inpAmount.value);
  const category = inpCategory.value;
  const time = new Date().toLocaleString();
  const comment = inpComment.value;
  const paymentType = inpPaymentType.value;

  if (title === "") {
    alert("Please fill all fields");
    return;
  }

  if (!Number.isFinite(expense) || expense <= 0) {
    alert("Invalid amount");
    return;
  }

  expenseArr.push({
    id: Date.now(),
    category,
    title,
    expense,
    paymentType,
    time,
    comment,
  });

  setLocal("expense", expenseArr);
  updateUI();
  floatingBtn.classList.remove("hidden"); //floating button visible
  addSec.classList.add("hidden"); //add sec hide
  inpAmount.value = ""; //amount feild set to empty
  inpTitle.value = ""; //title feild set to empty
});

//floating add button

const floatingBtn = document.querySelector("#flot-btn");

floatingBtn.addEventListener("click", () => {
  floatingBtn.classList.add("hidden");
  addSec.classList.remove("hidden");
});

//total expense display

function totalExpdis() {
  let exp = expenseArr.reduce(
    (acc, current) => acc + Number(current.expense),
    0,
  );

  tAmount.innerText = `₹ ${exp}`;
}
totalExpdis();

//total entries display

function totalEntries() {
  tEntries.innerText = expenseArr.length;
}
totalEntries();

//this month total entries

function monthTExp() {
  let today = new Date();
  const filtered = expenseArr
    .filter((item) => {
      let expDate = new Date(item.time);
      return (
        today.getMonth() == expDate.getMonth() &&
        today.getFullYear() == expDate.getFullYear()
      );
    })
    .reduce((acc, current) => acc + Number(current.expense), 0);
  tMonth.innerText = `₹ ${filtered}`;
}
monthTExp();

//chart type&category selection

const chartWrapper = document.querySelector(".chartwrapper");
chartWrapper.addEventListener("change", (e) => {
  const total = e.target.closest("#total-select");
  const category = e.target.closest("#category-select");

  if (!category && !total) return;

  if (total) {
    renderTotChart(e.target.value);
  } else if (category) {
    renderCatChart(e.target.value);
  }
});

//dynamic Total chart fuction

const totalCanvas = document.querySelector("#total-canvas");
function renderTotChart(type) {
  const expArr = expenseArr.reduce((acc, current) => {
    const isExisted = acc.find((item) => item.title === current.category);
    if (isExisted) {
      isExisted.expense += current.expense;
    } else {
      const obj = {
        title: current.category,
        expense: current.expense,
      };
      acc.push(obj);
    }
    return acc;
  }, []);
  drawChart(totalCanvas, type, expArr);
}

renderTotChart("bar");

//dynamic category charts options

const categoryChart = document.querySelector("#category-select");
renderCategories(categoryChart);

//dynamic category chart functinn

const categoryCanvas = document.querySelector("#category-canvas");
function renderCatChart(category) {
  const expArr = expenseArr.filter((item) => item.category === category);
  drawChart(categoryCanvas, "doughnut", expArr);
}

renderCatChart("clothing");

//dynamic Select option

function renderCategories(appendTo, includeAll = false) {
  if (includeAll) {
    appendTo.innerHTML = ` <option value="all-category">All CATEGORIES</option>`;
  } else {
    appendTo.innerHTML = "";
  }

  const list = expenseArr.map((item) => item.category);
  const categories = [...new Set(list)].sort();

  for (let i = 0; i < categories.length; i++) {
    const item = document.createElement("option");

    item.innerText = categories[i].toUpperCase();
    item.value = categories[i];

    appendTo.appendChild(item);
  }
}

renderCategories(categoryFilt, true);

//applying filter

let category = document.querySelectorAll(".exp-dis");
categoryFilt.addEventListener("change", () => {
  let category = document.querySelectorAll(".exp-dis");
  category.forEach((element) => {
    element.classList.remove("hidden");
    if (
      categoryFilt.value !== "all-category" &&
      !element.classList.contains(categoryFilt.value)
    ) {
      element.classList.add("hidden");
    }
  });
});

//Create Category card

function createCategoryCard(category, amt, time) {
  const wrapperDiv = document.createElement("div");
  wrapperDiv.className = `exp-dis ${category}`; //yha ek aur class add krni hai category ki  Done

  const categoryDiv = document.createElement("div"); //child 1
  categoryDiv.className = "category";
  const icon = document.createElement("img"); // image tag created
  icon.className = "category-icon";
  icon.alt = "category-icon";
  icon.src = `./assets/${category}.png`; //dynamic images src yet to be added
  categoryDiv.appendChild(icon); //sub-child 1
  const para = document.createElement("p"); //p tag created
  para.innerText = category.toUpperCase(); //dynamic name
  categoryDiv.appendChild(para); //sub-child 2 appended
  wrapperDiv.appendChild(categoryDiv); //child 1 appended

  const expenseLi = document.createElement("div"); //child 2
  expenseLi.className = "listdiv";
  const list = document.createElement("select");
  list.className = "list";
  renderOptCategory(list, category);
  expenseLi.appendChild(list);
  wrapperDiv.appendChild(expenseLi);

  const categoryAmtDiv = document.createElement("div"); //child 3
  categoryAmtDiv.className = "category-amount";

  const expenseDetails = document.createElement("div"); //sub-child 1
  expenseDetails.className = "exp-dt";
  const amtPara = document.createElement("p");
  amtPara.className = "exp amount";
  amtPara.innerText = `₹ ${amt}`; //category final amt is yet to be added
  amtPara.id = category; //dynamic id
  expenseDetails.appendChild(amtPara);
  const span = document.createElement("span");
  span.className = "d-t";
  span.id = `${category}-time`; //time is yet to be aded
  span.innerText = time;
  expenseDetails.appendChild(span);
  categoryAmtDiv.appendChild(expenseDetails); // sub child 1 appended

  const edit = document.createElement("button"); //sub child 2 created
  edit.className = "editExp";
  edit.id = edit;
  const img = document.createElement("img");
  img.src = "./assets/edit.png";
  edit.appendChild(img);
  categoryAmtDiv.appendChild(edit); //sub child 2 appended

  const deleteDiv = document.createElement("div"); //sub child 3 created
  deleteDiv.className = "delete";
  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-btn";
  deleteButton.type = "button";
  const buttonImg = document.createElement("img");
  buttonImg.className = "delete-img";
  buttonImg.src = "./assets/delete.png";
  deleteButton.appendChild(buttonImg);
  deleteDiv.appendChild(deleteButton);

  categoryAmtDiv.appendChild(deleteDiv); //sub-child 3 appended
  wrapperDiv.appendChild(categoryAmtDiv); // child 2 appended

  return wrapperDiv;
}

//dynamic options for select in category card

function renderOptCategory(appendto, category) {
  const count = expenseArr;

  //static option
  const option = document.createElement("option");
  option.innerText = "Category Expenses";
  option.id = "all-categories";
  appendto.appendChild(option);

  //dynamic list option
  for (let i = 0; i < count.length; i++) {
    if (count[i].category == category) {
      const option = document.createElement("option");
      option.innerText = count[i].title;
      option.id = count[i].id;
      appendto.appendChild(option);
    }
  }
}

//dynamic category Card display

function renderCatCard() {
  disWrapper.innerHTML = "";
  const categories = [
    ...new Set(expenseArr.map((item) => item.category)),
  ].sort();
  categories.forEach((item) => {
    let time;
    const finalAmt = expenseArr.reduce((acc, current) => {
      if (current.category == item) {
        acc += Number(current.expense);
        time = current.time;
      }
      return acc;
    }, 0);
    const card = createCategoryCard(item, finalAmt, time);
    disWrapper.appendChild(card);
  });
}

renderCatCard();

//event on list in individual expense

disWrapper.addEventListener("change", (e) => {
  const list = e.target.closest(".list");
  if (!list) {
    return;
  }

  const exp = expenseArr.find(
    (item) => item.id == e.target.selectedOptions[0].id,
  );
  const amt = disWrapper.querySelector(`#${exp.category}`);
  const time = disWrapper.querySelector(`#${exp.category}-time`);
  amt.innerText = `₹ ${exp.expense}`;
  time.innerText = exp.time;
});

//event on edit button

let editId = null;
disWrapper.addEventListener("click", (e) => {
  const editbtn = e.target.closest(".editExp");
  if (!editbtn) {
    return;
  }

  const isExisted = document.querySelector(".edit-wrapper");
  if (isExisted) {
    alert("Kindly save existing edit");
    return;
  }

  let currentCard = editbtn.closest(".exp-dis");

  const expItem = currentCard.querySelector(".list");
  if (expItem.selectedOptions[0].id === "all-categories") {
    alert("You can't update entire category. Kindly select an expense.");
    return;
  }

  const item = expenseArr.find(
    (item) => item.id == expItem.selectedOptions[0].id,
  );
  editId = item.id;
  const card = createEditCard(item.title, item.expense);

  if (card) {
    currentCard.after(card);
  }
});

//Create edit card

function createEditCard(title, amount) {
  const editWrapper = document.createElement("div"); //parent
  editWrapper.className = "edit-wrapper";

  const editdiv = document.createElement("div"); //child 1
  editdiv.className = "edit-amt-name";

  const editTitleDiv = document.createElement("div"); //sub child 1
  editTitleDiv.className = "edit-title-group";
  const spanT = document.createElement("span");
  spanT.className = "edit-label";
  spanT.innerText = "Edit Title:";
  const editTitle = document.createElement("input");
  editTitle.className = "edit-inp";
  editTitle.id = "edit-title";
  editTitle.type = "text";
  editTitle.value = title;
  editTitleDiv.appendChild(spanT);
  editTitleDiv.appendChild(editTitle);
  editdiv.appendChild(editTitleDiv);

  const editAmtDiv = document.createElement("div"); //sub child 2
  editAmtDiv.className = "edit-amount-group";
  const spanA = document.createElement("span");
  spanA.innerText = "Edit Amount:";
  const editAmt = document.createElement("input");
  editAmt.className = "edit-inp";
  editAmt.id = "edit-amount";
  editAmt.type = "number";
  editAmt.value = amount;
  editAmtDiv.appendChild(spanA);
  editAmtDiv.appendChild(editAmt);
  editdiv.appendChild(editAmtDiv);

  editWrapper.appendChild(editdiv);

  const optionsDiv = document.createElement("div"); //child 2
  optionsDiv.className = "edit-options";

  const saveBtn = document.createElement("button"); //sub child 1
  saveBtn.className = "saveedit-btn";
  saveBtn.type = "button";
  saveBtn.id = "save-btn";
  editCardEvent(saveBtn, editTitle, editAmt);

  const SaveImg = document.createElement("img");
  SaveImg.className = "edit-icons";
  SaveImg.src = "./assets/save.png";
  SaveImg.alt = "save Butoon";
  saveBtn.appendChild(SaveImg);
  optionsDiv.appendChild(saveBtn);

  const cancelBtn = document.createElement("button");
  cancelBtn.id = "cancelEdit";
  cancelBtn.className = "canceledit-btn";
  cancelBtn.type = "button";

  const cancelImg = document.createElement("img");
  cancelImg.className = "edit-icons";
  cancelImg.src = "./assets/cancel.png";
  cancelImg.alt = "save Butoon";
  cancelBtn.appendChild(cancelImg);
  optionsDiv.appendChild(cancelBtn);

  const delBtn = document.createElement("button");
  delBtn.id = "delEdit";
  delBtn.className = "deledit-btn";
  delBtn.type = "button";

  const delImg = document.createElement("img");
  delImg.className = "edit-icons";
  delImg.src = "./assets/delete.png";
  delImg.alt = "delete icon";
  delBtn.appendChild(delImg);
  optionsDiv.appendChild(delBtn);

  editWrapper.appendChild(optionsDiv);

  return editWrapper;
}

//Event on save button
function editCardEvent(saveBtn, editTitle, editAmt) {
  saveBtn.addEventListener("click", () => {
    const latestTitle = editTitle.value;
    const latestAmount = Number(editAmt.value);
    saveEdit(latestTitle, latestAmount);
  });
}

//function on save button

function saveEdit(title, amount) {
  if (editId === null) {
    return;
  }

  if (title.trim() === "" || !Number.isFinite(amount) || amount <= 0) {
    return;
  }

  const confirmation = confirm("Do you want to save changes");

  if (confirmation) {
    expenseArr.forEach((element) => {
      if (element.id === editId) {
        element.title = title;
        element.expense = amount;
      }
    });

    setLocal("expense", expenseArr);
    editId = null;
    updateUI();
  }
}

//category wise delete button

disWrapper.addEventListener("click", (e) => {
  //click validation

  const btn = e.target.closest(".delete-btn");
  if (!btn) {
    return;
  }

  if (confirm("Are you sure you want to delete this entire expense")) {
    let amount = e.target.closest(".category-amount").querySelector(".exp");
    let id = amount.getAttribute("id");
    expenseArr = expenseArr.filter((item) => item.category !== id);

    //Update amount displayed
    setLocal("expense", expenseArr);
    updateUI();
  }
});
