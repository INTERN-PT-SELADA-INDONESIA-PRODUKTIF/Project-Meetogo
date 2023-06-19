<template>
    <div class="container">
      <div class="form-container">
        <h3>Edit Acara</h3>
        <form @submit.prevent="updateAcara">
          <div class="form-group">
            <label for="jenis_acara">Jenis Acara</label>
            <input type="text" id="jenis_acara" v-model="editAcara1.jenis_acara" required>
          </div>
          <div class="form-group">
            <label for="subjek_acara">Subjek Acara</label>
            <input type="text" id="subjek_acara" v-model="editAcara.subjek_acara" required>
          </div>
          <div class="form-group">
            <label for="lokasi">Lokasi</label>
            <input type="text" id="lokasi" v-model="editAcara.lokasi" required>
          </div>
          <div class="form-group">
            <label for="keterangan">Keterangan</label>
            <textarea id="keterangan" v-model="editAcara.keterangan" required></textarea>
          </div>
          <div class="form-group">
            <label for="tanggal_dimulai">Tanggal Dimulai</label>
            <input type="date" id="tanggal_dimulai" v-model="editAcara.tanggal_dimulai" required>
          </div>
          <div class="form-group">
            <label for="tanggal_selesai">Tanggal Selesai</label>
            <input type="date" id="tanggal_selesai" v-model="editAcara.tanggal_selesai" required>
          </div>
          <button type="submit">Edit Acara</button>
        </form>
        <form @submit="submitForm">
            <div v-for="acara_edit in acara_edit" :key="acara_edit.Id">
                <label>{{ acara_edit.label }}</label>
                <input v-model="acara_edit.value" type="text">
            </div>
            <button type="submit">Simpan</button>
        </form>
        <button @click="cancel" class="btn btn-danger">Batal</button>
      </div>
    </div>
  </template>

<script>
import axios from 'axios'
import router from '@/router'

export default {
  data () {
    return {
      editAcara1: {
        jenis_acara: '',
        subjek_acara: '',
        lokasi: '',
        keterangan: '',
        tanggal_dimulai: '',
        tanggal_selesai: ''
      }
    }
  },
  mounted () {
    const id = this.$route.params.id
    this.editAcara1(id)
  },
  methods: {
    editAcara (id) {
      axios.get(`http://127.0.0.1:7070/kegiatan/edit/${id}`)
        .then(response => {
          if (response.data.message === 'success') {
            console.log(response.data.data[0])
            this.editAcara1 = response.data.data[0]
          }
        })
        .catch(error => {
          console.error(error)
        })
    },
    updateAcara () {
      const id = this.$route.params.id
      const formData = new URLSearchParams()
      formData.append('jenis_acara', this.acara.jenis_acara)
      formData.append('subjek_acara', this.acara.subjek_acara)
      formData.append('lokasi', this.acara.lokasi)
      formData.append('keterangan', this.acara.keterangan)
      formData.append('tanggal_dimulai', this.acara.tanggal_dimulai)
      formData.append('tanggal_selesai', this.acara.tanggal_selesai)
      const config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
      axios.put(`http://127.0.0.1:7070/kegiatan/update/${id}`, formData.toString(), config)
        .then(response => {
          if (response.data.message === 'success') {
            router.push({ name: 'home' })
          }
        })
        .catch(error => {
          console.error(error)
        })
    },
    cancel () {
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
