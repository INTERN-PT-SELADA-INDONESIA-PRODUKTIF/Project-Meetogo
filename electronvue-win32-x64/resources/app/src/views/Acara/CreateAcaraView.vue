<template>
<div class="container">
  <div class="form-container">
    <h3>Tambah Acara Baru</h3>
    <form @submit.prevent="CreateAcara">
      <div class="form-group">
        <label for="jenis_acara">Jenis Acara</label>
        <input type="text" id="jenis_acara" v-model="newData.jenis_acara" required>
      </div>
      <div class="form-group">
        <label for="subjek_acara">Subjek Acara</label>
        <input type="text" id="subjek_acara" v-model="newData.subjek_acara" required>
      </div>
      <div class="form-group">
        <label for="lokasi">Lokasi</label>
        <input type="text" id="lokasi" v-model="newData.lokasi" required>
      </div>
      <div class="form-group">
        <label for="keterangan">Keterangan</label>
        <textarea id="keterangan" v-model="newData.keterangan" required></textarea>
      </div>
      <div class="form-group">
        <label for="tanggal_dimulai">Tanggal Dimulai</label>
        <input type="date" id="tanggal_dimulai" v-model="newData.tanggal_dimulai" required>
      </div>
      <div class="form-group">
        <label for="tanggal_selesai">Tanggal Selesai</label>
        <input type="date" id="tanggal_selesai" v-model="newData.tanggal_selesai" required>
      </div>
      <button type="submit">Tambah Acara</button>
    </form>
    <button @click="batal" class="btn btn-danger">Batal</button>
  </div>
</div>
</template>

<script>
import axios from 'axios'
import router from '@/router'

export default {
  data () {
    return {
      newData: {
        jenis_acara: '',
        subjek_acara: '',
        lokasi: '',
        keterangan: '',
        tanggal_dimulai: '',
        tanggal_selesai: ''
      }
    }
  },
  methods: {
    CreateAcara () {
      // Memeriksa apakah ada input yang kosong
      if (
        !this.newData.jenis_acara ||
        !this.newData.subjek_acara ||
        !this.newData.lokasi ||
        !this.newData.keterangan ||
        !this.newData.tanggal_dimulai ||
        !this.newData.tanggal_selesai
      ) {
        console.error('Harap lengkapi semua input')
        return
      }

      const formData = new URLSearchParams()
      formData.append('jenis_acara', this.newData.jenis_acara)
      formData.append('subjek_acara', this.newData.subjek_acara)
      formData.append('lokasi', this.newData.lokasi)
      formData.append('keterangan', this.newData.keterangan)
      formData.append('tanggal_dimulai', this.newData.tanggal_dimulai)
      formData.append('tanggal_selesai', this.newData.tanggal_selesai)

      const config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }

      axios
        .post('http://127.0.0.1:7070/kegiatan/add', formData.toString(), config)
        .then(response => {
          if (response.data.message === 'success') {
            router.push({ name: 'home' })
          }
        })
        .catch(error => {
          console.error(error)
        })
    },
    async batal () {
      router.push({ name: 'home' })
    }
  }
}
</script>

<style>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.form-container {
  width: 400px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.form-group {
  margin-bottom: 10px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input[type="text"],
textarea,
input[type="date"] {
  width: 100%;
  padding: 5px;
}

button {
  background-color: #0368AA;
  color: #fff;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
