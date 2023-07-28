// Importation des modules requis
const mongoose = require('mongoose')
const createError = require('http-errors')
const http = require('http')
const UserMg = require('../db/mongo/models/userModel')
const GameMg = require('../db/mongo/models/gameModel')
const CardMg = require('../db/mongo/models/cardModel')
const HandMg = require('../db/mongo/models/handModel')

// Fonction qui gère toutes les interactions de socket
module.exports = (io) => {
    // Écoute des connexions entrantes
    io.on('connection', (socket) => {
        console.log('New client connected') // Affiche un message lorsqu'un nouveau client se connecte
        socket.emit('connection', null) // Envoie un signal de connexion au client

        // Écoute de l'événement "playCard"
        socket.on('playCard', async ({ gameId, playerId, cardId }) => {
            try {
                // Obtenir le joueur, le jeu et la carte à partir des identifiants
                const id = gameId
                const userId = playerId
                const player = await UserMg.findById(userId)
                const game = await GameMg.findById(id).populate(
                    'discard currentCard'
                )

                // Validation des données entrantes et vérification des règles du jeu
                // Vérifie si le jeu et le joueur existent et sont valides
                // Vérifie si le tour est correct et la carte est valide
                // Supprime la carte de la main du joueur et l'ajoute à la pile de défausse

                // Handle special card effects
                // If card type is 'skip', 'reverse', 'draw2', 'draw4', 'wild' or 'number', handle their effects
                // If the deck is empty, shuffle the deck

                // Save the changes to the game, hand, and player
                await hand.save({ validateBeforeSave: false })
                await player.save({ validateBeforeSave: false })
                await game.save({ validateBeforeSave: false })

                // Emit an event to the client with the results
                socket.emit('playCardResponse', {
                    success: true,
                    message: 'Card played successfully',
                    card,
                })
            } catch (error) {
                // If there's an error, emit an error event to the client
                socket.emit('playCardResponse', {
                    success: false,
                    message: error.message,
                })
            }
        })

        // Écoute de l'événement "drawCard"
        socket.on('drawCard', async ({ playerId, gameId }) => {
            try {
                drawCard(playerId, gameId)
                socket.emit('drawCardResponse', {
                    success: true,
                    message: 'Card drawn successfully',
                })
            } catch (error) {
                socket.emit('drawCardResponse', {
                    success: false,
                    message: error.message,
                })
            }
        })

        // Écoute de l'événement "disconnect"
        socket.on('disconnect', () => {
            console.log('Client disconnected') // Affiche un message lorsqu'un client se déconnecte
        })
    })
}

// These functions handle the special effects of cards
// 'skipTurn' skips the current player's turn
// 'reverseOrder' changes the turn order of players
// 'drawTwo' makes the next player draw two cards
// 'drawFour' makes the next player draw four cards and changes the current color
// 'changeColor' changes the current color
// 'drawCard' adds a card from the deck to a player's hand
// 'endTurn' ends a player's turn and checks if they have won
// 'endGame' ends the game and updates the game status
// 'shuffle' shuffles the discarded cards back into the deck
