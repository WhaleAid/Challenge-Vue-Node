<template>
  <div>
    <NavBar/>
    <details class="update-section">
      <summary><h1>Mise à jour du profil</h1></summary>
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
    </details>
    
    <details class="update-section">
      <!-- formulaire de mise à jour du mot de passe -->
      <summary><h2>Changer le mot de passe</h2></summary>
      <form @submit.prevent="updatePassword">
        <label>
          Mot de passe actuel :
          <input type="password" v-model="passwordCurrent" required />
        </label>
        <br/>
        <label>
          Nouveau mot de passe :
          <input type="password" v-model="password" required />
        </label>
        <br/>
        <label>
          Confirmer le nouveau mot de passe :
          <input type="password" v-model="passwordConfirm" required />
        </label>
        <br/>
        <button type="submit">Mettre à jour le mot de passe</button>
      </form>
    </details>
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
      passwordCurrent: '',
      password: '',
      passwordConfirm: ''
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
            toast("Profil mis à jour avec succès", {
                autoClose: 1000,
            });
            //this.$router.push('/home');
          }
        } catch (error) {
          console.error(error);
          alert('Erreur lors de la mise à jour du profil');
        }
      }
    },
    async updatePassword() {
      let token = localStorage.getItem('token');

      if (token) {
        const headers = {
          'Authorization': 'Bearer ' + token
        };
        try {
          const response = await axios.patch(`${process.env.VUE_APP_API_URL}/api/v1/users/updateMyPassword`, {
            passwordCurrent: this.passwordCurrent,
            password: this.password,
            passwordConfirm: this.passwordConfirm
          }, {headers});
          if (response.status === 200) {
            toast("Mot de passe mis à jour avec succès", {
                autoClose: 1000,
            });
            this.passwordCurrent = '';
            this.password = '';
            this.passwordConfirm = '';
          }
        } catch (error) {
          console.error(error);
          //alert('Erreur lors de la mise à jour du mot de passe');
          toast("Erreur lors de la mise à jour du mot de passe", {
                autoClose: 1000,
            });
        }
      }
    }
  }
}
</script>

<style scoped>
.update-section {
  background: #f5f5f5;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
}

.update-section summary {
  cursor: pointer;
  outline: none;
}
</style>