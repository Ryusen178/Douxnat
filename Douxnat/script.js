// 1. Inisialisasi Data
let cart = JSON.parse(localStorage.getItem('DOUXNAT_CART')) || [];

// 2. Jalankan saat halaman siap
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
});

// 3. Fungsi Tambah ke Keranjang
function addToCart(name, price) {
    cart.push({ name, price });
    saveAndUpdate();
    alert(name + " ditambahkan ke keranjang!");
}

// 4. Fungsi Hapus
function removeFromCart(index) {
    cart.splice(index, 1);
    saveAndUpdate();
}

// 5. Simpan ke Storage & Refresh Tampilan
function saveAndUpdate() {
    localStorage.setItem('DOUXNAT_CART', JSON.stringify(cart));
    updateCartUI();
}

// 6. UPDATE SEMUA TAMPILAN (Pusat Perbaikan)
function updateCartUI() {
    // Update SEMUA badge angka (Navbar & Floating)
    const badges = document.querySelectorAll('.cart-count-badge');
    badges.forEach(badge => {
        badge.innerText = cart.length;
    });

    // Update Daftar di Modal
    const list = document.getElementById('cartItemsList');
    const totalEl = document.getElementById('cartTotalPrice');

    if (list && totalEl) {
        list.innerHTML = '';
        let total = 0;

        cart.forEach((item, index) => {
            total += item.price;
            list.innerHTML += `
                <div class="cart-item-row" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; border-bottom:1px solid #eee; padding-bottom:5px;">
                    <div>
                        <div style="font-weight:bold;">${item.name}</div>
                        <div style="font-size:12px; color:#888;">Rp ${item.price.toLocaleString()}</div>
                    </div>
                    <button onclick="removeFromCart(${index})" style="color:red; border:none; background:none; cursor:pointer; font-size:18px;">&times;</button>
                </div>
            `;
        });
        totalEl.innerText = "Rp " + total.toLocaleString();
    }
}

// 7. Kontrol Modal
function toggleCart() {
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.style.display = (modal.style.display === 'block') ? 'none' : 'block';
    }
}

// 8. Kirim ke WA
function sendToWhatsApp() {
    if (cart.length === 0) {
        alert("Keranjang masih kosong!");
        return;
    }

    let nomorWA = "628123456789"; 
    let pesan = "🛍️ *PESANAN BARU - DOUXNAT*\n\n";
    cart.forEach((item, i) => {
        pesan += `${i+1}. ${item.name} (Rp ${item.price.toLocaleString()})\n`;
    });

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    pesan += `\n💰 *Total: Rp ${total.toLocaleString()}*`;

    window.open(`https://wa.me/${nomorWA}?text=${encodeURIComponent(pesan)}`, '_blank');

    // Reset setelah pesan
    cart = [];
    saveAndUpdate();
    toggleCart();
}

window.onclick = function(event) {
    const modal = document.getElementById('cartModal');
    if (event.target == modal) toggleCart();
}

// Fungsi untuk pindah ke tampilan form alamat
function showCheckout() {
    if (cart.length === 0) {
        alert("Keranjang masih kosong!");
        return;
    }
    document.getElementById('cartMainView').style.display = 'none';
    document.getElementById('checkoutSection').style.display = 'block';
}

// Fungsi untuk kembali ke daftar keranjang
function hideCheckout() {
    document.getElementById('cartMainView').style.display = 'block';
    document.getElementById('checkoutSection').style.display = 'none';
}

// Fungsi final untuk memproses pesanan
function processFinalOrder() {
    const name = document.getElementById('buyerName').value;
    const address = document.getElementById('buyerAddress').value;

    if (!name || !address) {
        alert("Mohon isi nama dan alamat lengkap ya Kak!");
        return;
    }

    // Menyiapkan pesan ringkasan untuk konfirmasi akhir ke WA (sebagai bukti bayar)
    let pesan = `*KONFIRMASI PEMBAYARAN - DOUXNAT*\n`;
    pesan += `--------------------------\n`;
    pesan += `👤 Nama: ${name}\n`;
    pesan += `📍 Alamat: ${address}\n`;
    pesan += `--------------------------\n`;
    
    cart.forEach((item, i) => {
        pesan += `${i+1}. ${item.name} - Rp ${item.price.toLocaleString()}\n`;
    });

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    pesan += `--------------------------\n`;
    pesan += `💰 *TOTAL TRANSFER: Rp ${total.toLocaleString()}*\n\n`;
    pesan += `*Saya sudah transfer ke rekening BCA 1234567890.* Berikut bukti transfernya:`;

    const nomorWA = "628123456789"; 
    window.open(`https://wa.me/${nomorWA}?text=${encodeURIComponent(pesan)}`, '_blank');

    // Reset data
    cart = [];
    saveAndUpdate();
    toggleCart();
    hideCheckout(); // Reset tampilan modal ke awal
}