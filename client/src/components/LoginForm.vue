<template>
  <div class="login-container">
    <input v-model="user.email" type="email" placeholder="Email">
    <input v-model="user.password" type="password" placeholder="Mot de passe">
    <button @click="login">Se connecter</button>
    <router-link to="/forgot-password">Mot de passe oublié ?</router-link>
    
    <!-- Ajoutez votre loader ici. Il sera affiché lorsque isLoading est true. -->
    <div v-if="isLoading">Loading...</div>
    
    <!-- Message d'erreur ici -->
    <div v-if="errorMessage">{{ errorMessage }}</div>
  </div>
</template>

<script>
import axios from 'axios';


export default {
  data() {
    return {
      user: {
        email: '',
        password: '',
      },
      errorMessage: '',
      isLoading: false,
    };
  },
  methods: {
    async login() {
        this.isLoading = true;
        try {
            const response = await axios.post(`${process.env.VUE_APP_API_URL}/api/v1/users/login`, this.user);
            if (response.status === 200) {
                console.log(response.data);
                localStorage.setItem('token', response.data.token);
                console.log('Token stored:', localStorage.getItem('token'));
                this.$router.push('/home');
            }
        } catch (error) {
            this.errorMessage = error.response.data.message || 'Une erreur inconnue est survenue.';
        } finally {
            this.isLoading = false;
        }
    },
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 10px; 
}
</style>