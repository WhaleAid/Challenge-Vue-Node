<template>
  <div>
    <NavBar/>
    <h1>Mise à jour du profil</h1>
    <form @submit.prevent="updateProfile">
      <label>
        Prénom :
        <input type="text" v-model="firstName" required />
      </label>
      <br/>
      <label>
        Nom de famille :
        <input type="text" v-model="lastName" required />
      </label>
      <br/>
      <label>
        Date de naissance :
        <input type="date" v-model="date_of_birth" required />
      </label>
      <br/>
      <button type="submit">Mettre à jour le profil</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import NavBar from './NavBar.vue';

export default {
  data() {
    return {
      firstName: '',
      lastName: '',
      date_of_birth: '',
    }
  },
  components : {
    NavBar
  },
  async created() {
    let token = localStorage.getItem('token');
    if (token) {
      const headers = {
        'Authorization': 'Bearer ' + token
      };
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/api/v1/users/me`, {headers});
        this.firstName = response.data.data.user.firstName;
        this.lastName = response.data.data.user.lastName;
        this.date_of_birth = response.data.data.user.date_of_birth;
        //console.log(response);
      } catch (error) {
        console.error(error);
        alert('Erreur lors de la récupération des informations du profil');
      }
    }
  },
  methods: {
    async updateProfile() {
        console.log('front updateProfile');
      let token = localStorage.getItem('token');

      if (token) {
        const headers = {
          'Authorization': 'Bearer ' + token
        };
        try {
          const response = await axios.patch(`${process.env.VUE_APP_API_URL}/api/v1/users/me`, {
            firstName: this.firstName,
            lastName: this.lastName,
            date_of_birth: this.date_of_birth
          }, {headers});
          if (response.status === 200) {
            // alert('Profil mis à jour avec succès');
            toast("Wow so easy !", {
                autoClose: 3000,
            });
            //this.$router.push('/home');
          }
        } catch (error) {
          console.error(error);
          alert('Erreur lors de la mise à jour du profil');
        }
      }
    }
  }
}
</script>