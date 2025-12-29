const openModalAddProduct = document.getElementById('openModalAddProduct');
const addProductModal = document.getElementById('addProductModal');
const cancelBtn = document.getElementById('cancelBtn');
const inputDataForm = document.getElementById('inputDataForm');

openModalAddProduct.addEventListener('click', () => {
    addProductModal.classList.remove('hidden');
});

cancelBtn.addEventListener('click', () => {
    addProductModal.classList.add('hidden');
});

// Tutup modal jika klik di luar konten modal
addProductModal.addEventListener('click', (e) => {
    if (e.target === addProductModal) {
        addProductModal.classList.add('hidden');
    }
});

let inputHarga = document.getElementById('hargaRp');
let hidden = document.getElementById('harga');
inputHarga.addEventListener('input', function (e) {
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
inputDataForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Ambil data form
    const formData = new FormData(inputDataForm);
    const data = Object.fromEntries(formData.entries());

    console.log('Data barang:', data);
    await fetchData('/api/barang', 'POST', data);

    // TODO: Kirim data ke server atau proses sesuai kebutuhan

    // Tutup modal dan reset form
    // dataModal.classList.add('hidden');
    // inputDataForm.reset();
    Swal.fire({
        position: "top-end",
        icon: "success",
        toast: true,
        title: "Data barang berhasil ditambahkan",
        showConfirmButton: false,
        timer: 1500,
    }).then(() => {
        inputDataForm.reset();
        index();
    });
});