const depoFilter = document.getElementById('depoFilter');
async function fetchDepo() {
    let depots = await fetchData('/api/gudang', 'GET');
    depots.data.forEach(depo => {
        let option = document.createElement('option');
        option.value = depo.kode_depo;
        option.textContent = depo.depo;
        depoFilter.appendChild(option);
    });
}
depoFilter.addEventListener('change', () => {
    document.getElementById('openModalStockOpname').disabled = false;
    const idDepo = depoFilter.value;
    if (idDepo) {
         getProduct(idDepo);
    }else{
        document.getElementById('openModalStockOpname').disabled = true;
        productsTable.innerHTML = '';
    }

});

fetchDepo();

let latestBarangList = [];
const searchInput = document.getElementById('pencarian');
if (searchInput) {
    searchInput.addEventListener('input', function (e) {
        const q = (e.target.value || '').trim().toLowerCase();
        if (!q) {
            renderProductsTable(latestBarangList);
            return;
        }
        const filtered = latestBarangList.filter(item => {
            const name = (item.nama_barang || '').toLowerCase();
            const jenis = (item.jenisbarang && item.jenisbarang.jenis_barang ? item.jenisbarang.jenis_barang : '').toLowerCase();
            const kode = (item.kode_barang || '').toLowerCase();
            return name.includes(q) || jenis.includes(q) || kode.includes(q);
        });
        renderProductsTable(filtered);
    });
}

async function getProduct(idDepo) {
    if (!idDepo) {
        idDepo = depoFilter.value;
    }
    const response = await fetchData(`/api/gudang/stokall/${idDepo}`, 'GET');
    const barangList = response.data;
    latestBarangList = barangList || [];
    renderProductsTable(latestBarangList);
    return
}
const productsTable = document.getElementById('productsTable');

function renderProductsTable(barangList) {
    productsTable.innerHTML = '';
    if (!barangList || barangList.length === 0) {
        productsTable.innerHTML = '<tr><td colspan="7" class="px-6 py-4 text-center">Tidak ada data</td></tr>';
        return;
    }
    barangList.forEach(item => {
        const tr = document.createElement('tr');
        tr.className = 'bg-white dark:bg-gray-800';
        tr.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">${item.nama_barang || ''}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">${(item.jenisbarang && item.jenisbarang.jenis_barang) || ''}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">${item.satuan_besar || ''}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">${item.isi || ''}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">${item.satuan_kecil || ''}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">${item.harga || ''}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">${item.stokGrups}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">${item.stok }</td>
        `;
        productsTable.appendChild(tr);
    });
}

async function openModalStockOpname() {
    let idDepo = document.getElementById('depoFilter').value;
    const modal = document.getElementById('addModal');
    const modalTitle = document.getElementById('modalTitle');
    modalTitle.innerHTML = 'Stock Opname';
    const form = document.getElementById('inputDataForm');
    form.innerHTML = '';
    let formFrom = document.createElement('div');
    formFrom.innerHTML = `  
                <div>
                    <input 
                        type="hidden" 
                        id="id" 
                        name="id" 
                        value="/api/gudang/stok/${idDepo}"
                    >
                    <label for="barang" class="block mb-1 font-medium">nama barang</label>
                    <input 
                        type="text" 
                        id="barang" 
                        name="barang" 
                        required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-indigo-400"
                        placeholder="Masukkan nama barang"
                    >
                </div>
                <div>
                    <label for="namaBarang" class="block mb-1 font-medium">Barang</label>
                    <input 
                        type="text" 
                        id="namaBarang" 
                        name="namaBarang" 
                        required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-indigo-400"
                        placeholder="Masukkan namaBarang"
                    >
                </div>
                <div>
                    <input 
                        type="hidden" 
                        id="kode_barang" 
                        name="kode_barang" 
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-indigo-400"
                        placeholder="Masukkan kode_barang"
                    >
                </div>
                <div>
                    <label for="stokDepoBesar" class="block mb-1 font-medium">Estimasi stok depo Satuan Besar</label>
                    <div class="flex">
                    <input 
                        type="number" 
                        id="stokDepoBesar" 
                        name="stokDepoBesar" 
                        readonly
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-indigo-400"
                    >
                    <span id="SatuanBesar" class="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md text-gray-700 dark:bg-gray-600 dark:border-gray-600 dark:text-gray-300">
                        unit
                    </span>
                    </div>
                </div>
                <div>
                    <label for="stokDepo" class="block mb-1 font-medium">stok depo</label>
                    <div class="flex">
                    <input 
                        type="number" 
                        id="stokDepo" 
                        name="stokDepo" 
                        readonly
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-indigo-400"
                    >
                    <span id="SatuanKecil" class="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md text-gray-700 dark:bg-gray-600 dark:border-gray-600 dark:text-gray-300">
                        unit
                    </span>
                    </div>
                </div>
                <div>
                    <label for="stokRealBesar" class="block mb-1 font-medium">Stok Real Satuan Besar</label>
                    <div class="flex">
                        <input
                            type="number" 
                            id="stokRealBesar" 
                            name="stokRealBesar" 
                            class="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-indigo-400"
                            placeholder="Masukkan jumlah"
                        >
                        <span id="SatuanBesarReal" class="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md text-gray-700 dark:bg-gray-600 dark:border-gray-600 dark:text-gray-300">
                            unit
                        </span>
                    </div>
                </div>
                <div>
                    <label for="stokRealKecil" class="block mb-1 font-medium">Stok Real</label>
                    <div class="flex">
                        <input 
                            type="number" 
                            id="stokRealKecil" 
                            name="stokRealKecil" 
                            required
                            class="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-indigo-400"
                            placeholder="Masukkan jumlah"
                        >
                        <span id="SatuanKecilReal" class="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md text-gray-700 dark:bg-gray-600 dark:border-gray-600 dark:text-gray-300">
                            unit
                        </span>
                    </div>
                </div>
                 <div>
                    <label for="status" class="block mb-1 font-medium">Status</label>
                    <input 
                        type="text" 
                        id="status" 
                        name="status" 
                        required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-indigo-400"
                        placeholder="Masukkan Status"
                    >
                </div>
                <!-- Tombol Submit -->
                <div class="flex justify-end space-x-2 pt-4">
                    <button 
                        onclick="closeModal('addModal')"
                        type="button" 
                        class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    >
                        Batal
                    </button>
                    <button 
                        type="submit"
                        class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        Simpan
                    </button>
                </div>
                `;
    form.appendChild(formFrom);
    modal.classList.remove('hidden');
    form.reset();
    let statusOpnameInput = document.getElementById('statusOpname').value;
    document.getElementById('status').value = statusOpnameInput;
    let namaBarangInput = document.getElementById('barang');
    let satuanBesarSpan = 0;
    namaBarangInput.addEventListener('input', async function () {
        let namaBarang = namaBarangInput.value;
        let dataStok = await fetchData(`/api/gudang/stok/${idDepo}?nama_barang=${namaBarang}`, 'GET');
        if (dataStok.status === 200) {
            satuanBesarSpan = dataStok.data.isi;
            document.getElementById('namaBarang').value = dataStok.data.nama_barang;
            document.getElementById('kode_barang').value = dataStok.data.kode_barang;
            document.getElementById('SatuanBesar').innerHTML = dataStok.data.satuan_besar;
            document.getElementById('stokDepoBesar').value = parseInt(dataStok.data.stokGrups);
            document.getElementById('SatuanKecil').innerHTML = dataStok.data.satuan_kecil;
            document.getElementById('stokDepo').value = parseInt(dataStok.data.stok);
            document.getElementById('SatuanBesarReal').innerHTML = dataStok.data.satuan_besar;
            document.getElementById('SatuanKecilReal').innerHTML = dataStok.data.satuan_kecil;
        } else {
            document.getElementById('namaBarang').value = '';
            document.getElementById('kode_barang').value = '';
            document.getElementById('stokDepoBesar').value = '';
            document.getElementById('stokDepo').value = '';
        }



    });
    let stokGrupReal = document.getElementById('stokRealBesar');
    stokGrupReal.addEventListener('input', async function () {

        let isi = satuanBesarSpan;
        let stokKecilReal = stokGrupReal.value * isi;
        document.getElementById('stokRealKecil').value = stokKecilReal;
    })

}

function closeModal(modalId) {
    const modal = document.getElementById('addModal');
    modal.classList.add('hidden');
}




let inputDataForm = document.getElementById('inputDataForm');
inputDataForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    let formData = new FormData(inputDataForm);
    const data = Object.fromEntries(formData.entries());
    const depoFilter = document.getElementById('depoFilter');
    const idDepo = depoFilter.value;
    if (!data.kode_barang) {
        Swal.fire({
            position: "top-end",
            icon: "error",
            toast: true,
            title: "Barang tidak ada",
            showConfirmButton: false,
            timer: 1500,
        });
        return;
    }
    let kirim = await fetchData(`/api/gudang/opname/${idDepo}`, 'POST', data);

    if (kirim.status === 200) {
        Swal.fire({
            position: "top-end",
            icon: "success",
            toast: true,
            title: kirim.message,
            showConfirmButton: false,
            timer: 1500,
        }).then(() => {
            closeModal('addModal');
            getProduct();
        });

    } else {
        console.log('reload' + kirim.status);
        Swal.fire({
            position: "top-end",
            icon: "error",
            toast: true,
            title: kirim.message || "Terjadi kesalahan",
            showConfirmButton: false,
            timer: 1500,
        });
    }
});
