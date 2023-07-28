<template>
  <div>
    <h1>Erreur de Paiement</h1>
    <p>Une erreur est survenue lors du processus de paiement. Veuillez réessayer plus tard.</p>
    <router-link to="/">Retour à la page d'accueil</router-link>
  </div>
</template>

<script>
export default {
  name: 'ErrorPayment',
}
</script>

<style scoped>
h1 {
  color: red;
}
</style>