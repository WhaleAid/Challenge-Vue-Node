<template>
    <div>
        <NavBar/>
        <h1>Bienvenue sur la page d'accueil !</h1>
        <div v-if="isAdmin==='false'">
            Utilisateur : {{status}}
        </div>

        <div v-if="status === 'base' && isAdmin===false">
            <button @click="goPremium">Passer premium</button>
        </div>
        
       <div v-if="isAdmin">
            <router-link to="/admin">Section administrateur</router-link>
        </div>

        <div style="border: 1px solid black">
            <div v-if="myGame">
                <div>{{ myGame }}</div> 
                <p>game</p>
            </div>

            <div v-else>
                {{ myGameMessage }}
            </div>
        </div>

        <div style="border: 1px solid black">
            <div v-if="gamesInProgress.length > 0">
            <h2>Parties en cours</h2>
            <div v-for="(game, index) in gamesInProgress" :key="index">
                {{ game }} <!-- Vous pouvez ajouter des détails supplémentaires ici. -->
            </div>
            </div>
            <div v-else>
                {{ gamesInProgressMessage }}
            </div>
        </div>

        <div style="border: 1px solid black">
            <h2>Mes victoires</h2>
            <p>Vous avez remporté {{ userWins }} partie(s).</p>
        </div>
        

        <div style="border: 1px solid black">
            <h2>Mes parties jouées</h2>
            <p>Vous avez joué à {{ userPlayedGames }} partie(s).</p>
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
import {loadStripe} from '@stripe/stripe-js';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
    components : 
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
            status : '',
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
            const response = await axios.get(`${process.env.VUE_APP_API_URL}/api/v1/users/me`, {headers});
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
    methods : {
        async goPremium() {
            try {
            const headers = {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            };
            const response = await axios.post(`${process.env.VUE_APP_API_URL}/api/v1/paiment/checkout-session`, {}, {headers});
            const session = response.data.session;

            // Redirige vers la page de paiement Stripe
            const stripe = await loadStripe(process.env.VUE_APP_STRIPE_PUBLIC_KEY);  
            console.log(stripe);
            stripe.redirectToCheckout({sessionId: session.id})
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
                alert('Erreur lors de l\'initialisation du paiement');
            }
        },
        async getMyGame() {
            try {
                const headers = {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                };
                const response = await axios.get(`${process.env.VUE_APP_API_URL}/api/v1/games/getMyGame`, {headers});
                console.log(response);
                if(response.data.game) {
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
                const response = await axios.get(`${process.env.VUE_APP_API_URL}/api/v1/games/getGamesInProgress`, {headers});
               
                if(response.data.games.length === [])
                {
                    this.gamesInProgress = response.data.games;
                }
                else
                {   
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
                const response = await axios.get(`${process.env.VUE_APP_API_URL}/api/v1/games/countUserWins`, {headers});
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
                const response = await axios.get(`${process.env.VUE_APP_API_URL}/api/v1/games/countUserPlayedGames`, {headers});
                this.userPlayedGames = response.data.userPlayedGames;
            } catch (error) {
                console.error(error);
                //alert('Erreur lors de la récupération du nombre de parties jouées');
                toast("Problème lors de la récupération du nombre total de parties jouées ..", {
                    autoClose: 2000,
                });
            }
        }
    }
}
</script>