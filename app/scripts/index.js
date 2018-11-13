import template from "../template/news-template.html";
import "./register";

const url = "https://news-pwa-86d39.firebaseio.com/news.json";
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

if ("caches" in window) {
  caches
    .match(url)
    .then(res => {
      if (res) {
        return res.json();
      }
    })
    .then(data => {
      console.log("From cache", data);
      if (!networkDataReceived) {
        let fetchData = {
          news: []
        };

        for (let item in data) {
          fetchData.news.push(data[item]);
        }
        const html = template(fetchData);
        document.querySelector(".news-container").innerHTML = html;
      }
    });
}
