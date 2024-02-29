const express = require('express');
const path = require('path');
const pug = require('pug');
const fs = require("fs");
const bodyParser = require("body-parser");
// const cors = require("cors");
// const {writeFile} = require("fs/promises");

function error_log(err) {
    let d = new Date();
    let logFile = fs.createWriteStream(__dirname + '/error_report.log', { flags: 'a' });
    logFile.write(d.toLocaleString() + ' ' + err.message + '\n');
    console.log(err);
}

const app = express();
app.use('/media', express.static('media'));
app.use(bodyParser.json());
// app.use(cors())

app.get('/', (req, res) => {
    fs.readFile(__dirname + "/books.json", (err, data) => {
        if (err) {
            error_log(err);
        }
        let filename = path.join(__dirname, "views", "catalog.pug");
        let template = pug.renderFile(
            filename,
            {
                cards: JSON.parse(data),
                page: "main"
            }
        )
        res.send(template);
    })
});


/**
 * Добавление книги в корзину
 * @param {Request} req
 */
app.post('/buy', (req, res) => {
    // 1. Синхронная запись в файл
    fs.writeFileSync("users_books.csv", "test");
    // 2. Асинхронная запись в файл с функцией обратного вызова
    // fs.writeFile("users_books.csv", "test", function(){
    //     console.log("File has been writed");
    // });
    // 3. Promise
    // const promise = writeFile("users_books.csv", "test");
    // promise.then(() => console.log("File has been writed"));
    
    const userId = Math.ceil(Math.random() * 1000);
    const d = new Date();
    d.setHours(d.getHours() + 5);
    const expires = d.toUTCString();
    res.setHeader("Set-Cookie", "user=" + userId + "; expires=" + expires)
    res.send(req.body);
});

app.get('/order', (req, res) => {
    let filepath = path.join(__dirname, "views", "order.pug");
    let template = pug.renderFile(filepath,
        {
            page: "order"
        });
    res.send(template);

});

app.get('/profile', (req, res) => {
    res.send("Profile page will be soon added!");
});

app.listen(3000, () => {
    console.log(`Server started by address: http://bookshop.local:3000`);
});