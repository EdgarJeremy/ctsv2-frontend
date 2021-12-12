import axios from "axios";
// import socket from "../components/Socket";

function getModels() {
    // return new Promise((resolve, reject) => {
    //     const req = axios.create({
    //         baseURL: `http://${window.location.hostname}:8085`,
    //         withCredentials: true
    //     });
    //     const services = {

    //         api: {
        
    //             _url: "/api",
        
    //             login: function (send) {
    //                 return req.post(`${this._url}/login`, send).then((data) => data.data);
    //             },
        
    //             cek_status: function () {
    //                 return req.get(`${this._url}/cek_status`).then((data) => data.data);
    //             },
        
    //             logout: function () {
    //                 return req.get(`${this._url}/logout`).then((data) => data.data);
    //             }
        
    //         },
        
    //         authenticated: {
        
    //             _url: "/authenticated",
        
    //             tujuan_index: function(limit = 999999, offset = 0, q = ""){
    //                 return req.get(`${this._url}/tujuan_index/${limit}/${offset}?q=${q}`).then((data) => data.data);
    //             },
        
    //             tujuan_get_syarat: function(id_tujuan) {
    //                 return req.get(`${this._url}/tujuan_get_syarat/${id_tujuan}`).then((data) => data.data).catch()
    //             },
        
    //             tujuan_create: function(post){
    //                 return req.post(`${this._url}/tujuan_create`, post).then((data) => data.data);
    //             },
        
    //             tujuan_edit: function(post) {
    //                 return req.post(`${this._url}/tujuan_edit`, post).then((data) => data.data);
    //             },
        
    //             tujuan_show: function(id_tujuan) {
    //                 return req.get(`${this._url}/tujuan_show/${id_tujuan}`).then((data) => data.data);
    //             },
        
    //             tujuan_delete: function(id_tujuan) {
    //                 return req.get(`${this._url}/tujuan_delete/${id_tujuan}`).then((data) => data.data);
    //             },
        
    //             tujuan_set_syarat: function(post) {
    //                 return req.post(`${this._url}/tujuan_set_syarat`, post).then((data) => data.data);
    //             },
        
    //             tujuan_get_steps: function(id_tujuan) {
    //                 return req.get(`${this._url}/tujuan_get_steps/${id_tujuan}`).then((data) => data.data);
    //             },
        
    //             tujuan_set_steps: function(steps) {
    //                 return req.post(`${this._url}/tujuan_set_steps`, steps).then((data) => data.data);
    //             },
        
    //             pendaftaran_create: function(post) {
    //                 return req.post(`${this._url}/pendaftaran_create`, post).then((data) => data.data);
    //             },
        
    //             pendaftaran_get_next_step: function(id_pendaftaran) {
    //                 return req.get(`${this._url}/pendaftaran_get_next_step/${id_pendaftaran}`).then((data) => data.data);
    //             },
        
    //             pendaftaran_set_to_next_step: function(post) {
    //                 return req.post(`${this._url}/pendaftaran_set_to_next_step`, post).then((data) => data.data);
    //             },
        
    //             pendaftaran_last_track: function(limit = 15, offset = 0, q = "", start, end, entry = false, id_tujuan = "") {
    //                 return req.get(`${this._url}/pendaftaran_last_track/${limit}/${offset}?q=${q}&start=${start}&end=${end}&entry=${entry ? true : ''}&id_tujuan=${id_tujuan}`).then((data) => data.data);
    //             },
        
    //             pendaftaran_one_track: function(id_pendaftaran) {
    //                 return req.get(`${this._url}/pendaftaran_one_track/${id_pendaftaran}`).then((data) => data.data);
    //             },
        
    //             pendaftaran_last_my_track: function(limit = 15, offset = 0, q = "", start, end, id_tujuan = "") {
    //                 return req.get(`${this._url}/pendaftaran_last_track/${limit}/${offset}?q=${q}&my=true&start=${start}&end=${end}&id_tujuan=${id_tujuan}`).then((data) => data.data);
    //             },
        
    //             pendaftaran_done: function(id_pendaftaran) {
    //                 return req.post(`${this._url}/pendaftaran_done`, {id_pendaftaran}).then((data) => data.data);
    //             },
        
    //             pendaftaran_all_done: function(limit = 15, offset = 0, q = "", start, end, entry, id_tujuan = "") {
    //                 return req.get(`${this._url}/pendaftaran_all_done/${limit}/${offset}?q=${q}&start=${start}&end=${end}&entry=${entry ? true : ''}&id_tujuan=${id_tujuan}`).then((data) => data.data);
    //             },
        
    //             pendaftaran_one_done: function(id_pendaftaran) {
    //                 return req.get(`${this._url}/pendaftaran_one_done/${id_pendaftaran}`).then((data) => data.data);
    //             },

    //             pendaftaran_count_pending: function() {
    //                 return req.get(`${this._url}/pendaftaran_count_pending`).then((data) => data.data);
    //             },

    //             pendaftaran_rekap_jumlah: function(start, end) {
    //                 return req.get(`${this._url}/pendaftaran_rekap_jumlah?start=${start}&end=${end}`).then((data) => data.data);
    //             },
        
    //             pengguna_index: function(limit = 15, offset = 0, q = "") {
    //                 return req.get(`${this._url}/pengguna_index/${limit}/${offset}?q=${q}`).then((data) => data.data);
    //             },
        
    //             pengguna_create: function(post) {
    //                 return req.post(`${this._url}/pengguna_create`, post).then((data) => data.data);
    //             },
        
    //             pengguna_delete: function(id_pengguna) {
    //                 return req.get(`${this._url}/pengguna_delete/${id_pengguna}`).then((data) => data.data);
    //             },
        
    //             pengguna_show: function(id_pengguna) {
    //                 return req.get(`${this._url}/pengguna_show/${id_pengguna}`).then((data) => data.data);
    //             },
        
    //             pengguna_edit: function(post) {
    //                 return req.post(`${this._url}/pengguna_edit`, post).then((data) => data.data);
    //             },

    //             pengguna_password: function(post) {
    //                 return req.post(`${this._url}/pengguna_password`, post).then((data) => data.data);
    //             },

    //             chat_index: function(limit, offset, to) {
    //                 return req.get(`${this._url}/chat_index/${limit}/${offset}?to=${to}`).then((data) => data.data);
    //             },

    //             chat_create: function(data) {
    //                 return req.post(`${this._url}/chat_create`, data).then((data) => data.data);
    //             }
        
    //         },

    //         external: {

    //             _url: `http://36.67.90.85/capil/api`,

    //             ambil_keluarga: function(kk) {
    //                 return fetch(`${this._url}/ambil_data_pasangan_kk/${kk}`).then((res) => res.json());
    //             },

    //             ambil_penduduk: function(nik) {
    //                 return fetch(`${this._url}/ambil_penduduk/${nik}`).then((res) => res.json());
    //             }

    //         }
        
    //     };
    //     if(socket.id) {
    //         req.defaults.headers.common["x-socket-id"] = socket.id;
    //         resolve(services);
    //     } else {
    //         socket.on("connect", () => {
    //             req.defaults.headers.common["x-socket-id"] = socket.id;
    //             resolve(services);
    //         });
    //     }
    // });
}

export default getModels;