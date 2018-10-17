import template from "../template/news-template.html";

const data = {
  news: [
    {
      url: "google.com",
      imageUrl:
        "https://cdn.theatlantic.com/assets/media/img/mt/2018/08/iss050e066094_large/lead_720_405.jpg?mod=1535549776",
      publishedAt: "today",
      title: "space news",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ut venenatis leo. Donec nec quam a metus mattis ultrices. Vivamus consectetur magna vel erat ultrices porta. Suspendisse bibendum ultricies felis ut aliquam. Vivamus placerat tincidunt dui, nec vestibulum velit tincidunt vel. Integer luctus dictum velit, ac bibendum quam ullamcorper et.",
      author: "glem"
    },
    {
      url: "google.com",
      imageUrl:
        "https://cdn.theatlantic.com/assets/media/img/mt/2018/08/iss050e066094_large/lead_720_405.jpg?mod=1535549776",
      publishedAt: "today",
      title: "space news",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ut venenatis leo. Donec nec quam a metus mattis ultrices. Vivamus consectetur magna vel erat ultrices porta. Suspendisse bibendum ultricies felis ut aliquam. Vivamus placerat tincidunt dui, nec vestibulum velit tincidunt vel. Integer luctus dictum velit, ac bibendum quam ullamcorper et.",
      author: "glem"
    }
  ]
};
const html = template(data);
console.log("template", html);

document.querySelector(".news-container").innerHTML = html;
