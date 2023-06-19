<template>
  <div>
    <h1>CRUD Vue.js 3</h1>
    <form @submit.prevent="createKegiatan">
      <input v-model="jenisAcara" type="text" placeholder="Jenis Acara" />
      <input v-model="subjekAcara" type="text" placeholder="Subjek Acara" />
      <input v-model="lokasi" type="text" placeholder="Lokasi" />
      <textarea v-model="keterangan" placeholder="Keterangan"></textarea>
      <input v-model="tanggalDimulai" type="date" placeholder="Tanggal Dimulai" />
      <input v-model="tanggalSelesai" type="date" placeholder="Tanggal Selesai" />
      <button type="submit">Tambah Kegiatan</button>
    </form>

    <ul>
      <li v-for="kegiatan in kegiatanList" :key="kegiatan.Id">
        <h3>{{ kegiatan.jenis_acara }}</h3>
        <p>{{ kegiatan.subjek_acara }}</p>
        <button @click="editKegiatan(kegiatan.Id)">Edit</button>
        <button @click="deleteKegiatan(kegiatan.Id)">Delete</button>
        <button @click="viewDetail(kegiatan.Id)">Detail</button>
      </li>
    </ul>

    <div v-if="detail">
      <h2>Detail Kegiatan</h2>
      <h3>{{ detail.jenis_acara }}</h3>
      <p>{{ detail.subjek_acara }}</p>
      <button @click="detail = null">Tutup</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'CrudComponent',
  data () {
    return {
      jenisAcara: '',
      subjekAcara: '',
      lokasi: '',
      keterangan: '',
      tanggalDimulai: '',
      tanggalSelesai: '',
      kegiatanList: [],
      detail: null
    }
  },
  created () {
    this.fetchKegiatanList()
  },
  methods: {
    async fetchKegiatanList () {
      try {
        const response = await axios.get('http://127.0.0.1:7070/kegiatan/all')
        this.kegiatanList = response.data
      } catch (error) {
        console.error(error)
        // Handle error response here
      }
    },
    async createKegiatan () {
      try {
        await axios.post('http://127.0.0.1:7070/kegiatan/add', {
          jenis_acara: this.jenisAcara,
          subjek_acara: this.subjekAcara,
          lokasi: this.lokasi,
          keterangan: this.keterangan,
          tanggal_dimulai: this.tanggalDimulai,
          tanggal_selesai: this.tanggalSelesai
        })
        this.jenisAcara = ''
        this.subjekAcara = ''
        this.lokasi = ''
        this.keterangan = ''
        this.tanggalDimulai = ''
        this.tanggalSelesai = ''
        this.fetchKegiatanList()
      } catch (error) {
        console.error(error)
        // Handle error response here
      }
    },
    async editKegiatan (id) {
      try {
        const response = await axios.get(`http://127.0.0.1:7070/kegiatan/edit/${id}`);
        const kegiatan = response.data
        this.jenisAcara = kegiatan.jenis_acara
        this.subjekAcara = kegiatan.subjek_acara
        this.lokasi = kegiatan.lokasi
        this.keterangan = kegiatan.keterangan
        this.tanggalDimulai = kegiatan.tanggal_dimulai
        this.tanggalSelesai = kegiatan.tanggal_selesai
      } catch (error) {
        console.error(error)
        // Handle error response here
      }
    },
    async updateKegiatan () {
      try {
        await axios.put('http://127.0.0.1:7070/kegiatan/update', {
          id,
          jenis_acara: this.jenisAcara,
          subjek_acara: this.subjekAcara,
          lokasi: this.lokasi,
          keterangan: this.keterangan,
          tanggal_dimulai: this.tanggalDimulai,
          tanggal_selesai: this.tanggalSelesai,
        });
        this.jenisAcara = '';
        this.subjekAcara = '';
        this.lokasi = '';
        this.keterangan = '';
        this.tanggalDimulai = '';
        this.tanggalSelesai = '';
        this.fetchKegiatanList();
      } catch (error) {
        console.error(error);
        // Handle error response here
      }
    },
    async deleteKegiatan(id) {
      try {
        await axios.delete(`http://127.0.0.1:7070/kegiatan/delete/${id}`);
        this.fetchKegiatanList();
      } catch (error) {
        console.error(error);
        // Handle error response here
      }
    },
    async viewDetail(id) {
      try {
        const response = await axios.get(`http://127.0.0.1:7070/kegiatan/detail/${id}`);
        this.detail = response.data;
      } catch (error) {
        console.error(error);
        // Handle error response here
      }
    },
  },
};
</script>

<style>
button {
  margin-left: 10px;
}
</style>
