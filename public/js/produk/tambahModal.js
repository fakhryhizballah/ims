const openModalAddProduct = document.getElementById('btnopenModalAddProduct');
const addProductModal = document.getElementById('addProductModal');
const cancelBtn = document.getElementById('cancelBtn');
const inputDataForm = document.getElementById('inputDataForm');
const editProductModal = document.getElementById('editProductModal');

openModalAddProduct.addEventListener('click', () => {
    addProductModal.classList.remove('hidden');
    inputDataForm.reset();
    document.getElementById('simpan').innerHTML = "Simpan";

});
async function openModalEditProduct(kode_barang) {
    addProductModal.classList.remove('hidden');
    let dataBarang = await fetchData(`/api/barang?kode_barang=${kode_barang}`, 'GET');
    inputDataForm.reset();
    inputDataForm.kode_barang.value = dataBarang.data[0].kode_barang;
    inputDataForm.nama_barang.value = dataBarang.data[0].nama_barang;
    inputDataForm.jenis_barang.value = dataBarang.data[0].jenisbarang.jenis_barang;
    inputDataForm.satuan_besar.value = dataBarang.data[0].satuan_besar;
    inputDataForm.kapasitas.value = dataBarang.data[0].isi;
    inputDataForm.satuan_kecil.value = dataBarang.data[0].satuan_kecil;
    inputDataForm.hargaRp.value = new Intl.NumberFormat('id-ID').format(dataBarang.data[0].harga);
    inputDataForm.hiddenHarga.value = dataBarang.data[0].harga;
    document.getElementById('simpan').innerHTML = "Edit";


}

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
let hiddenHarga = document.getElementById('harga');
inputHarga.addEventListener('input', function (e) {
    // Ambil hanya angka
    let value = this.value.replace(/[^0-9]/g, '');

    // Format ke Rupiah
    if (value) {
        this.value = new Intl.NumberFormat('id-ID').format(value);
        hiddenHarga.value = value;
    } else {
        this.value = '';
        hiddenHarga.value = '';
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
    satuan_kecil.innerHTML = '<option value="" disabled selected>Pilih satuan kecilss</option>';
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
    console.log('inputDataForm');

    // Ambil data form
    const formData = new FormData(inputDataForm);
    const data = Object.fromEntries(formData.entries());
    if (data.kode_barang) {
        console.log('edit')
        let kirim = await fetchData('/api/barang/edit', 'POST', data);

        // Access the status code here
        console.log('Edit Response Status Code:', kirim);
        let icon = kirim.res.status === 200 ? "success" : "warning";
        Swal.fire({
            position: "top-end",
            icon: icon,
            toast: true,
            title: kirim.message,
            showConfirmButton: false,
            timer: 1500,
        }).then(() => {
            inputDataForm.reset();
            addProductModal.classList.add('hidden');
            index();
        });
        return;
    }

    console.log('Data barang:', data);
    let kirim = await fetchData('/api/barang', 'POST', data);
    let icon = kirim.res.status === 200 ? "success" : "warning";
    // Access the status code here
    console.log('Add Response Status Code:', kirim);

    Swal.fire({
        position: "top-end",
        icon: icon,
        toast: true,
        title: kirim.message,
        showConfirmButton: false,
        timer: 1500,
    }).then(() => {
        inputDataForm.reset();
        index();
    });
});