import template from "../template/news-template.html";
import "./register";
import database from "../utils/idb-database";

const url = "https://news-d62a0.firebaseio.com/news.json";
let networkDataReceived = false;

fetch(url)
  .then(res => {
    return res.json();
  })
  .then(data => {
    networkDataReceived = true;
    console.log("From web", data);
    let fetchData = {
      news: []
    };

    for (let item in data) {
      fetchData.news.push(data[item]);
    }
    const html = template(fetchData);
    document.querySelector(".news-container").innerHTML = html;
  });

if ("indexedDB" in window) {
  database.getAllData("news").then(data => {
    if (!networkDataReceived) {
      console.log("from cache", data);
      let cacheData = {
        news: data
      };
      const html = template(cacheData);
      document.querySelector(".news-container").innerHTML = html;
    }
  });
}
