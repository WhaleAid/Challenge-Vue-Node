<template>
  <div className="forgot-password-container">
    <input v-model.trim="user.email" type="email" placeholder="Email">
    <button :disabled="isLoading" @click="forgotPassword">Réinitialiser le mot de passe</button>

    <div v-if="isLoading">Loading...</div>
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
      if (!this.user.email) {
        this.errorMessage = 'Veuillez entrer un email valide.';
        return;
      }

      this.isLoading = true;
      this.errorMessage = '';

      axios.post(`${process.env.VUE_APP_API_URL}/api/v1/users/forgotPassword`, this.user)
          .then(response => {
            console.log(response.data);
            this.errorMessage = 'Un lien de réinitialisation de mot de passe a été envoyé à votre adresse e-mail.';
          })
          .catch(error => {
            this.errorMessage = error.response?.data?.message || 'Une erreur inconnue est survenue.';
          })
          .finally(() => {
            this.isLoading = false;
          });
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