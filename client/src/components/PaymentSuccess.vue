<template>
  <div>
    <h1>Paiement réussi !</h1>
    <div>Vous allez être rediriger sur la page d'accueil...</div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  async created() {
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': 'Bearer ' + token };

      await axios.put(`${process.env.VUE_APP_API_URL}/api/v1/users/me`, {status: 'premium'}, {headers});

      this.redirectAfterDelay('/home', 4000);
    } catch (error) {
      // Gestion d'erreur appropriée à l'utilisateur
      this.$router.push('/error');
    }
  },
  methods: {
    redirectAfterDelay(route, delay) {
      setTimeout(() => {
        this.$router.push(route);
      }, delay);
    }
  }
}
</script>
