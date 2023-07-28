import { createRouter, createWebHistory } from 'vue-router';
import LoginSignup from './components/LoginSignup.vue';
import HomePage from './components/HomePage.vue';
import AdminPage from './components/AdminPage.vue';
import UpdateUser from './components/UpdateUser.vue';
import CreateUser from './components/CreateUser.vue';
import UserProfile from './components/UserProfile.vue';
import GameBoard from './components/GameBoard.vue';
import ForgotPassword from './components/ForgotPassword.vue';
import ResetPassword from './components/ResetPassword.vue';
import { useToast } from 'vue-toastification';

const routes = [
    {
      path: '/',
      name: 'LoginSignup',
      component: LoginSignup,
    },
    {   
        path : "/home",
        name : 'HomePage',
        component : HomePage,
        meta: { requiresAuth: true }
    },
    {
        path: '/admin',
        name: 'Admin',
        component: AdminPage,
        meta: { requiresAuth: true }
    },
    { 
        path: '/update-user/:id',
        component: UpdateUser,
        meta: { requiresAuth: true }
    },
    {
        path: '/createUser',
        name: 'CreateUser',
        component: CreateUser,
        meta: { requiresAuth: true }
    },
    {
        path : '/profile',
        name : 'UserProfile',
        component : UserProfile,
        meta: { requiresAuth: true }
    },
    { 
        path: '/forgot-password', 
        component: ForgotPassword 
    },
    {
        
        path: '/resetPassword/:token',
        component: ResetPassword 
        
    },
    {
        path: '/game/:id',
        component: GameBoard,
        meta: { requiresAuth: true }
    }


  ];

  const router = createRouter({
    history: createWebHistory(''),
    routes,
  });

  
  router.beforeEach((to, from, next) => {
    // Instance de Toastification
    const toast = useToast();

    // Vérifie si la route nécessite une authentification
    if (to.matched.some(record => record.meta.requiresAuth)) {
        // Vérifie si l'utilisateur est authentifié
        if (!localStorage.getItem('token')) {
            // Si l'utilisateur n'est pas authentifié, redirige vers la page de connexion
            // et affiche une notification 
            toast.error('Vous devez être connecté pour accéder à cette page.');
            next({ name: 'LoginSignup' });
        } else {
            // Si l'utilisateur est authentifié, le laisser accéder 
            next();
        }
    } else {
        // Si la route ne nécessite pas d'authentification, laissez simplement l'utilisateur accéder à la route
        next();
    }
});

export default router;