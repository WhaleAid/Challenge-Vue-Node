<template>
    <div>
        <NavBar />
        <h1>
            Welcome {{ firstName }} {{ lastName }}
            <span class="premium" v-if="status === 'premium'">
                <font-awesome-icon icon="fa-solid fa-star" />
            </span>
            <div class="youre-premium">
                <p>Vous êtes premium</p>
            </div>
        </h1>
        <div v-if="isAdmin === 'false'">
            Utilisateur : {{ status }}
        </div>

        <div class="payment" v-if="status === 'base' && isAdmin === false">
            <button @click="goPremium">Passer premium</button>
        </div>

        <div class="admin-link" v-if="isAdmin">
            <router-link to="/admin">Section administrateur</router-link>
        </div>

        <div class="create-game">
            <button @click="createGame">Créer une partie <font-awesome-icon icon="fa-solid fa-plus" /></button>
        </div>

        <div class="sections">
            <div class="section-dash">
                <div class="mygames-listing" v-if="myGame">
                    <div class="">Game is {{ myGame.status }}</div>
                    <p>{{ truncateId(myGame._id) }} <router-link :to="`/game/${myGame._id}`">
                            <font-awesome-icon icon="fa-solid fa-circle-chevron-right" />
                        </router-link> </p>
                </div>

                <div v-else>
                    {{ myGameMessage }}
                </div>
            </div>

            <div class="section-dash">
                <h2>Active games</h2>
                <div class="games-list" v-if="gamesInProgress.length > 0">
                    <div v-for="(game, index) in gamesInProgress" :key="index" class="game-listing">
                        <p>
                            {{ game.owner.firstName }}'s game
                        </p>
                        <button @click="joinGame(game._id)">Join game</button>
                    </div>
                </div>
                <div v-else>
                    {{ gamesInProgressMessage }}
                </div>
            </div>

            <div class="section-dash">
                <h2>Winnings</h2>
                <p>You've won {{ userWins }} game(s).</p>
                <p>Winning streak : {{ consecutiveWins }}</p> <img
                    src="https://media.tenor.com/8McIGu0Tf_QAAAAi/fire-joypixels.gif" alt="fire" width="20px">
            </div>


            <div class="section-dash">
                <h2>History</h2>
                <p>You've played {{ userPlayedGames }} game(s).</p>
            </div>

        </div>
        <!-- <div v-if="isAuthenticated">
            <router-link to="/profile">Voir mon profil</router-link>
        </div> -->

    </div>
</template>

<script>
import jwtDecode from 'jwt-decode';
import NavBar from './NavBar.vue';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import io from 'socket.io-client';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
    components:
    {
        NavBar
    },
    data() {
        return {
            isAdmin: false,
            isAuthenticated: false,
            firstName: '',
            lastName: '',
            date_of_birth: '',
            status: '',
            banned: false,
            myGame: null,
            myGameMessage: '',
            gamesInProgress: [],
            gamesInProgressMessage: '',
            userWins: 0,
            userPlayedGames: 0,
            consecutiveWins: 0,
        }
    },
    async created() {
        let token = localStorage.getItem('token');
        this.socket = io(process.env.VUE_APP_API_URL);
        if (token) {
            let decodedToken = jwtDecode(token);
            this.isAuthenticated = true;
            if (decodedToken.role === 'admin') {
                this.isAdmin = true;
            }
        }
        const headers = {
            'Authorization': 'Bearer ' + token
        };
        try {
            const response = await axios.get(`${process.env.VUE_APP_API_URL}/api/v1/users/me`, { headers });
            this.userId = response.data.data.user._id;
            this.firstName = response.data.data.user.firstName;
            this.lastName = response.data.data.user.lastName;
            this.date_of_birth = response.data.data.user.date_of_birth;
            this.status = response.data.data.user.status;
            this.banned = response.data.data.user.banned;
            this.consecutiveWins = response.data.data.user.consecutiveWins;
            if (this.banned) {
                try {
                    const response = await axios.get(process.env.VUE_APP_API_URL + '/api/v1/users/logout');
                    if (response.data.status === 'success') {
                        // Remove JWT token from localStorage
                        localStorage.removeItem('token');
                        // Redirect to login page
                        this.$router.push('/');
                    }
                } catch (error) {
                    console.error('Error during logout:', error);
                }
            }
            console.log(response.data.data.user)
            //console.log(response);
        } catch (error) {
            console.error(error);
            toast('Erreur lors de la récupération des informations du profil', {
                autoClose: 2000,
            });
        }
        this.socket.on('createGameResponse', (response) => {
            console.log('createGameResponse', response)
            if (response.success) {
                this.getGamesInProgress();
            } else {
                toast.error(response.message, {
                    autoClose: 3000,
                });
            }
        });
        this.socket.on('joinGameResponse', (response) => {
            console.log('joinGameResponse', response)
            if (response.success) {
                this.$router.push(`/game/${response.gameId}`);
            } else {
                toast.error(response.message, {
                    autoClose: 3000,
                });
            }
        });
        this.getMyGame();
        this.getGamesInProgress();
        this.getUserWins();
        this.getUserPlayedGames();
    },
    methods: {
        truncateId(id) {
            return id.substr(0, 7);
        },
        async goPremium() {
            try {
                const headers = {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                };
                const response = await axios.post(`${process.env.VUE_APP_API_URL}/api/v1/paiment/checkout-session`, {}, { headers });
                const session = response.data.session;

                // Redirige vers la page de paiement Stripe
                const stripe = await loadStripe(process.env.VUE_APP_STRIPE_PUBLIC_KEY);
                console.log(stripe);
                stripe.redirectToCheckout({ sessionId: session.id })
                    .then((result) => {
                        if (result.error) {
                            // Si redirectToCheckout échoue en raison d'une erreur (par exemple, parce que le réseau est en panne),
                            // l'affiche dans le bloc catch.
                            console.error(result.error.message);
                            this.$router.push('/paiement-fail');
                        }
                    })
            } catch (error) {
                console.error(error);
                // alert('Erreur lors de l\'initialisation du paiement');

                toast("Erreur lors de l'initialisation du paiement", {
                    autoClose: 2000,
                });
            }
        },
        async getMyGame() {
            try {
                const headers = {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                };
                const response = await axios.get(`${process.env.VUE_APP_API_URL}/api/v1/games/getMyGame`, { headers });
                console.log(response);
                if (response.data.game) {
                    this.myGame = response.data.game;
                    this.myGameMessage = "";
                    console.log(response);
                    // console.log(this.myGameMessage);
                } else {
                    this.myGameMessage = response.data.message;
                }
            } catch (error) {
                console.error(error);
                //alert('Erreur lors de la récupération de ma partie');
                toast(error, {
                    autoClose: 2000,
                });
            }
        },
        async getGamesInProgress() {
            try {
                const headers = {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                };
                const response = await axios.get(`${process.env.VUE_APP_API_URL}/api/v1/games/getGamesInProgress`, { headers });

                if (response.data.games.length !== []) {
                    this.gamesInProgress = response.data.games;
                }
                else {
                    console.log("aucune game");
                    this.gamesInProgressMessage = "Aucune Game en cours";
                }
            } catch (error) {
                console.error(error);
                //alert('Erreur lors de la récupération des parties en attente');
                toast(error, {
                    autoClose: 2000,
                });
            }
        },
        async getUserWins() {
            try {
                const headers = {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                };
                const response = await axios.get(`${process.env.VUE_APP_API_URL}/api/v1/games/countUserWins`, { headers });
                this.userWins = response.data.userWins;
            } catch (error) {
                console.error(error);
                //alert('Erreur lors de la récupération du nombre de victoires');
                toast(error, {
                    autoClose: 2000,
                });
            }
        },
        async getUserPlayedGames() {
            try {
                const headers = {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                };
                const response = await axios.get(`${process.env.VUE_APP_API_URL}/api/v1/games/countUserPlayedGames`, { headers });
                this.userPlayedGames = response.data.userPlayedGames;
            } catch (error) {
                console.error(error);
                //alert('Erreur lors de la récupération du nombre de parties jouées');
                toast(error, {
                    autoClose: 2000,
                });
            }
        },
        async createGame() {
            try {
                const headers = {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                };
                const response = await axios.post(`${process.env.VUE_APP_API_URL}/api/v1/games`, {}, { headers });
                // Si la requête est réussie, redirigez vers la nouvelle page de jeu avec l'ID de la partie retourné par l'API
                if (response.status === 200) {
                    console.log(response);
                    this.$router.push(`/game/${response.data._id}`);
                    this.socket.emit('createGame')
                }

                else if (response.status === 400) {
                    toast("cannot create game", {
                        autoClose: 2000,
                    });
                }
                else {
                    throw new Error();
                }
            } catch (error) {
                console.error(error);
                // Si la requête échoue, affichez un toast avec le message d'erreur
                toast("Game already in progress", {
                    autoClose: 2000,
                });
            }
        },
        async joinGame(gameId) {
            console.log('usreid', this.userId)
            this.socket.emit('joinGame', { gameId: gameId, playerId: this.userId });
        }
        // async joinGame(gameId) {
        //     try {
        //         const headers = {
        //             'Authorization': 'Bearer ' + localStorage.getItem('token')
        //         };
        //         const response = await axios.patch(`${process.env.VUE_APP_API_URL}/api/v1/users/joingame/${gameId}`, {}, { headers });
        //         if (response.status === 200) {
        //             this.$router.push(`/game/${gameId}`);
        //         }
        //     }
        //     catch (error) {
        //         if (error.response && error.response.status === 400) {
        //             // Afficher le message d'erreur provenant du serveur
        //             toast(error.response.data.message, {
        //                 autoClose: 2000,
        //             });
        //         }
        //         else {
        //             toast("Erreur serveur", {
        //                 autoClose: 2000,
        //             });
        //         }
        //         console.error(error);
        //     }
        // },
    }
}
</script>
<style>
h1 {
    text-align: left;
    margin-left: 20px;
    display: flex;
    align-items: center;

}

.create-game {
    margin: 20px 0;
    display: flex;
    justify-content: flex;
    padding: 2em;
}

.create-game button {
    background-color: rgb(192, 10, 10);
    border: none;
    border-radius: 5px;
    padding: 10px 20px;
    color: white;
    font-size: 20px;
    font-weight: bold;
    cursor: pointer;
    transition: all .2s ease-in-out;
}

.create-game button:hover {
    background-color: rgb(252, 9, 9);
    opacity: .8;
    transition: all .2s ease-in-out;
}

.premium {
    color: gold;
    font-size: 20px;
    margin-left: 10px;
}

.youre-premium {
    display: none;
    background-color: rgba(26, 25, 25, 0.498);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 5px;
    padding: 0px 10px;
    font-size: 14px;
    margin: 0;
    height: fit-content;
    margin-left: 10px;
}

.youre-premium p {
    margin: 5px 0;
}

.premium:hover+.youre-premium {
    display: block;
}

.sections {
    display: flex;
    justify-content: space-evenly;
    flex-wrap: wrap;
    margin: auto;
    gap: 20px;
}

.admin-link {
    margin: 0 30px;
    display: flex;
    justify-content: flex-start;
}

.admin-link a {
    text-decoration: none;
    background-color: black;
    padding: 10px 20px;
    border-radius: 5px;
    color: white;
    font-size: 20px;
    font-weight: bold;
}

.sections .section-dash {
    width: 300px;
    height: 300px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 16px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    padding: 1em;
}

.payment {
    display: flex;
    margin: 20px 0;
    justify-content: center;
    align-items: flex-start;
    padding: 0 0 0 2em;
    flex-direction: column;
    gap: 20px;
}

.payment button {
    background-color: rgb(192, 10, 10);
    border: none;
    border-radius: 5px;
    padding: 10px 20px;
    color: white;
    font-size: 20px;
    font-weight: bold;
    cursor: pointer;
}

.payment button:hover {
    background-color: rgb(252, 9, 9);
    opacity: 0.8;
}

.games-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    overflow-y: scroll;
    padding-right: 10px;
}

.games-list::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

.games-list::-webkit-scrollbar-track {
    border-radius: 10px;
    background-color: #F5F5F5;
}

.games-list::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: #F90;
    background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, .2) 25%, transparent 25%,
            transparent 50%, rgba(255, 255, 255, .2) 50%,
            rgba(255, 255, 255, .2) 75%, transparent 75%,
            transparent)
}

.games-list::-webkit-scrollbar-thumb:hover {
    background: #f7791f;
}

.game-listing {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 30px;
}

.game-listing p {
    font-size: 18px;
    font-weight: bold;
    margin: 0;
}

.game-listing button {
    background-color: rgb(192, 10, 10);
    border: none;
    border-radius: 5px;
    padding: 10px 20px;
    color: white;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
}

.game-listing button:hover {
    background-color: rgb(252, 9, 9);
    opacity: 0.8;
}

.mygames-listing {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 30px;
    background-color: rgba(255, 255, 255, 0.285);
    backdrop-filter: blur(5px);
    padding: 10px;
    border-radius: 10px;
    width: 100%;
}

.mygames-listing p {
    font-size: 18px;
    font-weight: bold;
    margin: 0;
}

.mygames-listing a {
    text-decoration: none;
    color: orangered;
}
</style>