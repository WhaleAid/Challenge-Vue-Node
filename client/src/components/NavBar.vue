<template>
  <nav>
    <router-link to="/home">Home</router-link>
    <!-- You can add more links here -->

    <!-- Dropdown Menu -->
    <div class="dropdown" style="float:right;">
      <button class="dropbtn">Menu</button>
      <div class="dropdown-content">
        <router-link to="/profile">Modifier le profil</router-link>
        <a @click="logout">Déconnexion</a>
      </div>
    </div>
  </nav>
</template>

<script>
import axios from 'axios';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
  methods: {
    async logout() {
    try {
      const response = await axios.get(process.env.VUE_APP_API_URL + '/api/v1/users/logout');
      if (response.data.status === 'success') {
        // Remove JWT token from localStorage
        localStorage.removeItem('token');
        // Redirect to login page
         toast("Successfully logged out !", {
                autoClose: 3000,
            });
        this.$router.push('/');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }
  }
}
</script>

<style>
.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  display: none;
  position: absolute;
  right: 0;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
}

.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

.dropdown-content a:hover {background-color: #f1f1f1}

.dropdown:hover .dropdown-content {
  display: block;
}

.dropdown:hover .dropbtn {
  background-color: #3e8e41;
}
nav {
 border: 1px solid black;   
}
</style>