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
        document.getElementById('tanggalFilter').disabled = false;
        document.getElementById('tanggalFilter').classList.remove('cursor-not-allowed', 'opacity-50');
        
    } else {
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
    const response = await fetchData(`/api/riwayat/stok?kode_depo=${idDepo}&start=${startDate}&end=${endDate}`, 'GET');
    const barangList = response.data;
    latestBarangList = barangList || [];
    renderProductsTable(latestBarangList);
    return
}
function renderProductsTable(barangList) {
    const productsTable = document.getElementById('dataPenerimaan');
    productsTable.innerHTML = '';
    if (!barangList || barangList.length === 0) {
        productsTable.innerHTML = '<tr><td colspan="11" class="px-6 py-4 text-center">Tidak ada data</td></tr>';
        return;
    }
    barangList.forEach(item => {
        const tr = document.createElement('tr');
        tr.className = 'bg-white dark:bg-gray-800';
        let tanggal = new Date(item.tanggal);
        let formattedDate = tanggal.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        tr.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">${item.barang.nama_barang || ''}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">${(item.barang.jenisbarang && item.barang.jenisbarang.jenis_barang) || ''}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">${item.barang.satuan_besar || ''}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">${item.barang.satuan_kecil || ''}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">${item.stok_awal || 0}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">${item.masuk || 0}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">${item.keluar || 0}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">${item.status || ''}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">${formattedDate || ''}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">${item.user_username || ''}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                <button class="text-indigo-600 hover:text-indigo-900">Edit</button>
                <button class="text-red-600 hover:text-red-900 ml-2">Delete</button>
            </td>
        `;
        productsTable.appendChild(tr);
    });

    
}

document.addEventListener('DOMContentLoaded', function () {
    // Ensure the date input doesn't trigger the on-screen keyboard (readonly + inputmode)
    const tanggalFilterEl = document.getElementById('tanggalFilter');
    if (tanggalFilterEl) {
        tanggalFilterEl.setAttribute('readonly', 'readonly');
        tanggalFilterEl.setAttribute('inputmode', 'none');
        // Prevent typing/pasting into the input
        tanggalFilterEl.addEventListener('keydown', function (e) { e.preventDefault(); });
        tanggalFilterEl.addEventListener('keypress', function (e) { e.preventDefault(); });
        tanggalFilterEl.addEventListener('paste', function (e) { e.preventDefault(); });
    }

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