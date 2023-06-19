<template>
  <div class="container-angka">
    <div class="box-angka">
      <p>Total Acara</p>
      <p>0</p>
    </div>
    <div class="box-angka">
      <p>Total Berlangsung</p>
      <p>0</p>
    </div>
    <div class="box-angka">
      <p>Total Ditunda</p>
      <p>0</p>
    </div>
    <div class="box-angka">
      <p>Total Selesai</p>
      <p>0</p>
    </div>
    <div class="box-angka">
      <p>Total Tersinkron</p>
      <p>0</p>
    </div>
    <div class="box-angka">
      <p>Total Belum Tersinkron</p>
      <p>0</p>
    </div>
  </div>
  <div class="container-acara">
    <div class="box-acara-navbar">
      <p>List User</p>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.Id">
            <td>{{ user.Username }}</td>
            <td>{{ user.Email }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="box-acara-navbar">
      <p>Aktivitas yang akan datang</p>
      <button @click="tambahAcara" class="btn btn-success">Tambah Acara</button>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Jenis Acara</th>
            <th>Subjek Acara</th>
            <th>Lokasi</th>
            <th>Keterangan</th>
            <th>Tanggal Dimulai</th>
            <th>Tanggal Selesai</th>
            <th>Opsi</th>th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="acara in acara" :key="acara.Id">
            <td>{{ acara.Id }}</td>
            <td>{{ acara.jenis_acara }}</td>
            <td>{{ acara.subjek_acara }}</td>
            <td>{{ acara.lokasi }}</td>
            <td>{{ acara.keterangan }}</td>
            <td>{{ acara.tanggal_dimulai }}</td>
            <td>{{ acara.tanggal_selesai }}</td>
            <td>
              <button class="btn btn-warning" @click="EditAcara(acara.Id)">Edit</button> ||  <button @click="del(acara.Id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import router from '@/router'

export default {
  data () {
    return {
      users: [],
      acara: []
    }
  },
  mounted () {
    this.getAllUser()
    this.getAllAcara()
  },
  methods: {
    getAllUser () {
      axios.get('http://127.0.0.1:7070/auth/users')
        .then(response => {
          if (response.data.message === 'success') {
            this.users = response.data.data
          }
        })
        .catch(error => {
          console.error(error)
        })
    },
    getAllAcara () {
      axios.get('http://127.0.0.1:7070/kegiatan/all')
        .then(response => {
          if (response.data.message === 'success') {
            this.acara = response.data.data
          }
        })
        .catch(error => {
          console.error(error)
        })
    },
    editAcara (Id) {
      axios.get(`http://127.0.0.1:7070/kegiatan/edit/${Id}`)
        .then(response => {
          if (response.data.message === 'success') {
            console.log(response.data.data[0].jenis_acara)
            this.getAllAcara()
          }
        })
        .catch(error => {
          console.error(error)
        })
    },
    del (Id) {
    // Menggunakan axios untuk menghapus data acara
      axios.delete(`http://127.0.0.1:7070/kegiatan/delete/${Id}`)
        .then(response => {
          if (response.data.message === 'success') {
            alert('Data Berhasil Dihapus')
            this.getAllAcara()
          }
        })
        .catch(error => {
          console.error(error)
        })
    },
    async tambahAcara () {
      router.push({ name: 'CreateAcara' })
    },
    async EditAcara (Id) {
      router.push({ name: 'EditAcara', params: { id: Id } })
    }
  }
}
</script>

<style>
.container {
  margin: 20px;
}

.my-box {
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 5px;
}

.welcome {
  text-align: center;
}

.box {
  background-color: #f0f0f0;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  text-align: center;
}

.box p {
  font-size: 18px;
  font-weight: bold;
  /* margin-bottom: 5px; */
}

.acara {
  display: flex;
  flex-wrap: wrap;
}

.container-angka {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.box-angka{
  background-color: #f0f0f0;
  padding: 10px;
  margin: 10px;
  border-radius: 5px;
  text-align: center;
  flex: 0 0 calc(33.33% - 20px);
}

.box-acara-navbar {
  flex: 1 1 300px;
  background-color: #f0f0f0;
  padding: 20px;
  margin-bottom: 10px;
  border-radius: 5px;
}

.box-acara-navbar p {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

table th,
table td {
  padding: 8px;
  border: 1px solid #ccc;
}

table th {
  font-weight: bold;
  background-color: #f0f0f0;
}
</style>
