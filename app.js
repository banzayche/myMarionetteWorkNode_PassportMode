// Подключаем модуль експресс
var express = require('express');
// Подключаем модуль боди-парсер
var bodyParser = require('body-parser');
// делаем переменную ссылкой на модуль экспресс
var app = express();

// массив с начальными моделями
// var todos = [
//     {
//         title: 'first task',
//         done: false,
//         date: '6575675',
//         id: 0
//     },
//     {
//         title: 'second task',
//         done: false,
//         date: '554444',
//         id: 1
//     },
//     {
//         title: 'third task',
//         done: false,
//         date: '222332',
//         id: 2
//     },
//     {
//         title: 'fourth task',
//         done: false,
//         date: '34534566',
//         id: 3
//     },
//     {
//         title: 'fifth task',
//         done: false,
//         date: '5675685867',
//         id: 4
//     },
//     {
//         title: 'six task',
//         done: false,
//         date: '546854867',
//         id: 5
//     },
//     {
//         title: 'seventh task',
//         done: false,
//         date: '5686674856',
//         id: 6
//     },
//     {
//         title: 'eigth task',
//         done: false,
//         date: '5468764863433',
//         id: 7
//     },
// ];

// Обращаемся к файлу tasks, который находится в этой же дирректории
var todos = require('./tasks');
// присваеваем переменной то, что возвращает нам код в файле
todos = todos.taskList();


// переменная в которой происходит подсчет айди
var nextId = todos.length;
// Указывается какую статическую дерикторию использовать по умолчанию
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

// Ниже мы говорим, если наш реквест не запрашивает статические ресурсы, то он отдаст index.html
app.use(function (req, res, next) {
    // если запросим статические ресурсы - то отдаст их
    if(req.url.indexOf("/api") === 0 ||
        req.url.indexOf("/bower-components") === 0 ||
        req.url.indexOf("/scripts") === 0) {
        return next();
    }
    // иначе - вернет следующий файл
    res.sendFile(__dirname + '/public/index.html');
});

// указывается работа с каким массивом будет проводиться, что будет отдаваться если запрашивается массив
app.get('/api/todos', function(req, res) {
    res.json(todos);
});
app.get('/api/login', function(req, res) {
    console.log('coming to log');
    res.sendFile(__dirname + '/public/index.html');
});
app.post('/api/login', function(req, res) {
    console.log('posting to log');
});

// что будет отдаваться если запрашивается с айди
app.get('/api/todos/:id', function(req, res) {
    var todo = todos.filter(function(todo) { return todo.id == req.params.id; })[0];

    if(!todo) {
        res.statusCode = 404;
        return res.json({ msg: "todo does not exist" });
    }

    res.json(todo);
});

// ПОСТ - это создание новых моделей на сервере
// новая - если нет айди, это по умолчанию
app.post('/api/todos', function(req, res) {
    if(!req.body.title || !req.body.date) {
        res.statusCode = 400;
        return res.json({ msg: "Invalid params sent" });
    }

    var newtodo = {
        title: req.body.title,
        done: req.body.done,
        date: req.body.date,
        id: nextId++,
    };

    todos.push(newtodo);

    res.json(newtodo);
});

// ПУТ - это изменение уже существующих на сервере моделей
app.put('/api/todos/:id', function(req, res) {
    if(!req.body.title || !req.body.date) {
        res.statusCode = 400;
        return res.json({ msg: "Invalid params sent" });
    }

    var todo = todos.filter(function(todo) { return todo.id == req.params.id; })[0];

    if(!todo) {
        res.statusCode = 404;
        return res.json({ msg: "todo does not exist" });
    }

    todo.title = req.body.title;
    todo.done = req.body.done;
    todo.date = req.body.date;
    todo.id = req.body.id;

    res.json(todo);
});

// Соответственно - удаление
app.delete('/api/todos/:id', function(req, res) {
    var todo = todos.filter(function(todo) { return todo.id == req.params.id; })[0];

    if(!todo) {
        res.statusCode = 404;
        return res.json({ msg: "todo does not exist" });
    }

    todos.splice(todos.indexOf(todo), 1);

    res.statusCode = 204;
    res.send({});
});

// адресс порта
app.listen(8100);
console.log('Server side has been started')