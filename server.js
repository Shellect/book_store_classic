const express = require('express');
const path = require('path');
const pug = require('pug');
const fs = require("fs");
const bodyParser = require("body-parser");
const session = require('express-session');
const redis = require("redis");
const RedisStore = require("connect-redis").default

function error_log(err) {
    let d = new Date();
    let logFile = fs.createWriteStream(__dirname + '/error_report.log', { flags: 'a' });
    logFile.write(d.toLocaleString() + ' ' + err.message + '\n');
    console.log(err);
}

// Настройка клиент Redis
const redisClient = redis.createClient({
    host: '127.0.0.1',
    port: 6379
});
redisClient.connect().catch(console.error);

// Создание хранилища
let redisStore = new RedisStore({
    client: redisClient,
    prefix: "bookshop:",
});

const app = express();
app.use('/media', express.static('media'));
app.use(bodyParser.json());
app.use(session({
    store: redisStore,
    secret: 'eptBATPhykOaN8LqWvl38KGdGa8ZRc60',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

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
    req.session.book_id = req.body.book_id;
    res.sendStatus(200);
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

app.get('/auth', (req, res) => {
    let filepath = path.join(__dirname, "views", "auth.pug");
    let template = pug.renderFile(filepath, {page: "auth"});
    res.send(template);
});

app.post('/auth', (req, res) => {
    res.sendStatus(200);
});

app.listen(3000, () => {
    console.log(`Server started by address: http://bookshop.local:3000`);
});