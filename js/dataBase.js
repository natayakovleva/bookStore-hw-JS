
function initDatabase(dbName, dbVersion, objectStoreName, callback) {
  const request = indexedDB.open(dbName, dbVersion);

  request.onerror = function (event) {
    console.error("Error opening IndexedDB:", event.target.error);
  };

  request.onupgradeneeded = function (event) {
    const db = event.target.result;
    if (!db.objectStoreNames.contains(objectStoreName)) {
      db.createObjectStore(objectStoreName, { keyPath: "id" });
    }
  };

  request.onsuccess = function (event) {
    const db = event.target.result;
    callback(db);
  };
}

export function saveDataToIndexedDB(data, objectStoreName) {
  const dbName = 'universal-store';
  const dbVersion = 2;

  initDatabase(dbName, dbVersion, objectStoreName, (db) => {
    if (!db.objectStoreNames.contains(objectStoreName)) {
      console.error(
        `Object store "${objectStoreName}" not found after upgrade`
      );
      db.close();
      return;
    }

    const tx = db.transaction(objectStoreName, "readwrite");
    const store = tx.objectStore(objectStoreName);

    data.forEach((item) => {
      store.put(item);
    });

    tx.oncomplete = function () {
      console.log("Data saved to IndexedDB successfully.");
      db.close();
    };

    tx.onerror = function (event) {
      console.error("Error saving data to IndexedDB:", event.target.error);
    };
  });
}

export function getDataFromIndexedDB(objectStoreName, callback) {
  const dbName = 'universal-store';
  const dbVersion = 2;

  initDatabase(dbName, dbVersion, objectStoreName, (db) => {
    if (!db.objectStoreNames.contains(objectStoreName)) {
      console.error(`Object store "${objectStoreName}" not found`);
      callback(new Error(`Object store "${objectStoreName}" not found`), null);
      db.close();
      return;
    }

    const tx = db.transaction(objectStoreName, "readonly");
    const store = tx.objectStore(objectStoreName);
    const getDataRequest = store.getAll();

    getDataRequest.onsuccess = function (event) {
      const data = event.target.result;
      callback(null, data);
    };

    getDataRequest.onerror = function (event) {
      console.error("Error getting data from IndexedDB:", event.target.error);
      callback(event.target.error, null);
    };

    tx.oncomplete = function () {
      db.close();
    };
  });
}
