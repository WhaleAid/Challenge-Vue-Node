<template>
  <div class="reset-password-container">
    <input v-model="user.password" type="password" placeholder="Nouveau mot de passe">
    <input v-model="user.passwordConfirm" type="password" placeholder="Confirmez le nouveau mot de passe">
    <button @click="resetPassword">Réinitialiser le mot de passe</button>

    <!-- Ajoutez votre loader ici. Il sera affiché lorsque isLoading est true. -->
    <div v-if="isLoading">Loading...</div>

    <!-- Message d'erreur ici -->
    <div v-if="errorMessage">{{ errorMessage }}</div>
  </div>
</template>

<script>
import axios from 'axios';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
  data() {
    return {
      user: {
        password: '',
        passwordConfirm: '',
      },
      errorMessage: '',
      isLoading: false,
    };
  },
  methods: {
    async resetPassword() {
      this.isLoading = true;
      try {
        const response = await axios.patch(`${process.env.VUE_APP_API_URL}/api/v1/users/resetPassword/${this.$route.params.token}`, this.user);
        if (response.status === 200) {
          console.log(response.data);
          this.errorMessage = 'Votre mot de passe a été réinitialisé avec succès.';
          // Vous pouvez rediriger l'utilisateur vers la page de connexion ici
          toast("Mot de passe mis à jour avec succes", {
                autoClose: 3000,
            });
          this.$router.push('/');
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
.reset-password-container {
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 10px;
}
</style>