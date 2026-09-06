let headerDateTime = document.querySelector("#pdate-time");
let inpTitle = document.querySelector("#inp-title");
let inpAmount = document.querySelector("#inp-amount");
let inpCategory = document.querySelector("#inp-category");
let addButton = document.querySelector("#add-btn");
let tAmount = document.querySelector(".tamount");
let tEntries = document.querySelector(".tentries");
let tMonth = document.querySelector(".tmonth");
let filCategory = document.querySelector("#fil-category");
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
  disExpense();
  totalEntries();
  monthTExp();
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

//category filter

let category = document.querySelectorAll(".exp-dis");
filCategory.addEventListener("change", () => {
  category.forEach((element) => {
    element.classList.remove("hidden");
    if (
      filCategory.value !== "all-category" &&
      !element.classList.contains(filCategory.value)
    ) {
      element.classList.add("hidden");
    }
  });
});

//category wise expense display

function disExpense() {
  let categoryExp = document.querySelectorAll(".exp");
  let expenseArr = getExpense();
  categoryExp.forEach((item) => {
    let id = item.getAttribute("id");
    let disCategoryAmt = document.querySelector(`#${id}`);
    let categoryTime = disCategoryAmt.closest(".exp-dt").querySelector(".d-t");
    let bal = 0;
    let found = false;

    expenseArr.forEach((element) => {
      if (element.category == id) {
        found = true;

        //Amount Update
        bal += Number(element.expense);
        disCategoryAmt.innerText = `₹ ${bal}`;

        //Time Update
        categoryTime.innerText = element.time;
      }
    });
    if (!found) {
      disCategoryAmt.innerText = "";
      categoryTime.innerText = "";
    }
  });
}

disExpense();

//category wise delete button

disWrapper.addEventListener("click", (e) => {
  //click validation

  const btn = e.target.closest(".delete-btn");
  if (!btn) {
    return;
  }

  if (confirm("Are you sure you want to delete this expense")) {
    let amount = e.target.closest(".category-amount").querySelector(".exp");
    let id = amount.getAttribute("id");
    let updatedArr = getExpense().filter((item) => item.category !== id);
    localStorage.setItem("expense", JSON.stringify(updatedArr));

    //Update amount displayed

    totalExpdis();
    disExpense();
    totalEntries();
    monthTExp();
  }
});
