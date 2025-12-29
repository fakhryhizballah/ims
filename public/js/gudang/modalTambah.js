function menuModal(modalId) {
    const modal = document.getElementById('addModal');
    const modalTitle = document.getElementById('modalTitle');
    const form = document.getElementById('inputDataForm');
    form.innerHTML = '';
    if (modalId === 'addSuppliersModal') {
        modalTitle.innerHTML = 'Tambah Suplayer';
        let formFrom = document.createElement('div');
        formFrom.innerHTML = `
                <div>
                    <input 
                        type="hidden" 
                        id="id" 
                        name="id" 
                        value="/api/supplier"
                    >
                    <label for="supplier" class="block mb-1 font-medium">nama supplier</label>
                    <input 
                        type="text" 
                        id="supplier" 
                        name="supplier" 
                        required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-indigo-400"
                        placeholder="Masukkan nama supplier"
                    >
                </div>
                <div>
                    <label for="alamat" class="block mb-1 font-medium">alamat</label>
                    <input 
                        type="text" 
                        id="alamat" 
                        name="alamat" 
                        required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-indigo-400"
                        placeholder="Masukkan alamat"
                    >
                </div>
                <div>
                    <label for="nowa" class="block mb-1 font-medium">No Telpon</label>
                    <input 
                        type="number" 
                        id="nowa" 
                        name="nowa" 
                        required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-indigo-400"
                        placeholder="Masukkan No Telpon"
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
    }
    if (modalId === 'addDepoModal') {
        modalTitle.innerHTML = 'Tambah Depo';
        let formFrom = document.createElement('div');
        formFrom.innerHTML = `
                <div>
                    <input 
                        type="hidden" 
                        id="id" 
                        name="id" 
                        value="/api/gudang"
                    >
                    <label for="depo" class="block mb-1 font-medium">Nama Depo</label>
                    <input 
                        type="text" 
                        id="depo" 
                        name="depo" 
                        required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-indigo-400"
                        placeholder="Masukkan nama depo"
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
    }
    modal.classList.remove('hidden');
    form.reset();
}
function closeModal(modalId) {
    const modal = document.getElementById('addModal');
    modal.classList.add('hidden');
}
let inputDataForm = document.getElementById('inputDataForm');
console.log(inputDataForm);
inputDataForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    let formData = new FormData(inputDataForm);
    const data = Object.fromEntries(formData.entries());
    let kirim = await fetchData(data.id, 'POST', data);

    if (kirim.status === 200) {
        console.log('reload 200');
        Swal.fire({
            position: "top-end",
            icon: "success",
            toast: true,
            title: kirim.message,
            showConfirmButton: false,
            timer: 1500,
        }).then(() => {
            console.log('reload');
            closeModal('addModal');
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