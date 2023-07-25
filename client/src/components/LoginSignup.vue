<template>
  <div class="home-container">
    <div class="image-container">
      <!-- Votre image ici -->
      <img src="./../assets/logo.png" alt="Image de jeu" />
    </div>
    <div class="form-container">
      <div v-if="isLogin">
        <login-component></login-component>
        <p>Nouveau chez nous ? <button @click="toggleView">Inscrivez-vous</button></p>
      </div>
      <div v-else>
        <signup-component></signup-component>
        <p>Déjà inscrit ? <button @click="toggleView">Connectez-vous</button></p>
      </div>
    </div>
  </div>
</template>

<script>
import LoginComponent from './LoginForm.vue'
import SignupComponent from './SignupForm.vue'

export default {
  components: {
    LoginComponent,
    SignupComponent
  },
  data() {
    return {
      isLogin: true
    };
  },
  methods: {
    toggleView() {
      this.isLogin = !this.isLogin;
    }
  }
};
</script>

<style scoped>
.home-container {
  display: flex;
  height: 100vh;
}

.image-container {
  flex: 1;
  background-size: cover;
}

.form-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.form-container p {
  margin-top: 20px;
}
</style>