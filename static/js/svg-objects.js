/**
 * =========================================================================
 * VIRTUAL LAB SVG OBJECT GENERATOR HD (GAYA SIDE-VIEW FLAT VECTOR MEJA LAB)
 * 
 * Standar Kualitas Tinggi:
 * 1. Kedalaman & Dimensi: Gradien multi-stop (linear & radial), sorotan cahaya putih, dan inner shadow.
 * 2. Kaca Realistis: Transparansi ganda, highlight diagonal, meniskus cairan, dan gelembung mikro.
 * 3. Logam & Plastik: Gradien baja/slate halus dengan specular shine.
 * 4. Detail Biologis Ilmiah: Membran sel ganda, zona pelusida, heliks ganda DNA berwarna,
 *    antibodi Y presisi, domba Finn Dorset vs Blackface bertekstur wol, dsb.
 * =========================================================================
 */

(function () {
    'use strict';

    const LabSVG = {
        getCommonDefs(p, liquidColor = '#eab308') {
            return `
            <defs>
                <!-- Gradien Kaca Realistis -->
                <linearGradient id="${p}_glass_body" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stop-color="#ffffff" stop-opacity="0.8"/>
                    <stop offset="12%" stop-color="#f0f9ff" stop-opacity="0.35"/>
                    <stop offset="50%" stop-color="#e0f2fe" stop-opacity="0.2"/>
                    <stop offset="88%" stop-color="#bae6fd" stop-opacity="0.35"/>
                    <stop offset="100%" stop-color="#ffffff" stop-opacity="0.75"/>
                </linearGradient>
                <linearGradient id="${p}_glass_highlight" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stop-color="#ffffff" stop-opacity="0.85"/>
                    <stop offset="50%" stop-color="#ffffff" stop-opacity="0.2"/>
                    <stop offset="100%" stop-color="#ffffff" stop-opacity="0.0"/>
                </linearGradient>

                <!-- Gradien Logam & Stainless Steel -->
                <linearGradient id="${p}_steel" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#f8fafc"/>
                    <stop offset="25%" stop-color="#e2e8f0"/>
                    <stop offset="55%" stop-color="#cbd5e1"/>
                    <stop offset="100%" stop-color="#64748b"/>
                </linearGradient>
                <linearGradient id="${p}_metal_bevel" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stop-color="#ffffff"/>
                    <stop offset="50%" stop-color="#94a3b8"/>
                    <stop offset="100%" stop-color="#334155"/>
                </linearGradient>

                <!-- Gradien Cairan Dinamis -->
                <linearGradient id="${p}_liquid" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#ffffff" stop-opacity="0.3"/>
                    <stop offset="15%" stop-color="${liquidColor}" stop-opacity="0.85"/>
                    <stop offset="100%" stop-color="${liquidColor}" stop-opacity="0.95"/>
                </linearGradient>

                <!-- Filter Glow LED & Lampu -->
                <filter id="${p}_glow" x="-25%" y="-25%" width="150%" height="150%">
                    <feGaussianBlur stdDeviation="3.5" result="blur"/>
                    <feMerge>
                        <feMergeNode in="blur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
                <filter id="${p}_soft_shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="3" stdDeviation="2.5" flood-color="#0f172a" flood-opacity="0.35"/>
                </filter>
            </defs>`;
        },

        render(id, opts = {}) {
            const w = opts.width || 100;
            const h = opts.height || 100;
            const state = opts.state || 'normal';
            const displayVal = opts.displayVal !== undefined ? opts.displayVal : '';
            const liquidLevel = opts.liquidLevel !== undefined ? opts.liquidLevel : 55;
            const liquidColor = opts.liquidColor || '#eab308';
            const label = opts.label || '';
            const p = `svg_${id.replace(/[^a-zA-Z0-9]/g, '_')}_${Math.floor(Math.random() * 100000)}`;

            const defs = this.getCommonDefs(p, liquidColor);
            let content = '';

            switch (id) {
                // =============================================================
                // 1. ALAT UMUM LABORATORIUM
                // =============================================================
                case 'tabung-erlenmeyer':
                    content = `
                    <g transform="translate(15, 6)">
                        <!-- Cairan dengan Meniskus & Gelembung Mikro -->
                        <path d="M 28 46 Q 35 44 42 46 L 64 85 Q 35 90 6 85 Z" fill="url(#${p}_liquid)"/>
                        <ellipse cx="35" cy="46" rx="7" ry="2" fill="${liquidColor}" opacity="0.9"/>
                        <!-- Gelembung Mikro -->
                        <circle cx="28" cy="62" r="1.5" fill="#ffffff" opacity="0.65"/>
                        <circle cx="40" cy="72" r="2" fill="#ffffff" opacity="0.6"/>
                        <circle cx="22" cy="78" r="1.2" fill="#ffffff" opacity="0.65"/>
                        <!-- Badan Kaca Labu Erlenmeyer Tebal -->
                        <path d="M 27 14 L 27 38 L 4 84 Q 35 92 66 84 L 43 38 L 43 14 Z" 
                              fill="url(#${p}_glass_body)" stroke="#334155" stroke-width="2.5"/>
                        <!-- Bibir Labu Cincin Tebal -->
                        <ellipse cx="35" cy="14" rx="9" ry="3.5" fill="url(#${p}_steel)" stroke="#334155" stroke-width="2"/>
                        <!-- Garis Skala Pengukur Putih Bersih -->
                        <line x1="31" y1="56" x2="39" y2="56" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round"/>
                        <line x1="28" y1="66" x2="42" y2="66" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round"/>
                        <line x1="24" y1="76" x2="46" y2="76" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round"/>
                        <!-- Pantulan Cahaya Diagonal Kaca Mengilap -->
                        <path d="M 12 82 L 30 45 L 30 18" stroke="#ffffff" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.8"/>
                    </g>`;
                    break;

                case 'tabung-reaksi':
                    const rH = (liquidLevel / 100) * 56;
                    content = `
                    <g transform="translate(34, 10)">
                        <!-- Cairan dengan Meniskus -->
                        <path d="M 6 ${74 - rH} Q 16 ${72 - rH} 26 ${74 - rH} L 26 70 Q 16 86 6 70 Z" fill="url(#${p}_liquid)"/>
                        <ellipse cx="16" cy="${74 - rH}" rx="10" ry="2.5" fill="${liquidColor}" opacity="0.9"/>
                        <circle cx="14" cy="55" r="1.2" fill="#ffffff" opacity="0.6"/>
                        <!-- Dinding Tabung Kaca Tebal -->
                        <path d="M 5 14 L 5 70 Q 16 88 27 70 L 27 14" 
                              fill="url(#${p}_glass_body)" stroke="#334155" stroke-width="2.5"/>
                        <!-- Bibir Tabung -->
                        <ellipse cx="16" cy="14" rx="12" ry="4" fill="#f8fafc" stroke="#334155" stroke-width="2"/>
                        <!-- Sorotan Cahaya -->
                        <line x1="8" y1="20" x2="8" y2="68" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" opacity="0.85"/>
                    </g>`;
                    break;

                case 'cawan-petri':
                    content = `
                    <g transform="translate(8, 42)">
                        <!-- Alas Media Agar Cawan -->
                        <ellipse cx="42" cy="38" rx="38" ry="12" fill="${liquidColor}" opacity="0.75"/>
                        <path d="M 4 38 L 4 45 Q 42 58 80 45 L 80 38 Q 42 50 4 38 Z" fill="${liquidColor}" opacity="0.85"/>
                        <!-- Dinding Cawan Kaca Bawah -->
                        <ellipse cx="42" cy="38" rx="40" ry="13" fill="none" stroke="#334155" stroke-width="2.5"/>
                        <path d="M 2 38 L 2 46 Q 42 60 82 46 L 82 38" fill="none" stroke="#334155" stroke-width="2.5"/>
                        <!-- Tutup Cawan Kaca Atas Transparan -->
                        <ellipse cx="42" cy="32" rx="41" ry="13.5" fill="url(#${p}_glass_body)" stroke="#334155" stroke-width="2"/>
                        <!-- Kilap Permukaan Kaca Lingkaran -->
                        <ellipse cx="40" cy="30" rx="30" ry="8" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.85"/>
                    </g>`;
                    break;

                case 'timbangan':
                    const tWeight = displayVal || '0.00 g';
                    content = `
                    <g transform="translate(8, 16)">
                        <!-- Piringan Stainless Timbangan Berkilau -->
                        <ellipse cx="42" cy="22" rx="36" ry="7" fill="url(#${p}_steel)" stroke="#334155" stroke-width="2.5"/>
                        <ellipse cx="42" cy="20" rx="30" ry="5" fill="#f1f5f9" opacity="0.6"/>
                        <rect x="38" y="26" width="8" height="14" fill="#475569" stroke="#334155" stroke-width="1.5"/>
                        <!-- Chassis Konsol Timbangan Beveled -->
                        <path d="M 8 40 L 76 40 L 82 78 L 2 78 Z" fill="url(#${p}_steel)" stroke="#334155" stroke-width="2.5"/>
                        <!-- Layar LCD Digital Luminous Hijau -->
                        <rect x="22" y="50" width="40" height="18" rx="3" fill="#022c22" stroke="#064e3b" stroke-width="2"/>
                        <text x="42" y="63" fill="#22c55e" font-size="11" font-family="'JetBrains Mono', 'Courier New', monospace" font-weight="bold" text-anchor="middle" filter="url(#${p}_glow)">${tWeight}</text>
                        <!-- Tombol Tare & Kalibrasi Berwarna -->
                        <circle cx="15" cy="59" r="3.5" fill="#0284c7" stroke="#0369a1" stroke-width="1"/>
                        <circle cx="69" cy="59" r="3.5" fill="#ea580c" stroke="#c2410c" stroke-width="1"/>
                    </g>`;
                    break;

                case 'bunsen':
                    const isFlameOn = state === 'lit' || state === 'on';
                    content = `
                    <g transform="translate(18, 12)">
                        <!-- Kaki Tiga Penyangga Kokoh Hitam -->
                        <line x1="14" y1="48" x2="3" y2="82" stroke="#1e293b" stroke-width="3.5" stroke-linecap="round"/>
                        <line x1="50" y1="48" x2="61" y2="82" stroke="#1e293b" stroke-width="3.5" stroke-linecap="round"/>
                        <line x1="32" y1="48" x2="32" y2="80" stroke="#334155" stroke-width="3"/>
                        <!-- Kassa Kawat Asbes Tahan Panas -->
                        <rect x="8" y="44" width="48" height="5" rx="1.5" fill="#cbd5e1" stroke="#334155" stroke-width="1.5"/>
                        <circle cx="32" cy="46" r="10" fill="#94a3b8" opacity="0.5"/>
                        <!-- Cerobong Bunsen Kuningan / Baja -->
                        <rect x="28" y="54" width="8" height="26" rx="1" fill="url(#${p}_steel)" stroke="#334155" stroke-width="2"/>
                        <ellipse cx="32" cy="80" rx="18" ry="4.5" fill="#0f172a" stroke="#020617" stroke-width="2"/>
                        <!-- Api Bunsen Realistis (Inti Biru Cyan + Lidah Api Oranye Kuning) -->
                        ${isFlameOn ? `
                        <g transform="translate(32, 42)" filter="url(#${p}_glow)">
                            <path d="M 0 0 C -7 -14, -5 -26, 0 -34 C 5 -26, 7 -14, 0 0 Z" fill="#f59e0b"/>
                            <path d="M 0 -2 C -4 -10, -3 -18, 0 -24 C 3 -18, 4 -10, 0 -2 Z" fill="#38bdf8" opacity="0.95"/>
                            <circle cx="0" cy="-6" r="2.5" fill="#ffffff"/>
                        </g>` : ''}
                    </g>`;
                    break;

                case 'mikroskop':
                    content = `
                    <g transform="translate(12, 6)">
                        <!-- Kaki Besi Berat Rata di Meja -->
                        <rect x="4" y="80" width="68" height="13" rx="4" fill="#1e293b" stroke="#0f172a" stroke-width="2.5"/>
                        <!-- Lengan Penyangga Melengkung Ergonomis -->
                        <path d="M 56 80 C 56 36, 50 24, 32 24" fill="none" stroke="#334155" stroke-width="11" stroke-linecap="round"/>
                        <!-- Meja Preparat Mekanis dengan Penjepit Slide -->
                        <rect x="12" y="54" width="40" height="6" rx="2" fill="#0f172a" stroke="#1e293b" stroke-width="1.5"/>
                        <rect x="26" y="52" width="12" height="2.5" fill="#38bdf8"/>
                        <!-- Tabung Lensa Okuler Logam Mengilap -->
                        <rect x="16" y="10" width="16" height="28" rx="2" fill="url(#${p}_steel)" stroke="#334155" stroke-width="2"/>
                        <rect x="14" y="4" width="20" height="8" rx="2.5" fill="#0f172a"/>
                        <!-- Revolver Lensa Objektif & Lensa 4x, 10x, 40x -->
                        <circle cx="24" cy="42" r="7" fill="#0f172a"/>
                        <rect x="19" y="45" width="10" height="9" rx="1.5" fill="url(#${p}_steel)" stroke="#334155" stroke-width="1.5"/>
                        <!-- Kenop Pengatur Fokus Kasar & Halus Koaksial -->
                        <circle cx="54" cy="52" r="7.5" fill="#94a3b8" stroke="#1e293b" stroke-width="2"/>
                        <circle cx="54" cy="52" r="4" fill="#cbd5e1" stroke="#334155" stroke-width="1.5"/>
                    </g>`;
                    break;

                case 'pipet':
                case 'mikropipet':
                    content = `
                    <g transform="translate(32, 6)">
                        <!-- Badan Mikropipet Ergonomis -->
                        <rect x="11" y="16" width="14" height="52" rx="3.5" fill="url(#${p}_steel)" stroke="#1e293b" stroke-width="2"/>
                        <!-- Tombol Plunger Tekan Atas -->
                        <rect x="13" y="4" width="10" height="12" rx="2" fill="#ef4444" stroke="#991b1b" stroke-width="1.8"/>
                        <!-- Display Digital Volume Mikro Liter (uL) -->
                        <rect x="12" y="30" width="12" height="16" rx="1.5" fill="#020617"/>
                        <text x="18" y="42" font-size="8.5" fill="#22c55e" font-family="'JetBrains Mono', monospace" text-anchor="middle" font-weight="bold">${displayVal || '100'}</text>
                        <!-- Tip Pipet Kaca Presisi -->
                        <path d="M 13 68 L 23 68 L 19 92 Q 18 94 17 92 L 13 68 Z" fill="url(#${p}_glass_body)" stroke="#475569" stroke-width="1.8"/>
                        ${state === 'filled' ? `<polygon points="14,76 22,76 18,92 18,92" fill="${liquidColor}" opacity="0.9"/>` : ''}
                    </g>`;
                    break;

                case 'suntikan':
                case 'suntikan-hormon':
                case 'suntikan-antigen':
                    const sLiq = id === 'suntikan-antigen' ? '#ef4444' : (id === 'suntikan-hormon' ? '#f59e0b' : '#38bdf8');
                    content = `
                    <g transform="translate(30, 8)">
                        <!-- Batang Plunger Pendorong dengan Pegangan -->
                        <rect x="16" y="2" width="6" height="26" rx="1" fill="#cbd5e1" stroke="#334155" stroke-width="1.8"/>
                        <rect x="11" y="2" width="16" height="4.5" rx="1.5" fill="#475569"/>
                        <rect x="14" y="26" width="10" height="4.5" rx="1" fill="#0f172a"/>
                        <!-- Tabung Silinder Spuit Kaca Transparan -->
                        <rect x="11" y="28" width="16" height="48" rx="2.5" fill="url(#${p}_glass_body)" stroke="#334155" stroke-width="2"/>
                        <!-- Cairan Hormon / Antigen di Dalam -->
                        <rect x="12" y="42" width="14" height="33" rx="1" fill="${sLiq}" opacity="0.85"/>
                        <!-- Garis Skala Pengukur -->
                        <line x1="12" y1="36" x2="17" y2="36" stroke="#334155" stroke-width="1.2"/>
                        <line x1="12" y1="46" x2="19" y2="46" stroke="#ffffff" stroke-width="1.5"/>
                        <line x1="12" y1="56" x2="19" y2="56" stroke="#ffffff" stroke-width="1.5"/>
                        <line x1="12" y1="66" x2="19" y2="66" stroke="#ffffff" stroke-width="1.5"/>
                        <!-- Jarum Baja Stainless Mengilap -->
                        <rect x="16" y="76" width="6" height="6" fill="#64748b"/>
                        <line x1="19" y1="82" x2="19" y2="95" stroke="#cbd5e1" stroke-width="2" stroke-linecap="round"/>
                    </g>`;
                    break;

                // =============================================================
                // 2. SIMULATOR A: KULTUR JARINGAN
                // =============================================================
                case 'wortel':
                    content = `
                    <g transform="translate(18, 12)">
                        <!-- Rumpun Daun Hijau Segar Bergradien -->
                        <path d="M 32 18 Q 24 0 16 -3 Q 24 8 30 18" fill="#16a34a" stroke="#14532d" stroke-width="1.5"/>
                        <path d="M 32 18 Q 32 -4 34 -8 Q 36 6 34 18" fill="#22c55e" stroke="#15803d" stroke-width="1.5"/>
                        <path d="M 32 18 Q 40 0 48 -3 Q 38 8 34 18" fill="#16a34a" stroke="#14532d" stroke-width="1.5"/>
                        <!-- Badan Wortel Oranye Alami -->
                        <path d="M 22 18 Q 32 14 42 18 L 35 82 Q 32 86 29 82 Z" fill="#ea580c" stroke="#9a3412" stroke-width="2.5"/>
                        <!-- Tekstur Guratan Horizontal Wortel -->
                        <line x1="26" y1="32" x2="33" y2="32" stroke="#7c2d12" stroke-width="1.8" stroke-linecap="round"/>
                        <line x1="31" y1="46" x2="38" y2="46" stroke="#7c2d12" stroke-width="1.8" stroke-linecap="round"/>
                        <line x1="28" y1="60" x2="35" y2="60" stroke="#7c2d12" stroke-width="1.8" stroke-linecap="round"/>
                        <!-- Kilau Segar -->
                        <path d="M 25 22 L 30 76" stroke="#fed7aa" stroke-width="2.5" stroke-linecap="round" opacity="0.6"/>
                    </g>`;
                    break;

                case 'pisau':
                    content = `
                    <g transform="translate(26, 8)">
                        <!-- Gagang Skalpel Bedah Logam Bertekstur Antiselip -->
                        <path d="M 21 10 L 27 10 L 25 56 L 23 56 Z" fill="url(#${p}_steel)" stroke="#334155" stroke-width="2"/>
                        <line x1="22" y1="20" x2="26" y2="20" stroke="#475569" stroke-width="1.5"/>
                        <line x1="22" y1="28" x2="26" y2="28" stroke="#475569" stroke-width="1.5"/>
                        <line x1="23" y1="36" x2="25" y2="36" stroke="#475569" stroke-width="1.5"/>
                        <!-- Mata Pisau Skalpel Tajam Mengilap Berkromium -->
                        <path d="M 23 56 L 25 56 L 27 82 Q 24 90 19 86 Z" fill="#ffffff" stroke="#1e293b" stroke-width="2"/>
                        <path d="M 21 60 L 21 84" stroke="#cbd5e1" stroke-width="1.5"/>
                    </g>`;
                    break;

                case 'laminar-flow':
                    content = `
                    <g transform="translate(4, 4)">
                        <!-- Badan Kabinet LAF Baja Putih -->
                        <rect x="4" y="6" width="84" height="78" rx="4" fill="#f8fafc" stroke="#334155" stroke-width="2.5"/>
                        <!-- Filter Udara Bersih HEPA Mikro-Kisi -->
                        <rect x="8" y="10" width="76" height="15" rx="2" fill="#0f172a"/>
                        <line x1="10" y1="14" x2="82" y2="14" stroke="#38bdf8" stroke-width="1" stroke-dasharray="3,2"/>
                        <line x1="10" y1="18" x2="82" y2="18" stroke="#38bdf8" stroke-width="1" stroke-dasharray="3,2"/>
                        <line x1="10" y1="22" x2="82" y2="22" stroke="#38bdf8" stroke-width="1" stroke-dasharray="3,2"/>
                        <!-- Lampu Sterilisasi UV/LED Biru Bercahaya -->
                        <line x1="12" y1="27" x2="80" y2="27" stroke="#38bdf8" stroke-width="3" filter="url(#${p}_glow)"/>
                        <!-- Ruang Kerja Aseptis Transparan -->
                        <rect x="8" y="27" width="76" height="49" fill="rgba(56, 189, 248, 0.12)" stroke="#94a3b8" stroke-width="1.5"/>
                        <!-- Meja Kerja Stainless Steel Perforasi -->
                        <rect x="6" y="76" width="80" height="8" rx="1.5" fill="url(#${p}_steel)" stroke="#334155" stroke-width="1.5"/>
                        <!-- Label Kaca Aseptis -->
                        <rect x="28" y="32" width="36" height="10" rx="2" fill="#0f172a"/>
                        <text x="46" y="39" fill="#38bdf8" font-size="6.5" font-family="'JetBrains Mono', sans-serif" font-weight="bold" text-anchor="middle">ASEPTIC ZONE</text>
                    </g>`;
                    break;

                case 'tabung-media':
                    content = `
                    <g transform="translate(30, 8)">
                        <!-- Tabung Reaksi Kultur Kaca Tebal -->
                        <path d="M 8 10 L 8 70 Q 20 88 32 70 L 32 10" fill="url(#${p}_glass_body)" stroke="#334155" stroke-width="2.5"/>
                        <!-- Tutup Sumbat Steril Berpori -->
                        <path d="M 6 6 L 34 6 L 32 14 L 8 14 Z" fill="#f8fafc" stroke="#475569" stroke-width="1.8"/>
                        <!-- Gel Agar Nutrisi Murashige & Skoog (MS) -->
                        <path d="M 9 46 L 31 46 L 31 69 Q 20 86 9 69 Z" fill="#eab308" opacity="0.92"/>
                        <ellipse cx="20" cy="46" rx="11" ry="3" fill="#fef08a"/>
                        <!-- Butiran Garis Vitamin & Sukrosa -->
                        <circle cx="15" cy="56" r="1.5" fill="#ca8a04"/>
                        <circle cx="24" cy="62" r="1.8" fill="#ca8a04"/>
                        <circle cx="18" cy="70" r="1.5" fill="#ca8a04"/>
                        <line x1="12" y1="18" x2="12" y2="68" stroke="#ffffff" stroke-width="2" opacity="0.75" stroke-linecap="round"/>
                    </g>`;
                    break;

                case 'eksplan':
                    content = `
                    <g transform="translate(28, 38)">
                        <!-- Kubus Jaringan Meristem Wortel 3D -->
                        <polygon points="22,10 34,4 46,10 34,16" fill="#fb923c" stroke="#ea580c" stroke-width="1.8"/>
                        <polygon points="22,10 34,16 34,34 22,27" fill="#ea580c" stroke="#c2410c" stroke-width="1.8"/>
                        <polygon points="34,16 46,10 46,27 34,34" fill="#c2410c" stroke="#9a3412" stroke-width="1.8"/>
                        <!-- Kilau Permukaan Segar -->
                        <line x1="24" y1="11" x2="33" y2="6" stroke="#fed7aa" stroke-width="1.5"/>
                    </g>`;
                    break;

                case 'kalus':
                    content = `
                    <g transform="translate(22, 25)">
                        <!-- Gumpalan Massa Sel Kalus Totipoten Bertekstur Granular -->
                        <circle cx="26" cy="30" r="13" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
                        <circle cx="38" cy="24" r="11" fill="#fde047" stroke="#ca8a04" stroke-width="2"/>
                        <circle cx="23" cy="44" r="12" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
                        <circle cx="37" cy="42" r="14" fill="#fde047" stroke="#ca8a04" stroke-width="2"/>
                        <circle cx="47" cy="34" r="9" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
                        <!-- Bintik Granula Sel Aktif Mitosis -->
                        <circle cx="26" cy="30" r="3.5" fill="#eab308"/>
                        <circle cx="38" cy="24" r="3" fill="#eab308"/>
                        <circle cx="37" cy="42" r="4" fill="#eab308"/>
                    </g>`;
                    break;

                case 'planlet':
                    content = `
                    <g transform="translate(24, 8)">
                        <!-- Batang Tunas Muda Hijau Berakar -->
                        <path d="M 26 72 Q 25 45 23 28" fill="none" stroke="#22c55e" stroke-width="3.5" stroke-linecap="round"/>
                        <!-- Daun Muda Bersemi Segar -->
                        <path d="M 23 28 Q 11 22 9 12 Q 21 20 23 28" fill="#4ade80" stroke="#16a34a" stroke-width="1.8"/>
                        <path d="M 23 28 Q 35 22 37 12 Q 25 20 23 28" fill="#4ade80" stroke="#16a34a" stroke-width="1.8"/>
                        <path d="M 24 44 Q 38 38 41 30 Q 29 38 24 44" fill="#22c55e" stroke="#15803d" stroke-width="1.8"/>
                        <!-- Perakaran Adventif Halus di Bawah -->
                        <path d="M 26 72 Q 18 80 11 88" fill="none" stroke="#fed7aa" stroke-width="2.5" stroke-linecap="round"/>
                        <path d="M 26 72 Q 26 82 27 92" fill="none" stroke="#fed7aa" stroke-width="2.5" stroke-linecap="round"/>
                        <path d="M 26 72 Q 34 80 41 88" fill="none" stroke="#fed7aa" stroke-width="2.5" stroke-linecap="round"/>
                    </g>`;
                    break;

                case 'pot-tanaman':
                    content = `
                    <g transform="translate(12, 18)">
                        <!-- Tanah Gembur Kaya Humus -->
                        <ellipse cx="38" cy="30" rx="30" ry="8" fill="#451a03" stroke="#291003" stroke-width="2"/>
                        <!-- Badan Pot Terakota Bergradien -->
                        <path d="M 8 30 L 17 72 Q 38 78 59 72 L 68 30 Z" fill="#c2410c" stroke="#7c2d12" stroke-width="2.5"/>
                        <!-- Bibir Atas Pot Berlekuk -->
                        <ellipse cx="38" cy="30" rx="32" ry="8.5" fill="#ea580c" stroke="#9a3412" stroke-width="2.2"/>
                        <path d="M 12 42 Q 38 48 64 42" fill="none" stroke="#9a3412" stroke-width="2"/>
                    </g>`;
                    break;

                case 'tumbuhan-dewasa':
                    content = `
                    <g transform="translate(12, 4)">
                        <!-- Pot Terakota Bawah -->
                        <path d="M 14 56 L 20 84 Q 38 88 56 84 L 62 56 Z" fill="#c2410c" stroke="#7c2d12" stroke-width="2"/>
                        <ellipse cx="38" cy="56" rx="27" ry="6.5" fill="#ea580c" stroke="#9a3412" stroke-width="1.5"/>
                        <ellipse cx="38" cy="56" rx="24" ry="5.5" fill="#451a03"/>
                        <!-- Tanaman Wortel Rimbun Dewasa -->
                        <path d="M 38 56 L 38 24" stroke="#15803d" stroke-width="4.5" stroke-linecap="round"/>
                        <!-- Daun Lebat Mirip Pakis Hijau -->
                        <path d="M 38 30 Q 14 14 8 4 Q 26 18 38 26" fill="#16a34a" stroke="#14532d" stroke-width="1.8"/>
                        <path d="M 38 24 Q 38 6 41 0 Q 43 10 39 24" fill="#22c55e" stroke="#15803d" stroke-width="1.8"/>
                        <path d="M 38 30 Q 62 14 68 4 Q 50 18 38 26" fill="#16a34a" stroke="#14532d" stroke-width="1.8"/>
                        <path d="M 38 42 Q 10 36 6 28 Q 22 38 38 38" fill="#15803d" stroke="#14532d" stroke-width="1.8"/>
                        <path d="M 38 42 Q 66 36 70 28 Q 54 38 38 38" fill="#15803d" stroke="#14532d" stroke-width="1.8"/>
                    </g>`;
                    break;

                case 'rak-inkubasi':
                    const rot = opts.timerAngle || 60;
                    content = `
                    <g transform="translate(8, 4)">
                        <!-- Lemari Rak Inkubasi Kultur Stainless -->
                        <rect x="6" y="8" width="72" height="80" rx="4" fill="url(#${p}_steel)" stroke="#334155" stroke-width="2.5"/>
                        <!-- Jendela Pintu Kaca & Rak Dalam -->
                        <rect x="11" y="14" width="62" height="52" rx="2.5" fill="rgba(241,245,249,0.55)" stroke="#94a3b8" stroke-width="1.5"/>
                        <line x1="11" y1="38" x2="73" y2="38" stroke="#475569" stroke-width="2.5"/>
                        <!-- Tabung Kultur Mini di Rak -->
                        <rect x="18" y="22" width="6" height="15" rx="1.5" fill="#fde047" opacity="0.8"/>
                        <rect x="30" y="22" width="6" height="15" rx="1.5" fill="#fde047" opacity="0.8"/>
                        <!-- Lampu Pertumbuhan Hangat -->
                        <line x1="13" y1="17" x2="71" y2="17" stroke="#facc15" stroke-width="3" filter="url(#${p}_glow)"/>
                        <line x1="13" y1="41" x2="71" y2="41" stroke="#facc15" stroke-width="3" filter="url(#${p}_glow)"/>
                        <!-- Jam Pengatur Waktu Analog Berjarum -->
                        <g transform="translate(42, 76)">
                            <circle cx="0" cy="0" r="9" fill="#0f172a" stroke="#f8fafc" stroke-width="2"/>
                            <line x1="0" y1="0" x2="0" y2="-6" stroke="#38bdf8" stroke-width="2" stroke-linecap="round"/>
                            <line x1="0" y1="0" x2="5" y2="0" stroke="#22c55e" stroke-width="2" stroke-linecap="round" transform="rotate(${rot})"/>
                            <circle cx="0" cy="0" r="2" fill="#f8fafc"/>
                        </g>
                        <text x="20" y="80" fill="#0f172a" font-size="8" font-family="'JetBrains Mono', monospace" font-weight="bold">25°C</text>
                    </g>`;
                    break;

                // =============================================================
                // 3. SIMULATOR B: BAYI TABUNG (IVF)
                // =============================================================
                case 'ovarium':
                    content = `
                    <g transform="translate(12, 12)">
                        <!-- Jaringan Ovarium Merah Muda Lembut -->
                        <path d="M 20 42 C 14 20, 52 14, 64 36 C 76 58, 38 80, 20 42 Z" fill="#f472b6" stroke="#be185d" stroke-width="3"/>
                        <!-- Folikel-Folikel Telur di Dalam -->
                        <circle cx="34" cy="36" r="8" fill="#fce7f3" stroke="#db2777" stroke-width="1.8"/>
                        <circle cx="34" cy="36" r="3.5" fill="#be185d"/>
                        <circle cx="50" cy="34" r="9" fill="#fce7f3" stroke="#db2777" stroke-width="1.8"/>
                        <circle cx="50" cy="34" r="4" fill="#be185d"/>
                        <!-- Folikel Matang (Graaf) Siap Ovulasi Menjorok Keluar -->
                        <circle cx="54" cy="52" r="10.5" fill="#fff1f2" stroke="#e11d48" stroke-width="2.5" filter="url(#${p}_glow)"/>
                        <circle cx="54" cy="52" r="5" fill="#9f1239"/>
                    </g>`;
                    break;

                case 'tabung-sperma':
                    content = `
                    <g transform="translate(14, 6)">
                        <!-- Tutup Ulir Tabung Falcon / Vial Biru Medis -->
                        <rect x="22" y="6" width="28" height="10" rx="2.5" fill="#1d4ed8" stroke="#1e3a8a" stroke-width="2"/>
                        <line x1="26" y1="6" x2="26" y2="16" stroke="#3b82f6" stroke-width="1.5"/>
                        <line x1="31" y1="6" x2="31" y2="16" stroke="#3b82f6" stroke-width="1.5"/>
                        <line x1="36" y1="6" x2="36" y2="16" stroke="#3b82f6" stroke-width="1.5"/>
                        <line x1="41" y1="6" x2="41" y2="16" stroke="#3b82f6" stroke-width="1.5"/>
                        <line x1="46" y1="6" x2="46" y2="16" stroke="#3b82f6" stroke-width="1.5"/>
                        <!-- Leher Tabung Steril -->
                        <rect x="25" y="16" width="22" height="6" fill="#cbd5e1" stroke="#94a3b8" stroke-width="1.5"/>
                        <!-- Badan Tabung Kerucut / Tabung Sentrifugasi Transparan -->
                        <path d="M 24 22 L 24 64 C 24 76, 32 82, 36 84 C 40 82, 48 76, 48 64 L 48 22 Z" 
                              fill="url(#${p}_glass_body)" stroke="#64748b" stroke-width="2.5"/>
                        <!-- Cairan Suspensi Sperma (Opalescent Biru Keputihan) -->
                        <path d="M 25 38 L 25 64 C 25 74, 32 80, 36 82 C 40 80, 47 74, 47 64 L 47 38 C 43 40, 29 40, 25 38 Z" 
                              fill="#93c5fd" opacity="0.82"/>
                        <!-- Garis Meniskus Cairan -->
                        <ellipse cx="36" cy="38" rx="11" ry="2.5" fill="#bfdbfe" stroke="#60a5fa" stroke-width="1.5"/>
                        <!-- Garis Skala Ukur Mililiter (Graduations) -->
                        <line x1="40" y1="46" x2="46" y2="46" stroke="#ffffff" stroke-width="1.5"/>
                        <line x1="42" y1="52" x2="46" y2="52" stroke="#ffffff" stroke-width="1.2"/>
                        <line x1="40" y1="58" x2="46" y2="58" stroke="#ffffff" stroke-width="1.5"/>
                        <line x1="42" y1="64" x2="46" y2="64" stroke="#ffffff" stroke-width="1.2"/>
                        <line x1="40" y1="70" x2="46" y2="70" stroke="#ffffff" stroke-width="1.5"/>
                        <!-- Area Label Tulis Putih (Frosted Writing Area) -->
                        <rect x="27" y="44" width="10" height="22" rx="1.5" fill="#ffffff" opacity="0.88" stroke="#cbd5e1" stroke-width="1"/>
                        <text x="32" y="58" fill="#1e293b" font-size="5" font-family="'JetBrains Mono', monospace" font-weight="bold" transform="rotate(-90, 32, 58)" text-anchor="middle">SPERMA</text>
                        <!-- Siluet Spermatozoa Mikro Berenang di Dalam Tabung -->
                        <g opacity="0.75">
                            <circle cx="31" cy="62" r="1.4" fill="#ffffff"/>
                            <path d="M 31 63.4 Q 30 67 32 70" fill="none" stroke="#ffffff" stroke-width="0.8"/>
                            <circle cx="38" cy="56" r="1.4" fill="#ffffff"/>
                            <path d="M 38 57.4 Q 40 61 37 64" fill="none" stroke="#ffffff" stroke-width="0.8"/>
                            <circle cx="34" cy="46" r="1.4" fill="#ffffff"/>
                            <path d="M 34 47.4 Q 32 50 35 53" fill="none" stroke="#ffffff" stroke-width="0.8"/>
                        </g>
                        <!-- Kilauan Refleksi Kaca Vertikal -->
                        <path d="M 27 24 L 27 60" stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity="0.6"/>
                        <!-- Penyangga Kaki Meja Tabung (Lab Rack Base) -->
                        <path d="M 18 80 L 54 80 L 58 86 L 14 86 Z" fill="#334155" stroke="#1e293b" stroke-width="2"/>
                        <rect x="22" y="78" width="28" height="3" rx="1" fill="#475569"/>
                    </g>`;
                    break;

                case 'ovum':
                    content = `
                    <g transform="translate(16, 16)">
                        <!-- Zona Pelusida Lapisan Pelindung Tebal Berkisi -->
                        <circle cx="34" cy="34" r="30" fill="rgba(251, 207, 232, 0.55)" stroke="#db2777" stroke-width="3" stroke-dasharray="5,2.5"/>
                        <!-- Sitoplasma Sel Telur Kaya Kuning Telur Vitelus -->
                        <circle cx="34" cy="34" r="24" fill="#fdf2f8" stroke="#ec4899" stroke-width="2.5"/>
                        <!-- Butiran Sitoplasma Halus -->
                        <circle cx="28" cy="26" r="1.5" fill="#f472b6" opacity="0.6"/>
                        <circle cx="42" cy="28" r="1.5" fill="#f472b6" opacity="0.6"/>
                        <circle cx="30" cy="42" r="1.5" fill="#f472b6" opacity="0.6"/>
                        <!-- Inti Sel Ovum Besar (Vesikel Germinal) Haploid (n) -->
                        <circle cx="34" cy="34" r="10" fill="#be185d" stroke="#831843" stroke-width="2.2"/>
                        <circle cx="32" cy="32" r="3.5" fill="#fce7f3"/>
                    </g>`;
                    break;

                case 'sperma':
                    content = `
                    <g transform="translate(10, 20)">
                        <!-- Kepala Sperma Oval Hidrodinamis dengan Akrosom -->
                        <ellipse cx="26" cy="26" rx="12" ry="8.5" fill="#60a5fa" stroke="#1d4ed8" stroke-width="2.5"/>
                        <!-- Tudung Akrosom di Ujung -->
                        <path d="M 14 26 C 14 21, 20 18, 26 18 C 22 23, 22 29, 26 34 C 20 34, 14 31, 14 26 Z" fill="#93c5fd"/>
                        <ellipse cx="27" cy="26" rx="6" ry="4" fill="#1e3a8a"/>
                        <!-- Leher Selubung Mitokondria Penyedia Energi -->
                        <rect x="36" y="24" width="6" height="4.5" rx="1.5" fill="#f59e0b" stroke="#d97706" stroke-width="1"/>
                        <!-- Ekor Cambuk Flagela Panjang Melengkung Sinusoidal -->
                        <path d="M 42 26 Q 52 18 60 26 T 78 26 T 90 26" fill="none" stroke="#2563eb" stroke-width="3" stroke-linecap="round"/>
                    </g>`;
                    break;

                case 'zigot':
                    content = `
                    <g transform="translate(16, 16)">
                        <circle cx="34" cy="34" r="30" fill="rgba(251, 207, 232, 0.65)" stroke="#db2777" stroke-width="3"/>
                        <circle cx="34" cy="34" r="24" fill="#fdf2f8" stroke="#ec4899" stroke-width="2.5"/>
                        <!-- Dua Pronukleus Menyatu (Fertilisasi Sempurna Diploid 2n) -->
                        <circle cx="28" cy="34" r="7.5" fill="#be185d" stroke="#831843" stroke-width="2"/>
                        <circle cx="40" cy="34" r="7.5" fill="#1d4ed8" stroke="#1e3a8a" stroke-width="2"/>
                        <circle cx="26" cy="32" r="2.5" fill="#fce7f3"/>
                        <circle cx="38" cy="32" r="2.5" fill="#bae6fd"/>
                    </g>`;
                    break;

                case 'blastula':
                    content = `
                    <g transform="translate(16, 16)">
                        <!-- Rongga Blastocoel Embrio Hari ke-5 -->
                        <circle cx="34" cy="34" r="30" fill="#fdf2f8" stroke="#db2777" stroke-width="3"/>
                        <!-- Lapisan Sel Trofoblas Melingkar -->
                        ${[0, 40, 80, 120, 160, 200, 240, 280, 320].map(deg => {
                            const rad = deg * Math.PI / 180;
                            const cx = 34 + 22 * Math.cos(rad);
                            const cy = 34 + 22 * Math.sin(rad);
                            return `<circle cx="${cx}" cy="${cy}" r="5" fill="#fbcfe8" stroke="#be185d" stroke-width="1.5"/>`;
                        }).join('')}
                        <!-- Massa Sel Dalam (Inner Cell Mass - Bakal Janin) -->
                        <g transform="translate(26, 26)">
                            <circle cx="4" cy="4" r="4.5" fill="#be185d"/>
                            <circle cx="10" cy="5" r="4" fill="#be185d"/>
                            <circle cx="5" cy="10" r="4" fill="#be185d"/>
                            <circle cx="11" cy="11" r="3.5" fill="#be185d"/>
                        </g>
                    </g>`;
                    break;

                case 'inkubator':
                    const incT = displayVal || '37.0°C';
                    content = `
                    <g transform="translate(8, 4)">
                        <!-- Badan Inkubator CO2 Medis Tebal -->
                        <rect x="6" y="8" width="76" height="80" rx="5" fill="#0f172a" stroke="#334155" stroke-width="3"/>
                        <!-- Pintu Kaca Berlampu LED Sian -->
                        <rect x="11" y="14" width="66" height="50" rx="3" fill="rgba(56, 189, 248, 0.16)" stroke="#38bdf8" stroke-width="2"/>
                        <line x1="13" y1="39" x2="75" y2="39" stroke="#475569" stroke-width="2.5"/>
                        <!-- Cawan Petri Mini di Dalam -->
                        <ellipse cx="44" cy="37" rx="16" ry="4.5" fill="#ffffff" stroke="#94a3b8" stroke-width="1.2"/>
                        <!-- Panel Kontrol Display Digital Hijau LED -->
                        <rect x="11" y="68" width="66" height="16" rx="2.5" fill="#020617"/>
                        <text x="34" y="80" fill="#22c55e" font-size="10" font-family="'JetBrains Mono', monospace" font-weight="bold" text-anchor="middle" filter="url(#${p}_glow)">${incT}</text>
                        <!-- Lampu Status Berkedip -->
                        <circle cx="62" cy="76" r="3.5" fill="#ef4444" filter="url(#${p}_glow)"/>
                        <circle cx="70" cy="76" r="3.5" fill="#22c55e"/>
                    </g>`;
                    break;

                case 'rahim':
                    content = `
                    <g transform="translate(8, 8)">
                        <!-- Dinding Miometrium Otot Rahim -->
                        <path d="M 16 26 C 10 42, 26 80, 48 84 C 70 80, 86 42, 80 26 C 70 14, 58 26, 48 26 C 38 26, 26 14, 16 26 Z" 
                              fill="#f43f5e" stroke="#9f1239" stroke-width="3.5"/>
                        <!-- Dinding Endometrium Tebal Siap Menerima Embrio -->
                        <path d="M 30 34 C 26 48, 38 66, 48 68 C 58 66, 70 48, 66 34 C 58 38, 48 38, 30 34 Z" 
                              fill="#ffe4e6" stroke="#e11d48" stroke-width="2.5"/>
                        <!-- Leher Rahim (Serviks) di Bawah -->
                        <rect x="43" y="82" width="10" height="12" rx="2" fill="#be123c"/>
                    </g>`;
                    break;

                // =============================================================
                // 4. SIMULATOR C: KLONING (DOMBA DOLLY)
                // =============================================================
                case 'domba-finndorset':
                    content = `
                    <g transform="translate(8, 12)">
                        <!-- 4 Kaki Domba Kokoh Berdiri di Meja -->
                        <rect x="20" y="58" width="7" height="24" rx="2.5" fill="#e2e8f0" stroke="#334155" stroke-width="1.8"/>
                        <rect x="32" y="58" width="7" height="22" rx="2.5" fill="#cbd5e1" stroke="#334155" stroke-width="1.8"/>
                        <rect x="56" y="58" width="7" height="24" rx="2.5" fill="#e2e8f0" stroke="#334155" stroke-width="1.8"/>
                        <rect x="68" y="58" width="7" height="22" rx="2.5" fill="#cbd5e1" stroke="#334155" stroke-width="1.8"/>
                        <!-- Tubuh Wol Putih Lebat Bergelombang 3D -->
                        <path d="M 22 42 Q 16 26 32 23 Q 48 19 64 23 Q 76 28 74 45 Q 72 58 54 60 Q 32 60 22 42 Z" 
                              fill="#f8fafc" stroke="#64748b" stroke-width="3"/>
                        <!-- Tekstur Gumpalan Wol -->
                        <circle cx="34" cy="36" r="6" fill="#f1f5f9"/>
                        <circle cx="48" cy="34" r="7" fill="#f1f5f9"/>
                        <circle cx="60" cy="40" r="6" fill="#f1f5f9"/>
                        <!-- Kepala Domba Finn Dorset Putih Bersih -->
                        <ellipse cx="18" cy="28" rx="11" ry="8" fill="#ffffff" stroke="#64748b" stroke-width="2.2"/>
                        <ellipse cx="24" cy="22" rx="3.5" ry="7" fill="#f1f5f9" stroke="#64748b" transform="rotate(30, 24, 22)"/>
                        <circle cx="13" cy="27" r="1.8" fill="#0f172a"/>
                        <circle cx="9" cy="30" r="1.5" fill="#f43f5e"/>
                    </g>`;
                    break;

                case 'sel-kelenjar-susu':
                    content = `
                    <g transform="translate(18, 18)">
                        <!-- Membran Sel Mamae Berpendar Halus -->
                        <path d="M 20 20 Q 10 38 24 52 Q 44 58 54 44 Q 60 26 40 18 Z" fill="#fce7f3" stroke="#be185d" stroke-width="3"/>
                        <!-- Inti Sel Diploid (2n) Pembawa Sifat Finndorset -->
                        <circle cx="34" cy="36" r="11" fill="#9d174d" stroke="#700732" stroke-width="2.5"/>
                        <circle cx="31" cy="33" r="3.5" fill="#fbcfe8"/>
                    </g>`;
                    break;

                case 'domba-blackface':
                    content = `
                    <g transform="translate(8, 12)">
                        <!-- Kaki Hitam Legam Khas Blackface -->
                        <rect x="20" y="58" width="7" height="24" rx="2.5" fill="#0f172a" stroke="#020617" stroke-width="2"/>
                        <rect x="32" y="58" width="7" height="22" rx="2.5" fill="#1e293b" stroke="#020617" stroke-width="2"/>
                        <rect x="56" y="58" width="7" height="24" rx="2.5" fill="#0f172a" stroke="#020617" stroke-width="2"/>
                        <rect x="68" y="58" width="7" height="22" rx="2.5" fill="#1e293b" stroke="#020617" stroke-width="2"/>
                        <!-- Tubuh Wol Putih -->
                        <path d="M 22 42 Q 16 26 32 23 Q 48 19 64 23 Q 76 28 74 45 Q 72 58 54 60 Q 32 60 22 42 Z" 
                              fill="#f1f5f9" stroke="#475569" stroke-width="3"/>
                        <!-- Wajah Hitam Legam (Blackface) -->
                        <ellipse cx="18" cy="28" rx="11" ry="8" fill="#0f172a" stroke="#020617" stroke-width="2.5"/>
                        <ellipse cx="24" cy="22" rx="3.5" ry="7" fill="#1e293b" stroke="#020617" transform="rotate(30, 24, 22)"/>
                        <!-- Mata Putih Bersinar -->
                        <circle cx="13" cy="27" r="2.2" fill="#ffffff"/>
                        <circle cx="13" cy="27" r="1.2" fill="#020617"/>
                    </g>`;
                    break;

                case 'ovum-blackface':
                    const hasNuc = state !== 'enucleated';
                    content = `
                    <g transform="translate(18, 18)">
                        <circle cx="32" cy="32" r="28" fill="#fdf4ff" stroke="#a855f7" stroke-width="3"/>
                        ${hasNuc ? `
                        <circle cx="32" cy="32" r="9" fill="#7e22ce" stroke="#581c87" stroke-width="2"/>
                        <circle cx="30" cy="30" r="3" fill="#e9d5ff"/>
                        ` : ''}
                    </g>`;
                    break;

                case 'cawan-kultur':
                    content = `
                    <g transform="translate(6, 12)">
                        <!-- Piringan Cawan Bawah (Sterile Glass Fusion Dish) -->
                        <ellipse cx="44" cy="56" rx="42" ry="17" fill="url(#${p}_glass_body)" stroke="#475569" stroke-width="2.5"/>
                        <!-- Dinding Samping Cawan Kaca Bening -->
                        <path d="M 2 56 C 2 68, 86 68, 86 56 L 86 42 C 86 32, 2 32, 2 42 Z" 
                              fill="url(#${p}_glass_body)" stroke="#64748b" stroke-width="2" opacity="0.5"/>
                        <!-- Permukaan Cairan Media Kultur Fusi (Lavender Hangat) -->
                        <ellipse cx="44" cy="52" rx="38" ry="14" fill="#f3e8ff" stroke="#c084fc" stroke-width="1.8" opacity="0.9"/>
                        <!-- Meniskus Refleksi Cahaya di Cairan -->
                        <ellipse cx="44" cy="50" rx="34" ry="11" fill="none" stroke="#e9d5ff" stroke-width="1.5" stroke-dasharray="14,6"/>
                        
                        <!-- Mikro-Kanal / Ruang Fusi di Tengah Cawan -->
                        <rect x="28" y="44" width="32" height="16" rx="4" fill="rgba(255, 255, 255, 0.75)" stroke="#a855f7" stroke-width="1.5"/>
                        
                        <!-- Sel Somatis Donor (Kiri - Pink Kelenjar Susu Diploid) -->
                        <circle cx="39" cy="52" r="5.5" fill="#f472b6" stroke="#db2777" stroke-width="1.8"/>
                        <circle cx="39" cy="52" r="2.5" fill="#9d174d"/>
                        
                        <!-- Ovum Tanpa Inti Resipien (Kanan - Ungu Enukleasi) Menyentuh Sel Donor -->
                        <circle cx="49" cy="52" r="6.5" fill="#e9d5ff" stroke="#9333ea" stroke-width="1.8" stroke-dasharray="3,1.5"/>
                        
                        <!-- Titik Kontak Fusi Membran (Percikan Energi Halus) -->
                        <line x1="44" y1="47" x2="44" y2="57" stroke="#facc15" stroke-width="2" filter="url(#${p}_glow)"/>
                        
                        <!-- Dua Elektroda Mikro Emas untuk Pulsa Fusi -->
                        <line x1="22" y1="52" x2="31" y2="52" stroke="#f59e0b" stroke-width="3" stroke-linecap="round"/>
                        <line x1="57" y1="52" x2="66" y2="52" stroke="#f59e0b" stroke-width="3" stroke-linecap="round"/>
                        
                        <!-- Kilau Refleksi Bibir Kaca Cawan -->
                        <path d="M 10 40 C 24 34, 64 34, 78 40" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" opacity="0.75"/>
                        <!-- Label Keterangan Kecil di Pinggir Cawan -->
                        <text x="44" y="66" fill="#7e22ce" font-size="6" font-family="'JetBrains Mono', monospace" font-weight="bold" text-anchor="middle">CAWAN FUSI SEL</text>
                    </g>`;
                    break;

                case 'alat-stimulasi':
                    content = `
                    <g transform="translate(8, 8)">
                        <!-- Kotak Generator Pulsa Elektrofusi -->
                        <rect x="8" y="24" width="70" height="52" rx="4.5" fill="#1e1b4b" stroke="#312e81" stroke-width="3"/>
                        <!-- Layar Digital Voltase Tinggi -->
                        <rect x="16" y="32" width="34" height="16" rx="2" fill="#020617"/>
                        <text x="33" y="44" fill="#38bdf8" font-size="9" font-family="'JetBrains Mono', monospace" font-weight="bold" text-anchor="middle" filter="url(#${p}_glow)">2.5 kV</text>
                        <!-- Dua Jarum Elektroda Fusi -->
                        <path d="M 58 36 L 78 36 L 78 62" fill="none" stroke="#f59e0b" stroke-width="2.5" stroke-linecap="round"/>
                        <path d="M 58 44 L 70 44 L 70 62" fill="none" stroke="#f59e0b" stroke-width="2.5" stroke-linecap="round"/>
                        ${state === 'active' ? `
                        <polygon points="73,58 78,52 75,61 82,57 74,66" fill="#facc15" filter="url(#${p}_glow)"/>
                        ` : ''}
                    </g>`;
                    break;

                case 'blastosit':
                    content = `
                    <g transform="translate(18, 18)">
                        <circle cx="32" cy="32" r="28" fill="#ede9fe" stroke="#6366f1" stroke-width="3"/>
                        <circle cx="30" cy="30" r="11" fill="#4338ca" stroke="#312e81" stroke-width="2.5"/>
                        <circle cx="28" cy="28" r="3.5" fill="#c7d2fe"/>
                    </g>`;
                    break;

                case 'domba-dolly':
                    content = `
                    <g transform="translate(12, 16)">
                        <!-- Kaki Anak Domba Lebih Pendek & Mungil -->
                        <rect x="18" y="48" width="6" height="20" rx="2" fill="#e2e8f0" stroke="#334155" stroke-width="1.5"/>
                        <rect x="28" y="48" width="6" height="18" rx="2" fill="#cbd5e1" stroke="#334155" stroke-width="1.5"/>
                        <rect x="48" y="48" width="6" height="20" rx="2" fill="#e2e8f0" stroke="#334155" stroke-width="1.5"/>
                        <rect x="58" y="48" width="6" height="18" rx="2" fill="#cbd5e1" stroke="#334155" stroke-width="1.5"/>
                        <!-- Badan Mungil Bulu Wol Putih Bersih -->
                        <path d="M 18 36 Q 14 24 28 22 Q 42 19 54 22 Q 64 26 62 38 Q 60 50 46 52 Q 28 53 18 36 Z" 
                              fill="#ffffff" stroke="#475569" stroke-width="2.5"/>
                        <!-- Muka Putih Bersih Persis Finn Dorset -->
                        <ellipse cx="16" cy="26" rx="9" ry="7" fill="#ffffff" stroke="#475569" stroke-width="2"/>
                        <ellipse cx="20" cy="20" rx="3" ry="5" fill="#f8fafc" stroke="#475569" transform="rotate(30, 20, 20)"/>
                        <circle cx="12" cy="25" r="1.5" fill="#0f172a"/>
                        <circle cx="9" cy="28" r="1.2" fill="#f43f5e"/>
                    </g>`;
                    break;

                // =============================================================
                // 5. SIMULATOR D: TEKNOLOGI HIBRIDOMA
                // =============================================================
                case 'tikus':
                    content = `
                    <g transform="translate(8, 22)">
                        <!-- Ekor Panjang Pink Melengkung -->
                        <path d="M 68 42 Q 86 34 82 16" fill="none" stroke="#f472b6" stroke-width="3" stroke-linecap="round"/>
                        <!-- Tubuh Mencit Putih Duduk -->
                        <ellipse cx="44" cy="42" rx="25" ry="16" fill="#f8fafc" stroke="#64748b" stroke-width="2.5"/>
                        <!-- Kaki -->
                        <ellipse cx="28" cy="54" rx="6" ry="3.5" fill="#cbd5e1"/>
                        <ellipse cx="56" cy="54" rx="7" ry="3.5" fill="#cbd5e1"/>
                        <!-- Moncong Kepala -->
                        <path d="M 26 35 Q 14 42 7 46 Q 20 51 28 46 Z" fill="#f8fafc" stroke="#64748b" stroke-width="2.2"/>
                        <!-- Telinga Merah Muda Lembut -->
                        <ellipse cx="28" cy="30" rx="6" ry="8.5" fill="#fbcfe8" stroke="#db2777" stroke-width="1.8"/>
                        <!-- Mata Merah Khas Albino Lab -->
                        <circle cx="18" cy="41" r="1.8" fill="#ef4444"/>
                        <!-- Kumis Halus -->
                        <line x1="9" y1="46" x2="0" y2="44" stroke="#94a3b8" stroke-width="1.2"/>
                        <line x1="9" y1="47" x2="0" y2="49" stroke="#94a3b8" stroke-width="1.2"/>
                    </g>`;
                    break;

                case 'tabung-limfosit-b':
                    content = `
                    <g transform="translate(30, 8)">
                        <path d="M 8 10 L 8 70 Q 20 88 32 70 L 32 10" fill="url(#${p}_glass_body)" stroke="#334155" stroke-width="2.5"/>
                        <path d="M 6 6 L 34 6 L 32 14 L 8 14 Z" fill="#38bdf8" stroke="#0284c7" stroke-width="1.8"/>
                        <path d="M 9 44 L 31 44 L 31 69 Q 20 86 9 69 Z" fill="#38bdf8" opacity="0.85"/>
                        <!-- Sel Limfosit B -->
                        <circle cx="20" cy="58" r="6" fill="#0284c7" stroke="#0369a1" stroke-width="1.5"/>
                        <circle cx="20" cy="58" r="3" fill="#bae6fd"/>
                    </g>`;
                    break;

                case 'tabung-sel-kanker':
                    content = `
                    <g transform="translate(30, 8)">
                        <path d="M 8 10 L 8 70 Q 20 88 32 70 L 32 10" fill="url(#${p}_glass_body)" stroke="#334155" stroke-width="2.5"/>
                        <path d="M 6 6 L 34 6 L 32 14 L 8 14 Z" fill="#ef4444" stroke="#b91c1c" stroke-width="1.8"/>
                        <path d="M 9 44 L 31 44 L 31 69 Q 20 86 9 69 Z" fill="#f87171" opacity="0.85"/>
                        <!-- Sel Kanker Mieloma Berduri Aktif Membelah -->
                        <circle cx="20" cy="58" r="6.5" fill="#dc2626" stroke="#991b1b" stroke-width="1.5"/>
                        <circle cx="20" cy="58" r="2.5" fill="#fca5a5"/>
                    </g>`;
                    break;

                case 'tabung-fusi':
                    content = `
                    <g transform="translate(24, 8)">
                        <path d="M 22 14 L 22 40 L 4 78 Q 26 86 48 78 L 32 40 L 32 14 Z" fill="url(#${p}_glass_body)" stroke="#334155" stroke-width="2.5"/>
                        <ellipse cx="27" cy="14" rx="9" ry="3.5" fill="#cbd5e1" stroke="#334155" stroke-width="1.8"/>
                        <!-- Cairan Fusi PEG Ungu -->
                        <path d="M 9 66 L 43 66 L 47 78 Q 26 86 5 78 Z" fill="#a855f7" opacity="0.88"/>
                        <circle cx="22" cy="72" r="4.5" fill="#0284c7"/>
                        <circle cx="30" cy="72" r="4.5" fill="#dc2626"/>
                    </g>`;
                    break;

                case 'sel-hibridoma':
                    content = `
                    <g transform="translate(16, 16)">
                        <path d="M 16 34 Q 16 16 34 16 Q 52 16 52 34 Q 52 52 34 52 Q 16 52 16 34 Z" 
                              fill="#fdf4ff" stroke="#a855f7" stroke-width="3.5"/>
                        <!-- Inti Sel Ganda Fusi -->
                        <circle cx="27" cy="34" r="8" fill="#0284c7" stroke="#0369a1" stroke-width="1.8"/>
                        <circle cx="41" cy="34" r="8" fill="#dc2626" stroke="#991b1b" stroke-width="1.8"/>
                    </g>`;
                    break;

                case 'rak-kultur':
                    content = `
                    <g transform="translate(8, 8)">
                        <!-- Pelat Kultur Mikro 96-Well -->
                        <rect x="4" y="24" width="76" height="46" rx="3.5" fill="#f8fafc" stroke="#334155" stroke-width="2.5"/>
                        ${[0, 1, 2, 3].map(row => 
                            [0, 1, 2, 3, 4, 5].map(col => {
                                const cx = 14 + col * 11;
                                const cy = 33 + row * 10;
                                const isPos = (row === 1 && col === 2) || (row === 2 && col === 4);
                                return `<circle cx="${cx}" cy="${cy}" r="4" fill="${isPos ? '#a855f7' : '#e2e8f0'}" stroke="#94a3b8" stroke-width="1.2"/>`;
                            }).join('')
                        ).join('')}
                    </g>`;
                    break;

                case 'tabung-antibodi':
                    content = `
                    <g transform="translate(28, 10)">
                        <rect x="8" y="26" width="28" height="46" rx="2.5" fill="url(#${p}_glass_body)" stroke="#334155" stroke-width="2.2"/>
                        <rect x="13" y="16" width="18" height="10" rx="2" fill="#f59e0b" stroke="#b45309" stroke-width="1.8"/>
                        <!-- Cairan Emas Antibodi Monoklonal -->
                        <rect x="10" y="44" width="24" height="26" fill="#fbbf24" opacity="0.92"/>
                        <rect x="10" y="32" width="24" height="11" fill="#ffffff" stroke="#94a3b8" stroke-width="1"/>
                        <text x="22" y="40" fill="#0f172a" font-size="6.5" font-family="'JetBrains Mono', sans-serif" font-weight="bold" text-anchor="middle">mAb</text>
                    </g>`;
                    break;

                case 'antibodi':
                    content = `
                    <g transform="translate(16, 12)">
                        <!-- Molekul Protein Bentuk Huruf Y -->
                        <!-- Rantai Berat (Heavy Chain) -->
                        <path d="M 34 82 L 34 44 L 16 18" fill="none" stroke="#f59e0b" stroke-width="6" stroke-linecap="round"/>
                        <path d="M 34 82 L 34 44 L 52 18" fill="none" stroke="#f59e0b" stroke-width="6" stroke-linecap="round"/>
                        <!-- Rantai Ringan (Light Chain) -->
                        <path d="M 13 40 L 8 22" fill="none" stroke="#fbbf24" stroke-width="4" stroke-linecap="round"/>
                        <path d="M 55 40 L 60 22" fill="none" stroke="#fbbf24" stroke-width="4" stroke-linecap="round"/>
                        <!-- Situs Pengikat Antigen (Paratope) -->
                        <circle cx="16" cy="18" r="4" fill="#ef4444"/>
                        <circle cx="52" cy="18" r="4" fill="#ef4444"/>
                    </g>`;
                    break;

                // =============================================================
                // 6. SIMULATOR E: DNA REKOMBINAN
                // =============================================================
                case 'sel-manusia':
                    content = `
                    <g transform="translate(16, 12)">
                        <path d="M 16 36 Q 16 14 36 14 Q 56 14 56 36 Q 56 58 36 58 Q 16 58 16 36 Z" fill="#e0f2fe" stroke="#0284c7" stroke-width="3"/>
                        <circle cx="36" cy="36" r="16" fill="#0284c7" stroke="#0369a1" stroke-width="2.5"/>
                        <!-- Benang Kromatin DNA di Dalam Inti -->
                        <path d="M 28 36 Q 36 28 44 36" fill="none" stroke="#bae6fd" stroke-width="2.2"/>
                        <path d="M 28 40 Q 36 48 44 40" fill="none" stroke="#bae6fd" stroke-width="2.2"/>
                    </g>`;
                    break;

                case 'dna':
                    content = `
                    <g transform="translate(22, 8)">
                        <!-- Heliks Ganda DNA 3D -->
                        <path d="M 12 10 Q 34 32 12 54 Q 34 76 12 94" fill="none" stroke="#0284c7" stroke-width="3.5" stroke-linecap="round"/>
                        <path d="M 34 10 Q 12 32 34 54 Q 12 76 34 94" fill="none" stroke="#38bdf8" stroke-width="3.5" stroke-linecap="round"/>
                        <!-- Pasangan Basa Berwarna Komplementer -->
                        <line x1="16" y1="21" x2="30" y2="21" stroke="#f59e0b" stroke-width="2.5"/>
                        <line x1="21" y1="32" x2="25" y2="32" stroke="#10b981" stroke-width="2.5"/>
                        <line x1="16" y1="43" x2="30" y2="43" stroke="#ef4444" stroke-width="2.5"/>
                        <line x1="16" y1="65" x2="30" y2="65" stroke="#f59e0b" stroke-width="2.5"/>
                        <line x1="21" y1="76" x2="25" y2="76" stroke="#10b981" stroke-width="2.5"/>
                    </g>`;
                    break;

                case 'gen-insulin':
                    content = `
                    <g transform="translate(16, 26)">
                        <rect x="8" y="14" width="46" height="14" rx="3.5" fill="#38bdf8" stroke="#0284c7" stroke-width="2.5"/>
                        <rect x="4" y="14" width="4" height="7" fill="#38bdf8"/>
                        <rect x="54" y="21" width="4" height="7" fill="#38bdf8"/>
                        <text x="31" y="24" fill="#0f172a" font-size="7" font-family="'JetBrains Mono', monospace" font-weight="bold" text-anchor="middle">INSULIN GEN</text>
                    </g>`;
                    break;

                case 'enzim-gunting':
                    content = `
                    <g transform="translate(18, 12)">
                        <!-- Enzim Restriksi Endonuklease Gunting Molekuler -->
                        <path d="M 14 18 L 42 52" stroke="#0284c7" stroke-width="5.5" stroke-linecap="round"/>
                        <path d="M 46 18 L 18 52" stroke="#0284c7" stroke-width="5.5" stroke-linecap="round"/>
                        <circle cx="30" cy="39" r="5" fill="#ffffff" stroke="#1e293b" stroke-width="2.2"/>
                        <circle cx="14" cy="65" r="8" fill="none" stroke="#e11d48" stroke-width="3.5"/>
                        <circle cx="46" cy="65" r="8" fill="none" stroke="#e11d48" stroke-width="3.5"/>
                    </g>`;
                    break;

                case 'sel-bakteri':
                    content = `
                    <g transform="translate(8, 18)">
                        <path d="M 8 36 Q 0 25 -4 36" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round"/>
                        <path d="M 8 42 Q -2 48 -6 42" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round"/>
                        <rect x="12" y="18" width="60" height="34" rx="17" fill="#d1fae5" stroke="#059669" stroke-width="3"/>
                        <circle cx="32" cy="35" r="8" fill="none" stroke="#9333ea" stroke-width="2.5"/>
                        <path d="M 48 26 Q 60 35 48 44" fill="none" stroke="#10b981" stroke-width="2.2" stroke-linecap="round"/>
                    </g>`;
                    break;

                case 'plasmid':
                    content = `
                    <g transform="translate(16, 16)">
                        <circle cx="34" cy="34" r="25" fill="none" stroke="#9333ea" stroke-width="5.5"/>
                        <line x1="34" y1="6" x2="34" y2="12" stroke="#ffffff" stroke-width="3.5"/>
                        <circle cx="34" cy="9" r="2.5" fill="#ef4444"/>
                    </g>`;
                    break;

                case 'enzim-ligase':
                    content = `
                    <g transform="translate(18, 18)">
                        <path d="M 14 14 Q 32 6 50 14 L 50 38 Q 32 26 14 38 Z" fill="#facc15" stroke="#ca8a04" stroke-width="3"/>
                        <circle cx="32" cy="22" r="3.5" fill="#ca8a04"/>
                    </g>`;
                    break;

                case 'plasmid-rekombinan':
                    content = `
                    <g transform="translate(16, 16)">
                        <path d="M 34 9 A 25 25 0 1 1 16 18" fill="none" stroke="#9333ea" stroke-width="5.5"/>
                        <path d="M 16 18 A 25 25 0 0 1 34 9" fill="none" stroke="#0284c7" stroke-width="6.5" stroke-linecap="round"/>
                        <circle cx="34" cy="9" r="2.5" fill="#22c55e"/>
                        <circle cx="16" cy="18" r="2.5" fill="#22c55e"/>
                    </g>`;
                    break;

                case 'media-antibiotik':
                    content = `
                    <g transform="translate(8, 18)">
                        <ellipse cx="42" cy="36" rx="38" ry="13" fill="#fee2e2" stroke="#dc2626" stroke-width="2.5"/>
                        <path d="M 4 36 L 4 46 Q 42 60 80 46 L 80 36" fill="none" stroke="#dc2626" stroke-width="2.5"/>
                        <circle cx="30" cy="35" r="3.5" fill="#22c55e" stroke="#15803d" stroke-width="1.2"/>
                        <circle cx="52" cy="33" r="3.5" fill="#22c55e" stroke="#15803d" stroke-width="1.2"/>
                        <circle cx="40" cy="41" r="4" fill="#22c55e" stroke="#15803d" stroke-width="1.2"/>
                    </g>`;
                    break;

                case 'fermentor':
                    content = `
                    <g transform="translate(12, 4)">
                        <!-- Pipa Pemasukan & Sirkulasi Stainless -->
                        <path d="M 22 4 L 22 18" stroke="#64748b" stroke-width="4.5" stroke-linecap="round"/>
                        <path d="M 54 4 L 54 18" stroke="#64748b" stroke-width="4.5" stroke-linecap="round"/>
                        <!-- Tangki Baja Industri 316L -->
                        <rect x="14" y="18" width="48" height="58" rx="5" fill="url(#${p}_steel)" stroke="#334155" stroke-width="3"/>
                        <!-- Jendela Kaca Pengamat Cairan Bioreaktor -->
                        <rect x="26" y="30" width="24" height="28" rx="2.5" fill="#38bdf8" opacity="0.85" stroke="#0284c7" stroke-width="1.8"/>
                        <!-- Pengaduk Agitator Impeller Ganda -->
                        <line x1="38" y1="20" x2="38" y2="52" stroke="#0f172a" stroke-width="2.5"/>
                        <line x1="30" y1="42" x2="46" y2="42" stroke="#0f172a" stroke-width="3"/>
                        <line x1="30" y1="52" x2="46" y2="52" stroke="#0f172a" stroke-width="3"/>
                        <!-- Manometer Pengukur Tekanan Dial -->
                        <circle cx="56" cy="30" r="6" fill="#ffffff" stroke="#1e293b" stroke-width="1.5"/>
                        <line x1="56" y1="30" x2="58" y2="26" stroke="#ef4444" stroke-width="1.5"/>
                        <!-- Kaki Baja Penyangga & Keran Hasil Panen Insulin -->
                        <rect x="12" y="74" width="10" height="18" fill="#1e293b"/>
                        <rect x="54" y="74" width="10" height="18" fill="#1e293b"/>
                        <path d="M 38 74 L 38 84 L 46 84" stroke="#f59e0b" stroke-width="3.5" fill="none" stroke-linecap="round"/>
                    </g>`;
                    break;

                default:
                    content = `
                    <g transform="translate(10, 10)">
                        <rect x="10" y="10" width="60" height="60" rx="8" fill="#e2e8f0" stroke="#64748b" stroke-width="2"/>
                        <text x="40" y="44" fill="#334155" font-size="8" font-family="sans-serif" font-weight="bold" text-anchor="middle">${label || id}</text>
                    </g>`;
                    break;
            }

            return `
            <svg class="lab-svg-entity" data-asset-id="${id}" viewBox="0 0 ${w} ${h}" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                ${defs}
                ${content}
            </svg>`;
        }
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = LabSVG;
    }
    if (typeof window !== 'undefined') {
        window.LabSVG = LabSVG;
    }
})();
