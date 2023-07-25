<template>
    <div>
        <NavBar/>
        <h1>Bienvenue sur la page d'accueil !</h1>
        
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

export default {
    components : 
    {
        NavBar
    },
    data() {
        return {
            isAdmin: false,
            isAuthenticated: false
        }
    },
    created() {
        let token = localStorage.getItem('token');
        if (token) {
            let decodedToken = jwtDecode(token);
            this.isAuthenticated = true;
            if (decodedToken.role === 'admin') {
                this.isAdmin = true;
        }
    }
    }
}
</script>