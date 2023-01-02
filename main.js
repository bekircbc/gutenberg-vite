import "./style.scss";
import axios from "axios";

let input;
let books = [];
const headerElem = document.querySelector("#header");
const appElem = document.querySelector("#app");

headerElem.innerHTML = `
<h1>Gutenberg Project</h1>
<div>
<form>
<input type="text" class="inputSearch">
<button class="btnSearch">Search</button></form></div>`;

const inputSearch = document.querySelector(".inputSearch");
const btnSearch = document.querySelector(".btnSearch");

const getBookUrl = (rawBook) => {
  let url = "";
  const formatPairs = Object.entries(rawBook.formats);
  formatPairs.forEach(([key, value]) => {
    if (
      value.endsWith(".txt") ||
      value.endsWith(".htm") ||
      value.endsWith(".html.images")
    ) {
      url = value;
    }
  });
  return url;
};

const getBooks = async (searchText) => {
  const url = `https://gutendex.com/books/?search=${searchText}`;
  const response = await axios.get(url);
  const rawBooks = response.data.results;
  rawBooks.forEach((rawBook) => {
    books.push({
      title: rawBook.title,
      imageUrl: rawBook.formats["image/jpeg"]
        ? rawBook.formats["image/jpeg"]
        : "images/blank.png",
      author:
        rawBook.authors && rawBook.authors.length > 0
          ? rawBook.authors[0].name
          : "(no author listed)",
      bookUrl: getBookUrl(rawBook),
    });
  });
  return books;
};

btnSearch.addEventListener("click", async (e) => {
  e.preventDefault();
  input = inputSearch.value;
  getBooks(input);
  appElem.innerHTML = `Loading... Please wait.`;
  setTimeout(function () {
    appElem.innerHTML = `<ul>
    ${books
      .map((book) => {
        return `<a href="${book.bookUrl}"<li>${book.title}, <span>${book.author}</span></br>
        <span> <image src="${book.imageUrl}"></image></span></li></a>`;
      })
      .join(``)}
    </ul>`;
  }, 2500);
});

console.log(books);

// appElem.innerHTML += `<ul>
// ${books.map((book) => {
//   return `<li>${book.title} ${book.author} <image src="book.imageUrl"></image></li>`;
// })}
// </ul>`;

// const title = "<h1>Employees</h1>";
// appElem.innerHTML = title + "<div>Loading...</div>";

// setTimeout(() => {
//   (async () => {
//     // fetch
//     // const response = await fetch(url);
//     // const employees = await response.json();

//     // axios
//     const response = await axios.get(url);
//     const employees = response.data;

//     appElem.innerHTML =
//       title +
//       `
//   <ul>
//       ${employees
//         .map((employee) => {
//           return `<li>${employee.firstName} ${employee.lastName}</li>`;
//         })
//         .join("")}
//   </ul>
// `;
//   })();
// }, 2000);
