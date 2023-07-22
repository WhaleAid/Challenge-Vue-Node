const express = require("express");
const createError = require("http-errors");
const mongoose = require("mongoose");

const UserMg = require("../db/mongo/models/userModel");
const UserPg = require("../db/postGres/models/userPostgresModel");
const CardMg = require("../db/mongo/models/cardModel");
const CardPg = require("../db/postGres/models/cardPostgresModel");
const GameMg = require("../db/mongo/models/gameModel");
const GamePg = require("../db/postGres/models/gamePostgresModel");
const HandMg = require("../db/mongo/models/handModel");
const HandPg = require("../db/postGres/models/handPostgresModel");


getAll = async (req, res, next) => {
  try {
    const games = await GameMg.find({});
    res.send(games);
  } catch (error) {
    console.log(error.message);
  }
};

const create = async (req, res, next) => {
  const userId = req.user._id;
  const { players } = req.body;

  const user = await UserMg.findById(userId);
  if (!user) {
    return next(createError(404, "user not found"));
  }
  if (user.games.length >= 5 && user.status == "base") {
    return next(createError(400, "user already has 5 games"));
  }

  try {
    let discard = [];
    const deck = await CardMg.find({});
    const numberCards = await CardMg.find({ type: "number" });
    const randomIndex = Math.floor(Math.random() * numberCards.length);
    const currentCard = numberCards[randomIndex];
    discard.push(currentCard);

    const game = await GameMg.create({
      players: [userId, players],
      deck: deck.filter(
        (card) => card._id.toString() !== currentCard._id.toString()
      ),
      discard: discard,
      owner: userId,
      status: "waiting",
      currentCard: currentCard,
    });

    user.games.push(game._id);
    await user.save({ validateBeforeSave: false });
    res.send(game);
  } catch (error) {
    console.log(error.message);
  }
};

const startGame = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;

  const user = await UserMg.findById(userId);
  if (!user) {
    return next(createError(404, "user not found"));
  }
  const game = await GameMg.findById(id).populate({
    path: "players",
    populate: {
        path: "hand",
        populate: {
            path: "cards",
        },
    },
  });
  if (!game) {
    return next(createError(404, "game not found"));
  }

  try {
    if (game.status == "waiting" && game.owner.toString() == userId.toString()) {
      game.status = "started";
      game.turn = 0;
      game.direction = "clockwise";
      game.players = game.players.sort(() => Math.random() - 0.5);
      game.players.forEach(async (player) => {
        const hand = await HandMg.create({
            cards: [],
        });
        player.hand = hand._id;
        for (let i = 0; i < 7; i++) {
          const randomIndex = Math.floor(Math.random() * game.deck.length);
          const card = game.deck[randomIndex];
          player.hand.cards.push(card);
          game.deck.splice(randomIndex, 1);
        }
        await player.save({ validateBeforeSave: false });
        await game.save({ validateBeforeSave: false });
      });

      res.send(game);
    } else {
      return next(createError(400, "game already started"));
    }
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  getAll,
  create,
  startGame,
};
