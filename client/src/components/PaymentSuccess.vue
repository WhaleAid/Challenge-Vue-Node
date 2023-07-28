<template>
  <div>
    <h1>Paiement réussi !</h1>
    <div>Vous allez être rediriger sur la page d'accueil...</div>
    <!-- Vous pouvez remplacer le texte ci-dessus par une animation de chargement si vous le souhaitez -->
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      isLoading: false
    };
  },
  async created() {
    try {
      this.isLoading = true;
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': 'Bearer ' + token,
      };
      const response = await axios.put(`${process.env.VUE_APP_API_URL}/api/v1/users/me`, {status: 'premium'}, {headers});
      console.log(response);
      setTimeout(() => {
        this.$router.push('/home'); // Remplacez 'HomePage' par le nom ou la route de votre page d'accueil
      }, 4000); // Attend 3 secondes avant de rediriger
      this.isLoading = false;
    } catch (error) {
      console.error(error);
      this.isLoading = false;
      alert('Erreur lors de la mise à jour du statut');
    }
  }
}
</script>