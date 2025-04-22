const supabase = require("./db");

async function checkAdminUser() {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", "admin")
      .single();

    if (error) {
      console.error("Ошибка при поиске пользователя:", error);
    } else if (data) {
      console.log("Найден пользователь admin:", data);
    } else {
      console.log("Пользователь admin не найден");
    }
  } catch (error) {
    console.error("Ошибка:", error);
  } finally {
    process.exit();
  }
}

checkAdminUser();
