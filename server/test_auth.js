const axios = require("axios");

async function testAuth() {
  try {
    console.log("Отправляем запрос на вход...");
    console.log("URL:", "http://localhost:5000/api/auth/login");
    console.log("Данные:", {
      username: "admin",
      password: "admin",
    });

    const response = await axios.post(
      "http://localhost:5000/api/auth/login",
      {
        username: "admin",
        password: "admin",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("\nУспешный ответ:");
    console.log("Статус:", response.status);
    console.log("Данные:", response.data);
  } catch (error) {
    console.error("\nОшибка при выполнении запроса:");
    if (error.response) {
      // Ответ был получен, но статус не в диапазоне 2xx
      console.error("Статус:", error.response.status);
      console.error("Данные:", error.response.data);
      console.error("Заголовки:", error.response.headers);
    } else if (error.request) {
      // Запрос был сделан, но ответ не получен
      console.error("Нет ответа от сервера");
      console.error("Запрос:", error.request);
    } else {
      // Что-то пошло не так при настройке запроса
      console.error("Ошибка:", error.message);
    }
  }
}

testAuth();
