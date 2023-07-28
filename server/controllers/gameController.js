const express = require('express')
const createError = require('http-errors')
const mongoose = require('mongoose')

const UserMg = require('../db/mongo/models/userModel')
const HandMg = require('../db/mongo/models/handModel')
const GameMg = require('../db/mongo/models/gameModel')
const CardMg = require('../db/mongo/models/cardModel')

const getAll = async (req, res, next) => {
    try {
        const games = await GameMg.find({})
        return res.status(200).send(games)
    } catch (error) {
        return next(createError(500, error.message))
    }
}

const create = async (req, res, next) => {
    try {
        const userId = req.user._id
        const { players } = req.body

        const user = await UserMg.findById(userId)
        if (!user) {
            return next(createError(404, 'user not found'))
        }

        if (user.games.length >= 5 && user.status == 'base') {
            return next(createError(400, 'game limit reached'))
        }

        let discard = []
        const deck = await CardMg.find({})
        const numberCards = await CardMg.find({ type: 'number' })
        const randomIndex = Math.floor(Math.random() * numberCards.length)
        const currentCard = numberCards[randomIndex]
        discard.push(currentCard)

        const game = await GameMg.create({
            players: [userId, ...players],
            owner: userId,
            deck: deck.filter(
                (card) => card._id.toString() !== currentCard._id.toString()
            ),
            discard: discard,
            currentCard: currentCard,
            status: 'waiting',
        })

        user.games.push(game._id)
        await user.save({ validateBeforeSave: false })
        return res.status(201).send(game)
    } catch (error) {
        return next(createError(500, error.message))
    }
}

const startGame = async (req, res, next) => {
    try {
        const { id } = req.params
        const userId = req.user._id

        const user = await UserMg.findById(userId)
        if (!user) {
            return next(createError(404, 'user not found'))
        }

        const game = await GameMg.findById(id).populate('players')
        if (!game) {
            return next(createError(404, 'game not found'))
        }

        if (game.owner.toString() !== userId.toString()) {
            return next(createError(403, 'only the owner can start the game'))
        }

        if (game.status === 'ended') {
            return next(createError(400, 'game already ended'))
        }

        if (game.status === 'started') {
            return next(createError(400, 'game already started'))
        }

        game.status = 'started'
        game.turn = 0
        game.direction = 'clockwise'
        game.players = game.players.sort(() => Math.random() - 0.5)

        for (let i = 0; i < game.players.length; i++) {
            const player = await UserMg.findById(game.players[i])

            const hand = await HandMg.create({
                player: player._id,
                cards: [],
                game: game._id,
            })

            for (let j = 0; j < 7; j++) {
                const randomIndex = Math.floor(Math.random() * game.deck.length)
                const card = game.deck[randomIndex]
                hand.cards.push(card)
                game.deck.splice(randomIndex, 1)
            }

            await hand.save({ validateBeforeSave: false })
            await player.save({ validateBeforeSave: false })
        }

        await game.save({ validateBeforeSave: false })
        return res.status(200).send(game)
    } catch (error) {
        return next(createError(500, error.message))
    }
}

const getGamesInProgress = async(req,res,next) =>{
    console.log("get games in progress endpoint");
    try {
        const games = await GameMg.find({
            status: 'waiting',
            players: {
                $nin: [new mongoose.Types.ObjectId(req.user._id)]
            }
        });
        console.log("Games : ", games);
        res.json({games: games || []});
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: 'error',
            message: "Une erreur s'est produite lors de la récupération des jeux",
            details: err.message
        });
    }
    
}

const getMyGame = async(req,res)=>{
    console.log("get my game status");
    const ObjectId = mongoose.Types.ObjectId;
    try {
        const game = await GameMg.findOne({
            status: 'started',
            players: new ObjectId(req.user._id)
        });
        console.log("game : ", game);
        if (game) {
            res.json({
                game
            });
        } else {
            res.json({
                message: "Aucune partie commencée trouvée pour cet utilisateur"
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: 'error',
            message: "Une erreur s'est produite lors de la récupération du jeu",
            details: err.message
        });
    }
}

const countUserWins = async(req,res)=>{
    console.log("get user wins count");
    try {
        const userId = new mongoose.Types.ObjectId(req.user._id);

        const result = await GameMg.aggregate([
            {
                $match: {
                    winner: userId
                }
            },
            {
                $count: "userWins"
            }
        ]);

        res.json(result[0] || {userWins: 0});

    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: 'error',
            message: "Une erreur s'est produite lors du comptage des victoires de l'utilisateur",
            details: err.message
        });
    }
}

const countUserPlayedGames = async(req,res)=>{
    console.log("count user played games endpoints");
    const userId = req.user._id;
    
    try {
        const result = await UserMg.aggregate([
            
            { $match: { _id: new mongoose.Types.ObjectId(userId) } },
            
            { $unwind: "$games" },
            
            { $match: { "games.status": "ended" } },
           
            { $count: "userPlayedGames" }
        ]);

        let count = 0;
        if(result.length > 0){
            count = result[0].userPlayedGames;
        }

        res.json({ userPlayedGames: count });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            status: 'error',
            message: "Une erreur s'est produite lors de la récupération des jeux joués par l'utilisateur",
            details: err.message
        });
    }
}

module.exports = {
    getAll,
    create,
    startGame,
    getGamesInProgress,
    getMyGame,
    countUserWins,
    countUserPlayedGames
}
