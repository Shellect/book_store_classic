import "bootstrap/dist/js/bootstrap";
import "bootstrap/scss/bootstrap.scss";
import "bootstrap-icons/font/bootstrap-icons.scss";
import "./auth.scss";

let books = document.querySelectorAll('.card');

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

let submitBtn = document.querySelector("#auth-submit");
if (submitBtn){
    submitBtn.addEventListener('click', e => {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", "http://bookshop.local:3000/auth");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onloadend = function () {
            if (xhr.status == 200) {
                console.log(xhr.responseText);
            }
        }
        const login = document.querySelector("#username").value;
        const password = document.querySelector("#password").value;
        const body = JSON.stringify({
            login,
            password
        })
        xhr.send(body);
    });
}