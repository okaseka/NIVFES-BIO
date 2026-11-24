/**
 * =========================================================================
 * VIRTUAL LAB SIMULATOR ENGINE (SMP/MTs KELAS IX - BIOTEKNOLOGI MODERN)
 * GAYA REFERENSI: VIRTUAL LAB SIDE VIEW MEJA LAB DATAR
 * 
 * Fitur Utama & Perbaikan:
 * 1. Tata Letak Slot Otomatis: Seluruh objek tersusun rapi berjarak aman tanpa saling menumpuk.
 * 2. Titik Tambat (Anchor Point): Posisi drop presisi pada alat (misal dalam LAF, tabung, cawan, dll).
 * 3. Skala Diperbesar (~1.4x) & Z-Index Terpusat (Bayangan < Alat < Objek < Di Dalam Alat < Drag).
 * 4. Fullscreen API & Landscape Recommendation di HP.
 * 5. Stepper Terkunci, Catatan Pengamatan Otomatis, Hint, Reset, dan Layar Akhir Ringkasan.
 * =========================================================================
 */

(function () {
    'use strict';

    // State utama Virtual Lab
    const labState = {
        subbab: 'kultur-jaringan',
        stepIndex: 0,
        observations: [],
        isProcessing: false,
        selectedEntityId: null,
        hintActive: false,
        activeTimeouts: [],
        objects: {}
    };

    function safeTimeout(fn, ms) {
        const id = setTimeout(() => {
            fn();
            labState.activeTimeouts = labState.activeTimeouts.filter(t => t !== id);
        }, ms);
        labState.activeTimeouts.push(id);
        return id;
    }

    function clearAllTimeouts() {
        labState.activeTimeouts.forEach(id => clearTimeout(id));
        labState.activeTimeouts = [];
    }

    // Helper penentu persentase slot otomatis merata
    function getSlotPositions(count) {
        const positions = [];
        for (let i = 0; i < count; i++) {
            const center = ((i + 0.5) / count) * 100;
            positions.push(Math.round(center * 10) / 10);
        }
        return positions;
    }

    // =========================================================================
    // DEFINISI TITIK TAMBAT (ANCHOR POINTS) ALAT LABORATORIUM
    // =========================================================================
    const APPARATUS_ANCHORS = {
        'laminar-flow': { yOffset: 20, scale: 0.85, zIndex: 30 },
        'tabung-media': { yOffset: 28, scale: 0.65, zIndex: 30 },
        'rak-inkubasi': { yOffset: 30, scale: 0.75, zIndex: 30 },
        'pot-tanaman': { yOffset: 32, scale: 0.90, zIndex: 30 },
        'ovarium': { yOffset: 12, scale: 0.85, zIndex: 30 },
        'cawan-petri': { yOffset: 12, scale: 0.75, zIndex: 30 },
        'inkubator': { yOffset: 28, scale: 0.75, zIndex: 30 },
        'rahim': { yOffset: 28, scale: 0.75, zIndex: 30 },
        'mikropipet': { yOffset: 15, scale: 0.80, zIndex: 30 },
        'alat-stimulasi': { yOffset: 24, scale: 0.80, zIndex: 30 },
        'domba-surrogate': { yOffset: 16, scale: 0.82, zIndex: 30 },
        'tikus': { yOffset: 10, scale: 0.80, zIndex: 30 },
        'tabung-limfosit-b': { yOffset: 26, scale: 0.65, zIndex: 30 },
        'tabung-fusi': { yOffset: 26, scale: 0.72, zIndex: 30 },
        'rak-kultur': { yOffset: 20, scale: 0.75, zIndex: 30 },
        'tabung-antibodi': { yOffset: 26, scale: 0.75, zIndex: 30 },
        'enzim-gunting': { yOffset: 14, scale: 0.80, zIndex: 30 },
        'sel-bakteri': { yOffset: 12, scale: 0.75, zIndex: 30 },
        'media-antibiotik': { yOffset: 14, scale: 0.75, zIndex: 30 },
        'fermentor': { yOffset: 34, scale: 0.80, zIndex: 30 }
    };

    // =========================================================================
    // KONFIGURASI LENGKAP 5 SIMULATOR BIOTEKNOLOGI MODERN
    // =========================================================================
    const SIMULATOR_DATA = {
        // ---------------------------------------------------------------------
        // A. KULTUR JARINGAN
        // ---------------------------------------------------------------------
        'kultur-jaringan': {
            id: 'kultur-jaringan',
            title: 'Kultur Jaringan Tumbuhan (Wortel)',
            subtitle: 'Perbanyakan vegetatif in vitro memanfaatkan sifat totipotensi sel meristematik.',
            icon: '🌱',
            tableCols: ['Langkah', 'Perlakuan Alat & Bahan', 'Keterangan Ilmiah'],
            summarySteps: [
                'Eksplan diambil dari jaringan meristematik akar wortel di dalam meja steril LAF.',
                'Pemotongan dilakukan secara aseptis dengan pisau skalpel berukuran ±1 cm³.',
                'Inokulasi ke dalam media nutrisi MS padat yang mengandung hormon pemacu pertumbuhan.',
                'Inkubasi pada rak kultur bersuhu 25°C memicu pembelahan sel mitosis membentuk kalus.',
                'Subkultur ke media berauksin dan sitokinin menginduksi organogenesis menjadi planlet.',
                'Aklimatisasi memindahkan planlet ke pot tanah untuk beradaptasi menjadi tumbuhan dewasa.'
            ],
            // 6 Objek berjajar pada 6 slot proporsional di meja
            initialObjects: [
                { id: 'wortel', assetId: 'wortel', name: 'Wortel Segar', slotIndex: 0, w: 115, h: 135 },
                { id: 'pisau', assetId: 'pisau', name: 'Pisau Skalpel Steril', slotIndex: 1, w: 110, h: 140 },
                { id: 'laminar-flow', assetId: 'laminar-flow', name: 'Meja Steril (LAF)', slotIndex: 2, w: 170, h: 160, isApparatus: true, isTargetOnly: true },
                { id: 'tabung-media', assetId: 'tabung-media', name: 'Tabung Nutrisi MS', slotIndex: 3, w: 105, h: 140, isApparatus: true },
                { id: 'pot-tanaman', assetId: 'pot-tanaman', name: 'Pot Tanah Aklimatisasi', slotIndex: 4, w: 135, h: 135, isApparatus: true, isTargetOnly: true },
                { id: 'rak-inkubasi', assetId: 'rak-inkubasi', name: 'Rak Inkubasi (Jam)', slotIndex: 5, w: 160, h: 165, isApparatus: true, isTargetOnly: true }
            ],
            steps: [
                {
                    instruction: 'Geser wortel segar ke meja kerja steril (Laminar Air Flow / LAF).',
                    sourceId: 'wortel',
                    targetId: 'laminar-flow',
                    actionText: 'Menyiapkan Eksplan di Area Aseptis',
                    explanation: 'Kondisi aseptis (steril) pada LAF mutlak diperlukan agar eksplan bebas dari spora jamur dan bakteri.',
                    obsRow: ['1. Persiapan', 'Wortel di Meja Steril LAF', 'Sampel jaringan diletakkan di ruang aseptis beraliran udara bersih.'],
                    onSuccess(state) {
                        const target = state.objects['laminar-flow'];
                        const anchor = APPARATUS_ANCHORS['laminar-flow'];
                        state.objects['wortel'].x = target.x;
                        state.objects['wortel'].yOffset = anchor.yOffset;
                        state.objects['wortel'].isInside = true;
                    }
                },
                {
                    instruction: 'Geser pisau skalpel ke wortel di meja steril untuk memotong eksplan.',
                    sourceId: 'pisau',
                    targetId: 'wortel',
                    actionText: 'Memotong Jaringan Meristem',
                    explanation: 'Pemotongan eksplan kambium merangsang sel aktif membelah karena adanya sifat totipotensi sel.',
                    obsRow: ['2. Pemotongan', 'Pisau Skalpel Steril', 'Terpotong bagian meristem akar wortel (eksplan) berukuran kecil.'],
                    onSuccess(state) {
                        state.objects['pisau'].x = state.objects['pisau'].initialX;
                        state.objects['wortel'].assetId = 'eksplan';
                        state.objects['wortel'].name = 'Eksplan Wortel';
                        state.objects['wortel'].w = 95;
                        state.objects['wortel'].h = 95;
                    }
                },
                {
                    instruction: 'Geser potongan eksplan ke dalam tabung media nutrisi MS.',
                    sourceId: 'wortel',
                    targetId: 'tabung-media',
                    actionText: 'Inokulasi Media Nutrisi MS',
                    explanation: 'Media MS mengandung sukrosa, garam mineral, vitamin, dan hormon yang memicu metabolisme sel.',
                    obsRow: ['3. Inokulasi', 'Tabung Nutrisi MS Steril', 'Eksplan tertanam pada gel agar steril berkandungan garam mineral dan vitamin.'],
                    onSuccess(state) {
                        delete state.objects['wortel'];
                        state.objects['tabung-media'].liquidLevel = 70;
                    }
                },
                {
                    instruction: 'Geser tabung media nutrisi ke rak inkubasi kultur.',
                    sourceId: 'tabung-media',
                    targetId: 'rak-inkubasi',
                    actionText: 'Inkubasi Pembelahan Sel Mitosis',
                    timerDuration: 2200,
                    timerText: 'Inkubasi 25°C: Sel meristematik membelah menjadi gumpalan Kalus...',
                    explanation: 'Dalam suhu optimal 25°C, sel aktif membelah membentuk kalus (massa sel yang belum terdiferensiasi).',
                    obsRow: ['4. Pembentukan Kalus', 'Rak Kultur Suhu 25°C', 'Sel meristem aktif membelah membentuk kumpulan sel kalus.'],
                    onSuccess(state) {
                        const target = state.objects['rak-inkubasi'];
                        state.objects['tabung-media'].x = state.objects['tabung-media'].initialX;
                        state.objects['tabung-media'].yOffset = 0;
                        state.objects['tabung-media'].assetId = 'kalus';
                        state.objects['tabung-media'].name = 'Gumpalan Kalus';
                        state.objects['tabung-media'].w = 110;
                        state.objects['tabung-media'].h = 110;
                        state.objects['tabung-media'].isApparatus = false;
                    }
                },
                {
                    instruction: 'Geser kalus ke meja steril LAF untuk induksi diferensiasi organogenesis.',
                    sourceId: 'tabung-media',
                    targetId: 'laminar-flow',
                    actionText: 'Diferensiasi Menjadi Planlet',
                    timerDuration: 2000,
                    timerText: 'Hormon auksin & sitokinin memicu pembentukan tunas dan akar (Planlet)...',
                    explanation: 'Keseimbangan hormon auksin (merangsang akar) dan sitokinin (merangsang tunas) menghasilkan planlet lengkap.',
                    obsRow: ['5. Diferensiasi', 'Media Auksin & Sitokinin', 'Kalus berkembang membentuk akar halus dan daun muda (Planlet).'],
                    onSuccess(state) {
                        const target = state.objects['laminar-flow'];
                        const anchor = APPARATUS_ANCHORS['laminar-flow'];
                        state.objects['tabung-media'].x = target.x;
                        state.objects['tabung-media'].yOffset = anchor.yOffset;
                        state.objects['tabung-media'].isInside = true;
                        state.objects['tabung-media'].assetId = 'planlet';
                        state.objects['tabung-media'].name = 'Planlet Wortel';
                        state.objects['tabung-media'].w = 115;
                        state.objects['tabung-media'].h = 145;
                    }
                },
                {
                    instruction: 'Geser planlet ke pot tanah untuk proses aklimatisasi menjadi tumbuhan dewasa.',
                    sourceId: 'tabung-media',
                    targetId: 'pot-tanaman',
                    actionText: 'Aklimatisasi Tumbuhan',
                    explanation: 'Aklimatisasi melatih tanaman beradaptasi dari lingkungan steril ke lingkungan tanah alami.',
                    obsRow: ['6. Aklimatisasi', 'Pot Tanah Subur', 'Planlet berhasil beradaptasi dan tumbuh subur menjadi tanaman wortel dewasa.'],
                    onSuccess(state) {
                        delete state.objects['tabung-media'];
                        state.objects['pot-tanaman'].assetId = 'tumbuhan-dewasa';
                        state.objects['pot-tanaman'].name = 'Wortel Dewasa Subur';
                        state.objects['pot-tanaman'].w = 150;
                        state.objects['pot-tanaman'].h = 165;
                    }
                }
            ]
        },

        // ---------------------------------------------------------------------
        // B. BAYI TABUNG (IVF)
        // ---------------------------------------------------------------------
        'bayi-tabung': {
            id: 'bayi-tabung',
            title: 'Fertilisasi In Vitro (Bayi Tabung)',
            subtitle: 'Proses pembuahan sel telur dan sel sperma di luar tubuh manusia secara in vitro.',
            icon: '👶',
            tableCols: ['Langkah', 'Perlakuan Medis', 'Keterangan Ilmiah'],
            summarySteps: [
                'Injeksi hormon pemacu ovulasi merangsang ovarium mematangkan beberapa sel telur sekaligus.',
                'Pengambilan sel telur matang (ovum) dipindahkan ke cawan petri kultur bersuhu tubuh.',
                'Penambahan suspensi spermatozoa aktif ke cawan petri memicu terjadinya fertilisasi in vitro membentuk zigot.',
                'Inkubator CO₂ suhu 37°C memfasilitasi pembelahan mitosis bertahap zigot hingga tahap blastula (morula/blastosit).',
                'Embrio blastula berkualitas terbaik diimplantasikan ke dinding rahim ibu yang sah hingga berkembang menjadi janin.'
            ],
            initialObjects: [
                { id: 'ovarium', assetId: 'ovarium', name: 'Ovarium Donor Ibu', slotIndex: 0, w: 140, h: 135, isApparatus: true },
                { id: 'suntikan-hormon', assetId: 'suntikan-hormon', name: 'Suntikan Hormon Matang', slotIndex: 1, w: 105, h: 140 },
                { id: 'tabung-sperma', assetId: 'tabung-sperma', name: 'Sampel Sperma Ayah', slotIndex: 2, w: 105, h: 140, isApparatus: true },
                { id: 'cawan-petri', assetId: 'cawan-petri', name: 'Cawan Petri Kultur', slotIndex: 3, w: 135, h: 110, isApparatus: true, isTargetOnly: true },
                { id: 'inkubator', assetId: 'inkubator', name: 'Inkubator CO2 (37°C)', slotIndex: 4, w: 160, h: 165, isApparatus: true, isTargetOnly: true },
                { id: 'rahim', assetId: 'rahim', name: 'Rahim (Uterus) Ibu', slotIndex: 5, w: 150, h: 150, isApparatus: true, isTargetOnly: true }
            ],
            steps: [
                {
                    instruction: 'Geser suntikan hormon ke ovarium untuk merangsang pematangan sel telur.',
                    sourceId: 'suntikan-hormon',
                    targetId: 'ovarium',
                    actionText: 'Stimulasi Ovulasi Hormonal',
                    explanation: 'Hormon gonadotropin merangsang folikel ovarium agar beberapa ovum matang secara serentak.',
                    obsRow: ['1. Stimulasi Hormon', 'Injeksi Gonadotropin', 'Folikel ovarium berkembang dan mematangkan ovum siap ovulasi.'],
                    onSuccess(state) {
                        state.objects['suntikan-hormon'].x = state.objects['suntikan-hormon'].initialX;
                        state.objects['ovarium'].assetId = 'ovum';
                        state.objects['ovarium'].name = 'Ovum Matang';
                        state.objects['ovarium'].w = 115;
                        state.objects['ovarium'].h = 115;
                        state.objects['ovarium'].isApparatus = false;
                    }
                },
                {
                    instruction: 'Geser ovum matang ke cawan petri kultur.',
                    sourceId: 'ovarium',
                    targetId: 'cawan-petri',
                    actionText: 'Pengambilan Sel Telur (Ovum Pick-up)',
                    explanation: 'Ovum diletakkan dalam cawan kultur steril berisi medium nutrisi penunjang fertilisasi.',
                    obsRow: ['2. Isolasi Ovum', 'Cawan Petri Kultur Steril', 'Ovum matang berhasil ditempatkan pada medium in vitro.'],
                    onSuccess(state) {
                        delete state.objects['ovarium'];
                    }
                },
                {
                    instruction: 'Geser sampel sperma ke cawan petri yang berisi sel telur.',
                    sourceId: 'tabung-sperma',
                    targetId: 'cawan-petri',
                    actionText: 'Fertilisasi In Vitro',
                    timerDuration: 2000,
                    timerText: 'Spermatozoa membuahi sel telur: Penyatuan dua pronukleus membentuk Zigot (2n)...',
                    explanation: 'Spermatozoa menembus zona pelusida ovum menghasilkan penyatuan materi genetik diploid (zigot).',
                    obsRow: ['3. Fertilisasi', 'Inseminasi In Vitro', 'Peleburan inti sperma dan ovum menghasilkan zigot diploid (2n).'],
                    onSuccess(state) {
                        state.objects['tabung-sperma'].x = state.objects['tabung-sperma'].initialX;
                        state.objects['cawan-petri'].assetId = 'zigot';
                        state.objects['cawan-petri'].name = 'Zigot Terfertilisasi';
                        state.objects['cawan-petri'].w = 115;
                        state.objects['cawan-petri'].h = 115;
                        state.objects['cawan-petri'].isTargetOnly = false;
                    }
                },
                {
                    instruction: 'Geser zigot ke dalam inkubator CO₂ suhu 37°C.',
                    sourceId: 'cawan-petri',
                    targetId: 'inkubator',
                    actionText: 'Inkubasi Pembelahan Mitosis Embrio',
                    timerDuration: 2400,
                    timerText: 'Inkubator 37°C: Zigot membelah mitosis 2, 4, 8 sel hingga tahap Blastula...',
                    explanation: 'Kondisi hangat 37°C dan kelembapan stabil meniru lingkungan saluran tuba fallopi manusia.',
                    obsRow: ['4. Inkubasi Embrio', 'Inkubator CO₂ 37°C', 'Zigot membelah aktif melalui tahap morula hingga menjadi blastula.'],
                    onSuccess(state) {
                        state.objects['cawan-petri'].x = state.objects['cawan-petri'].initialX;
                        state.objects['cawan-petri'].assetId = 'blastula';
                        state.objects['cawan-petri'].name = 'Embrio Blastula';
                        state.objects['cawan-petri'].w = 115;
                        state.objects['cawan-petri'].h = 115;
                    }
                },
                {
                    instruction: 'Geser embrio blastula ke rahim ibu untuk proses implantasi.',
                    sourceId: 'cawan-petri',
                    targetId: 'rahim',
                    actionText: 'Implantasi Embrio ke Dinding Rahim',
                    explanation: 'Tahap blastula adalah fase ideal embrio menempel pada endometrium rahim untuk melanjutkan kehamilan.',
                    obsRow: ['5. Implantasi', 'Endometrium Rahim Ibu', 'Embrio menempel sempurna pada dinding rahim dan berkembang menjadi janin.'],
                    onSuccess(state) {
                        delete state.objects['cawan-petri'];
                        state.objects['rahim'].name = 'Rahim Berisi Janin (Hamil)';
                    }
                }
            ]
        },

        // ---------------------------------------------------------------------
        // C. KLONING (DOMBA DOLLY)
        // ---------------------------------------------------------------------
        'kloning': {
            id: 'kloning',
            title: 'Kloning Somatik (Domba Dolly)',
            subtitle: 'Transfer inti sel somatis ke ovum tanpa inti untuk menghasilkan individu identik.',
            icon: '🐑',
            tableCols: ['Langkah', 'Tahapan Rekayasa', 'Keterangan Ilmiah'],
            summarySteps: [
                'Isolasi sel somatis kelenjar susu (diploid 2n) dari domba Finn Dorset sebagai donor inti genetik.',
                'Pengambilan sel telur ovum dari domba Blackface, lalu intinya dibuang (enukleasi) dengan mikropipet.',
                'Transfer inti sel somatis diploid Finn Dorset disisipkan ke dalam ovum tanpa inti Blackface.',
                'Alat stimulasi pulsa listrik (elektrofusi 2.5 kV) menyatukan membran dan memicu pembelahan menjadi blastosit.',
                'Implantasi blastosit ke rahim induk pengganti (surrogate mother) domba Blackface.',
                'Kelahiran domba Dolly yang memiliki ciri fisik putih 100% identik dengan donor inti (Finn Dorset).'
            ],
            initialObjects: [
                { id: 'domba-finndorset', assetId: 'domba-finndorset', name: 'Finn Dorset (Donor Inti)', slotIndex: 0, w: 155, h: 145, isApparatus: true },
                { id: 'sel-kelenjar-susu', assetId: 'sel-kelenjar-susu', name: 'Sel Mamae (2n)', slotIndex: 1, w: 110, h: 110 },
                { id: 'domba-blackface', assetId: 'domba-blackface', name: 'Blackface (Donor Ovum)', slotIndex: 2, w: 155, h: 145, isApparatus: true },
                { id: 'mikropipet', assetId: 'mikropipet', name: 'Mikromanipulator Enukleasi', slotIndex: 3, w: 105, h: 145 },
                { id: 'alat-stimulasi', assetId: 'alat-stimulasi', name: 'Mesin Elektrofusi', slotIndex: 4, w: 150, h: 145, isApparatus: true, isTargetOnly: true },
                { id: 'domba-surrogate', assetId: 'domba-blackface', name: 'Blackface (Induk Pengganti)', slotIndex: 5, w: 155, h: 145, isApparatus: true, isTargetOnly: true }
            ],
            steps: [
                {
                    instruction: 'Geser sel kelenjar susu dari Finn Dorset ke mikropipet untuk isolasi inti donor.',
                    sourceId: 'sel-kelenjar-susu',
                    targetId: 'mikropipet',
                    actionText: 'Isolasi Sel Somatis Diploid',
                    explanation: 'Sel kelenjar mamae mengandung materi genetik diploid (2n) lengkap dari domba Finn Dorset.',
                    obsRow: ['1. Donor Inti', 'Sel Kelenjar Susu (2n)', 'Materi genetik diploid pembawa sifat induk Finn Dorset disiapkan.'],
                    onSuccess(state) {
                        const target = state.objects['mikropipet'];
                        state.objects['sel-kelenjar-susu'].x = target.x - 4;
                    }
                },
                {
                    instruction: 'Geser mikropipet ke domba Blackface untuk membuang inti ovum (enukleasi).',
                    sourceId: 'mikropipet',
                    targetId: 'domba-blackface',
                    actionText: 'Enukleasi Sel Telur (Ovum)',
                    explanation: 'Inti sel ovum domba Blackface dihisap dan dibuang agar tidak mewariskan sifat genetiknya.',
                    obsRow: ['2. Enukleasi', 'Penyedotan Inti Ovum', 'Inti sel telur Blackface dibuang menghasilkan ovum sitoplasma kosong.'],
                    onSuccess(state) {
                        state.objects['mikropipet'].x = state.objects['mikropipet'].initialX;
                        state.objects['domba-blackface'].assetId = 'ovum-blackface';
                        state.objects['domba-blackface'].name = 'Ovum Tanpa Inti';
                        state.objects['domba-blackface'].w = 115;
                        state.objects['domba-blackface'].h = 115;
                        state.objects['domba-blackface'].isApparatus = false;
                    }
                },
                {
                    instruction: 'Geser inti sel mamae (Finn Dorset) ke ovum tanpa inti Blackface.',
                    sourceId: 'sel-kelenjar-susu',
                    targetId: 'domba-blackface',
                    actionText: 'Transfer Inti Somatis (SCNT)',
                    explanation: 'Ovum tanpa inti kini diisi inti diploid sel somatis donor (Somatic Cell Nuclear Transfer).',
                    obsRow: ['3. Transfer Inti', 'Penyatuan Inti Donor', 'Inti diploid (2n) Finn Dorset berhasil dimasukkan ke ovum Blackface.'],
                    onSuccess(state) {
                        delete state.objects['sel-kelenjar-susu'];
                        state.objects['domba-blackface'].name = 'Ovum Berinti Donor (2n)';
                    }
                },
                {
                    instruction: 'Geser ovum rekombinan ke mesin elektrofusi untuk stimulasi pembelahan sel.',
                    sourceId: 'domba-blackface',
                    targetId: 'alat-stimulasi',
                    actionText: 'Elektrofusi & Aktivasi Pembelahan',
                    timerDuration: 2200,
                    timerText: 'Kejut listrik mikro 2.5 kV memicu fusi membran dan membelah menjadi Blastosit...',
                    explanation: 'Denyut listrik mikro mengaktifkan sel seolah-olah baru saja mengalami pembuahan alami.',
                    obsRow: ['4. Elektrofusi', 'Generator Pulsa 2.5 kV', 'Sengatan listrik menyatukan sel dan memicu pembelahan menjadi blastosit.'],
                    onSuccess(state) {
                        state.objects['domba-blackface'].x = state.objects['domba-blackface'].initialX;
                        state.objects['domba-blackface'].yOffset = 0;
                        state.objects['domba-blackface'].isInside = false;
                        state.objects['domba-blackface'].assetId = 'blastosit';
                        state.objects['domba-blackface'].name = 'Blastosit Kloning';
                        state.objects['domba-blackface'].w = 115;
                        state.objects['domba-blackface'].h = 115;
                    }
                },
                {
                    instruction: 'Geser blastosit ke induk pengganti Blackface untuk kehamilan hingga kelahiran Dolly.',
                    sourceId: 'domba-blackface',
                    targetId: 'domba-surrogate',
                    actionText: 'Implantasi & Kelahiran Domba Dolly',
                    timerDuration: 2400,
                    timerText: 'Masa kehamilan 148 hari berjalan... Lahir Domba Dolly berwajah putih!',
                    explanation: 'Domba Dolly berwajah putih identik 100% dengan Finn Dorset karena mewarisi inti selnya, bukan induk Blackface.',
                    obsRow: ['5. Kelahiran Dolly', 'Induk Pengganti Blackface', 'Lahir Domba Dolly berbulu dan berwajah putih (100% identik Finn Dorset).'],
                    onSuccess(state) {
                        delete state.objects['domba-blackface'];
                        state.objects['domba-surrogate'].assetId = 'domba-dolly';
                        state.objects['domba-surrogate'].name = 'Domba Dolly (Identik Finn Dorset)';
                        state.objects['domba-surrogate'].w = 135;
                        state.objects['domba-surrogate'].h = 125;
                    }
                }
            ]
        },

        // ---------------------------------------------------------------------
        // D. TEKNOLOGI HIBRIDOMA
        // ---------------------------------------------------------------------
        'teknologi-hibridoma': {
            id: 'teknologi-hibridoma',
            title: 'Teknologi Hibridoma (Antibodi Monoklonal)',
            subtitle: 'Fusi sel limfosit B dan sel kanker mieloma menghasilkan antibodi spesifik tak terbatas.',
            icon: '💉',
            tableCols: ['Langkah', 'Perlakuan Fusi', 'Keterangan Ilmiah'],
            summarySteps: [
                'Injeksi antigen spesifik ke tubuh mencit memicu sistem kekebalan memproduksi sel limfosit B.',
                'Isolasi limfosit B penghasil antibodi diambil dari organ limpa mencit donor.',
                'Pencampuran sel limfosit B dengan sel kanker mieloma ke dalam tabung fusi bersama zat PEG.',
                'Reaksi fusi sel menghasilkan sel hibridoma yang memiliki dua sifat unggul secara bersamaan.',
                'Kultur seleksi pada media HAT menumbuhkan sel hibridoma yang membelah cepat dan menghasilkan antibodi.',
                'Pemanenan antibodi monoklonal murni yang sangat spesifik untuk terapi medis dan diagnostik presisi.'
            ],
            // 7 Objek berjajar pada 7 slot proporsional di meja
            initialObjects: [
                { id: 'tikus', assetId: 'tikus', name: 'Mencit Donor', slotIndex: 0, w: 150, h: 125, isApparatus: true },
                { id: 'suntikan-antigen', assetId: 'suntikan-antigen', name: 'Suntikan Antigen', slotIndex: 1, w: 105, h: 140 },
                { id: 'tabung-limfosit-b', assetId: 'tabung-limfosit-b', name: 'Tabung Limfosit B', slotIndex: 2, w: 105, h: 140, isApparatus: true, isTargetOnly: true },
                { id: 'tabung-sel-kanker', assetId: 'tabung-sel-kanker', name: 'Tabung Sel Mieloma', slotIndex: 3, w: 105, h: 140, isApparatus: true },
                { id: 'tabung-fusi', assetId: 'tabung-fusi', name: 'Tabung Fusi PEG', slotIndex: 4, w: 125, h: 145, isApparatus: true, isTargetOnly: true },
                { id: 'rak-kultur', assetId: 'rak-kultur', name: 'Pelat Kultur HAT', slotIndex: 5, w: 155, h: 135, isApparatus: true, isTargetOnly: true },
                { id: 'tabung-antibodi', assetId: 'tabung-antibodi', name: 'Vial Hasil (mAb)', slotIndex: 6, w: 105, h: 135, isApparatus: true, isTargetOnly: true }
            ],
            steps: [
                {
                    instruction: 'Geser suntikan antigen ke mencit donor untuk merangsang respon imun.',
                    sourceId: 'suntikan-antigen',
                    targetId: 'tikus',
                    actionText: 'Imunisasi Antigen Patogen',
                    explanation: 'Antigen memicu respon imun adaptif mencit sehingga limpa memproduksi limfosit B spesifik.',
                    obsRow: ['1. Imunisasi', 'Injeksi Antigen ke Mencit', 'Sistem imun mencit terpicu membentuk limfosit B penghasil antibodi.'],
                    onSuccess(state) {
                        state.objects['suntikan-antigen'].x = state.objects['suntikan-antigen'].initialX;
                    }
                },
                {
                    instruction: 'Geser mencit ke tabung limfosit B untuk mengisolasi sel kekebalan dari limpa.',
                    sourceId: 'tikus',
                    targetId: 'tabung-limfosit-b',
                    actionText: 'Isolasi Sel Limfosit B',
                    explanation: 'Sel limfosit B memiliki kemampuan khusus memproduksi antibodi spesifik terhadap antigen target.',
                    obsRow: ['2. Isolasi Limfosit', 'Ekstraksi Limpa Mencit', 'Didapatkan suspensi sel limfosit B penghasil antibodi spesifik.'],
                    onSuccess(state) {
                        state.objects['tikus'].x = state.objects['tikus'].initialX;
                        state.objects['tabung-limfosit-b'].isTargetOnly = false;
                    }
                },
                {
                    instruction: 'Geser tabung limfosit B ke tabung fusi PEG.',
                    sourceId: 'tabung-limfosit-b',
                    targetId: 'tabung-fusi',
                    actionText: 'Pencampuran Limfosit B ke Reagen Fusi',
                    explanation: 'Polietilen glikol (PEG) berperan melemahkan membran sel agar fusi sel dapat berlangsung.',
                    obsRow: ['3. Pencampuran', 'Penambahan ke Tabung Fusi', 'Limfosit B dimasukkan ke dalam tabung reaksi fusi ber-PEG.'],
                    onSuccess(state) {
                        state.objects['tabung-limfosit-b'].x = state.objects['tabung-limfosit-b'].initialX;
                    }
                },
                {
                    instruction: 'Geser tabung sel kanker mieloma ke tabung fusi PEG.',
                    sourceId: 'tabung-sel-kanker',
                    targetId: 'tabung-fusi',
                    actionText: 'Fusi Sel Membentuk Hibridoma',
                    timerDuration: 2200,
                    timerText: 'Zat PEG menyatukan membran Limfosit B dan Sel Mieloma: Terbentuk Sel Hibridoma...',
                    explanation: 'Sel kanker mieloma menyumbangkan sifat membelah cepat tanpa henti, sedangkan limfosit B menyumbang sifat pembuat antibodi.',
                    obsRow: ['4. Fusi Hibridoma', 'Reaksi Fusi Kimiawi PEG', 'Terbentuk sel hibridoma yang mampu membelah terus dan menghasilkan antibodi.'],
                    onSuccess(state) {
                        delete state.objects['tabung-sel-kanker'];
                        state.objects['tabung-fusi'].assetId = 'sel-hibridoma';
                        state.objects['tabung-fusi'].name = 'Sel Hibridoma';
                        state.objects['tabung-fusi'].w = 120;
                        state.objects['tabung-fusi'].h = 120;
                        state.objects['tabung-fusi'].isApparatus = false;
                        state.objects['tabung-fusi'].isTargetOnly = false;
                    }
                },
                {
                    instruction: 'Geser sel hibridoma ke pelat kultur selektif media HAT.',
                    sourceId: 'tabung-fusi',
                    targetId: 'rak-kultur',
                    actionText: 'Seleksi Kultur Media HAT',
                    timerDuration: 2200,
                    timerText: 'Media HAT menyeleksi: Hanya sel hibridoma yang bertahan hidup dan membelah cepat...',
                    explanation: 'Media HAT mematikan sel mieloma tak berfusi; hanya sel hibridoma fusi yang dapat memperbanyak diri.',
                    obsRow: ['5. Seleksi HAT', 'Pelat Kultur Media Selektif', 'Sel hibridoma tumbuh pesat menghasilkan klon antibodi monoklonal.'],
                    onSuccess(state) {
                        state.objects['tabung-fusi'].assetId = 'antibodi';
                        state.objects['tabung-fusi'].name = 'Antibodi Monoklonal';
                        state.objects['tabung-fusi'].w = 115;
                        state.objects['tabung-fusi'].h = 130;
                    }
                },
                {
                    instruction: 'Geser molekul antibodi ke vial tabung hasil akhir.',
                    sourceId: 'tabung-fusi',
                    targetId: 'tabung-antibodi',
                    actionText: 'Pemanenan Antibodi Monoklonal',
                    explanation: 'Antibodi monoklonal murni (mAb) siap digunakan sebagai terapi pengobatan kanker dan diagnostik spesifik.',
                    obsRow: ['6. Pemanenan', 'Vial Reagen Antibodi', 'Diperoleh antibodi monoklonal murni berkemurnian tinggi untuk pengobatan medis.'],
                    onSuccess(state) {
                        delete state.objects['tabung-fusi'];
                        state.objects['tabung-antibodi'].name = 'Antibodi Monoklonal (Selesai)';
                    }
                }
            ]
        },

        // ---------------------------------------------------------------------
        // E. DNA REKOMBINAN
        // ---------------------------------------------------------------------
        'dna-rekombinan': {
            id: 'dna-rekombinan',
            title: 'Teknologi DNA Rekombinan (Insulin)',
            subtitle: 'Penyisipan gen insulin manusia ke dalam plasmid bakteri untuk produksi hormon insulin.',
            icon: '🧬',
            tableCols: ['Langkah', 'Mekanisme Enzimatis', 'Keterangan Ilmiah'],
            summarySteps: [
                'Isolasi DNA untai ganda dari sel pankreas manusia yang membawa gen penghasil hormon insulin.',
                'Enzim restriksi endonuklease (gunting biologi) memotong fragmen gen insulin pada situs pengenalan urutan basa.',
                'Isolasi cincin plasmid bakteri E. coli dan pemotongan cincin dengan enzim restriksi yang sama (sticky ends cocok).',
                'Enzim ligase (perekat biologi) menyambung gen insulin ke dalam plasmid menghasilkan Plasmid Rekombinan.',
                'Transformasi memasukkan plasmid rekombinan ke dalam sel inang bakteri Escherichia coli.',
                'Seleksi media antibiotik mengeliminasi bakteri gagal; hanya bakteri pembawa plasmid resisten yang bertahan hidup.',
                'Kultur bakteri unggul pada bioreaktor fermentor memperbanyak bakteri hingga memanen hormon insulin skala industri.'
            ],
            // 6 Objek berjajar pada 6 slot proporsional di meja
            initialObjects: [
                { id: 'sel-manusia', assetId: 'sel-manusia', name: 'Sel Pankreas Manusia', slotIndex: 0, w: 130, h: 130 },
                { id: 'enzim-gunting', assetId: 'enzim-gunting', name: 'Enzim Restriksi (Gunting)', slotIndex: 1, w: 115, h: 135 },
                { id: 'sel-bakteri', assetId: 'sel-bakteri', name: 'Bakteri E. coli + Plasmid', slotIndex: 2, w: 150, h: 125, isApparatus: true },
                { id: 'enzim-ligase', assetId: 'enzim-ligase', name: 'Enzim Ligase (Perekat)', slotIndex: 3, w: 115, h: 110 },
                { id: 'media-antibiotik', assetId: 'media-antibiotik', name: 'Cawan Seleksi Antibiotik', slotIndex: 4, w: 135, h: 115, isApparatus: true, isTargetOnly: true },
                { id: 'fermentor', assetId: 'fermentor', name: 'Bioreaktor Fermentor', slotIndex: 5, w: 165, h: 170, isApparatus: true, isTargetOnly: true }
            ],
            steps: [
                {
                    instruction: 'Geser sel manusia ke enzim gunting untuk mengisolasi untai heliks DNA.',
                    sourceId: 'sel-manusia',
                    targetId: 'enzim-gunting',
                    actionText: 'Isolasi DNA Kromosom Manusia',
                    explanation: 'DNA untai ganda membawa gen target pengkode hormon insulin yang akan disalin.',
                    obsRow: ['1. Isolasi DNA', 'Sel Pankreas Manusia', 'Berhasil mengekstraksi molekul DNA heliks ganda pembawa gen insulin.'],
                    onSuccess(state) {
                        state.objects['sel-manusia'].assetId = 'dna';
                        state.objects['sel-manusia'].name = 'DNA Heliks Ganda';
                        state.objects['sel-manusia'].w = 110;
                        state.objects['sel-manusia'].h = 145;
                    }
                },
                {
                    instruction: 'Geser enzim restriksi (gunting) ke DNA untuk memotong gen insulin.',
                    sourceId: 'enzim-gunting',
                    targetId: 'sel-manusia',
                    actionText: 'Pemotongan dengan Enzim Restriksi',
                    explanation: 'Restriksi endonuklease memotong ikatan fosfodiester DNA pada urutan palindromik spesifik.',
                    obsRow: ['2. Pemotongan Gen', 'Enzim Restriksi Endonuklease', 'Fragmen gen pengkode insulin terpotong dengan ujung lengket (sticky ends).'],
                    onSuccess(state) {
                        state.objects['enzim-gunting'].x = state.objects['enzim-gunting'].initialX;
                        state.objects['sel-manusia'].assetId = 'gen-insulin';
                        state.objects['sel-manusia'].name = 'Gen Insulin Terpotong';
                        state.objects['sel-manusia'].w = 125;
                        state.objects['sel-manusia'].h = 95;
                    }
                },
                {
                    instruction: 'Geser enzim restriksi ke bakteri untuk memotong cincin plasmid vektor.',
                    sourceId: 'enzim-gunting',
                    targetId: 'sel-bakteri',
                    actionText: 'Pemotongan Plasmid Vektor',
                    explanation: 'Plasmid dipotong dengan enzim yang sama agar menghasilkan ujung sticky ends yang komplementer.',
                    obsRow: ['3. Pembukaan Vektor', 'Plasmid Bakteri E. coli', 'Cincin plasmid terbuka dan siap disisipi fragmen gen target.'],
                    onSuccess(state) {
                        state.objects['enzim-gunting'].x = state.objects['enzim-gunting'].initialX;
                        state.objects['sel-bakteri'].assetId = 'plasmid';
                        state.objects['sel-bakteri'].name = 'Plasmid Terbuka';
                        state.objects['sel-bakteri'].w = 120;
                        state.objects['sel-bakteri'].h = 120;
                        state.objects['sel-bakteri'].isApparatus = false;
                    }
                },
                {
                    instruction: 'Geser gen insulin ke plasmid terbuka, lalu rekatkan dengan enzim ligase.',
                    sourceId: 'sel-manusia',
                    targetId: 'sel-bakteri',
                    actionText: 'Ligasi Gen Menghasilkan Plasmid Rekombinan',
                    explanation: 'Enzim DNA ligase mengatalisis pembentukan ikatan kovalen menyatukan gen insulin ke vektor plasmid.',
                    obsRow: ['4. Rekombinasi', 'Enzim DNA Ligase', 'Gen insulin tersambung permanen ke cincin plasmid membentuk Plasmid Rekombinan.'],
                    onSuccess(state) {
                        delete state.objects['sel-manusia'];
                        state.objects['sel-bakteri'].assetId = 'plasmid-rekombinan';
                        state.objects['sel-bakteri'].name = 'Plasmid Rekombinan';
                        state.objects['sel-bakteri'].w = 120;
                        state.objects['sel-bakteri'].h = 120;
                    }
                },
                {
                    instruction: 'Geser plasmid rekombinan ke cawan media untuk proses transformasi bakteri.',
                    sourceId: 'sel-bakteri',
                    targetId: 'media-antibiotik',
                    actionText: 'Transformasi DNA ke Sel Bakteri Inang',
                    explanation: 'Transformasi membuat sel bakteri kompeten menyerap plasmid rekombinan ke dalam sitoplasmanya.',
                    obsRow: ['5. Transformasi', 'Bakteri Inang E. coli', 'Plasmid rekombinan berhasil masuk ke dalam sel bakteri inang.'],
                    onSuccess(state) {
                        state.objects['sel-bakteri'].x = state.objects['sel-bakteri'].initialX;
                        state.objects['sel-bakteri'].assetId = 'sel-bakteri';
                        state.objects['sel-bakteri'].name = 'Bakteri Ter-Transformasi';
                        state.objects['sel-bakteri'].w = 150;
                        state.objects['sel-bakteri'].h = 125;
                    }
                },
                {
                    instruction: 'Lakukan seleksi antibiotik: bakteri resisten hidup membentuk koloni.',
                    sourceId: 'sel-bakteri',
                    targetId: 'media-antibiotik',
                    actionText: 'Seleksi Gen Resisten Antibiotik',
                    timerDuration: 2000,
                    timerText: 'Uji antibiotik: Bakteri tanpa plasmid mati; bakteri pembawa plasmid insulin tetap hidup...',
                    explanation: 'Plasmid membawa gen resistensi ampisilin sehingga hanya koloni pembawa gen insulin yang bertahan hidup.',
                    obsRow: ['6. Seleksi Resistensi', 'Media Agar Antibiotik', 'Hanya bakteri pembawa plasmid rekombinan yang bertahan dan berkembang biak.'],
                    onSuccess(state) {
                        state.objects['sel-bakteri'].name = 'Koloni Bakteri Unggul';
                    }
                },
                {
                    instruction: 'Geser bakteri unggul ke bioreaktor fermentor untuk memproduksi hormon insulin.',
                    sourceId: 'sel-bakteri',
                    targetId: 'fermentor',
                    actionText: 'Kultur Fermentor Skala Industri',
                    timerDuration: 2400,
                    timerText: 'Bioreaktor beroperasi: Bakteri membelah miliaran kali dan mensekresikan hormon insulin murni...',
                    explanation: 'Di dalam fermentor bernutrisi optimal, bakteri mengekspresikan gen insulin manusia dalam jumlah massal.',
                    obsRow: ['7. Panen Insulin', 'Bioreaktor Fermentor', 'Bakteri membelah massal dan menghasilkan hormon insulin manusia murni berstandar farmasi.'],
                    onSuccess(state) {
                        delete state.objects['sel-bakteri'];
                        state.objects['fermentor'].name = 'Fermentor Menghasilkan Insulin';
                    }
                }
            ]
        }
    };

    // =========================================================================
    // ENGINE UTAMA VLAB MANAGER
    // =========================================================================
    const VLabManager = {
        init() {
            const container = document.getElementById('sim-container');
            if (!container) return;

            const moduleAttr = container.getAttribute('data-module');
            if (moduleAttr && SIMULATOR_DATA[moduleAttr]) {
                labState.subbab = moduleAttr;
            } else {
                labState.subbab = 'kultur-jaringan';
            }

            this.resetSimulatorState();
            this.renderDOM(container);
            this.bindGlobalEvents();
        },

        onTabActivated() {
            const container = document.getElementById('sim-container');
            if (!container) return;

            const moduleAttr = container.getAttribute('data-module');
            if (moduleAttr && SIMULATOR_DATA[moduleAttr] && labState.subbab !== moduleAttr) {
                labState.subbab = moduleAttr;
                this.resetSimulatorState();
                this.renderDOM(container);
            } else if (!container.querySelector('.lab-scene-wrapper')) {
                this.renderDOM(container);
            }
        },

        handleResize() {
            this.recalculateSlotPositions();
            this.renderEntities();
        },

        resetSimulatorState() {
            clearAllTimeouts();
            const config = SIMULATOR_DATA[labState.subbab] || SIMULATOR_DATA['kultur-jaringan'];

            labState.stepIndex = 0;
            labState.observations = [];
            labState.isProcessing = false;
            labState.selectedEntityId = null;
            labState.hintActive = false;

            // Hitung posisi slot awal berdasarkan jumlah objek
            const slotCount = config.initialObjects.length;
            const slots = getSlotPositions(slotCount);

            labState.objects = {};
            config.initialObjects.forEach((obj, idx) => {
                const posX = slots[obj.slotIndex !== undefined ? obj.slotIndex : idx];
                labState.objects[obj.id] = Object.assign({}, obj, {
                    x: posX,
                    initialX: posX,
                    yOffset: 0,
                    isInside: false,
                    isDragging: false
                });
            });
        },

        recalculateSlotPositions() {
            // Memastikan objek awal yang belum berpindah tetap berada di slot yang pas
            const config = SIMULATOR_DATA[labState.subbab];
            if (!config) return;

            const slotCount = config.initialObjects.length;
            const slots = getSlotPositions(slotCount);

            config.initialObjects.forEach((obj, idx) => {
                const current = labState.objects[obj.id];
                if (current && current.x === current.initialX) {
                    const newX = slots[obj.slotIndex !== undefined ? obj.slotIndex : idx];
                    current.x = newX;
                    current.initialX = newX;
                }
            });
        },

        toggleFullscreen() {
            const sceneEl = document.querySelector('.lab-scene-wrapper');
            if (!sceneEl) return;

            const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement;
            const fsBtn = document.getElementById('btn-fullscreen');

            if (!isFullscreen) {
                if (sceneEl.requestFullscreen) {
                    sceneEl.requestFullscreen();
                } else if (sceneEl.webkitRequestFullscreen) {
                    sceneEl.webkitRequestFullscreen();
                }
                if (fsBtn) fsBtn.innerHTML = '<span>✖</span> Keluar Layar Penuh';
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                }
                if (fsBtn) fsBtn.innerHTML = '<span>⛶</span> Layar Penuh';
            }
        },

        renderDOM(container) {
            const config = SIMULATOR_DATA[labState.subbab];
            const currentStep = config.steps[labState.stepIndex];
            const totalSteps = config.steps.length;

            const bgGradient = (window.LabTheme && window.LabTheme.gradients[labState.subbab]) 
                ? window.LabTheme.gradients[labState.subbab] 
                : 'linear-gradient(180deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)';

            let html = `
            <div class="flex flex-col gap-5 w-full">
                <!-- BANNER REKOMENDASI LANDSCAPE UNTUK GADGET HP -->
                <div class="landscape-notice-banner">
                    <span class="text-base">📱</span>
                    <span>Putar layar HP ke posisi <b>Landscape</b> untuk tampilan panggung laboratorium yang lebih luas dan nyaman.</span>
                </div>

                <!-- TOP BAR: STEPPER & CONTROL BUTTONS -->
                <div class="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div class="flex items-center gap-4">
                        <div class="w-13 h-13 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-3xl shadow-inner p-2">
                            ${config.icon}
                        </div>
                        <div>
                            <div class="flex items-center gap-2">
                                <span class="bg-teal-100 text-teal-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                    Langkah ${labState.stepIndex + 1} dari ${totalSteps}
                                </span>
                                <h3 class="font-extrabold text-slate-800 text-lg sm:text-xl">${config.title}</h3>
                            </div>
                            <p class="text-sm sm:text-base text-slate-600 mt-1 font-semibold leading-snug" id="lab-instruction-text">
                                ${currentStep ? currentStep.instruction : 'Simulasi Selesai!'}
                            </p>
                        </div>
                    </div>
                    <div class="flex items-center gap-2 self-end md:self-auto flex-wrap">
                        <button id="btn-fullscreen" onclick="window.VLabManager.toggleFullscreen()" class="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-xl font-bold text-xs shadow-sm transition">
                            <span>⛶</span> Layar Penuh
                        </button>
                        <button id="btn-hint" onclick="window.VLabManager.triggerHint()" class="flex items-center gap-1.5 px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-300 rounded-xl font-bold text-xs shadow-sm transition">
                            <span>💡</span> Petunjuk
                        </button>
                        <button id="btn-reset" onclick="window.VLabManager.handleReset()" class="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-xl font-bold text-xs shadow-sm transition">
                            <span>🔄</span> Reset
                        </button>
                    </div>
                </div>

                <!-- MAIN LAB SCENE CONTAINER (SIDE-VIEW MEJA LAB EXPANDED) -->
                <div class="lab-scene-wrapper" style="background: ${bgGradient};">
                    <!-- Background Gradient & Elemen Dekorasi Halus -->
                    <div class="lab-scene-bg"></div>
                    <div class="lab-scene-decor"></div>

                    <!-- Meja Lab 3D dengan Permukaan dan Kedalaman -->
                    <div class="lab-table-strip"></div>
                    <!-- Bayangan Transisi Dinding ke Meja -->
                    <div class="lab-wall-shadow"></div>

                    <!-- Scrollable Table Container for Mobile -->
                    <div class="lab-table-scroll-container" id="lab-scroll-bench">
                        <div class="lab-table-plane" id="lab-entities-container">
                            <!-- Objek di-render oleh renderEntities() -->
                        </div>
                    </div>

                    <!-- Banner Indikator Swipe Horizontal di HP -->
                    <div class="mobile-swipe-hint">↔ Geser meja lab ke kiri/kanan</div>

                    <!-- Toast Notifikasi Hasil / Penjelasan Ilmiah -->
                    <div id="lab-toast" class="lab-toast-message hidden"></div>

                    <!-- Overlay Animasi Proses / Timer -->
                    <div id="lab-process-overlay" class="lab-process-overlay hidden">
                        <div class="w-16 h-16 rounded-full border-4 border-teal-400 border-t-transparent lab-clock-spin mb-4"></div>
                        <h4 class="text-2xl font-bold text-white mb-2" id="process-title">Memproses...</h4>
                        <p class="text-sm sm:text-base text-teal-200 text-center max-w-lg px-4 leading-relaxed" id="process-desc"></p>
                    </div>
                </div>

                <!-- TABEL CATATAN PENGAMATAN OTOMATIS -->
                <div class="obs-table-wrapper">
                    <div class="px-5 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                        <h4 class="font-bold text-slate-800 text-sm sm:text-base flex items-center gap-2">
                            <span>📋</span> Tabel Catatan Pengamatan Praktikum
                        </h4>
                        <span class="text-xs text-slate-500 font-medium">Terisi otomatis per langkah</span>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left obs-table">
                            <thead>
                                <tr>
                                    ${config.tableCols.map(col => `<th>${col}</th>`).join('')}
                                </tr>
                            </thead>
                            <tbody id="obs-table-body">
                                ${this.renderObservations()}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- FINISH MODAL DIALOG (HANYA RINGKASAN & TOMBOL ULANGI) -->
            <div id="finish-modal" class="finish-modal-backdrop hidden">
                <div class="finish-modal-box">
                    <div class="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 shadow-sm">
                        🏆
                    </div>
                    <h3 class="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-2">Simulasi Praktikum Selesai!</h3>
                    <p class="text-slate-600 text-sm sm:text-base mb-6">Selamat! Anda telah menyelesaikan seluruh rangkaian praktikum <b>${config.title}</b> secara tuntas.</p>
                    
                    <div class="text-left bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-6 text-xs sm:text-sm text-slate-700 space-y-2.5">
                        <p class="font-bold text-slate-800 text-sm mb-2 flex items-center gap-1.5"><span>📌</span> Ringkasan Alur Proses:</p>
                        ${config.summarySteps.map((s, idx) => `<p class="leading-relaxed"><span class="font-bold text-teal-700">${idx + 1}.</span> ${s}</p>`).join('')}
                    </div>

                    <button onclick="window.VLabManager.handleReset()" class="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md transition text-base">
                        🔄 Ulangi Simulator
                    </button>
                </div>
            </div>
            `;

            container.innerHTML = html;
            this.renderEntities();
        },

        renderEntities() {
            const plane = document.getElementById('lab-entities-container');
            if (!plane) return;

            plane.innerHTML = '';
            const config = SIMULATOR_DATA[labState.subbab];
            const currentStep = config.steps[labState.stepIndex];

            for (const [id, obj] of Object.entries(labState.objects)) {
                const canInteract = currentStep && currentStep.sourceId === id;
                const isSelected = labState.selectedEntityId === id;
                const isInside = !!obj.isInside;
                const isApparatus = !!obj.isApparatus;

                const entityEl = document.createElement('div');
                entityEl.id = `entity-${id}`;
                entityEl.className = `lab-entity ${canInteract ? 'can-interact' : ''} ${isSelected ? 'is-selected' : ''} ${isInside ? 'is-inside' : ''} ${isApparatus ? 'is-apparatus' : ''}`;
                
                // Posisi slot dalam persen terhadap kontainer meja lab
                entityEl.style.left = `${obj.x}%`;
                // Kaki objek tepat menempel di permukaan garis meja (tinggi strip meja = 28%)
                entityEl.style.bottom = `calc(26% + ${obj.yOffset || 0}px)`;
                entityEl.style.width = `${obj.w}px`;
                entityEl.style.height = `${obj.h}px`;
                entityEl.style.transform = `translateX(-50%)`;
                entityEl.setAttribute('data-id', id);

                // Konten SVG definisi tinggi
                let svgHtml = '';
                if (window.LabAssetsConfig) {
                    svgHtml = window.LabAssetsConfig.renderItem(obj.assetId || id, {
                        width: obj.w,
                        height: obj.h,
                        label: obj.name
                    });
                }

                entityEl.innerHTML = `
                    <div class="lab-entity-visual">
                        ${svgHtml}
                        <div class="lab-entity-shadow"></div>
                    </div>
                    <span class="lab-entity-label">${obj.name}</span>
                `;

                this.attachEntityEvents(entityEl, id);
                plane.appendChild(entityEl);
            }
        },

        attachEntityEvents(el, id) {
            let startX = 0;
            let initialLeft = 0;
            let isDragging = false;

            const onPointerDown = (e) => {
                if (labState.isProcessing) return;
                const config = SIMULATOR_DATA[labState.subbab];
                const currentStep = config.steps[labState.stepIndex];
                if (!currentStep) return;

                // Alternatif HP: Tap target jika sudah ada objek yang dipilih
                if (labState.selectedEntityId && labState.selectedEntityId !== id) {
                    if (id === currentStep.targetId && labState.selectedEntityId === currentStep.sourceId) {
                        this.handleSuccessDrop(currentStep);
                        return;
                    } else {
                        this.handleWrongDrop(currentStep, 'Gunakan alat atau bahan yang sesuai dengan instruksi langkah!');
                        return;
                    }
                }

                if (currentStep.sourceId !== id) {
                    labState.selectedEntityId = id;
                    this.renderEntities();
                    return;
                }

                labState.selectedEntityId = id;
                isDragging = true;
                el.classList.add('is-dragging');
                el.setPointerCapture(e.pointerId);

                startX = e.clientX;
                initialLeft = labState.objects[id].x;

                const targetEl = document.getElementById(`entity-${currentStep.targetId}`);
                if (targetEl) {
                    targetEl.classList.add('lab-target-highlight');
                }
            };

            const onPointerMove = (e) => {
                if (!isDragging) return;
                const plane = document.getElementById('lab-entities-container');
                if (!plane) return;

                const rect = plane.getBoundingClientRect();
                const deltaX = ((e.clientX - startX) / rect.width) * 100;
                const newX = Math.max(3, Math.min(97, initialLeft + deltaX));

                el.style.left = `${newX}%`;
                labState.objects[id].x = newX;
            };

            const onPointerUp = (e) => {
                if (!isDragging) return;
                isDragging = false;
                el.classList.remove('is-dragging');
                el.releasePointerCapture(e.pointerId);

                const config = SIMULATOR_DATA[labState.subbab];
                const currentStep = config.steps[labState.stepIndex];

                if (currentStep) {
                    const targetEl = document.getElementById(`entity-${currentStep.targetId}`);
                    if (targetEl) {
                        targetEl.classList.remove('lab-target-highlight');
                    }
                }

                const targetObj = labState.objects[currentStep.targetId];
                if (targetObj) {
                    const distance = Math.abs(labState.objects[id].x - targetObj.x);
                    if (distance <= 14) {
                        this.handleSuccessDrop(currentStep);
                        return;
                    }
                }

                this.handleWrongDrop(currentStep, 'Objek belum mencapai alat tujuan yang tepat.');
            };

            const onPointerCancel = () => {
                if (isDragging) {
                    isDragging = false;
                    el.classList.remove('is-dragging');
                    this.renderEntities();
                }
            };

            el.addEventListener('pointerdown', onPointerDown);
            el.addEventListener('pointermove', onPointerMove);
            el.addEventListener('pointerup', onPointerUp);
            el.addEventListener('pointercancel', onPointerCancel);
        },

        handleSuccessDrop(step) {
            labState.isProcessing = true;
            labState.selectedEntityId = null;

            if (typeof step.onSuccess === 'function') {
                step.onSuccess(labState);
            }

            if (step.obsRow) {
                labState.observations.push(step.obsRow);
            }

            this.showToast(step.explanation, 'success');

            if (step.timerDuration) {
                const overlay = document.getElementById('lab-process-overlay');
                const title = document.getElementById('process-title');
                const desc = document.getElementById('process-desc');

                if (overlay && title && desc) {
                    title.innerText = step.actionText || 'Mereaksikan...';
                    desc.innerText = step.timerText || 'Proses biologis sedang berlangsung...';
                    overlay.classList.remove('hidden');

                    safeTimeout(() => {
                        overlay.classList.add('hidden');
                        this.advanceStep();
                    }, step.timerDuration);
                    return;
                }
            }

            safeTimeout(() => {
                this.advanceStep();
            }, 600);
        },

        handleWrongDrop(step, defaultMsg) {
            labState.selectedEntityId = null;
            const sourceEl = document.getElementById(`entity-${step.sourceId}`);
            if (sourceEl) {
                sourceEl.classList.add('animate-shake');
                safeTimeout(() => {
                    sourceEl.classList.remove('animate-shake');
                }, 500);
            }

            if (labState.objects[step.sourceId]) {
                labState.objects[step.sourceId].x = labState.objects[step.sourceId].initialX;
            }

            this.showToast(defaultMsg || 'Langkah belum tepat. Geser objek ke sasaran yang benar!', 'error');
            this.renderEntities();
        },

        advanceStep() {
            labState.isProcessing = false;
            labState.stepIndex++;

            const config = SIMULATOR_DATA[labState.subbab];
            if (labState.stepIndex >= config.steps.length) {
                this.renderEntities();
                this.updateUI();
                this.showFinishModal();
            } else {
                this.renderEntities();
                this.updateUI();
            }
        },

        updateUI() {
            const config = SIMULATOR_DATA[labState.subbab];
            const currentStep = config.steps[labState.stepIndex];

            const instrEl = document.getElementById('lab-instruction-text');
            if (instrEl && currentStep) {
                instrEl.innerText = currentStep.instruction;
            }

            const tbody = document.getElementById('obs-table-body');
            if (tbody) {
                tbody.innerHTML = this.renderObservations();
            }
        },

        renderObservations() {
            if (labState.observations.length === 0) {
                return `<tr><td colspan="3" class="text-center py-6 text-slate-400 italic font-medium">Belum ada catatan pengamatan. Lakukan interaksi pada meja lab di atas.</td></tr>`;
            }

            return labState.observations.map((row, idx) => `
                <tr class="${idx === labState.observations.length - 1 ? 'new-row' : ''}">
                    <td class="font-bold text-teal-800">${row[0]}</td>
                    <td class="font-semibold text-slate-800">${row[1]}</td>
                    <td class="text-slate-600 leading-relaxed">${row[2]}</td>
                </tr>
            `).join('');
        },

        showToast(message, type = 'success') {
            const toast = document.getElementById('lab-toast');
            if (!toast) return;

            toast.className = `lab-toast-message ${type}`;
            toast.innerHTML = `<span>${type === 'success' ? '💡' : '⚠️'}</span> <span>${message}</span>`;
            toast.classList.remove('hidden');

            safeTimeout(() => {
                toast.classList.add('hidden');
            }, 3800);
        },

        triggerHint() {
            const config = SIMULATOR_DATA[labState.subbab];
            const currentStep = config.steps[labState.stepIndex];
            if (!currentStep) return;

            const sourceEl = document.getElementById(`entity-${currentStep.sourceId}`);
            const targetEl = document.getElementById(`entity-${currentStep.targetId}`);

            if (sourceEl) {
                sourceEl.classList.add('pulse-hint');
                safeTimeout(() => sourceEl.classList.remove('pulse-hint'), 2500);
            }

            if (targetEl) {
                targetEl.classList.add('lab-target-highlight');
                safeTimeout(() => targetEl.classList.remove('lab-target-highlight'), 2500);
            }

            this.showToast(`Petunjuk: Ambil "${labState.objects[currentStep.sourceId].name}" dan arahkan ke "${labState.objects[currentStep.targetId].name}".`, 'success');
        },

        handleReset() {
            const finishModal = document.getElementById('finish-modal');
            if (finishModal) {
                finishModal.classList.add('hidden');
            }

            this.resetSimulatorState();
            const container = document.getElementById('sim-container');
            if (container) {
                this.renderDOM(container);
            }
        },

        showFinishModal() {
            const finishModal = document.getElementById('finish-modal');
            if (finishModal) {
                finishModal.classList.remove('hidden');
            }
            if (typeof confetti === 'function') {
                confetti({
                    particleCount: 100,
                    spread: 80,
                    origin: { y: 0.6 }
                });
            }
        },

        bindGlobalEvents() {
            window.addEventListener('resize', () => {
                this.handleResize();
            });
        }
    };

    window.VLabManager = VLabManager;

    document.addEventListener('DOMContentLoaded', () => {
        VLabManager.init();
    });
})();
