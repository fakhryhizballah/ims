async function kelolaSupplier() {
    let getSupplier = await fetchData('/api/supplier', 'GET');
    const modal = document.getElementById('addModal');
    const modalTitle = document.getElementById('modalTitle');
    const form = document.getElementById('inputDataForm');
    form.innerHTML = '';
    modalTitle.innerHTML = 'Kelola Supplier';
    let formFrom = document.createElement('div');
    // formFrom.classList.add('max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden');
    formFrom.innerHTML = `
                <div class="overflow-x-auto">
                    <table class="min-w-full table-auto">
                        <thead class="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Supplier</th>
                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Alamat</th>
                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">No WA</th>
                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody id="supplierTable" class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                         
                        </tbody>
                    </table>
                </div>`;
    form.appendChild(formFrom);
    let dataTable = document.getElementById('supplierTable');
    getSupplier.data.forEach(supplier => {
        let row = document.createElement('tr');
        row.innerHTML = `
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">${supplier.supplier}</td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">${supplier.alamat}</td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">${supplier.nowa}</td>
                    <td class="px-4 py-2 whitespace-nowrap text-right">
                         <button type="button" class="text-sm text-gray-900 dark:text-gray-100 bg-red-500 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-800 py-1 px-3 rounded" onclick="hapusSupplier('${supplier.kode_supplier}')">Hapus</button>
                    </td>`;
        dataTable.appendChild(row);
    });
    modal.classList.remove('hidden');
    form.reset();
}
async function hapusSupplier(kode_supplier) {
    Swal.fire({
        title: 'Anda yakin?',
        text: 'Data akan dihapus secara permanent',
        icon: 'warning',
        buttons: true,
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Ya, hapus!',
        cancelButtonText: 'Batal'
    }).then(async (result) => {
        if (result.isConfirmed) {
            let deleteSupplier = await fetchData('/api/supplier', 'DELETE', { kode_supplier: kode_supplier });
            if (deleteSupplier.status === 200) {
                Swal.fire('Terhapus!', 'Data supplier telah dihapus.', 'success');
                kelolaSupplier();
            } else {
                Swal.fire('Gagal!', 'Data supplier gagal dihapus.', 'error');
            }
        }
    });
}