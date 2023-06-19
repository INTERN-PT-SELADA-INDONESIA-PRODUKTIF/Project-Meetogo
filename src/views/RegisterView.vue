<template>
    <img alt="Vue logo" src="../assets/logo.png">
    <div class="register">
        <div>
          <input v-model="Username" type="text" placeholder="Username">
        </div>
        <div>
          <input v-model="Email" type="email" placeholder="Email">
        </div>
        <div>
          <input v-model="Password" type="password" placeholder="Password">
        </div>
        <button v-on:click="register">Register</button>
        <br>
        <router-link to="/">Login</router-link>
        <RegisterLink msg=""/>
    </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'RegisterForm',
  data () {
    return {
      Username: '',
      Email: '',
      Password: ''
    }
  },
  methods: {
    async register () {
      const params = new URLSearchParams()
      params.append('Username', this.Username)
      params.append('Email', this.Email)
      params.append('Password', this.Password)

      try {
        const response = await axios.post('http://127.0.0.1:7070/auth/register', params, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
        console.warn(response)
        if (response.status === 201) {
          alert('register berhasil')
          localStorage.setItem('user-info', response.data)
        }
      } catch (error) {
        console.error(error)
        // Handle error response here
      }
    }
  }
}
</script>

<style>
.register {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 50px;
}

input {
    padding: 10px;
    margin-bottom: 10px;
    width: 200px;
}

button {
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
}

router-link {
    color: #007bff;
    text-decoration: none;
    margin-top: 10px;
}

</style>
