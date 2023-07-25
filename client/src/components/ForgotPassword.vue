<template>
  <div class="forgot-password-container">
    <input v-model="user.email" type="email" placeholder="Email">
    <button @click="forgotPassword">Réinitialiser le mot de passe</button>

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
      },
      errorMessage: '',
      isLoading: false,
    };
  },
  methods: {
    async forgotPassword() {
      this.isLoading = true;
      try {
        const response = await axios.post(`${process.env.VUE_APP_API_URL}/api/v1/users/forgotPassword`, this.user);
        if (response.status === 200) {
          console.log(response.data);
          this.errorMessage = 'Un lien de réinitialisation de mot de passe a été envoyé à votre adresse e-mail.';
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
.forgot-password-container {
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 10px;
}
</style>