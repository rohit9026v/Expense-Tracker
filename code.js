let pDateTime = document.querySelector("#pdate-time");
let inpTitle = document.querySelector("#inp-title");
let inpAmount = document.querySelector("#inp-amount");
let inpCategory = document.querySelector("#inp-category");
let addButton = document.querySelector("#add-btn");
let tAmount = document.querySelector(".tamount");
let tEntries = document.querySelector(".tentries");
let tMonth = document.querySelector(".tmonth");
let filCategory = document.querySelector("#fil-category");









        //Page date and time function

                function showtime(){
                        let now = new Date();
                        let date = now.toLocaleDateString()
                        let time = now.toLocaleTimeString()
                        pDateTime.innerText = `${date}, ${time}`;
                        return `${date} ${time}`        
                }
                showtime();
                setInterval(showtime,1000);
                




        //function on add button

let expArray = JSON.parse(localStorage.getItem('expense')) ||[];
addButton.addEventListener("click" , () => {
        let title = inpTitle.value;
        let expense = inpAmount.value;
        let category = inpCategory.value;
        let time = showtime();
        if(title === "" || expense === ""){
                alert("Please fill all feilds");
                return
        }

        if(expense<=0){
                alert("Invalid amount");
                return
        }
        expArray.push({
                category: category,
                title: title,
                expense: expense,
                time: time
        });
        localStorage.setItem("expense",JSON.stringify(expArray));
        totalExpdis()   
        inpAmount.value = "";
        inpTitle.value = "";
        disExpense();
        tEntries.innerText = expArray.length; 

});


                //category wise date display



                //total expense display
        function totalExpdis(){
        let totalExpense = JSON.parse(localStorage.getItem('expense')) || [];
        let exp = totalExpense.reduce((acc,current) => {
                return ((+acc) + (+current.expense))
        },0);
        tAmount.innerText = exp;
        };
        totalExpdis();

        //total entries display
        tEntries.innerText = expArray.length;  




        //category filter
        let category = document.querySelectorAll(".exp-dis")
        filCategory.addEventListener("change",() => {
                category.forEach((element) => {
                        element.classList.remove('hidden')
                        if(
                                filCategory.value !== "all-category"&&
                                !element.classList.contains(filCategory.value)){
                                element.classList.add('hidden');
                        }
                });
        });    


        //category wise expense display
        function disExpense(){
        let categoryExp = document.querySelectorAll(".exp");
        let data = JSON.parse(localStorage.getItem('expense')) || [];
        categoryExp.forEach((value) => {
                let id = value.getAttribute("id")
                let bal = {};
                bal[id] = 0;
                let disCatAmount = document.getElementById(id);
                data.forEach((element) => {
                        if(element.category == id){
                                //Amount Update
                                bal[id] += +(element.expense)
                                disCatAmount.innerText = `₹${bal[id]}`; 
                                
                                //Time Update
                        let categoryTime = disCatAmount.closest(".exp-dt").querySelector(".d-t");
                        categoryTime.innerText = element.time;
                        }
                       
                })
        })
        }

        disExpense();


        //category wise delete button
        
        let deleteBtn = document.querySelectorAll(".delete-btn");
        deleteBtn.forEach((element) => {
                 element.addEventListener("click", () => {

                        //date and amount removed from UI
                        let amount = element.parentElement.parentElement.querySelector(".exp.amount");
                        let id = amount.getAttribute("id");
                        let date = element.closest(".category-amount").querySelector(".d-t");
                        amount.innerText = "";
                        date.innerText = "";
                        //date and amount removed from localStorage
                        let array = JSON.parse(localStorage.getItem("expense"));
                        console.log(array);
                        let newArray = array.filter((object) => {
                               return (object.category !== id)
                        });
                        localStorage.setItem("expense",JSON.stringify(newArray));

                        // page reload
                        location.reload();

                 })
        })
       




       

                



        


