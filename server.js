const express = require('express');
const path = require('path');
const pug = require('pug');
const fs = require("fs");



function error_log(err) {
    let d = new Date();
    let logFile = fs.createWriteStream(__dirname + '/error_report.log', { flags: 'a' });
    logFile.write(d.toLocaleString() + ' ' + err.message + '\n');
    console.log(err);
}

const app = express();
app.use('/media', express.static('media'));

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

app.get('/bootstrap.css', (req, res) => {
    res.sendFile(path.join(__dirname, "node_modules/bootstrap/dist/css/bootstrap.css"));
});

app.get('/bootstrap.js', (req, res) => {
    res.sendFile(path.join(__dirname, "node_modules/bootstrap/dist/js/bootstrap.js"));
});

app.post('/buy', (req, res) => {
    //     res.send("Покупка прошла успешно!");
    // });

    // app.get('/success', (req, res) => {
    //res.sendFile(path.join(__dirname, "views", "thankyoupage.html"));
    res.send(
        pug.renderFile(path.join(__dirname, "views", "thankyoupage.html"), {
            username: "John",
            bookname: "Lord of rings",
            date: "12.03.2024",
            address: "Moscow, Kreml"
        })
    );
})

app.get('/order', (req, res) => {
    let filepath = path.join(__dirname, "views", "order.pug");
    let template = pug.renderFile(filepath,
        {
            page: "order"
        });
    res.send(template);

})

app.listen(3000, () => {
    console.log(`Server started by address: http://localhost:3000`);
})