// variable to hold database connection
let db;

// establish connection and set it to version 1
const request = indexedDB.open('budget_tracker', 1);

// this will run if the db versio nchanges
request.onupgradeneeded = function(event) {
    // save reference to db
    const db = event.target.result;
    // create an object store and set it to auto increment
    db.createObjectStore('new_budget', { autoIncrement: true });
};

request.onsuccess = function(event) {
    // when db is successfully created with its object store
    db = event.target.result;

    // check if app is online and run the following
    if (navigator.onLine) {

    }
};

request.onerror = function(event) {
    // log error here
    console.log(event.target.errorCode);
};

// this will execute if there is no connection when submitting
function saveRecord(record) {
    // open a new transaction with the database with read and write permissions
    const transaction = db.transaction(['new_budget'], 'readwrite');

    // access new_budget
    const budgetObjectStore = transaction.objectStore('new_budget');

    // add record using .add
    budgetObjectStore.add(record);
};

function uploadBudget() {
    // open transaction on db
    const transaction = db.transaction(['new_budget'], 'readwrite');

    // access object
    const budgetObjectStore = transaction.objectStore('new_budget');

    // get all records and place into a variable
    const getAll = budgetObjectStore.getAll();

    // after a successfull .getAll run the following
    getAll.onsuccess = function() {
        // if there was data then send to api server
        if (getAll.result.length > 0) {
            fetch('/api/transaction', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json' 
                }
            })
            .then(response => response.json())
            .then(serverResponse => {
                if (serverResponse.message) {
                    throw new Error(serverResponse);
                }
                // open another transaction
                const transaction = db.transaction(['new_budget'], 'readwrite');
                // access the new object
                const budgetObjectStore = transaction.objectStore('new_budget');
                // clear all items
                budgetObjectStore.clear();

                alert('All saved budgets have been submitted!');
            })
            .catch(err => {
                console.log(err);
            });
        }
    }
};

// listen for app coming back online
window.addEventListener('online', uploadBudget);