const supabase = require("./db");

async function testConnection() {
  try {
    // Проверяем подключение, пытаясь получить данные пользователя admin
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", "admin")
      .single();

    if (error) {
      console.error("Ошибка при запросе к базе данных:", error);
      return;
    }

    console.log("Подключение к базе данных успешно");
    console.log("Данные пользователя admin:", data);

    // Проверяем структуру таблицы
    const { data: tableInfo, error: tableError } = await supabase
      .from("users")
      .select()
      .limit(0);

    if (tableError) {
      console.error("Ошибка при проверке структуры таблицы:", tableError);
    } else {
      console.log("Структура таблицы users корректна");
    }
  } catch (error) {
    console.error("Неожиданная ошибка:", error);
  } finally {
    process.exit();
  }
}

testConnection();
