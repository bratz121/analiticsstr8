const bcrypt = require("bcryptjs");
const supabase = require("./db");

async function createAdminUser() {
  try {
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash("admin", salt);

    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          username: "admin",
          password_hash: password_hash,
          role: "admin",
        },
      ])
      .select();

    if (error) {
      if (error.code === "23505") {
        console.log("Пользователь admin уже существует");
      } else {
        console.error("Ошибка:", error);
      }
    } else {
      console.log("Админ успешно создан:", data);
    }
  } catch (error) {
    console.error("Ошибка:", error);
  } finally {
    process.exit();
  }
}

createAdminUser();
