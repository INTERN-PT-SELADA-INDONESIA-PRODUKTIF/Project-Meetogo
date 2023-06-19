<template>
  <div class="login">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="login mt-4">
          <div class="mb-3">
            <input v-model="Email" name="Email" type="email" class="form-control" placeholder="Email">
          </div>
          <div class="mb-3">
            <input v-model="Password" name="Password"  type="password" class="form-control" placeholder="Password">
          </div>
          <button @click="login" class="btn btn-primary">Login</button>
          <br>
          <router-link to="/register" class="text-primary">register</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import router from '@/router'

export default {
  name: 'LoginView',
  data () {
    return {
      Email: '',
      Password: ''
    }
  },
  methods: {
    async login () {
      try {
        const formData = new URLSearchParams()
        formData.append('Email', this.Email)
        formData.append('Password', this.Password)
        const config = {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
        const response = await axios.post('http://127.0.0.1:7070/auth/login', formData.toString(), config)
        console.log(response)
        if (response.status === 200) {
          const user = response.data
          console.log('console : ')
          console.log(user[0].Token)
          if (user[0].Token) {
            localStorage.setItem('token', user.Token)
            router.push({ name: 'home' })
          } else {
            console.error('Login failed')
          }
        }
      } catch (error) {
        console.error(error)
      }
    }
    // async login () {
    //   // router.push({ name: 'home' })
    //   try {
    //     const response = await axios.post('http://127.0.0.1:7070/auth/login', {
    //       Email: this.Email,
    //       Password: this.Password
    //     })
    //     if (response.status === 200) {
    //       const user = response.data
    //       if (user.Token) {
    //         localStorage.setItem('token', user.Token)
    //         router.push({ name: 'home' })
    //       } else {
    //         console.error('Login failed')
    //       }
    //     }
    //   } catch (error) {
    //     console.error(error)
    //   }
    // }
  }
}
</script>
