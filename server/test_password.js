const bcrypt = require("bcryptjs");

async function testPassword() {
  const storedHash =
    "$2a$10$vQcjA2ldvcYXBhX8Hwp4oOXYwLKjAkOxwVJHU9QZYGYPiXxFmqIJm";
  const password = "admin";

  try {
    const isValid = await bcrypt.compare(password, storedHash);
    console.log("Пароль верный:", isValid);
  } catch (error) {
    console.error("Ошибка при проверке пароля:", error);
  }
}

testPassword();
