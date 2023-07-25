<template>
  <div>
    <NavBar/>
    <h1>Update User</h1>
    <form @submit.prevent="updateUser">
      <label for="firstName">First Name:</label>
      <input id="firstName" v-model="user.firstName" required />

      <label for="lastName">Last Name:</label>
      <input id="lastName" v-model="user.lastName" required />

      <label for="email">Email:</label>
      <input id="email" v-model="user.email" required />

      <!-- Vous pouvez ajouter d'autres champs ici -->

      <button type="submit">Update</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import NavBar from './NavBar.vue';
// import jwtDecode from 'jwt-decode';

export default {
    components : {
        NavBar
    },
    name: "UpdateUser",
    data() {
        return {
            user: {},
        };
    },
    methods: {
        async loadUser() {
            const token = localStorage.getItem('token');
            const userId = this.$route.params.id;
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_URL}/api/v1/users/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                this.user = response.data.data.user; // Assurez-vous que cela correspond à la structure de vos données retournées
            } catch (error) {
                console.error(error);
            }
        },
        async updateUser() {
            const token = localStorage.getItem('token');
            const userId = this.$route.params.id;
            try {
                await axios.patch(`${process.env.VUE_APP_API_URL}/api/v1/users/${userId}`, this.user, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                // Rediriger l'administrateur vers la page Admin après la mise à jour
                this.$router.push('/admin');
            } catch (error) {
                console.error(error);
            }
        },
    },
    created() {
        this.loadUser();
    },
};
</script>

<style scoped>
  /* ajoutez votre style ici */
</style>