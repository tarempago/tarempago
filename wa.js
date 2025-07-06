// Konfigurasi Admin WhatsApp
const ADMIN_WHATSAPP = "6288271127189"; // Ganti dengan nomor admin yang sebenarnya

// Fungsi untuk memvalidasi form
function validateForm(formData) {
    const requiredFields = ['nama'];
    
    for (let field of requiredFields) {
        if (!formData[field] || formData[field].trim() === '') {
            alert(`Field ${field} harus diisi!`);
            return false;
        }
    }
    
    return true;
}

// Fungsi untuk membuat pesan WhatsApp
function createWhatsAppMessage(serviceType, formData) {
    let message = `🌟 *PESANAN ${serviceType.toUpperCase()}* 🌟\n\n`;

    // Data umum
    message += `👤 *Nama:* ${formData.nama}\n`;

    // Data spesifik per layanan
    switch (serviceType) {
        case 'Antar Jemput':
            message += `🚖 *LAYANAN ANTAR JEMPUT*\n`;
            message += `📍 *Alamat Penjemputan:* ${formData.alamat_jemput}\n`;
            message += `🎯 *Alamat Tujuan:* ${formData.alamat_tujuan}\n`;
            if (formData.waktu) {
                const waktu = new Date(formData.waktu).toLocaleString('id-ID');
                message += `⏰ *Waktu Penjemputan:* ${waktu}\n`;
            }
            break;

        case 'Titip Belanja':
            message += `🛒 *LAYANAN TITIP BELANJA*\n`;
            message += `🏪 *Lokasi Belanja:* ${formData.lokasi_belanja}\n`;
            message += `📝 *Daftar Belanja:*\n${formData.daftar_belanja}\n`;
            message += `🏠 *Alamat Pengiriman:* ${formData.alamat_kirim}\n`;
            message += `💰 *Estimasi Budget:* ${formData.budget}\n`;
            break;

        case 'Kirim Barang':
            message += `📦 *LAYANAN KIRIM BARANG*\n`;
            message += `📍 *Alamat Penjemputan:* ${formData.alamat_penjemputan}\n`;
            message += `🎯 *Alamat Tujuan:* ${formData.alamat_tujuan}\n`;
            message += `👤 *Nama Penerima:* ${formData.nama_penerima}\n`;
            message += `📱 *HP Penerima:* ${formData.hp_penerima}\n`;
            message += `📋 *Deskripsi Barang:*\n${formData.deskripsi_barang}\n`;
            message += `⏰ *Waktu Pengiriman:* ${formData.waktu_kirim}\n`;
            break;

        case 'Titip Makan':
            message += `🍱 *LAYANAN TITIP MAKAN*\n`;
            message += `🏪 *Nama Warung:* ${formData.nama_warung}\n`;
            message += `📍 *Alamat Warung:* ${formData.alamat_warung}\n`;
            message += `🍽️ *Pesanan:*\n${formData.pesanan_makanan}\n`;
            message += `🏠 *Alamat Pengiriman:* ${formData.alamat_kirim}\n`;
            message += `⏰ *Waktu Pengiriman:* ${formData.waktu_kirim}\n`;
            message += `💰 *Estimasi Budget:* ${formData.budget}\n`;
            break;
    }

    // Metode pembayaran
    message += `\n💳 *Metode Pembayaran:* ${formData.bayar}\n`;

    // Catatan tambahan
    if (formData.catatan && formData.catatan.trim() !== '') {
        message += `\n📝 *Catatan Tambahan:*\n${formData.catatan}\n`;
    }

    message += `\n✨ Terima kasih telah menggunakan layanan TarempaGO! ✨`;

    return message;
}

// Fungsi untuk mengirim ke WhatsApp
function sendToWhatsApp(serviceType, formData) {
    if (!validateForm(formData)) {
        return false;
    }

    const message = createWhatsAppMessage(serviceType, formData);
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodedMessage}`;

    window.open(whatsappURL, '_blank');
    return true;
}

// Fungsi untuk mengambil data dari form
function getFormData(form) {
    const formData = {};
    const elements = form.elements;

    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];

        if (element.name) {
            if (element.type === 'radio') {
                if (element.checked) {
                    formData[element.name] = element.value;
                }
            } else if (element.type !== 'submit') {
                formData[element.name] = element.value;
            }
        }
    }

    return formData;
}

// Event listener untuk semua form
document.addEventListener('DOMContentLoaded', function () {
    const antarForm = document.getElementById('antarForm');
    if (antarForm) {
        antarForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const formData = getFormData(this);
            sendToWhatsApp('Antar Jemput', formData);
        });
    }

    const belanjaForm = document.getElementById('belanjaForm');
    if (belanjaForm) {
        belanjaForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const formData = getFormData(this);
            sendToWhatsApp('Titip Belanja', formData);
        });
    }

    const kirimForm = document.getElementById('kirimForm');
    if (kirimForm) {
        kirimForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const formData = getFormData(this);
            sendToWhatsApp('Kirim Barang', formData);
        });
    }

    const makanForm = document.getElementById('makanForm');
    if (makanForm) {
        makanForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const formData = getFormData(this);
            sendToWhatsApp('Titip Makan', formData);
        });
    }

    // Validasi real-time untuk field yang wajib diisi
    const requiredInputs = document.querySelectorAll('input[required], textarea[required], select[required]');
    requiredInputs.forEach(input => {
        input.addEventListener('blur', function () {
            if (this.value.trim() === '') {
                this.style.borderColor = '#e74c3c';
            } else {
                this.style.borderColor = '#27ae60';
            }
        });

        input.addEventListener('input', function () {
            if (this.value.trim() !== '') {
                this.style.borderColor = '#27ae60';
            }
        });
    });
});

// Fungsi utilitas untuk debugging
function debugFormData(formData) {
    console.log('Form Data:', formData);
}

// Export functions untuk testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateForm,
        createWhatsAppMessage,
        sendToWhatsApp
    };
}