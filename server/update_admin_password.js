const bcrypt = require("bcryptjs");
const supabase = require("./db");

async function updateAdminPassword() {
  try {
    // Создаем новый хеш пароля
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash("admin", salt);

    // Обновляем пароль в базе данных
    const { data, error } = await supabase
      .from("users")
      .update({ password_hash })
      .eq("username", "admin")
      .select();

    if (error) {
      console.error("Ошибка при обновлении пароля:", error);
    } else {
      console.log("Пароль успешно обновлен");

      // Проверяем новый пароль
      const isValid = await bcrypt.compare("admin", password_hash);
      console.log("Проверка нового пароля:", isValid);
    }
  } catch (error) {
    console.error("Ошибка:", error);
  } finally {
    process.exit();
  }
}

updateAdminPassword();
