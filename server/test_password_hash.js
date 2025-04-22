const bcrypt = require("bcryptjs");

async function testPasswordHash() {
  const password = "admin";
  const storedHash =
    "$2a$10$vQcjA2ldvcYXBhX8Hwp4oOXYwLKjAkOxwVJHU9QZYGYPiXxFmqIJm";

  console.log("Тестируем пароль:", password);
  console.log("Сохраненный хеш:", storedHash);

  try {
    // Создаем новый хеш
    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(password, salt);
    console.log("Новый хеш для того же пароля:", newHash);

    // Проверяем старый хеш
    const isValidOld = await bcrypt.compare(password, storedHash);
    console.log("Проверка со старым хешем:", isValidOld);

    // Проверяем новый хеш
    const isValidNew = await bcrypt.compare(password, newHash);
    console.log("Проверка с новым хешем:", isValidNew);
  } catch (error) {
    console.error("Ошибка:", error);
  }
}

testPasswordHash();
