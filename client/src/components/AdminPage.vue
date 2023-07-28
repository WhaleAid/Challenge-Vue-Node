<template>
    <div>
        <h1>Page Admin !</h1>
        <button @click="createUser">Créer un nouvel utilisateur</button>
        <div v-if="loading">Chargement...</div>
        <table v-else>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Prénom</th>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Update</th>
                    <th>Delete</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in users" :key="user._id">
                    <td>{{ user._id }}</td>
                    <td>{{ user.firstName }}</td>
                    <td>{{ user.lastName }}</td>
                    <td>{{ user.email }}</td>
                    <td>{{ user.role }}</td>
                    <td>
                       <button @click="goToUpdatePage(user._id)">Update</button>
                    </td>
                    <td>
                        <button @click="deleteUser(user._id)">Delete</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import axios from 'axios';
import jwtDecode from 'jwt-decode';

export default {
    name: "AdminPage",
    data() {
        return {
            users: [],
            loading: true,
        };
    },
    methods: {
        async loadUsers() {
            const token = localStorage.getItem('token');
            const decodedToken = jwtDecode(token);
            if (decodedToken.role === 'admin') {
                try {
                    const response = await axios.get(`${process.env.VUE_APP_API_URL}/api/v1/users/`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    this.users = response.data.data.users;
                } catch (error) {
                    console.error(error);
                } finally {
                    this.loading = false;
                }
            }
        },
        async deleteUser(id) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`${process.env.VUE_APP_API_URL}/api/v1/users/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                // Recharger les utilisateurs après avoir supprimé un utilisateur
                this.loadUsers();
            } catch (error) {
                console.error(error);
            }
        },
        goToUpdatePage(id) {
            this.$router.push(`/update-user/${id}`);
        },
        createUser() {
            this.$router.push('/createUser');
        },
    },
    async created() {
        await this.loadUsers();
    },
};
</script>

<style scoped>
  /* ajoutez votre style ici */
</style>