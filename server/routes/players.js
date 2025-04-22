const express = require("express");
const router = express.Router();
const Player = require("../models/Player");

// Получить всех игроков
router.get("/", async (req, res) => {
  try {
    const players = await Player.find();
    res.json(players);
  } catch (err) {
    console.error("Error fetching players:", err);
    res.status(500).json({ message: "Error fetching players" });
  }
});

// Создать нового игрока
router.post("/", async (req, res) => {
  try {
    if (!req.body.name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const player = new Player({
      name: req.body.name,
      matches: [],
      stats: {
        totalKills: 0,
        totalAssists: 0,
        totalDeaths: 0,
        totalMatches: 0,
        winRate: 0,
        averageKd: 0,
        averageImpact: 0,
        mapStats: [],
      },
    });

    const newPlayer = await player.save();
    res.status(201).json(newPlayer);
  } catch (err) {
    console.error("Error creating player:", err);
    res.status(400).json({ message: "Error creating player" });
  }
});

// Добавить матч игроку
router.post("/:id/matches", async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    const { map, kills, assists, deaths, win } = req.body;

    if (
      !map ||
      kills === undefined ||
      assists === undefined ||
      deaths === undefined ||
      win === undefined
    ) {
      return res.status(400).json({ message: "All match fields are required" });
    }

    player.matches.push({
      date: new Date(),
      map,
      kills: parseInt(kills),
      assists: parseInt(assists),
      deaths: parseInt(deaths),
      win: win === "true",
    });

    player.calculateStats();
    const updatedPlayer = await player.save();
    res.json(updatedPlayer);
  } catch (err) {
    console.error("Error adding match:", err);
    res.status(400).json({ message: "Error adding match" });
  }
});

// Получить статистику игрока
router.get("/:id/stats", async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(404).json({ message: "Игрок не найден" });
    }
    res.json(player.stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Удалить игрока
router.delete("/:id", async (req, res) => {
  try {
    const player = await Player.findByIdAndDelete(req.params.id);
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }
    res.json({ message: "Player deleted" });
  } catch (err) {
    console.error("Error deleting player:", err);
    res.status(500).json({ message: "Error deleting player" });
  }
});

module.exports = router;
