<template>
    <div class="game-message" v-if="game.status === 'waiting'">
        <svg width="200px" height="200px" viewBox="0 0 1024 1024" class="icon" version="1.1"
            xmlns="http://www.w3.org/2000/svg">
            <path
                d="M704 256m-149.333333 0a149.333333 149.333333 0 1 0 298.666666 0 149.333333 149.333333 0 1 0-298.666666 0Z"
                fill="#BA68C8" />
            <path
                d="M704 149.333333c-58.816 0-106.666667 47.850667-106.666667 106.666667s47.850667 106.666667 106.666667 106.666667 106.666667-47.850667 106.666667-106.666667-47.850667-106.666667-106.666667-106.666667z"
                fill="#FFFFFF" />
            <path d="M704 256m-21.333333 0a21.333333 21.333333 0 1 0 42.666666 0 21.333333 21.333333 0 1 0-42.666666 0Z"
                fill="#263238" />
            <path d="M682.666667 170.666667h42.666666v85.333333h-42.666666z" fill="#263238" />
            <path d="M715.861333 238.250667l64 42.666666-23.658666 35.52-64-42.666666z" fill="#263238" />
            <path d="M298.666667 106.666667a85.333333 85.333333 0 1 1 0 170.666666 85.333333 85.333333 0 0 1 0-170.666666"
                fill="#FFB74D" />
            <path
                d="M394.624 661.354667a74.730667 74.730667 0 0 1-71.509333-53.226667l-64-213.333333a74.666667 74.666667 0 1 1 143.04-42.901334l64 213.333334a74.645333 74.645333 0 0 1-71.530667 96.128z"
                fill="#607D8B" />
            <path
                d="M682.624 917.333333a42.624 42.624 0 0 1-41.344-32.32L576 661.333333h-170.666667l42.666667-106.666666 170.666667 21.333333a42.666667 42.666667 0 0 1 41.386666 32.32l64 256A42.666667 42.666667 0 0 1 682.624 917.333333z"
                fill="#607D8B" />
            <path
                d="M501.354667 597.333333c-2.56 0-5.162667-0.32-7.786667-0.96l-170.666667-42.666666a32 32 0 0 1-23.274666-23.274667l-46.208-155.093333c-11.178667-42.453333 21.589333-71.36 75.477333-76.693334 0 0-23.658667 23.936-19.392 41.045334l47.552 156.565333 152.042667 38.016A32 32 0 0 1 501.354667 597.333333z"
                fill="#607D8B" />
            <path
                d="M357.056 496.277333l95.594667 23.893334-7.125334-23.786667-71.573333-17.877333-59.968-124.053334zM533.226667 565.333333c0 2.56-0.213333 5.162667-0.853334 7.765334a32 32 0 0 1-38.805333 23.274666l-170.666667-42.666666a31.850667 31.850667 0 0 1-22.506666-21.333334l11.989333 39.893334c1.813333 0.661333 3.456 1.664 5.376 2.154666l170.645333 42.666667a53.269333 53.269333 0 0 0 66.197334-49.088l-21.376-2.666667z"
                fill="#37474F" />
            <path
                d="M576 746.666667h-170.666667c-128 0-154.944-86.741333-160.277333-108.010667L151.210667 332.501333s83.968-27.008 106.368 56.256 70.741333 231.701333 70.741333 231.701334C328.448 620.629333 341.333333 661.333333 405.333333 661.333333h86.229334c85.333333 0 84.437333 85.333333 84.437333 85.333334z"
                fill="#FF9800" />
        </svg>
        <h1>This game has not started yet</h1>
        <div class="handle-game" v-if="game.owner._id === userId">
            <p> {{ game.players.length }} / 4 Players Joined</p>
            <button @click="startGame">Start game</button>
        </div>
    </div>
    <div class="game-message" v-if="game.status === 'ended'">
        <svg width="200px" height="200px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path opacity="0.5"
                d="M21 6.20766V11.4061C21 16.8106 16.761 19.4332 14.1014 20.5469C13.38 20.849 13.0193 21 12 21C10.9807 21 10.62 20.849 9.89856 20.5469C7.23896 19.4332 3 16.8106 3 11.4061V6.20766C3 4.05201 3 2.97418 3.70725 2.38442C4.4145 1.79467 5.49553 1.97202 7.6576 2.32673L8.71202 2.49971C10.3523 2.76881 11.1724 2.90336 12 2.90336C12.8276 2.90336 13.6477 2.76881 15.288 2.49971L16.3424 2.32673C18.5045 1.97202 19.5855 1.79467 20.2927 2.38442C21 2.97418 21 4.05201 21 6.20766Z"
                fill="#1C274C" />
            <path
                d="M7.17107 8.78309C7.29454 8.53986 7.75695 8.207 8.50016 8.207C9.24338 8.207 9.70579 8.53986 9.82926 8.78309C10.0144 9.14782 10.4649 9.29574 10.8354 9.11349C11.2059 8.93123 11.3562 8.48781 11.1711 8.12308C10.7123 7.21935 9.60365 6.73047 8.50016 6.73047C7.39668 6.73047 6.28804 7.21935 5.82926 8.12308C5.64411 8.48781 5.79439 8.93123 6.16492 9.11349C6.53544 9.29574 6.98591 9.14782 7.17107 8.78309Z"
                fill="#1C274C" />
            <path
                d="M15.5002 8.207C14.7569 8.207 14.2945 8.53986 14.1711 8.78309C13.9859 9.14782 13.5354 9.29574 13.1649 9.11349C12.7944 8.93123 12.6441 8.48781 12.8293 8.12308C13.288 7.21935 14.3967 6.73047 15.5002 6.73047C16.6037 6.73047 17.7123 7.21935 18.1711 8.12308C18.3562 8.48781 18.2059 8.93123 17.8354 9.11349C17.4649 9.29574 17.0144 9.14782 16.8293 8.78309C16.7058 8.53986 16.2434 8.207 15.5002 8.207Z"
                fill="#1C274C" />
            <path
                d="M7.99594 13.8125C7.696 14.0937 7.67123 14.5731 7.9569 14.8683C8.2402 15.1612 8.70946 15.1748 9.00977 14.9007L9.01531 14.896L9.02419 14.8888C9.02939 14.8846 9.03592 14.8795 9.04379 14.8734C9.06315 14.8586 9.09073 14.8384 9.12649 14.8143C9.22721 14.7463 9.39425 14.6462 9.63305 14.5429C10.1081 14.3373 10.8804 14.1131 12 14.1131C13.1196 14.1131 13.8919 14.3373 14.367 14.5429C14.6058 14.6462 14.7728 14.7463 14.8735 14.8143C14.9239 14.8483 14.9578 14.8743 14.9758 14.8888L14.9862 14.8973L14.9909 14.9014C15.2913 15.1748 15.76 15.1609 16.0431 14.8683C16.3288 14.5731 16.3172 14.1058 16.0172 13.8246L16.016 13.8234L16.0146 13.8221L16.0115 13.8192L16.0041 13.8125L15.9842 13.7949C15.9688 13.7815 15.9489 13.7647 15.9244 13.745C15.8754 13.7056 15.8081 13.6548 15.7218 13.5965C15.5491 13.4799 15.3005 13.3339 14.9706 13.1912C14.3081 12.9045 13.3304 12.6366 12 12.6366C10.6696 12.6366 9.69192 12.9045 9.02945 13.1912C8.6995 13.3339 8.45092 13.4799 8.2782 13.5965C8.19189 13.6548 8.1246 13.7056 8.07562 13.745C8.05113 13.7647 8.03121 13.7815 8.01576 13.7949L7.99594 13.8125Z"
                fill="#1C274C" />
        </svg>

        <h1>This game has ended</h1>
    </div>
    <div class="game-container" v-if="game.status === 'started'">
        <div class="game-board">
            <div class="opponents">
                <div class="player" v-if="players[1]">
                    <div class="player-name" v-if="players[1].username">
                        {{ players[1].username }}
                        <font-awesome-icon icon="fa-solid fa-user" v-show="isMyTurn(players[1]._id, game.turn)" />
                    </div>
                    <div class="cards-wrapper">
                        <div class="card" v-for="(card, index) of players[1].hand.cards" :key="card._id"
                            :style="{ transform: `translateX(${(index - players[1].hand.cards.length / 2) * 10}px)` }">
                            <CardBack />
                        </div>
                    </div>
                </div>
                <div class="player" v-if="players[2]">
                    <div class="player-name" v-if="players[2].username">
                        {{ players[2].username }}
                        <font-awesome-icon icon="fa-solid fa-user" v-show="isMyTurn(players[2]._id, game.turn)" />
                    </div>
                    <div class="cards-wrapper">
                        <div class="card" v-for="(card, index) of players[2].hand.cards" :key="card._id"
                            :style="{ transform: `translateX(${(index - players[2].hand.cards.length / 2) * 10}px)` }">
                            <CardBack />
                        </div>
                    </div>
                </div>
                <div class="player" v-if="players[3]">
                    <div class="player-name" v-if="players[3].username">
                        {{ players[3].username }}
                        <font-awesome-icon icon="fa-solid fa-user" v-show="isMyTurn(players[3]._id, game.turn)" />
                    </div>
                    <div class="cards-wrapper">
                        <div class="card" v-for="(card, index) of players[3].hand.cards" :key="card._id"
                            :style="{ transform: `translateX(${(index - players[3].hand.cards.length / 2) * 10}px)` }">
                            <CardBack />
                        </div>
                    </div>
                </div>
            </div>
            <Modal modalClass="modal-colors" title='Wild' mask v-model:visible="isVisible" offsetTop="25%">
                <h2>Choose your color !</h2>
                <div class="color-btns">

                    <button @click="selectColor('red')" :style="{ 'background-color': 'red' }">

                    </button>
                    <button @click="selectColor('green')" :style="{ 'background-color': 'green' }">

                    </button>
                    <button @click="selectColor('blue')" :style="{ 'background-color': 'blue' }">

                    </button>
                    <button @click="selectColor('yellow')" :style="{ 'background-color': 'yellow' }">

                    </button>
                </div>
            </Modal>
            <div class="game-table">
                <div class="game-table-wrapper">
                    <div class="card current" v-if="game.currentCard">
                        <CardComponent :color="game.currentCard.color" :value="game.currentCard.value"
                            :type="game.currentCard.type" />
                    </div>
                    <div class="current-color" v-if="game.currentColor" :style="{ backgroundColor: game.currentColor }">
                    </div>
                    <div class="card deck" @click="emitDraw">
                        <CardBack />
                    </div>
                </div>
                <div class="end-btn">
                    <button>
                        <font-awesome-icon icon="fa-solid fa-right-from-bracket" />
                    </button>
                </div>
                <p class="timer">
                    {{ $store.state.time }}
                </p>
            </div>
            <div class="bottom-player">
                <div class="player" v-if="players[0]">
                    <div class="strikes-container" v-if="players[0]?.hand?.inactive">
                        <font-awesome-icon icon="fa-solid fa-ban" />
                        {{ players[0]?.hand?.inactive }} Strikes / 3
                    </div>
                    <div class="player-name" v-if="players[0].username">
                        {{ players[0].username }}
                        <font-awesome-icon icon="fa-solid fa-user" v-show="isMyTurn(players[0]._id, game.turn)" />
                    </div>
                    <div class="cards-wrapper" v-if="players[0]?.hand?.cards">
                        <div class="card" v-for="(card, index) of players[0].hand.cards" :key="card._id"
                            :style="{ transform: `translateX(${(index - players[0].hand.cards.length / 2) * 35}px)` }">
                            <CardComponent :color="card.color" :value="card.value" :type="card.type"
                                @native-click="emitEvent(players[0]._id, game._id, card)" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import CardComponent from './cards/CardComponent.vue';
import CardBack from './cards/CardBack.vue';
import io from 'socket.io-client';
import { toast } from 'vue3-toastify';
import { Modal } from 'usemodal-vue3';

export default {
    computed: {
        time() {
            return this.$store.state.time;
        }
    },
    watch: {
        time(value) {
            if (value === 0) {
                this.$store.commit('stopTimer');
                this.emitDraw(true)
                this.$store.commit('resetTime');
            }
        }
    },
    components: {
        CardComponent,
        CardBack,
        Modal
    },
    data() {
        return {
            game: {},
            players: [{}],
            isLoading: false,
            errorMessage: null,
            socket: null,
            userId: null,
            isVisible: false,
            selectedCard: null,
            indexes: [{}]
        }
    },
    async created() {
        this.userId = JSON.parse(localStorage.getItem('user'))._id;
        await this.getGame();
        this.$store.dispatch('startTimer');
        this.socket = io(process.env.VUE_APP_API_URL);
        this.socket.on('connection', () => {
            this.getGame()
        })
        this.socket.on('startGameResponse', (response) => {
            if (response.success) {
                this.getGame();
            } else {
                toast.error(response.message, {
                    autoClose: 3000,
                });
            }
        })
        this.socket.on('playCardResponse', (response) => {
            if (response.success) {
                this.getGame();
                this.$store.dispatch('startTimer');
            } else {
                toast.error(response.message, {
                    autoClose: 3000,
                });
            }
        })
        this.socket.on('drawCardResponse', (response) => {
            if (response.success) {
                this.getGame();
            } else {
                toast.error(response.message, {
                    autoClose: 3000,
                });
            }
        })
    },
    beforeUnmount() {
        this.$store.commit('stopTimer');
    },
    methods: {
        async getGame() {
            this.isLoading = true;
            try {
                const token = localStorage.getItem('token');
                const headers = {
                    'Authorization': 'Bearer ' + token,
                };

                const response = await axios.get(`${process.env.VUE_APP_API_URL}/api/v1/games/${this.$route.params.id}`, { headers });
                const responseData = response.data.data;
                this.game = responseData.game;

                this.indexes = responseData.players.map((player, index) => ({
                    id: player._id,
                    index: index
                }))
                const userPlayer = responseData.players.find(player => player._id === this.userId);
                if (userPlayer) {
                    const otherPlayers = responseData.players.filter(player => player._id !== this.userId);
                    this.players = [userPlayer, ...otherPlayers];
                } else {
                    this.players = response.players;
                }
                console.log(responseData);
                if (response.status === 200) {
                    this.game = response.data.data.game;
                } else {
                    this.errorMessage = response.data.message;
                }
            } catch (error) {
                if (error.response && error.response.data && error.response.data.message) {
                    this.errorMessage = error.response.data.message;
                } else {
                    this.errorMessage = 'Une erreur est survenue, veuillez réessayer plus tard.';
                }
            } finally {
                this.isLoading = false;
            }
        },
        emitEvent(playerId, gameId, card) {
            if (card.type === 'wild' || card.type === 'draw4') {
                this.selectedCard = card;
                this.isVisible = true;
            } else if (card.type === 'reverse' || card.type === 'draw2' || card.type === 'skip'
                || card.type === 'number') {
                this.socket.emit('playCard', { gameId: gameId, playerId: playerId, cardId: card._id });
            }
        },
        selectColor(color) {
            this.isVisible = false;
            this.socket.emit('playCard', { gameId: this.game._id, playerId: this.userId, cardId: this.selectedCard, color });
        },
        emitDraw(inactive) {
            if (inactive) {
                this.players.forEach(player => {
                    if (this.isMyTurn(player._id, this.game.turn)) {
                        this.socket.emit('drawCard', { playerId: player._id, gameId: this.game._id, inactive });
                    }
                })
            } else {
                this.socket.emit('drawCard', { playerId: this.userId, gameId: this.game._id });
            }
        },
        isMyTurn(playerId, turn) {
            const player = this.indexes.find(index => index.id === playerId);

            if (player && player.index === turn) {
                return true;
            }

            return false;
        },
        startGame() {
            this.socket.emit('startGame', { gameId: this.game._id, playerId: this.userId });
        }
    }
}
</script>
<style scoped>
@keyframes gradient {
    0% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0% 50%;
    }
}

@keyframes flip {
    0% {
        transform: rotateY(0deg);
    }

    50% {
        transform: rotateY(180deg);
    }

    100% {
        transform: rotateY(360deg);
    }
}

.end-btn {
    transform: translateY(90px);
    position: absolute;
}

.end-btn button {
    cursor: pointer;
    background-color: #fe6368;
    padding: 5px 20px;
    border-radius: 15px;
    border: 0px;
    color: white;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
    transition: all 0.2s ease-in-out;
}

.game-message {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.game-message button {
    cursor: pointer;
    background-color: #fe6368;
    padding: 5px 20px;
    border-radius: 15px;
    border: 0px;
    color: white;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
    transition: all 0.2s ease-in-out;
}

.game-message button:hover {
    background-color: #fa121a;
    transition: all 0.2s ease-in-out;
}

.end-btn button:hover {
    background-color: #fa121a;
    transition: all 0.2s ease-in-out;
}

.timer {
    position: absolute;
    background-color: white;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 700;
    transform: translateY(-90px);
}

.strikes-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: auto;
    margin-bottom: 5px;
    padding: 5px 10px;
    border-radius: 10px;
    gap: 5px;
    width: fit-content;
    background-color: white;
}

.strikes-container svg {
    color: red;
    font-size: 20px;
}

.modal-colors .modal-vue3-content {
    background-color: #f5f5f500 !important;
}

.modal-colors button {
    height: 50px;
    width: 50px;
    border-radius: 50%;
}

.color-btns {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
}

.flip-animation {
    animation: flip 3s infinite;
}

.game-container {
    margin: auto;
    max-width: 100vw;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-size: 200% 200%;
    background-image: linear-gradient(45deg, #f41219 0%, #ffb164 50%, #f4f420 100%);
    animation: gradient 10s ease infinite;
}

.game-board {
    display: flex;
    flex-direction: column;
    width: 100%;
    justify-content: center;
    align-items: center;
    margin: auto;
    overflow: hidden;
    gap: 30px;
}

.game-table {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
}

.game-table-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 200px;
    margin: auto;
    gap: 30px;
}

.current-color {
    border-radius: 50%;
    width: 40px;
    height: 40px;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;
}

.card {
    width: 100px;
    height: 150px;
    border-radius: 10px;
    position: absolute;
    background-color: white;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    display: flex;
    justify-content: center;
    align-items: center;
    scale: 1;
    transition: all 0.2s ease-in-out;
}

.current,
.deck {
    width: 150px;
    height: 200px;
    position: relative;
}

.deck {
    cursor: pointer;
}

.bottom-player {
    position: relative;
    height: 230px;
    width: 100%;
}

.bottom-player .card:hover {
    scale: 1.1 !important;
    transition: all 0.2s ease-in-out;
    cursor: pointer;
    z-index: 10;
}

.opponents {
    display: flex;
    justify-content: space-evenly;
    gap: 20px;
    position: relative;
    gap: 30px;
    width: 100%;
    height: 230px;
}

.middle-section {
    grid-area: middle-section;
    display: grid;
    grid-template-columns: 1fr 3fr 1fr;
    justify-content: space-between;
    align-items: center;
}

.right-player {
    transform: rotate(90deg);
}

.player {
    height: inherit;
}

.player .player-name {
    font-size: 20px;
    margin-bottom: 10px;
    font-weight: 700;
    padding: 5px 10px;
    margin: auto;
    width: fit-content;
    backdrop-filter: blur(10px);
    background-color: rgba(255, 255, 255, 0.556);
    border-radius: 10px;
}

.player .cards-wrapper {
    position: relative;
    display: flex;
    padding-top: 10px;
    min-width: 400px;
    height: 75%;
    justify-content: center;
    padding: 10px 50px;
}

/* This is the track of the scrollbar */
.player .cards-wrapper::-webkit-scrollbar-track {
    border-radius: 10px;
    background-color: #F5F5F5;
}

/* This is the handle of the scrollbar */
.player .cards-wrapper::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: #F90;
    background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, .2) 25%, transparent 25%,
            transparent 50%, rgba(255, 255, 255, .2) 50%,
            rgba(255, 255, 255, .2) 75%, transparent 75%,
            transparent)
}

.player .cards-wrapper::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}
</style>