import "bootstrap/dist/js/bootstrap";
import "bootstrap/scss/bootstrap.scss";
import "bootstrap-icons/font/bootstrap-icons.scss";

let books = document.querySelectorAll('.card');
let formBook = document.querySelector("#book-name");

for (let i = 0; i < books.length; i++) {
    books[i].addEventListener('click', e => {
        if(e.target.tagName === "INPUT") {
            let xhr = new XMLHttpRequest();
            xhr.open("POST", "http://bookshop.local:3000/buy");
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.onloadend = function () {
                if (xhr.status == 200) {
                    console.log(xhr.responseText);
                }
            }
            xhr.send('{"book_id": 1}');
        }
    });
}