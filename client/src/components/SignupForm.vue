<template>
  <div class="signup-container">

    <input v-model="user.firstName" placeholder="Prénom">
    <input v-model="user.lastName" placeholder="Nom">
    <input v-model="user.email" type="email" placeholder="Email">
    <input v-model="user.password" type="password" placeholder="Mot de passe">
    <input v-model="user.passwordConfirm" type="password" placeholder="Confirmer le mot de passe">
    <button @click="signup">S'inscrire</button>
    
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
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        passwordConfirm: '',
      },
      errorMessage: '',
      isLoading: false,
    };
  },
  methods: {
    async signup() {
      this.isLoading = true;
      try {
        const response = await axios.post(`${process.env.VUE_APP_API_URL}/api/v1/users/signup`, this.user);
        
        // La requête a réussi, rediriger l'utilisateur vers la page d'accueil
        if (response.status === 201) {
          this.$router.push({ name: 'HomePage' });
        } else {
          // Gérer les autres codes de statut ici si nécessaire
          this.errorMessage = response.data.message;
        }
      } catch (error) {
        // Gérer les erreurs ici
        if (error.response && error.response.data && error.response.data.message) {
          this.errorMessage = error.response.data.message;
        } else {
          this.errorMessage = 'Une erreur est survenue, veuillez réessayer plus tard.';
        }
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>


<style scoped>
.signup-container {
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 10px; /* Ajustez l'espace entre les éléments ici */
}
</style>