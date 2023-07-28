<template>
    <div>
        <NavBar />
        <h1>Welcome {{ firstName }} {{ lastName }}</h1>
        <div v-if="isAdmin === 'false'">
            Utilisateur : {{ status }}
        </div>

        <div v-if="status === 'base' && isAdmin === false">
            <button @click="goPremium">Passer premium</button>
        </div>

        <div v-if="isAdmin">
            <router-link to="/admin">Section administrateur</router-link>
        </div>

        <div class="create-game">
            <button @click="createGame">Créer une partie <font-awesome-icon icon="fa-solid fa-plus" /></button>
        </div>

        <div class="sections">
            <div class="section-dash">
                <div v-if="myGame">
                    <div>My game's ID {{ myGame._id }}</div>
                    <p>Active game <router-link :to="`/game/${myGame._id}`">Enter game</router-link> </p>
                </div>

                <div v-else>
                    {{ myGameMessage }}
                </div>
            </div>

            <div class="section-dash">
                <h2>Active games</h2>
                <div v-if="gamesInProgress.length > 0">
                    <div v-for="(game, index) in gamesInProgress" :key="index">
                        {{ game._id }}
                    </div>
                </div>
                <div v-else>
                    {{ gamesInProgressMessage }}
                </div>
            </div>

            <div class="section-dash">
                <h2>Winnings</h2>
                <p>You've won {{ userWins }} game(s).</p>
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
            myGame: null,
            myGameMessage: '',
            gamesInProgress: [],
            gamesInProgressMessage: '',
            userWins: 0,
            userPlayedGames: 0

        }
    },
    async created() {
        let token = localStorage.getItem('token');
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
            this.firstName = response.data.data.user.firstName;
            this.lastName = response.data.data.user.lastName;
            this.date_of_birth = response.data.data.user.date_of_birth;
            this.status = response.data.data.user.status;
            //console.log(response);
        } catch (error) {
            console.error(error);
            alert('Erreur lors de la récupération des informations du profil');
        }
        this.getMyGame();
        this.getGamesInProgress();
        this.getUserWins();
        this.getUserPlayedGames();
    },
    methods: {
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
                toast("Problème lors de la récupération de ma partie en cours..", {
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

                if (response.data.games.length === []) {
                    this.gamesInProgress = response.data.games;
                }
                else {
                    console.log("aucune game");
                    this.gamesInProgressMessage = "Aucune Game en cours";
                }
            } catch (error) {
                console.error(error);
                //alert('Erreur lors de la récupération des parties en attente');
                toast("Problème lors de la récupération des parties en cours..", {
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
                toast("Erreur lors de la récupération du nombre de victoires", {
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
                toast("Problème lors de la récupération du nombre total de parties jouées ..", {
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
                console.log(response)
                if (response.status === 200) {
                    this.$router.push(`/game/${response.data._id}`);
                }
                else if (response.status === 400) {
                    toast("Vous avez atteint la limite des parties créées. Passez en Premium pour en créer de nouvelles", {
                        autoClose: 2000,
                    });
                }
                else {
                    throw new Error();
                }
            } catch (error) {
                console.error(error);
                // Si la requête échoue, affichez un toast avec le message d'erreur
                toast("Problème lors de la création d'une nouvelle partie", {
                    autoClose: 2000,
                });
            }
        }
    }
}
</script>
<style>
h1 {
    text-align: left;
    margin-left: 20px;
}

.create-game {
    margin: 20px 0;
    display: flex;
    justify-content: flex-start;
    padding: 2em;
}

.create-game button {
    background-color: rgb(240, 106, 53);
    border: none;
    border-radius: 5px;
    padding: 10px 20px;
    color: white;
    font-size: 20px;
    font-weight: bold;
    cursor: pointer;
}

.sections {
    display: flex;
    justify-content: space-evenly;
    flex-wrap: wrap;
    gap: 20px;
}

.sections .section-dash {
    width: 300px;
    height: 200px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 16px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    padding: 1em;
}
</style>