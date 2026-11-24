/**
 * =========================================================================
 * VIRTUAL LAB THEME PALETTE & DESIGN SYSTEM
 * Definisi warna konsisten untuk seluruh objek SVG dan panggung simulator
 * =========================================================================
 */

const LabTheme = {
    // Warna Meja & Panggung
    stage: {
        tableSurface: '#1e293b',       // Strip meja biru-abu gelap datar
        tableEdge: '#334155',          // Garis tepi meja (highlight pantulan)
        tableDepth: '#0f172a',         // Ketebalan dasar meja
        shadowColor: 'rgba(15, 23, 42, 0.45)' // Bayangan kontak datar
    },

    // Background Gradient per Simulator
    gradients: {
        'kultur-jaringan': 'linear-gradient(180deg, #042f2e 0%, #0f766e 55%, #2dd4bf 100%)',
        'bayi-tabung': 'linear-gradient(180deg, #3b0764 0%, #6b21a8 50%, #a855f7 100%)',
        'kloning': 'linear-gradient(180deg, #1e1b4b 0%, #3730a3 50%, #6366f1 100%)',
        'teknologi-hibridoma': 'linear-gradient(180deg, #500724 0%, #9d174d 50%, #ec4899 100%)',
        'dna-rekombinan': 'linear-gradient(180deg, #082f49 0%, #0369a1 50%, #0ea5e9 100%)'
    },

    // Kaca & Bahan Laboratorium Transparan
    glass: {
        stroke: '#475569',
        fill: 'rgba(241, 245, 249, 0.35)',
        highlight: 'rgba(255, 255, 255, 0.75)',
        liquidNutrient: '#eab308',     // Kuning agar MS
        liquidSperm: '#93c5fd',        // Biru transparan sperma
        liquidRed: '#ef4444',          // Merah darah / antigen
        liquidPurple: '#a855f7',       // Reagen fusi / ungu
        liquidGreen: '#22c55e',        // Hasil antibiotik / hijau
        liquidBlue: '#38bdf8'          // Insulin murni
    },

    // Logam & Alat Presisi
    hardware: {
        metalLight: '#f1f5f9',
        metalMid: '#cbd5e1',
        metalDark: '#64748b',
        metalOutline: '#1e293b',
        displayBg: '#0f172a',
        displayGreen: '#22c55e',
        displayAmber: '#f59e0b',
        displayCyan: '#38bdf8'
    },

    // Biologi (Organ, Sel, Tanaman, Hewan)
    biology: {
        carrotOrange: '#ea580c',
        carrotGreen: '#16a34a',
        cellMembrane: '#be185d',
        cellCytoplasm: '#fce7f3',
        cellNucleus: '#831843',
        dnaBlue: '#0284c7',
        dnaCyan: '#38bdf8',
        plasmidPurple: '#9333ea',
        plasmidInsert: '#06b6d4',
        sheepWhite: '#f8fafc',
        sheepShade: '#cbd5e1',
        sheepBlackface: '#1e293b',
        antibodyYellow: '#f59e0b',
        antibodyTip: '#b45309'
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = LabTheme;
}
if (typeof window !== 'undefined') {
    window.LabTheme = LabTheme;
}

