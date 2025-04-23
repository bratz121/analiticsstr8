require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const supabase = require("./db");

const app = express();

// Настройка CORS
app.use(
  cors({
    origin: ["http://localhost:3000", "https://str8-stats.netlify.app"],
    credentials: true,
  })
);

app.use(express.json());

// Раздача статических файлов из папки build
app.use(express.static(path.join(__dirname, "../build")));

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key";

// Middleware для проверки JWT токена
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Требуется авторизация" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Недействительный токен" });
    }
    req.user = user;
    next();
  });
};

// Middleware для проверки роли админа
const requireAdmin = async (req, res, next) => {
  try {
    const { data: user } = await supabase
      .from("users")
      .select("role")
      .eq("id", req.user.id)
      .single();

    if (!user || user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Требуются права администратора" });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера", error: error.message });
  }
};

// Авторизация
app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Проверяем наличие username и password
    if (!username || !password) {
      return res.status(400).json({
        message: "Требуется указать имя пользователя и пароль",
        details: {
          username: !username ? "Не указано имя пользователя" : null,
          password: !password ? "Не указан пароль" : null,
        },
      });
    }

    console.log("Попытка входа для пользователя:", username);

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .single();

    if (error) {
      console.error("Ошибка при поиске пользователя:", error);
      return res.status(401).json({
        message: "Неверное имя пользователя или пароль",
        error: error.message,
      });
    }

    if (!user) {
      console.log("Пользователь не найден:", username);
      return res
        .status(401)
        .json({ message: "Неверное имя пользователя или пароль" });
    }

    console.log("Проверка пароля для пользователя:", username);
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      console.log("Неверный пароль для пользователя:", username);
      return res
        .status(401)
        .json({ message: "Неверное имя пользователя или пароль" });
    }

    console.log("Успешный вход для пользователя:", username);
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      token,
      username: user.username,
      role: user.role,
    });
  } catch (err) {
    console.error("Ошибка входа:", err);
    res.status(500).json({
      message: "Ошибка сервера",
      error: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }
});

// Управление пользователями (только для админов)
app.post("/api/users", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Проверяем, существует ли пользователь
    const { data: existingUser } = await supabase
      .from("users")
      .select("username")
      .eq("username", username)
      .single();

    if (existingUser) {
      return res.status(400).json({ message: "Пользователь уже существует" });
    }

    // Хешируем пароль
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Создаем пользователя
    const { data, error } = await supabase
      .from("users")
      .insert([{ username, password_hash, role }])
      .select();

    if (error) {
      throw error;
    }

    res.json(data[0]);
  } catch (err) {
    console.error("Create user error:", err);
    res.status(500).json({ message: "Ошибка сервера", error: err.message });
  }
});

// Получение списка пользователей (только для админов)
app.get("/api/users", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, username, role, created_at");

    if (error) {
      throw error;
    }

    res.json(data);
  } catch (err) {
    console.error("Get users error:", err);
    res.status(500).json({ message: "Ошибка сервера", error: err.message });
  }
});

// Удаление пользователя (только для админов)
app.delete(
  "/api/users/:id",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;

      const { error } = await supabase.from("users").delete().eq("id", id);

      if (error) {
        throw error;
      }

      res.json({ message: "Пользователь успешно удален" });
    } catch (err) {
      console.error("Delete user error:", err);
      res.status(500).json({ message: "Ошибка сервера", error: err.message });
    }
  }
);

// Маршруты для работы с игроками
app.get("/api/players", authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase.from("players").select("*");

    if (error) {
      throw error;
    }

    const players = data.map((player) => ({
      ...player,
      id: player.id.toString(),
    }));

    res.json(players);
  } catch (error) {
    console.error("Error fetching players:", error);
    res
      .status(500)
      .json({ message: "Error fetching players", error: error.message });
  }
});

app.post("/api/players", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    // Проверяем, существует ли игрок с таким именем
    const { data: existingPlayer } = await supabase
      .from("players")
      .select("name")
      .eq("name", name)
      .single();

    if (existingPlayer) {
      return res.status(400).json({ message: "Player already exists" });
    }

    const { data, error } = await supabase
      .from("players")
      .insert([{ name, matches: [], stats: calculateStats([]) }])
      .select();

    if (error) {
      throw error;
    }

    const player = {
      ...data[0],
      id: data[0].id.toString(),
    };

    res.json(player);
  } catch (error) {
    console.error("Error creating player:", error);
    res
      .status(400)
      .json({ message: "Error creating player", error: error.message });
  }
});

app.post(
  "/api/players/:id/matches",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { map, kills, assists, deaths, win } = req.body;

      // Получаем текущего игрока
      const { data: player, error: fetchError } = await supabase
        .from("players")
        .select("*")
        .eq("id", parseInt(id))
        .single();

      if (fetchError) {
        console.error("Error fetching player:", fetchError);
        return res
          .status(404)
          .json({ message: "Player not found", error: fetchError.message });
      }

      // Добавляем новый матч
      const newMatch = {
        date: new Date().toISOString(),
        map: map.toLowerCase(),
        kills: parseInt(kills),
        assists: parseInt(assists),
        deaths: parseInt(deaths),
        win: win === "true" || win === true,
      };

      const matches = [...(player.matches || []), newMatch];

      // Обновляем статистику
      const stats = calculateStats(matches);

      // Обновляем игрока
      const { data, error } = await supabase
        .from("players")
        .update({
          matches,
          stats,
        })
        .eq("id", parseInt(id))
        .select();

      if (error) {
        console.error("Error updating player:", error);
        return res
          .status(400)
          .json({ message: "Error updating player", error: error.message });
      }

      const updatedPlayer = {
        ...data[0],
        id: data[0].id.toString(),
      };

      res.json(updatedPlayer);
    } catch (err) {
      console.error("Error adding match:", err);
      res
        .status(400)
        .json({ message: "Error adding match", error: err.message });
    }
  }
);

// Функция для расчета статистики
function calculateStats(matches) {
  if (!matches || matches.length === 0) {
    return {
      totalKills: 0,
      totalAssists: 0,
      totalDeaths: 0,
      totalMatches: 0,
      winRate: 0,
      averageKd: 0,
      averageImpact: 0,
      mapStats: [],
    };
  }

  const totalMatches = matches.length;
  const totalKills = matches.reduce((sum, match) => sum + match.kills, 0);
  const totalAssists = matches.reduce((sum, match) => sum + match.assists, 0);
  const totalDeaths = matches.reduce((sum, match) => sum + match.deaths, 0);
  const totalWins = matches.reduce(
    (sum, match) => sum + (match.win ? 1 : 0),
    0
  );
  const winRate = (totalWins / totalMatches) * 100;
  const averageKd = totalDeaths > 0 ? totalKills / totalDeaths : totalKills;
  const averageImpact =
    totalMatches > 0 ? (totalKills + totalAssists) / totalMatches : 0;

  // Группируем матчи по картам
  const mapStats = {};
  matches.forEach((match) => {
    const mapName = match.map.toLowerCase();
    if (!mapStats[mapName]) {
      mapStats[mapName] = {
        matches: 0,
        wins: 0,
        kills: 0,
        deaths: 0,
      };
    }
    mapStats[mapName].matches++;
    if (match.win) mapStats[mapName].wins++;
    mapStats[mapName].kills += match.kills;
    mapStats[mapName].deaths += match.deaths;
  });

  // Преобразуем статистику по картам в нужный формат
  const formattedMapStats = Object.entries(mapStats).map(
    ([mapName, stats]) => ({
      mapName: mapName.charAt(0).toUpperCase() + mapName.slice(1),
      matches: stats.matches,
      wins: stats.wins,
      winRate: (stats.wins / stats.matches) * 100,
      averageKd: stats.deaths > 0 ? stats.kills / stats.deaths : stats.kills,
    })
  );

  return {
    totalKills,
    totalAssists,
    totalDeaths,
    totalMatches,
    winRate,
    averageKd,
    averageImpact,
    mapStats: formattedMapStats,
  };
}

// Обработка всех остальных маршрутов - отдаем index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build/index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
