<template>
    <div>
        <NavBar/>
        <h1>Bienvenue sur la page d'accueil !</h1>
        <div v-if="isAdmin==='false'">
            Utilisateur : {{status}}
        </div>

        <div v-if="status === 'base' && isAdmin==='false'">
            <button @click="goPremium">Passer premium</button>
        </div>
        
       <div v-if="isAdmin">
            <router-link to="/admin">Section administrateur</router-link>
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
            status : ''

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
        }
    }
}
</script>