// ==========================================
// 1. MENGAMBIL ELEMEN HTML
// ==========================================

const form = document.getElementById("form-pendaftaran");

const langkahForm = document.querySelectorAll(".form-step");

const tombolLanjut = document.querySelectorAll(".tombol-lanjut");

const tombolKembali = document.querySelectorAll(".tombol-kembali");

const progressFill = document.getElementById("progress-fill");

const stepLabel = document.getElementById("step-label");

const pilihanRiwayat = document.querySelectorAll(
    'input[name="riwayat-sekolah"]'
);

const dataTK = document.getElementById("data-tk");

const namaTK = document.getElementById("nama-tk");

const popupSukses = document.getElementById("popup-sukses");

const tombolTutupPopup = document.getElementById("tutup-popup");

let langkahAktif = 0;


// ==========================================
// 2. MENAMPILKAN TAHAP FORMULIR
// ==========================================

function tampilkanLangkah(nomorLangkah) {
    langkahAktif = nomorLangkah;

    langkahForm.forEach((langkah, index) => {
        const aktif = index === langkahAktif;

        langkah.hidden = !aktif;
        langkah.classList.toggle("active", aktif);
    });

    // Mengubah indikator kemajuan.
    const persentase = ((langkahAktif + 1) / langkahForm.length) * 100;

    progressFill.style.width = persentase + "%";

    // Mengubah tulisan langkah.
    stepLabel.textContent =
        `Langkah ${langkahAktif + 1} dari ${langkahForm.length}`;

    // Kembali ke bagian atas formulir.
    document.getElementById("pendaftaran").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


// ==========================================
// 3. MEMERIKSA ISIAN PADA SETIAP TAHAP
// ==========================================

function periksaLangkah() {
    const langkahSekarang = langkahForm[langkahAktif];

    const kolomWajib = langkahSekarang.querySelectorAll(
        "input[required], select[required], textarea[required]"
    );

    for (const kolom of kolomWajib) {
        // Kolom pada bagian yang disembunyikan tidak diperiksa.
        if (kolom.disabled || kolom.closest("[hidden]")) {
            continue;
        }

        // Periksa validitas setiap kolom.
        if (!kolom.checkValidity()) {
            kolom.reportValidity();
            kolom.focus();
            return false;
        }
    }

    return true;
}


// ==========================================
// 4. TOMBOL LANJUT
// ==========================================

tombolLanjut.forEach((tombol) => {
    tombol.addEventListener("click", () => {

        // Periksa dahulu apakah kolom tahap sekarang valid.
        if (!periksaLangkah()) {
            return;
        }

        // Berpindah ke tahap selanjutnya.
        if (langkahAktif < langkahForm.length - 1) {
            tampilkanLangkah(langkahAktif + 1);
        }
    });
});


// ==========================================
// 5. TOMBOL KEMBALI
// ==========================================

tombolKembali.forEach((tombol) => {
    tombol.addEventListener("click", () => {

        if (langkahAktif > 0) {
            tampilkanLangkah(langkahAktif - 1);
        }
    });
});


// ==========================================
// 6. PILIHAN RIWAYAT TK / PAUD
// ==========================================

function perbaruiRiwayatSekolah() {
    const pilihan = document.querySelector(
        'input[name="riwayat-sekolah"]:checked'
    );

    const pernahSekolah = pilihan && pilihan.value === "Pernah";

    // Tampilkan kolom nama sekolah jika memilih Pernah.
    dataTK.hidden = !pernahSekolah;

    // Nama TK wajib diisi hanya jika memilih Pernah.
    namaTK.required = Boolean(pernahSekolah);

    // Jika memilih Belum Pernah, kosongkan data TK.
    if (!pernahSekolah) {
        namaTK.value = "";

        document.getElementById("tahun-mulai").value = "";
        document.getElementById("tahun-selesai").value = "";
    }
}

pilihanRiwayat.forEach((pilihan) => {
    pilihan.addEventListener("change", perbaruiRiwayatSekolah);
});


// ==========================================
// 7. FORMULIR SELESAI
// ==========================================

form.addEventListener("submit", (event) => {
    // Jangan mengirim formulir ke server karena ini masih demo.
    event.preventDefault();

    // Pastikan tahap terakhir sudah valid.
    if (!periksaLangkah()) {
        return;
    }

    // Tampilkan pop-up ucapan selamat.
    popupSukses.hidden = false;

    // Cegah halaman di belakang pop-up digulir.
    document.body.style.overflow = "hidden";

    // Fokuskan pengguna ke pop-up.
    tombolTutupPopup.focus();
});


// ==========================================
// 8. MENUTUP POP-UP
// ==========================================

function tutupPopup() {
    popupSukses.hidden = true;

    document.body.style.overflow = "";

    // Kembali ke tahap pertama.
    form.reset();

    dataTK.hidden = true;
    namaTK.required = false;

    tampilkanLangkah(0);
}

tombolTutupPopup.addEventListener("click", tutupPopup);


// ==========================================
// 9. MENUTUP POP-UP DENGAN TOMBOL ESC
// ==========================================

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !popupSukses.hidden) {
        tutupPopup();
    }
});


// ==========================================
// 10. MENJALANKAN FORMULIR
// ==========================================

// Tampilkan tahap pertama ketika halaman dibuka.
tampilkanLangkah(0);

console.log("🌈 PPDB SD Pelangi Ceria siap digunakan!");
