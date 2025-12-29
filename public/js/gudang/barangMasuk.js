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
   
    const idDepo = depoFilter.value;
    if (idDepo) {
        document.getElementById('tambahBarangMasuk').disabled = false;
        document.getElementById('tambahBarangMasuk').classList.remove('cursor-not-allowed');
        document.getElementById('tambahBarangMasuk').classList.remove('opacity-50');
        document.getElementById('tanggalFilter').disabled = false;
        document.getElementById('tanggalFilter').classList.remove('cursor-not-allowed', 'opacity-50');
        
    } else {
        document.getElementById('tambahBarangMasuk').disabled = true;
        document.getElementById('tambahBarangMasuk').classList.add('cursor-not-allowed');
        document.getElementById('tambahBarangMasuk').classList.add('opacity-50');
        document.getElementById('tanggalFilter').disabled = true;
        document.getElementById('tanggalFilter').classList.add('cursor-not-allowed', 'opacity-50');
    }

});

fetchDepo();
async function dataSupplier() {
    let suplayers = await fetchData('/api/supplier', 'GET');
    let dataOption = document.getElementById('supplier_id');
    suplayers.data.forEach(suplayer => {
        let option = document.createElement('option');
        option.value = suplayer.id;
        option.textContent = suplayer.supplier;
        dataOption.appendChild(option);
       
    });
    
}

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

async function getProduct(idDepo, startDate, endDate) {
    if (!idDepo) {
        idDepo = depoFilter.value;
    }
    const response = await fetchData(`/api/penerimaan/cari?kode_depo=${idDepo}&start=${startDate}&end=${endDate}`, 'GET');
    const barangList = response.data;
    latestBarangList = barangList || [];
    renderProductsTable(latestBarangList);
    return
}
function renderProductsTable(barangList) {
    const productsTable = document.getElementById('dataPenerimaan');
    productsTable.innerHTML = '';
    if (!barangList || barangList.length === 0) {
        productsTable.innerHTML = '<tr><td colspan="10" class="px-6 py-4 text-center">Tidak ada data</td></tr>';
        return;
    }
    barangList.forEach(item => {
        const tr = document.createElement('tr');
        tr.className = 'bg-white dark:bg-gray-800';
        tr.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">${item.barang.nama_barang || ''}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">${(item.barang.jenisbarang.jenis_barang) || ''}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">${item.satuan_besar || ''}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">${item.satuan_kecil || ''}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">${item.harga || ''}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">${item.total_harga || ''}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">${(item.supplier.supplier) || ''}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">${item.tanggal || ''}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">${item.user || ''}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                <button class="text-indigo-600 hover:text-indigo-900">Edit</button>
                <button class="text-red-600 hover:text-red-900 ml-2">Delete</button>
            </td>
        `;
        productsTable.appendChild(tr);
    });

    
}

async function tambahBarangMasuk() {
    let idDepo = document.getElementById('depoFilter').value;
    const modal = document.getElementById('addModal');
    const modalTitle = document.getElementById('modalTitle');
    modalTitle.innerHTML = 'Input Data Barang Masuk';
    const form = document.getElementById('inputDataForm');
    form.innerHTML = '';
    let formFrom = document.createElement('div');
    let dateNow = new Date();
    formFrom.innerHTML = `  
                <div>
                    <input 
                        type="hidden" 
                        id="id" 
                        name="id" 
                        value="${idDepo}"
                    >
                </div>
                
                <div class="relative">
                  <label for="barang" class="block mb-1 font-medium">Nama Barang</label>
                    <input list="suggestionList" id="nama_barang" name="nama_barang" required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-indigo-400"
                        placeholder="Masukkan nama barang">
                    <datalist id="suggestionList">
        
                    </datalist>
                </div>
                <div>
                    <label for="kode_barang" class="block mb-1 font-medium">Kode Barang</label>
                    <input 
                        type="text" 
                        id="kode_barang" 
                        name="kode_barang" 
                        required
                        readonly
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-indigo-400"
                        placeholder="Masukkan kode barang"
                    >
                </div>
                <div>
                    <label for="satuan_besar" class="block mb-1 font-medium">Satuan Besar</label>
                    <div class="flex">
                        <input 
                            type="number" 
                            id="satuan_besar" 
                            name="satuan_besar" 
                            required
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-indigo-400"
                            placeholder="Masukkan satuan besar"
                        >
                        <span id="SatuanBesar" class="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md text-gray-700 dark:bg-gray-600 dark:border-gray-600 dark:text-gray-300">
                                unit
                        </span>
                    </div>
                </div>
                <div>
                    <label for="satuan_kecil" class="block mb-1 font-medium">Satuan Kecil</label>
                    <div class="flex">
                        <input 
                            type="number" 
                            id="satuan_kecil" 
                            name="satuan_kecil" 
                            required
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-indigo-400"
                            placeholder="Masukkan satuan kecil"
                        >
                        <span id="SatuanKecil" class="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md text-gray-700 dark:bg-gray-600 dark:border-gray-600 dark:text-gray-300">
                                unit
                        </span>
                    </div>
                </div>
                <div>
                    <label for="harga" class="block mb-1 font-medium">Harga</label>
                    <input 
                        type="number" 
                        id="harga" 
                        name="harga" 
                        required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-indigo-400"
                        placeholder="Masukkan harga"
                    >
                </div>
                <div>
                    <label for="total_harga" class="block mb-1 font-medium">Total Harga</label>
                    <input 
                        type="number" 
                        id="total_harga" 
                        name="total_harga" 
                        required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-indigo-400"
                        placeholder="Masukkan total harga"
                    >
                </div>
                <div class="mb-6">
                    <label for="supplier_id" class="block mb-1 font-medium">Supplier ID</label>
                    <select 
                        id="supplier_id" 
                        name="supplier_id" 
                        required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-indigo-400"
                    >
                        <option value="">Pilih Supplier</option>
                    </select>
                </div>
                <div>
                    <label for="depo_id" class="block mb-1 font-medium">Depo ID</label>
                    <input 
                        type="text" 
                        id="depo_id" 
                        name="depo_id" 
                        value="${idDepo}"
                        readonly
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-indigo-400"
                        placeholder="Masukkan Depo ID"
                    >
                </div>
                <div>
                    <label for="tanggal" class="block mb-1 font-medium">Tanggal</label>
                    <input 
                        type="date" 
                        id="tanggal" 
                        name="tanggal" 
                        value="${dateNow.toISOString().split('T')[0]}"
                        required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-indigo-400"
                    >
                </div>
                <div>
                    <label for="penerima" class="block mb-1 font-medium">Penerima</label>
                    <input 
                        type="text" 
                        id="penerima" 
                        name="penerima" 
                        required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-indigo-400"
                        placeholder="Masukkan nama penerima"
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
    dataSupplier();
    let namaBarangInput = document.getElementById('nama_barang');
    let satuan_besar = document.getElementById('satuan_besar');
    let satuan_kecil = document.getElementById('satuan_kecil');
    let isi = 0;
    let harga = 0;
    namaBarangInput.addEventListener('input', async function () {
        let cari = namaBarangInput.value;
        let main = await fetchData(`/api/barang/cari?nama_barang=${cari}&jenis_barang=`, 'GET');
        const sugegstionList = document.getElementById('suggestionList');
        // console.log(main);
        sugegstionList.innerHTML = '';
        if (main.data.length > 0) {
            main.data.forEach(data => {
                const suggestion = document.createElement('option');
                suggestion.className = 'px-3 py-2 border-b border-gray-300';
                suggestion.value = `${data.nama_barang}`;
                sugegstionList.appendChild(suggestion);
            });
            console.log(main.data[0]);
            document.getElementById('kode_barang').value = main.data[0].kode_barang;
            document.getElementById('SatuanBesar').value = main.data[0].satuan_besar;
            document.getElementById('SatuanKecil').value = main.data[0].satuan_kecil;
            document.getElementById('harga').value = main.data[0].harga;
            isi = main.data[0].isi
            harga = main.data[0].harga
        }
    });
    satuan_besar.addEventListener('input', function () {
        let getValue = satuan_besar.value;
        console.log(getValue);
        let hargaSatuan = document.getElementById('harga').value;
        document.getElementById('satuan_kecil').value = getValue * isi;
        document.getElementById('total_harga').value = getValue * isi * hargaSatuan;
    })
    satuan_kecil.addEventListener('input', function () {
        let getValue = satuan_kecil.value;
        let hargaSatuan = document.getElementById('harga').value;
        document.getElementById('total_harga').value = getValue * hargaSatuan;
    })
    document.getElementById('harga').addEventListener('input', function () {
        let hargaSatuan = document.getElementById('harga').value;
        let getValue = document.getElementById('satuan_kecil').value;
        document.getElementById('total_harga').value = getValue * hargaSatuan;
    })


    // form.reset();
}
inputDataForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    let formData = new FormData(inputDataForm);
    const data = Object.fromEntries(formData.entries());
    console.log(data);
   
    let kirim = await fetchData(`/api/penerimaan/addPenerimaan`, 'POST', data);

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
            // getProduct();
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

function closeModal(modalId) {
    const modal = document.getElementById('addModal');
    modal.classList.add('hidden');
}


document.addEventListener('DOMContentLoaded', function () {
    // Initialize the date range picker
    $('#tanggalFilter').daterangepicker({
        opens: 'left',
        locale: {
            format: 'YYYY-MM-DD'
        }, maxDate: new Date()
    }, function (start, end, label) {
        let depo = document.getElementById('depoFilter').value;
        console.log(depo);
        if (!depo) {
            Swal.fire({
                position: "top-end",
                icon: "error",
                toast: true,
                title: "Pilih Depo terlebih dahulu",
                showConfirmButton: false,
                timer: 1500,
            });
            return;
        }
        getProduct(depo, start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
        // Callback function when date range is selected
        console.log("A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
        // You can add your filtering logic here based on the selected date range
    });
});