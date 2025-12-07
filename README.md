# Лабораторная работа №5. Архитектурные стили и протоколы взаимодействия Web-API (WebSockets)

## Цель работы

- Освоить альтернативный архитектурный стиль Web-API: WebSockets.
- Реализовать real-time взаимодействие между клиентом и сервером.
- Интегрировать новый стиль API с существующим REST API и системой аутентификации.

---

## Структура проекта

```
lab5-websockets/
├── server.js
├── package.json
├── client.html
├── routes/
│   ├── auth.js
│   └── todos.js
├── models/
│   ├── user.js
│   └── todo.js
├── middlewares/
│   ├── auth.js
│   └── errorHandler.js
└── ws/
    └── socket.js
```

**Описание:**

- `server.js` — основной файл сервера, REST и WebSocket интеграция.
- `package.json` — зависимости и скрипты запуска.
- `client.html` — клиент для тестирования WebSocket чата.
- `routes/` — маршруты REST API (`auth.js`, `todos.js`).
- `models/` — заглушки для пользователей и задач.
- `middlewares/` — авторизация JWT (`auth.js`) и глобальный обработчик ошибок (`errorHandler.js`).
- `ws/socket.js` — middleware для проверки JWT в WebSocket соединениях.

---

## Фрагменты кода

### WebSocket сервер (server.js)
```javascript
io.use(authenticateSocket); // проверка JWT при соединении
io.on("connection", (socket) => {
  console.log("Пользователь подключился:", socket.user.username);

  socket.on("message", (data) => {
    io.emit("message", `${socket.user.username}: ${data}`);
  });

  socket.on("disconnect", () => {
    console.log("Пользователь отключился:", socket.user.username);
  });
});
```

### WebSocket middleware (ws/socket.js)
```javascript
function authenticateSocket(socket, next) {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error("Token missing"));

  jwt.verify(token, secret, (err, user) => {
    if (err) return next(new Error("Invalid token"));
    socket.user = users.find(u => u.id === user.id);
    next();
  });
}
```

### REST API проверка авторизации (middlewares/auth.js)
```javascript
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Token missing" });

  jwt.verify(token, secret, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
}
```

---

## Контрольные вопросы

1. **В чём основные отличия REST от WebSockets?**
   - REST: запрос-ответ, клиент инициирует каждый запрос.
   - WebSockets: двустороннее соединение, сервер может инициировать сообщения клиенту.
   - WebSockets позволяют real-time обновления без постоянного опроса REST API.

2. **Когда использование WebSockets даёт преимущество?**
   - Чат-приложения, игровые серверы, коллаборативные редакторы, real-time уведомления.
   - Улучшение производительности: уменьшается нагрузка от постоянных HTTP-запросов.
   - Удобство: мгновенная синхронизация данных.

3. **Ограничения WebSockets:**
   - Более сложная архитектура для масштабирования.
   - Необходим постоянный open-сокет, что увеличивает потребление ресурсов.
   - Поддержка кэширования и REST-подобной инфраструктуры ограничена.

4. **Интеграция WebSockets с REST API и JWT:**
   - WebSockets использует тот же механизм авторизации (JWT), что и REST.
   - REST API продолжает работать для CRUD операций.
   - WebSockets добавляет real-time обмен сообщениями поверх существующих моделей пользователей и задач.

---

## Вывод

В ходе лабораторной работы №5 была реализована интеграция WebSockets в существующее приложение Node.js с REST API. 

Пользователи могут:
- Подключаться к серверу с проверкой JWT.
- Отправлять сообщения, которые мгновенно доставляются всем подключённым клиентам.
- Продолжать использовать REST API для стандартных операций CRUD.

WebSockets расширили функциональность приложения, обеспечив real-time взаимодействие, улучшив удобство использования и повысив интерактивност
