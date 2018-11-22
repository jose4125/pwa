(function() {
  let dbPromise = idb.open("news-store", 1, db => {
    if (!db.objectStoreNames.contains("news")) {
      db.createObjectStore("news", { keyPath: "id" });
    }

    if (!db.objectStoreNames.contains("sync-new-posts")) {
      db.createObjectStore("sync-posts", { keyPath: "id" });
    }
  });

  let database = {
    saveData: function(st, data) {
      return dbPromise.then(db => {
        let tx = db.transaction(st, "readwrite");
        let store = tx.objectStore(st);
        store.put(data);
        return tx.complete;
      });
    },
    getAllData: function(st) {
      return dbPromise.then(db => {
        let tx = db.transaction(st, "readonly");
        let store = tx.objectStore(st);
        return store.getAll();
      });
    },
    clearAllData: function(st) {
      return dbPromise.then(db => {
        let tx = db.transaction(st, "readwrite");
        let store = tx.objectStore(st);
        store.clear();
        return tx.complete;
      });
    },
    deleteItemData: function(st, id) {
      return dbPromise.then(db => {
        let tx = db.transaction(st, "readwrite");
        let store = tx.objectStore(st);
        store.delete(id);
        return tx.complete;
      });
    }
  };

  if (typeof module !== "undefined") {
    module.exports = database;
    module.exports.default = module.exports;
  } else {
    self.database = database;
  }
})();
