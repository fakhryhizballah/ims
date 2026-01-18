// let totalProducts = document.getElementById('totalProducts');
// fetch('/api/barang', { method: 'GET' })
//     .then(response => response.json())
//     .then(data => {
//         console.log(data);
//         totalProducts.innerText = data.data.length;
//     })
async function index() {
    let main = await fetchData('/api/barang', 'GET');
    let totalProducts = document.getElementById('totalProducts');
    totalProducts.innerText = main.total.barang;
    let totalJenis = document.getElementById('totalJenis');
    totalJenis.innerText = main.total.jenis;
    let kategoryList = await fetchData('/api/barang/category', 'GET');
    console.log(kategoryList);
    let kategory = document.getElementById('categoryFilter');
    kategory.innerHTML = '<option value="">All Categories</option>';
    kategoryList.data.forEach(x => {
        const option = document.createElement('option');
        option.value = x.kode_jenis;
        option.textContent = x.jenis_barang;
        kategory.appendChild(option);
    });
    tabelProduct(main.data);

}
index();

function tabelProduct(data) {
    let productsTable = document.getElementById('productsTable');
    productsTable.innerHTML = '';
    data.forEach(x => {
        const productRow = document.createElement('tr');
        productRow.className = 'hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200';
        productRow.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">${x.nama_barang}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">${x.jenisbarang.jenis_barang}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">${x.satuan_besar}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">${x.isi}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">${x.satuan_kecil}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600 dark:text-indigo-400">Rp. ${x.harga.toLocaleString('id-ID')}</td>
            <td class="px-6 py-4 whitespace-nowrap text-2xl font-bold text-gray-900 dark:text-white">
                <button onClick="openModalEditProduct('${x.kode_barang}')" class="bg-indigo-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-indigo-700 transition-colors dark:hover:bg-indigo-800">
                    <i class="fas fa-edit mr-1"></i>Edit
                </button>
                <button onClick="openModalDeleteProduct('${x.nama_barang}')" class="bg-red-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-red-700 transition-colors dark:hover:bg-red-800">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        productsTable.appendChild(productRow);
    });
}

let pencarian = document.getElementById('pencarian');
pencarian.addEventListener('input', async () => {
    let categoryFilter = document.getElementById('categoryFilter').value;
    let cari = pencarian.value;
    let main = await fetchData(`/api/barang/cari?nama_barang=${cari}&jenis_barang=${categoryFilter}`, 'GET');
    tabelProduct(main.data);
});
let categoryFilter = document.getElementById('categoryFilter');
categoryFilter.addEventListener('change', async () => {
    let cari = pencarian.value;
    let main = await fetchData(`/api/barang/cari?nama_barang=${cari}&jenis_barang=${categoryFilter.value}`, 'GET');
    tabelProduct(main.data);
});

async function openModalDeleteProduct(nama) {
    Swal.fire({
        position: "middle",
        icon: "warning",
        toast: true,
        title: 'Maaf ' + nama + ' tidak bisa di hapus',
        showConfirmButton: false,
        timer: 1500,
    })

}