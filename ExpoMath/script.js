document.addEventListener("DOMContentLoaded", () => {
  // ===== 1. SELEKSI ELEMEN DOM =====
  const inputBasis = document.getElementById("basis");
  const inputPangkat = document.getElementById("pangkat");
  const btnHitung = document.getElementById("btnHitung");
  const resultCard = document.getElementById("resultCard");
  const outputHasil = document.getElementById("outputHasil");
  const outputLangkah = document.getElementById("outputLangkah");

  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  const allNavLinks = document.querySelectorAll(".nav-link");
  const qeButtons = document.querySelectorAll(".qe-btn");

  // ===== 2. RESPONSIVE NAVBAR INTERACTION =====
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
      navToggle.classList.toggle("active");
    });
  }

  // Tutup menu navbar setelah link diklik (untuk mobile view)
  allNavLinks.forEach(link => {
    link.addEventListener("click", () => {
      if (navLinks.classList.contains("open")) {
        navLinks.classList.remove("open");
        navToggle.classList.remove("active");
      }
    });
  });

  // ===== 3. FITUR QUICK EXAMPLES (COBA CONTOH CEPAT) =====
  qeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const basisVal = btn.getAttribute("data-basis");
      const pangkatVal = btn.getAttribute("data-pangkat");

      inputBasis.value = basisVal;
      inputPangkat.value = pangkatVal;

      // Jalankan fungsi hitung secara otomatis
      hitungEksponensial();
      
      // Scroll halus ke area kalkulator agar user langsung melihat hasilnya
      document.getElementById("kalkulator").scrollIntoView({ behavior: "smooth" });
    });
  });

  // ===== 4. TOMBOL HITUNG KALKULATOR =====
  if (btnHitung) {
    btnHitung.addEventListener("click", hitungEksponensial);
  }

  // ===== 5. FUNGSI UTAMA: LOGIKA MATEMATIKA DISKRIT =====
  function hitungEksponensial() {
    // Ambil nilai dan ubah ke tipe angka (float untuk basis, int untuk pangkat)
    const a = parseFloat(inputBasis.value);
    const n = parseInt(inputPangkat.value);

    // Validasi jika inputan masih kosong atau bukan angka
    if (isNaN(a) || isNaN(n)) {
      tampilkanError("Masukkan nilai bilangan basis (a) dan pangkat (n) yang valid terlebih dahulu.");
      return;
    }

    // --- KONDISI ERROR (KASUS TAK TENTU) ---
    // Jika basis = 0 dan pangkat <= 0 (0^0 atau 0^-n tidak terdefinisi)
    if (a === 0 && n <= 0) {
      tampilkanError(`Bentuk 0<sup>${n}</sup> menghasilkan nilai yang tidak terdefinisi atau tak tentu dalam matematika.`);
      return;
    }

    let hasilAkhir = 0;
    let teksLangkah = "";

    // --- KONDISI 1: PANGKAT NOL (n = 0) ---
    if (n === 0) {
      hasilAkhir = 1;
      teksLangkah = `
        <p><strong>Definisi Pangkat Nol:</strong></p>
        <p>Berdasarkan bahan kuliah Matematika Diskrit, untuk setiap bilangan bulat atau riil $a \\neq 0$, berlaku rumus awal basis:</p>
        <div class="step-math">a<sup>0</sup> = 1</div>
        <p>Sehingga untuk input basis <strong>${a}</strong>:</p>
        <div class="step-math">${a}<sup>0</sup> = <span class="highlight">${hasilAkhir}</span></div>
      `;
    } 
    
    // --- KONDISI 2: PANGKAT POSITIF (n > 0) ---
    else if (n > 0) {
      hasilAkhir = Math.pow(a, n);
      
      // Menyusun deretan teks perkalian berulang (contoh: 2 x 2 x 2)
      let susunanPerkalian = [];
      for (let i = 0; i < n; i++) {
        // Beri tanda kurung jika angka basis bertanda negatif agar rapi
        susunanPerkalian.push(a < 0 ? `(${a})` : a);
      }
      const stringPerkalian = susunanPerkalian.join(" × ");

      teksLangkah = `
        <p><strong>Definisi Pangkat Positif:</strong></p>
        <p>Karena pangkat $n > 0$, maka dilakukan operasi perkalian berulang bilangan basis ($a$) sebanyak $n$ kali:</p>
        <div class="step-math">a<sup>n</sup> = a × a × ... × a (sebanyak ${n} kali)</div>
        <p>Langkah penyelesaian:</p>
        <div class="step-math">${a}<sup>${n}</sup> = ${stringPerkalian}</div>
        <div class="step-math">Hasil akhir = <span class="highlight">${formatAngka(hasilAkhir)}</span></div>
      `;
    } 
    
    // --- KONDISI 3: PANGKAT NEGATIF (n < 0) ---
    else {
      const pangkatPositif = Math.abs(n);
      const nilaiPenyebut = Math.pow(a, pangkatPositif);
      hasilAkhir = 1 / nilaiPenyebut;

      let susunanPerkalian = [];
      for (let i = 0; i < pangkatPositif; i++) {
        susunanPerkalian.push(a < 0 ? `(${a})` : a);
      }
      const stringPerkalian = susunanPerkalian.join(" × ");

      teksLangkah = `
        <p><strong>Definisi Pangkat Negatif:</strong></p>
        <p>Berdasarkan aturan eksponensial matematika diskrit, pangkat negatif diubah menjadi bentuk pecahan (seper):</p>
        <div class="step-math">a<sup>-n</sup> = 1 / a<sup>n</sup></div>
        <p>Langkah 1 (Mengubah ke pecahan positif):</p>
        <div class="step-math">${a}<sup>${n}</sup> = 1 / (${a}<sup>${pangkatPositif}</sup>)</div>
        <p>Langkah 2 (Menghitung perkalian di bagian penyebut):</p>
        <div class="step-math">= 1 / (${stringPerkalian})</div>
        <div class="step-math">= 1 / ${formatAngka(nilaiPenyebut)}</div>
        <p>Langkah 3 (Pembagian akhir pecahan):</p>
        <div class="step-math">Hasil akhir = <span class="highlight">${formatAngka(hasilAkhir)}</span></div>
      `;
    }

    // Tampilkan hasil kalkulasi ke user
    bukaBoxHasil(formatAngka(hasilAkhir), teksLangkah, false);
  }

  // ===== 6. FUNGSI PENDUKUNG (HELPER FUNCTIONS) =====
  
  // Membantu merapikan format desimal panjang agar tidak merusak tampilan web
  function formatAngka(num) {
    if (Number.isInteger(num)) return num.toString();
    // Jika desimalnya sangat panjang, batasi hingga maksimal 5 angka di belakang koma
    return parseFloat(num.toFixed(5)).toString();
  }

  // Menampilkan kotak hasil kalkulasi dengan efek animasi halus
  function bukaBoxHasil(hasil, langkah, isError = false) {
    if (isError) {
      outputHasil.innerHTML = `<span style="color: #EF4444;">Error!</span>`;
      outputLangkah.innerHTML = langkah;
    } else {
      outputHasil.innerHTML = hasil;
      outputLangkah.innerHTML = langkah;
    }

    resultCard.style.display = "block";
    resultCard.style.opacity = "0";
    
    // Trigger animasi fade-in ringan menggunakan requestAnimationFrame
    requestAnimationFrame(() => {
      resultCard.style.transition = "opacity 0.4s ease";
      resultCard.style.opacity = "1";
    });
  }

  // Mengatur tampilan khusus ketika mendeteksi input eror
  function tampilkanError(pesanPesan) {
    const teksError = `
      <div style="background-color: #FEF2F2; border-left: 4px solid #EF4444; padding: 1rem; color: #991B1B; border-radius: 6px;">
        <p style="margin: 0; font-weight: 500;">⚠️ Gagal Memproses:</p>
        <p style="margin: 0.25rem 0 0 0; font-size: 0.9rem;">${pesanPesan}</p>
      </div>
    `;
    bukaBoxHasil("—", teksError, true);
  }
});