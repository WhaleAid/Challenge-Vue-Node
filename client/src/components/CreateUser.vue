<template>
  <div>
    <h1>Créer un nouvel utilisateur</h1>
    <form @submit.prevent="submitForm">
      <input type="text" v-model="user.firstName" placeholder="First Name" required>
      <input type="text" v-model="user.lastName" placeholder="Last Name" required>
      <input type="email" v-model="user.email" placeholder="Email" required>
      <input type="password" v-model="user.password" placeholder="Password" required>
      <input type="password" v-model="user.passwordConfirm" placeholder="Confirm Password" required>
      <input type="date" v-model="user.date_of_birth" placeholder="Date of Birth" required>
      <select v-model="user.role">
        <option disabled value="">Please select a role</option>
        <option>admin</option>
        <option>user</option>
      </select>
      <button type="submit">Submit</button>
    </form>
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
        date_of_birth: '',
        role: '',
      },
    };
  },
  methods: {
    async submitForm() {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.post(
          `${process.env.VUE_APP_API_URL}/api/v1/users`,
          this.user,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(response);
        // Redirect back to Admin Page
        this.$router.push('/admin');
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>