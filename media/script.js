let books = document.querySelectorAll('.card');
let formBook = document.querySelector("#book-name");

for (let i = 0; i < books.length; i++) {
    books[i].addEventListener('click', e => {
        if(e.target.tagName === "INPUT") {
            let title = books[i].querySelector(".card-title").innerText;
            formBook.value = title;
        }
    });
}