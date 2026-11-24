/**
 * =========================================================================
 * VIRTUAL LAB ASSETS CONFIG & MANIFEST HD (SKALA DIPERBESAR ~1.4X)
 * =========================================================================
 */

(function () {
    'use strict';

    const LabAssetsConfig = {
        defaultType: 'svg',
        svgBaseUrl: '/static/assets/svg',
        imageBaseUrl: '/static/assets/images',

        // Skala proporsional realistis (1.35x - 1.5x)
        objects: {
            // --- UMUM ---
            'tabung-erlenmeyer': { id: 'tabung-erlenmeyer', name: 'Labu Erlenmeyer', category: 'umum', type: 'svg', width: 125, height: 140, tier: 'medium' },
            'tabung-reaksi': { id: 'tabung-reaksi', name: 'Tabung Reaksi', category: 'umum', type: 'svg', width: 105, height: 135, tier: 'medium' },
            'cawan-petri': { id: 'cawan-petri', name: 'Cawan Petri Kaca', category: 'umum', type: 'svg', width: 135, height: 110, tier: 'medium' },
            'mikroskop': { id: 'mikroskop', name: 'Mikroskop Laboratorium', category: 'umum', type: 'svg', width: 145, height: 155, tier: 'large' },
            'pipet': { id: 'pipet', name: 'Mikropipet Presisi', category: 'umum', type: 'svg', width: 105, height: 145, tier: 'medium' },
            'suntikan': { id: 'suntikan', name: 'Jarum Suntik Spuit', category: 'umum', type: 'svg', width: 105, height: 140, tier: 'medium' },
            'timbangan': { id: 'timbangan', name: 'Timbangan Digital', category: 'umum', type: 'svg', width: 155, height: 135, tier: 'large' },
            'bunsen': { id: 'bunsen', name: 'Pembakar Bunsen & Kassa', category: 'umum', type: 'svg', width: 135, height: 145, tier: 'large' },

            // --- A: KULTUR JARINGAN ---
            'wortel': { id: 'wortel', name: 'Wortel Segar', category: 'a-kultur-jaringan', type: 'svg', width: 115, height: 135, tier: 'medium' },
            'pisau': { id: 'pisau', name: 'Pisau Skalpel Steril', category: 'a-kultur-jaringan', type: 'svg', width: 110, height: 140, tier: 'medium' },
            'laminar-flow': { id: 'laminar-flow', name: 'Laminar Air Flow (LAF)', category: 'a-kultur-jaringan', type: 'svg', width: 170, height: 160, tier: 'large' },
            'tabung-media': { id: 'tabung-media', name: 'Tabung Nutrisi MS', category: 'a-kultur-jaringan', type: 'svg', width: 105, height: 140, tier: 'medium' },
            'eksplan': { id: 'eksplan', name: 'Potongan Eksplan', category: 'a-kultur-jaringan', type: 'svg', width: 95, height: 95, tier: 'small' },
            'kalus': { id: 'kalus', name: 'Gumpalan Kalus', category: 'a-kultur-jaringan', type: 'svg', width: 110, height: 110, tier: 'small' },
            'planlet': { id: 'planlet', name: 'Planlet Wortel Mini', category: 'a-kultur-jaringan', type: 'svg', width: 115, height: 145, tier: 'medium' },
            'pot-tanaman': { id: 'pot-tanaman', name: 'Pot Tanah Aklimatisasi', category: 'a-kultur-jaringan', type: 'svg', width: 135, height: 135, tier: 'medium' },
            'tumbuhan-dewasa': { id: 'tumbuhan-dewasa', name: 'Tanaman Wortel Dewasa', category: 'a-kultur-jaringan', type: 'svg', width: 150, height: 165, tier: 'large' },
            'rak-inkubasi': { id: 'rak-inkubasi', name: 'Rak Inkubasi (Jam)', category: 'a-kultur-jaringan', type: 'svg', width: 160, height: 165, tier: 'large' },

            // --- B: BAYI TABUNG ---
            'ovarium': { id: 'ovarium', name: 'Organ Ovarium', category: 'b-bayi-tabung', type: 'svg', width: 140, height: 135, tier: 'medium' },
            'suntikan-hormon': { id: 'suntikan-hormon', name: 'Suntikan Hormon', category: 'b-bayi-tabung', type: 'svg', width: 105, height: 140, tier: 'medium' },
            'tabung-sperma': { id: 'tabung-sperma', name: 'Tabung Sampel Sperma', category: 'b-bayi-tabung', type: 'svg', width: 105, height: 140, tier: 'medium' },
            'ovum': { id: 'ovum', name: 'Sel Ovum Matang', category: 'b-bayi-tabung', type: 'svg', width: 115, height: 115, tier: 'small' },
            'sperma': { id: 'sperma', name: 'Spermatozoa', category: 'b-bayi-tabung', type: 'svg', width: 115, height: 100, tier: 'small' },
            'zigot': { id: 'zigot', name: 'Sel Zigot (Fertilisasi)', category: 'b-bayi-tabung', type: 'svg', width: 115, height: 115, tier: 'small' },
            'blastula': { id: 'blastula', name: 'Embrio Tahap Blastula', category: 'b-bayi-tabung', type: 'svg', width: 115, height: 115, tier: 'small' },
            'inkubator': { id: 'inkubator', name: 'Inkubator CO2 (37°C)', category: 'b-bayi-tabung', type: 'svg', width: 160, height: 165, tier: 'large' },
            'rahim': { id: 'rahim', name: 'Rahim (Uterus) Ibu', category: 'b-bayi-tabung', type: 'svg', width: 150, height: 150, tier: 'large' },

            // --- C: KLONING ---
            'domba-finndorset': { id: 'domba-finndorset', name: 'Finn Dorset (Donor Inti)', category: 'c-kloning', type: 'svg', width: 155, height: 145, tier: 'large' },
            'sel-kelenjar-susu': { id: 'sel-kelenjar-susu', name: 'Sel Kelenjar Susu (2n)', category: 'c-kloning', type: 'svg', width: 110, height: 110, tier: 'small' },
            'domba-blackface': { id: 'domba-blackface', name: 'Blackface (Donor Ovum)', category: 'c-kloning', type: 'svg', width: 155, height: 145, tier: 'large' },
            'ovum-blackface': { id: 'ovum-blackface', name: 'Ovum Domba (Enukleasi)', category: 'c-kloning', type: 'svg', width: 115, height: 115, tier: 'small' },
            'mikropipet': { id: 'mikropipet', name: 'Mikromanipulator Enukleasi', category: 'c-kloning', type: 'svg', width: 105, height: 145, tier: 'medium' },
            'cawan-kultur': { id: 'cawan-kultur', name: 'Cawan Fusi Sel', category: 'c-kloning', type: 'svg', width: 135, height: 110, tier: 'medium' },
            'alat-stimulasi': { id: 'alat-stimulasi', name: 'Mesin Elektrofusi', category: 'c-kloning', type: 'svg', width: 150, height: 145, tier: 'large' },
            'blastosit': { id: 'blastosit', name: 'Blastosit Kloning', category: 'c-kloning', type: 'svg', width: 115, height: 115, tier: 'small' },
            'domba-dolly': { id: 'domba-dolly', name: 'Domba Dolly (Anak Kloning)', category: 'c-kloning', type: 'svg', width: 135, height: 125, tier: 'medium' },

            // --- D: TEKNOLOGI HIBRIDOMA ---
            'tikus': { id: 'tikus', name: 'Mencit Donor Imun', category: 'd-hibridoma', type: 'svg', width: 150, height: 125, tier: 'medium' },
            'suntikan-antigen': { id: 'suntikan-antigen', name: 'Suntikan Antigen', category: 'd-hibridoma', type: 'svg', width: 105, height: 140, tier: 'medium' },
            'tabung-limfosit-b': { id: 'tabung-limfosit-b', name: 'Suspensi Limfosit B', category: 'd-hibridoma', type: 'svg', width: 105, height: 140, tier: 'medium' },
            'tabung-sel-kanker': { id: 'tabung-sel-kanker', name: 'Sel Kanker Mieloma', category: 'd-hibridoma', type: 'svg', width: 105, height: 140, tier: 'medium' },
            'tabung-fusi': { id: 'tabung-fusi', name: 'Tabung Fusi PEG', category: 'd-hibridoma', type: 'svg', width: 125, height: 145, tier: 'medium' },
            'sel-hibridoma': { id: 'sel-hibridoma', name: 'Sel Hibridoma', category: 'd-hibridoma', type: 'svg', width: 120, height: 120, tier: 'small' },
            'rak-kultur': { id: 'rak-kultur', name: 'Pelat Kultur Selektif HAT', category: 'd-hibridoma', type: 'svg', width: 155, height: 135, tier: 'large' },
            'tabung-antibodi': { id: 'tabung-antibodi', name: 'Vial Antibodi (mAb)', category: 'd-hibridoma', type: 'svg', width: 105, height: 135, tier: 'medium' },
            'antibodi': { id: 'antibodi', name: 'Molekul Antibodi (Bentuk Y)', category: 'd-hibridoma', type: 'svg', width: 115, height: 130, tier: 'small' },

            // --- E: DNA REKOMBINAN ---
            'sel-manusia': { id: 'sel-manusia', name: 'Sel Pankreas Manusia', category: 'e-dna-rekombinan', type: 'svg', width: 130, height: 130, tier: 'medium' },
            'dna': { id: 'dna', name: 'DNA Heliks Ganda', category: 'e-dna-rekombinan', type: 'svg', width: 110, height: 145, tier: 'medium' },
            'gen-insulin': { id: 'gen-insulin', name: 'Fragmen Gen Insulin', category: 'e-dna-rekombinan', type: 'svg', width: 125, height: 95, tier: 'small' },
            'enzim-gunting': { id: 'enzim-gunting', name: 'Enzim Restriksi Endonuklease', category: 'e-dna-rekombinan', type: 'svg', width: 115, height: 135, tier: 'medium' },
            'sel-bakteri': { id: 'sel-bakteri', name: 'Bakteri E. coli', category: 'e-dna-rekombinan', type: 'svg', width: 150, height: 125, tier: 'medium' },
            'plasmid': { id: 'plasmid', name: 'Plasmid Vektor Sirkular', category: 'e-dna-rekombinan', type: 'svg', width: 120, height: 120, tier: 'small' },
            'enzim-ligase': { id: 'enzim-ligase', name: 'Enzim Ligase Molekuler', category: 'e-dna-rekombinan', type: 'svg', width: 115, height: 110, tier: 'small' },
            'plasmid-rekombinan': { id: 'plasmid-rekombinan', name: 'Plasmid Rekombinan', category: 'e-dna-rekombinan', type: 'svg', width: 120, height: 120, tier: 'small' },
            'media-antibiotik': { id: 'media-antibiotik', name: 'Cawan Seleksi Antibiotik', category: 'e-dna-rekombinan', type: 'svg', width: 135, height: 115, tier: 'medium' },
            'fermentor': { id: 'fermentor', name: 'Bioreaktor Fermentor', category: 'e-dna-rekombinan', type: 'svg', width: 165, height: 170, tier: 'large' }
        },

        renderItem(id, options = {}) {
            const item = this.objects[id] || { id, name: id, category: 'umum', type: 'svg', width: 110, height: 110 };
            const type = item.type || this.defaultType;

            if (type === 'image' && item.imagePath) {
                return `<img src="${item.imagePath}" alt="${item.name}" class="lab-entity-img" style="width: 100%; height: 100%; object-fit: contain;" />`;
            }

            if (window.LabSVG && typeof window.LabSVG.render === 'function') {
                return window.LabSVG.render(id, Object.assign({}, item, options));
            }

            const category = item.category || 'umum';
            return `<img src="${this.svgBaseUrl}/${category}/${id}.svg" alt="${item.name}" class="lab-entity-svg" style="width: 100%; height: 100%; object-fit: contain;" />`;
        }
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = LabAssetsConfig;
    }
    if (typeof window !== 'undefined') {
        window.LabAssetsConfig = LabAssetsConfig;
    }
})();
