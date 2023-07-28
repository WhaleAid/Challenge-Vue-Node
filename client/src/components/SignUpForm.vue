<script setup>
    import { reactive } from 'vue';

    const state = reactive({
        email: '',
        password: '',
        confirmPassword: '',
        error: '',
    });

    const signUp = async () => {
        if (state.password !== state.confirmPassword) {
            state.error = 'Passwords do not match';
            return;
        }

        const response = await fetch('http://localhost:5000/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: state.email,
                password: state.password,
            }),
        });

        const data = await response.json();

        if (data.error) {
            state.error = data.error;
        } else {
            state.error = '';
            state.email = '';
            state.password = '';
            state.confirmPassword = '';
        }
    };

    const clearError = () => {
        state.error = '';
    };

    const clearForm = () => {
        state.email = '';
        state.password = '';
        state.confirmPassword = '';
    };

</script>