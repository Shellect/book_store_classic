// Подключение модулей
const express = require('express');
const bodyParser = require("body-parser");
const { body, validationResult } = require('express-validator');
const fs = require("fs");
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
redisClient.connect().catch(error_log);

// Создание хранилища
let redisStore = new RedisStore({
    client: redisClient,
    prefix: "bookshop:",
});

const app = express();
app.set('view engine', 'pug');
app.use('/media', express.static('media'));
app.use(express.json());
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
        res.render(
            "catalog",
            {
                cards: JSON.parse(data),
                page: "main",
                user: req.session.user
            }
        )
    })
});


/**
 * Добавление книги в корзину
 */
app.post('/buy', (req, res) => {
    req.session.books = req.body.book_id;
    res.sendStatus(200);
});

app.get('/order', (req, res) => {
    res.render("order", { page: "order" });
});

app.get('/profile', (req, res) => {
    res.render("profile", { page: "profile" });
});

app.get('/auth', (req, res) => {
    res.render("auth", { page: "auth", errors: [] });
});

app.post('/auth',
    bodyParser.urlencoded(),
    body('username').notEmpty(),
    body('password').notEmpty(),
    (req, res, next) => {
        const result = validationResult(req);
        if (result.isEmpty()) {
            // Если ошибок не найдено
            req.session.regenerate(function (err) {
                // Если redis не доступен передаём управление обработчику ошибок
                if (err) next(err);

                // Записываем информацию о авторизации пользователя в сессии
                req.session.user = req.body.username;

                // Сохраняем сессию
                req.session.save(function (err) {
                    if (err) return next(err);
                    // Перенаправляем пользователя на главную страницу
                    res.redirect('/');
                });
            });
        } else {
            res.render('auth', { errors: result.array() })
        }
    });

app.listen(3000, () => {
    console.log(`Server started by address: http://bookshop.local:3000`);
});