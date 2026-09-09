let headerDateTime = document.querySelector("#pdate-time");
let inpTitle = document.querySelector("#inp-title");
let inpAmount = document.querySelector("#inp-amount");
let inpCategory = document.querySelector("#inp-category");
let addButton = document.querySelector("#add-btn");
let tAmount = document.querySelector(".tamount");
let tEntries = document.querySelector(".tentries");
let tMonth = document.querySelector(".tmonth");
let categoryFilt = document.querySelector("#fil-category");
let disWrapper = document.querySelector(".dis-wrapper");

//date and time Updation

setInterval(() => {
  headerDateTime.innerText = new Date().toLocaleString();
}, 1000);

//Getting data from Local Storage...

function getExpense() {
  return JSON.parse(localStorage.getItem("expense")) || [];
}

//function on add button

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
  });

  localStorage.setItem("expense", JSON.stringify(expenseArr));
  totalExpdis();
  totalEntries();
  monthTExp();
  renderCategories();
  renderCategoryDis();
  inpAmount.value = "";
  inpTitle.value = "";
});

//category wise date display

//total expense display

function totalExpdis() {
  let exp = getExpense().reduce(
    (acc, current) => acc + Number(current.expense),
    0,
  );

  tAmount.innerText = exp;
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
    .reduce((acc, current) => acc + current.expense, 0);
  tMonth.innerText = filtered;
}
monthTExp();

//dynamic filter option

function renderCategories() {
  categoryFilt.innerHTML = "";

  const item = document.createElement("option");
  item.innerText = "All Category";
  item.value = "all-category";
  categoryFilt.appendChild(item);

  const list = getExpense().map((item) => {
    return item.category;
  });

  const categories = [...new Set([...list])].sort();

  for (let i = 0; i < categories.length; i++) {
    const item = document.createElement("option");
    item.innerText = categories[i];
    item.value = categories[i];
    categoryFilt.appendChild(item);
  }
}

renderCategories();

//applying filter

let category = document.querySelectorAll(".exp-dis");
categoryFilt.addEventListener("change", () => {
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

//dynamic category display

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

    const categoryAmtDiv = document.createElement("div"); //child 2
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

    const deleteDiv = document.createElement("div");
    deleteDiv.className = "delete";
    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-btn";
    deleteButton.type = "button";
    const buttonImg = document.createElement("img");
    buttonImg.className = "delete-img";
    buttonImg.src = "./assets/delete.png";
    deleteButton.appendChild(buttonImg);
    deleteDiv.appendChild(deleteButton);

    categoryAmtDiv.appendChild(deleteDiv); //sub-child 2 appended
    wrapperDiv.appendChild(categoryAmtDiv); // child 2 appended

    disWrapper.appendChild(wrapperDiv); //appended to a common wrapper
  });
}

renderCategoryDis();

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
    renderCategories();
    renderCategoryDis();
  }
});
