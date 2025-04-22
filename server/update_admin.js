const bcrypt = require("bcryptjs");
const supabase = require("./db");

async function updateAdmin() {
  try {
    // Создаем новый хеш пароля
    const password = "admin";
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    console.log("Новый хеш:", password_hash);

    // Обновляем пароль в базе данных
    const { data, error } = await supabase
      .from("users")
      .update({ password_hash })
      .eq("username", "admin")
      .select();

    if (error) {
      console.error("Ошибка при обновлении:", error);
      return;
    }

    console.log("Пароль успешно обновлен");

    // Проверяем обновленный пароль
    const isValid = await bcrypt.compare(password, password_hash);
    console.log("Проверка нового пароля:", isValid);
  } catch (error) {
    console.error("Ошибка:", error);
  }
}

updateAdmin();
