const editProductModal = document.getElementById('editProductModal');
const cancelBtnEdit = document.getElementById('cancelBtnEdit');
const inputDataFormEdit = document.getElementById('inputDataFormEdit');

async function openModalEditProduct(kode_barang) {
    editProductModal.classList.remove('hidden');
    let dataBarang = await fetchData(`/api/barang?kode_barang=${kode_barang}`, 'GET');
    inputDataFormEdit.reset();
    inputDataFormEdit.kode_barang.value = dataBarang.data[0].kode_barang;
    inputDataFormEdit.nama_barang.value = dataBarang.data[0].nama_barang;
    inputDataFormEdit.jenis_barang.value = dataBarang.data[0].jenisbarang.jenis_barang;
    inputDataFormEdit.satuan_besar.value = dataBarang.data[0].satuan_besar;
    inputDataFormEdit.kapasitas.value = dataBarang.data[0].isi;
    inputDataFormEdit.satuan_kecil.value = dataBarang.data[0].satuan_kecil;
    inputDataFormEdit.hargaRp.value = dataBarang.data[0].harga;

    
}

cancelBtnEdit.addEventListener('click', () => {
    editProductModal.classList.add('hidden');
});

// Tutup modal jika klik di luar konten modal
editProductModal.addEventListener('click', (e) => {
    if (e.target === editProductModal) {
        editProductModal.classList.add('hidden');
    }
});

let inputHargaEdit = document.getElementById('hargaRp');
let hidden = document.getElementById('harga');
inputHargaEdit.addEventListener('input', function (e) {
    // Ambil hanya angka
    let value = this.value.replace(/[^0-9]/g, '');

    // Format ke Rupiah
    if (value) {
        this.value = new Intl.NumberFormat('id-ID').format(value);
        hidden.value = value;
    } else {
        this.value = '';
        hidden.value = '';
    }
});
let getSatuanList = async () => {
    let satuan = await fetchData('/api/barang/satuan', 'GET');
    satuanList = satuan.data;
    let satuanSelect = document.getElementById('satuan_besar');
    satuanSelect.innerHTML = '<option value="" disabled selected>Pilih satuan besar</option>';
    satuanList.forEach(satuan => {
        const option = document.createElement('option');
        option.value = satuan.slug;
        option.textContent = satuan.nama_satuan;
        satuanSelect.appendChild(option);
    });
    let satuan_kecil = document.getElementById('satuan_kecil');
    satuan_kecil.innerHTML = '<option value="" disabled selected>Pilih satuan kecil</option>';
    satuanList.forEach(satuan => {
        const option = document.createElement('option');
        option.value = satuan.slug;
        option.textContent = satuan.nama_satuan;
        satuan_kecil.appendChild(option);
    });
}
getSatuanList();

let jenisBarang = async () => {
    let jenis = await fetchData('/api/barang/category', 'GET');
    jenisList = jenis.data;
    let jenisSelect = document.getElementById('jenis_barang');
    const datalist = document.createElement('datalist');
    datalist.id = 'jenisBarangList';
    jenisSelect.appendChild(datalist);
    jenisList.forEach(jenis => {
        const option = document.createElement('option');
        option.value = jenis.jenis_barang;
        option.textContent = jenis.jenis_barang;
        datalist.appendChild(option);
    });
}
jenisBarang();

// Contoh submit form (bisa disesuaikan)
inputDataFormEdit.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Ambil data form
    const formData = new FormData(inputDataFormEdit);
    const data = Object.fromEntries(formData.entries());

    console.log('Data barang:', data);
    await fetchData('/api/barang/edit', 'POST', data);

    // TODO: Kirim data ke server atau proses sesuai kebutuhan

    // Tutup modal dan reset form
    editProductModal.classList.add('hidden');
    inputDataFormEdit.reset();
    Swal.fire({
        position: "top-end",
        icon: "success",
        toast: true,
        title: "Data barang berhasil ditambahkan",
        showConfirmButton: false,
        timer: 1500,
    }).then(() => {
        inputDataFormEdit.reset();
        index();
    });
});