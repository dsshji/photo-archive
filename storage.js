// open a database wrapped in Promise that returns it
function openDB() {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open("PhotoTree", 1);
    
    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
    
    request.onerror = (event) => {
      reject("failed to open db");
    };
    
    // update for the database if changes detected
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      const objectStore = db.createObjectStore("images", { keyPath: "src" });
    };
  });
};

// method to save the image to the database
function saveImage(db, id, file) {
    return new Promise((resolve, reject) => {
        // open a transaction that will add the Image with key = id to images objectStore
        const transaction = db.transaction(["images"], "readwrite");
        const store = transaction.objectStore("images");
        const request = store.add({ src: id, file: file });
        
        request.onsuccess = (event) => {
        resolve(event.target.result);
        };
        
        request.onerror = (event) => {
        reject("failed to open db");
        };
    });    
};

function getImage(db, id) {
    return new Promise((resolve, reject) => {
        // open a transaction that will get the Image by id from images objectStore
        const transaction = db.transaction(["images"], "readonly");
        const store = transaction.objectStore("images");
        const request = store.get(id);
        
        request.onsuccess = (event) => {
        resolve(event.target.result);
        };
        
        request.onerror = (event) => {
        reject("failed to open db");
        };
    });    
};

function removeImage(db, id) {
    return new Promise((resolve, reject) => {
        // open a transaction that will remove the Image by id from images objectStore
        const transaction = db.transaction(["images"], "readwrite");
        const store = transaction.objectStore("images");
        const request = store.delete(id);
        
        request.onsuccess = (event) => {
        resolve(event.target.result);
        };
        
        request.onerror = (event) => {
        reject("failed to open db");
        };
    });    
};