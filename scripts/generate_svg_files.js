const fs = require('fs');
const path = require('path');
const LabSVG = require('../static/js/svg-objects.js');

const OBJECT_MAPPING = {
    'umum': [
        'tabung-erlenmeyer', 'tabung-reaksi', 'cawan-petri', 'mikroskop', 
        'pipet', 'suntikan', 'timbangan', 'bunsen'
    ],
    'a-kultur-jaringan': [
        'wortel', 'pisau', 'laminar-flow', 'tabung-media', 'eksplan', 
        'kalus', 'planlet', 'pot-tanaman', 'tumbuhan-dewasa', 'rak-inkubasi'
    ],
    'b-bayi-tabung': [
        'ovarium', 'suntikan-hormon', 'tabung-sperma', 'cawan-petri', 
        'ovum', 'sperma', 'zigot', 'blastula', 'inkubator', 'rahim'
    ],
    'c-kloning': [
        'domba-finndorset', 'sel-kelenjar-susu', 'domba-blackface', 'ovum-blackface', 
        'mikropipet', 'cawan-kultur', 'alat-stimulasi', 'blastosit', 'domba-dolly'
    ],
    'd-hibridoma': [
        'tikus', 'suntikan-antigen', 'tabung-limfosit-b', 'tabung-sel-kanker', 
        'tabung-fusi', 'rak-kultur', 'tabung-antibodi', 'sel-hibridoma', 'antibodi'
    ],
    'e-dna-rekombinan': [
        'sel-manusia', 'dna', 'gen-insulin', 'enzim-gunting', 'sel-bakteri', 
        'plasmid', 'enzim-ligase', 'plasmid-rekombinan', 'media-antibiotik', 'fermentor'
    ]
};

const DIRS = ['src/assets/svg', 'static/assets/svg'];

let count = 0;
for (const [folder, items] of Object.entries(OBJECT_MAPPING)) {
    for (const item of items) {
        const svgContent = LabSVG.render(item, { width: 100, height: 100 });
        for (const baseDir of DIRS) {
            const dirPath = path.join(baseDir, folder);
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
            }
            const filePath = path.join(dirPath, `${item}.svg`);
            fs.writeFileSync(filePath, svgContent.trim(), 'utf8');
        }
        count++;
    }
}

console.log(`[SUCCESS] Berhasil mengenerate ${count} file SVG ke dalam src/assets/svg dan static/assets/svg!`);

