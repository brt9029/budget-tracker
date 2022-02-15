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
}

// this will execute if there is no connection when submitting
function saveRecord(record) {
    // open a new transaction with the database with read and write permissions
    const transaction = db.transaction(['new_budget'], 'readwrite');

    // access new_budget
    const budgetObjectStore = transaction.objectStore('new_budget');

    // add record using .add
    budgetObjectStore.add(record);
}