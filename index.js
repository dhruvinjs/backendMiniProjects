const { Command } = require('commander');
const program = new Command();   
const Table = require('cli-table');
const fs = require('fs');

const filePath='userRecords.json'
const {parse}=require('json2csv')
let id=1
const today=new Date()

let budget=[]
let userRec=[]

if(fs.existsSync(filePath)){
    userRec=JSON.parse(fs.readFileSync(filePath, "utf8"))
}
function saveData(updatedData){
 

        userRec=JSON.parse(fs.readFileSync(filePath,"utf8"))
        userRec.push(updatedData)

        fs.writeFileSync(filePath, JSON.stringify(userRec, null, 2));
  
    // fs.writeFileSync(filePath,JSON.stringify(userRec,null,2))//
    // Null will basically convert the object onto string values
    // 2 means providing the space
}

function saveBudget(updatedData){
    
        budget.push(updatedData)
        fs.writeFileSync(filePath, JSON.stringify(budget, null, 2));
 

    // fs.writeFileSync(filePath,JSON.stringify(budget,null,2))
    //will create a simple object for budget for each month
}


function deleteData(idToRemove){
   //id will be converted to string and and userRec will contain id  not equal to idToRemove 
    userRec=userRec.filter(ele=>ele.id.toString() !== idToRemove.toString())
    fs.writeFileSync(filePath,JSON.stringify(userRec,null,2))
}

// decreaseBudget(10,100)
program.command("add")
.description('This command will add expense and take desciption')
.option('-d --desc <type>','Expense description')
.option('-a --amt <number>',"Amount")
.option('-c --category <type>',"Basic category")
.action((options)=>{
    if(isNaN(options.amt)){throw new Error("Error: The 'amt' option be a valid number.")}
    
    
    const newExpense={
    desc:options.desc,
    amt:options.amt,
    id:id,
    month:today.getMonth(),
    timing:today.getHours()+' '+today.getMinutes(),
    category:options.category
}
    // Add the new user record to the array
    // userRec.push(newExpense);
    
    id++;
    saveData(newExpense)
    decreaseBudget(today.getMonth(),options.amt)
    console.log("Expense added successfully Id: " + (id))
})



program.command('list expenses')
.description("Will list all the expension")
.option('-a --amt <number>','will only list the Amt')
.action((options)=>{
    const table = new Table({  head: ['ID', 'Description', 'Amt'], });
    userRec.forEach(user=>     
        table.push([user.id,user.desc,user.amt])
    )
    console.log(table.toString());
})


program.command('total')
.description("Will Add all the expenses")
.option('-m --month <number>','Expense of specific month')
.option('-c --category <type>','Expense of specific month')
.action((options)=>{
    const exp=userRec.map(ele=>Number(ele.amt))
    const month=userRec.map(ele=>ele.month)
    if(options.month){
    const filteredExpenses = userRec.filter(ele => ele.month === Number(options.month))
                            .map(ele=>Number(ele.amt))
    const totalMon=filteredExpenses.reduce((acc,value)=>acc+value,0)
    console.log(totalMon)
}
if(options.category==='Eating'){
    const filterCategoryExp=userRec.filter(ele=>ele.category===String(options.category))
    .map(ele=>Number(ele.amt))
    const totalCategory=filterCategoryExp.reduce((acc,value)=>acc+value,0)
    console.log("Eating category Exp "+totalCategory);
    }
    const total=exp.reduce((acc,value)=>acc+value,0)
    console.log("Total Expenses "+total)
})
// program.command()

program.command('delete')
.description("Will delete the expense by taking the id")
.option("--id <number>","ID of expense")
.action((options)=>{
    deleteData(options.id)
    console.log("Expense record deleted"); 
})

program.command('set-budget')
.option('-m, --month <type>','Expense of specific month')
.option('-b --budget <type>',"Budget")
.action((options)=>{
    if (isNaN(options.budget) || isNaN(options.month)) {
        throw new Error("Error: Argument should be a valid number");
    }
    const budgetObj = {
        budgetAmt:options.budget, // Ensure values are numbers
        budgetMonth: options.month  // Ensure values are numbers
    };


// budget.push(budgetObj);
saveBudget(budgetObj)

console.log("Budget Set Successfullly")
})

program.command('export-csv')
.action(()=>{

    const jsonFile=JSON.parse(fs.readFileSync(filePath,"utf8"))
console.log(jsonFile)
    
    try {
        // Convert the JSON data to CSV format
        const csv = parse(jsonFile);
        
        // Write the CSV string to a file
        fs.writeFileSync('userRecords.csv',csv)
      
        console.log('CSV file has been saved!');
      } catch (err) {
        console.error('Error converting to CSV:', err);
      }
})

program.parse()