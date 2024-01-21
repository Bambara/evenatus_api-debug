const asyncHandler = require("express-async-handler");
const chalk = require("chalk");
const Game = require("../models/game.js");

/*const getAllGames = asyncHandler(async (req, res) => {
  try {
    await Game.find({ status: req.query.status })
      .then((result) => {
        if (result.length > 0) {
          res.status(200).json({ games: result });
        } else {
          res.status(404).json({ games: [] });
          console.error(chalk.yellow("Game not found"));
        }
      })
      .catch((error) => {
        console.error(chalk.red(error));
        res.status(500).json({ error: error });
      });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.toString() });
  }
});*/

const getGamesByIdList = asyncHandler(async (req, res) => {
  try {
    await Game.find({ _id: { $in: req["body"].ids } })
      .then((result) => {
        if (result.length > 0) {
          res.status(200).json({ games: result });
        } else {
          res.status(404).json({ games: [] });
        }
      })
      .catch((reason) => {
        throw reason;
      });
  } catch (e) {
    console.error(chalk.red(e));
    res.status(500).json({ error: e.toString() });
  }
});

const addNewGame = asyncHandler(async (req, res) => {
  try {
    const newGame = new Game({
      name: req["body"].name,
      poster: req["body"].poster,
      age_category: req["body"].age_category,
      publisher_id: req["body"].publisher_id,
      play_type: req["body"].play_type,
      player_type: req["body"].player_type,
      status: req["body"].status,
    });
    await newGame
      .save()
      .then(async (New_Game_List) => {
        if (New_Game_List !== null) {
          res.status(201).json({ New_Game_List });
        } else {
          res.status(500).json("Cannot Save");
        }
      })
      .catch((error) => {
        console.error(chalk.red(error));
        res.status(500).json({ error: error.toString() });
      });
  } catch (e) {
    console.error(chalk.red(error));
    res.status(500).json({ error: e.toString() });
  }
});

const getAllGames = asyncHandler(async (req, res) => {
  try {
    if (req["query"].status === "All") {
      await Game.find()
        .then((games) => {
          if (games !== null) {
            res.status(200).json({ games: games });
          } else {
            res.status(404).json("Games not found");
          }
        })
        .catch((error) => {
          console.error(chalk.red(error));
          res.status(500).json({ error: error.toString() });
        });
    } else {
      await Game.find({ status: req["query"].status })
        .then((games) => {
          if (games !== null) {
            res.status(200).json({ games: games });
          } else {
            res.status(404).json("Games not found");
          }
        })
        .catch((error) => {
          console.error(chalk.red(error));
          res.status(500).json({ error: error.toString() });
        });
    }
  } catch (e) {
    console.error(chalk.red(erroer));
    res.status(500).json({ error: e.toString() });
  }
});

const getGameByName = asyncHandler(async (req, res) => {
  try {
    await Game.find({ name: req["query"].name })
      .then((result) => {
        if (result.length > 0) {
          res.status(200).json({ games: result });
        } else {
          res.status(404).json({ games: [] });
        }
      })
      .catch((reason) => {
        throw reason;
      });
  } catch (e) {
    console.error(chalk.red(e));
    res.status(500).json({ error: e.toString() });
  }
});

module.exports = {
  getAllGames,
  getGamesByIdList,
  addNewGame,
  getGameByName,
};
