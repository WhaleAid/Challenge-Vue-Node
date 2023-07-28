<template>
  <div>
    <div v-if="loading">Chargement...</div>
    <div v-else>
      <NavBar/>
      <h1>Update User</h1>
      <form @submit.prevent="updateUser">
        <label for="firstName">First Name:</label>
        <input id="firstName" v-model="user.firstName" required />
        <br>
        <label for="lastName">Last Name:</label>
        <input id="lastName" v-model="user.lastName" required />
        <br>
        <label for="email">Email:</label>
        <input id="email" v-model="user.email" required />
        <br>
        <label for="role">Role:</label>
        <input id="role" v-model="user.role" required />
        <br>
        <button type="submit">Update</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import NavBar from './NavBar.vue';

export default {
  components : {
    NavBar
  },
  name: "UpdateUser",
  data() {
    return {
      user: {},
      loading: true,
      errorMessage: null,
    };
  },
  computed: {
    token() {
      return localStorage.getItem('token');
    },
    userId() {
      return this.$route.params.id;
    }
  },
  methods: {
    async sendRequest(method, url, data) {
      try {
        return await axios({
          method,
          url,
          data,
          headers: { Authorization: `Bearer ${this.token}` }
        });
      } catch (error) {
        this.errorMessage = error.message;
      }
    },
    async loadUser() {
      const response = await this.sendRequest('get', `${process.env.VUE_APP_API_URL}/api/v1/users/${this.userId}`);
      this.user = response?.data?.data?.user;
      this.loading = false;
    },
    async updateUser() {
      await this.sendRequest('patch', `${process.env.VUE_APP_API_URL}/api/v1/users/${this.userId}`, this.user);
      this.$router.push('/admin');
    },
  },
  async created() {
    await this.loadUser();
  },
};
</script>

<style scoped>
</style>
