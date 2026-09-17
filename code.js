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

//date and time Updation

setInterval(() => {
  headerDateTime.innerText = new Date().toLocaleString();
}, 1000);

//Getting data from Local Storage...

function getExpense() {
  return JSON.parse(localStorage.getItem("expense")) || [];
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
  localStorage.setItem("isDark", JSON.stringify(dark));
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
  let title = inpTitle.value.trim();
  let expense = Number(inpAmount.value);
  let category = inpCategory.value;
  let time = new Date().toLocaleString();

  if (title === "") {
    alert("Please fill all fields");
    return;
  }

  if (!Number.isFinite(expense) || expense <= 0) {
    alert("Invalid amount");
    return;
  }

  const expenseArr = getExpense();

  expenseArr.push({
    category,
    title,
    expense,
    time,
    id: Date.now(),
  });

  localStorage.setItem("expense", JSON.stringify(expenseArr));
  totalExpdis();
  totalEntries();
  monthTExp();
  renderCategories(categoryFilt, true);
  renderCategoryDis();
  renderTotChart("bar"); //Total expense chart Updated
  renderCatChart("clothing"); //Category chart Updated
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
  let exp = getExpense().reduce(
    (acc, current) => acc + Number(current.expense),
    0,
  );

  tAmount.innerText = `₹ ${exp}`;
}
totalExpdis();

//total entries display

function totalEntries() {
  tEntries.innerText = getExpense().length;
}
totalEntries();

//this month total entries

function monthTExp() {
  let today = new Date();
  const filtered = getExpense()
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
  const expArr = getExpense().reduce((acc, current) => {
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
  const expArr = getExpense().filter((item) => item.category === category);
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

  const list = getExpense().map((item) => item.category);
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

//category card total amount function
function calculateCatTotal(){

}


//dynamic category Card display

function renderCategoryDis() {
  disWrapper.innerHTML = "";
  const list = getExpense().map((item) => {
    return item.category;
  });

  const categories = [...new Set([...list])].sort();
  categories.forEach((item) => {
    let time;
    const finalAmt = getExpense().reduce((acc, current) => {
      if (current.category == item) {
        acc += Number(current.expense);
        time = current.time;
      }
      return acc;
    }, 0);

    const wrapperDiv = document.createElement("div");
    wrapperDiv.className = `exp-dis ${item}`; //yha ek aur class add krni hai category ki  Done

    const categoryDiv = document.createElement("div"); //child 1
    categoryDiv.className = "category";
    const icon = document.createElement("img"); // image tag created
    icon.className = "category-icon";
    icon.alt = "category-icon";
    icon.src = `./assets/${item}.png`; //dynamic images
    categoryDiv.appendChild(icon); //sub-child 1
    const para = document.createElement("p"); //p tag created
    para.innerText = item.toUpperCase(); //dynamic name
    categoryDiv.appendChild(para); //sub-child 2 appended
    wrapperDiv.appendChild(categoryDiv); //child 1 appended

    const expenseLi = document.createElement("div"); //child 2
    expenseLi.className = "listdiv";
    const list = document.createElement("select");
    list.className = "list";

    const count = getExpense();
    //static option
    const listItem = document.createElement("option");
    listItem.innerText = "Category Expenses";
    listItem.id = "all-categories ";
    list.appendChild(listItem);

    //dynamic list option
    for (let i = 0; i < count.length; i++) {
      if (count[i].category == item) {
        const listItem = document.createElement("option");
        listItem.innerText = count[i].title;
        listItem.id = count[i].id;
        list.appendChild(listItem);
      }
    }
    expenseLi.appendChild(list);
    wrapperDiv.appendChild(expenseLi);

    const categoryAmtDiv = document.createElement("div"); //child 3
    categoryAmtDiv.className = "category-amount";

    const expenseDetails = document.createElement("div"); //sub-child 1
    expenseDetails.className = "exp-dt";
    const amtPara = document.createElement("p");
    amtPara.className = "exp amount";
    amtPara.innerText = `₹ ${finalAmt}`;
    amtPara.id = item; //dynamic id
    expenseDetails.appendChild(amtPara);
    const span = document.createElement("span");
    span.className = "d-t";
    span.id = `${item}-time`;
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

    disWrapper.appendChild(wrapperDiv); //appended to a common wrapper
  });
}

renderCategoryDis();

//event on list in individual expense

disWrapper.addEventListener("change", (e) => {
  const list = e.target.closest(".list");
  if (!list) {
    return;
  }

  const exp = getExpense().find(
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

  let currentCard = editbtn.closest(".exp-dis");

  const expItem = currentCard.querySelector(".list");

  const item = getExpense().find(
    (item) => item.id == expItem.selectedOptions[0].id,
  );
  editId = item.id;
  const card = renderEdit(item.title, item.expense);

  if (card) {
    currentCard.after(card);
  }
});

//Render edit card

function renderEdit(title, amount) {
  const isExisted = document.querySelector(".edit-wrapper");
  if (isExisted) {
    alert("Kindly save existing edit");
    return;
  }

  const wrapper = document.createElement("div"); //parent
  wrapper.className = "edit-wrapper";

  const editdiv = document.createElement("div"); //child 1
  editdiv.className = "edit-amt-name";

  const editTitleDiv = document.createElement("div"); //sub child 1
  editTitleDiv.className = "edit-title-group";
  const spanT = document.createElement("span");
  spanT.className = "edit-label";
  spanT.innerText = "Edit Title";
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
  spanA.innerText = "Edit Amount";
  const editAmt = document.createElement("input");
  editAmt.className = "edit-inp";
  editAmt.id = "edit-amount";
  editAmt.type = "number";
  editAmt.value = amount;
  editAmtDiv.appendChild(spanA);
  editAmtDiv.appendChild(editAmt);
  editdiv.appendChild(editAmtDiv);

  wrapper.appendChild(editdiv);

  const cnfDiv = document.createElement("div"); //child 2
  cnfDiv.className = "confirm-edit";
  const cnfBtn = document.createElement("button"); //sub child 1
  cnfBtn.className = "edit-btn";
  cnfBtn.type = "button";
  cnfBtn.id = "save-btn";
  cnfBtn.addEventListener("click", () => {
    saveEdit(editTitle, editAmt);
  });
  const img = document.createElement("img");
  img.className = "edit-save-icon";
  img.src = "./assets/save.png";
  img.alt = "save Butoon";
  cnfBtn.appendChild(img);
  cnfDiv.appendChild(cnfBtn);

  wrapper.appendChild(cnfDiv);

  return wrapper;
}

//function on save button

function saveEdit(editTitle, editAmt) {
  if (
    editTitle.value.trim() === "" ||
    !Number.isFinite(Number(editAmt.value)) ||
    Number(editAmt.value) <= 0
  ) {
    return;
  }

  if (editId === null) {
    return;
  }

  const confirmation = confirm("Do you want to save changes");
  if (confirmation) {
    const updatedList = getExpense();
    updatedList.forEach((element) => {
      if (element.id == editId) {
        element.title = editTitle.value;
        element.expense = Number(editAmt.value);
      }
    });
    localStorage.setItem("expense", JSON.stringify(updatedList)); //item updated
    editAmt.value = "";
    editTitle.value = "";
    editId = null;
    totalExpdis();
    monthTExp();
    renderCategoryDis();
    renderTotChart("bar"); //Total expense chart rendered
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
    let updatedArr = getExpense().filter((item) => item.category !== id);
    localStorage.setItem("expense", JSON.stringify(updatedArr));

    //Update amount displayed

    totalExpdis();
    totalEntries();
    monthTExp();
    renderCategories(categoryFilt, true);
    renderCategoryDis();
    renderTotChart("bar");
  }
});
