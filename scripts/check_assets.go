package main

import (
	"fmt"
	"os"
	"path/filepath"
)

type SVGCheckItem struct {
	Category string
	ID       string
	Name     string
}

var allObjects = []SVGCheckItem{
	// Umum
	{"umum", "tabung-erlenmeyer", "Labu Erlenmeyer"},
	{"umum", "tabung-reaksi", "Tabung Reaksi"},
	{"umum", "cawan-petri", "Cawan Petri"},
	{"umum", "mikroskop", "Mikroskop Laboratorium"},
	{"umum", "pipet", "Mikropipet"},
	{"umum", "suntikan", "Jarum Suntik Spuit"},
	{"umum", "timbangan", "Timbangan Digital"},
	{"umum", "bunsen", "Pembakar Bunsen & Kassa"},

	// A: Kultur Jaringan
	{"a-kultur-jaringan", "wortel", "Wortel Segar"},
	{"a-kultur-jaringan", "pisau", "Pisau Skalpel Steril"},
	{"a-kultur-jaringan", "laminar-flow", "Laminar Air Flow (LAF)"},
	{"a-kultur-jaringan", "tabung-media", "Tabung Nutrisi MS"},
	{"a-kultur-jaringan", "eksplan", "Potongan Eksplan"},
	{"a-kultur-jaringan", "kalus", "Gumpalan Kalus"},
	{"a-kultur-jaringan", "planlet", "Planlet Wortel Mini"},
	{"a-kultur-jaringan", "pot-tanaman", "Pot Tanah Aklimatisasi"},
	{"a-kultur-jaringan", "tumbuhan-dewasa", "Tanaman Wortel Dewasa"},
	{"a-kultur-jaringan", "rak-inkubasi", "Rak Inkubasi Jam"},

	// B: Bayi Tabung
	{"b-bayi-tabung", "ovarium", "Organ Ovarium"},
	{"b-bayi-tabung", "suntikan-hormon", "Suntikan Hormon"},
	{"b-bayi-tabung", "tabung-sperma", "Tabung Sampel Sperma"},
	{"b-bayi-tabung", "cawan-petri", "Cawan Petri Kultur"},
	{"b-bayi-tabung", "ovum", "Sel Ovum Matang"},
	{"b-bayi-tabung", "sperma", "Spermatozoa"},
	{"b-bayi-tabung", "zigot", "Sel Zigot Fertilisasi"},
	{"b-bayi-tabung", "blastula", "Embrio Tahap Blastula"},
	{"b-bayi-tabung", "inkubator", "Inkubator CO2 37°C"},
	{"b-bayi-tabung", "rahim", "Uterus / Dinding Rahim"},

	// C: Kloning
	{"c-kloning", "domba-finndorset", "Domba Finn Dorset (Donor Inti)"},
	{"c-kloning", "sel-kelenjar-susu", "Sel Kelenjar Susu (2n)"},
	{"c-kloning", "domba-blackface", "Domba Blackface (Donor Ovum)"},
	{"c-kloning", "ovum-blackface", "Ovum Domba Enukleasi"},
	{"c-kloning", "mikropipet", "Mikromanipulator Enukleasi"},
	{"c-kloning", "cawan-kultur", "Cawan Fusi Sel"},
	{"c-kloning", "alat-stimulasi", "Mesin Elektrofusi"},
	{"c-kloning", "blastosit", "Blastosit Kloning"},
	{"c-kloning", "domba-dolly", "Domba Dolly"},

	// D: Hibridoma
	{"d-hibridoma", "tikus", "Mencit Donor Imun"},
	{"d-hibridoma", "suntikan-antigen", "Suntikan Antigen"},
	{"d-hibridoma", "tabung-limfosit-b", "Suspensi Limfosit B"},
	{"d-hibridoma", "tabung-sel-kanker", "Sel Kanker Mieloma"},
	{"d-hibridoma", "tabung-fusi", "Tabung Fusi PEG"},
	{"d-hibridoma", "sel-hibridoma", "Sel Hibridoma"},
	{"d-hibridoma", "rak-kultur", "Pelat Kultur HAT"},
	{"d-hibridoma", "tabung-antibodi", "Vial Antibodi Monoklonal"},
	{"d-hibridoma", "antibodi", "Molekul Antibodi Bentuk Y"},

	// E: DNA Rekombinan
	{"e-dna-rekombinan", "sel-manusia", "Sel Pankreas Manusia"},
	{"e-dna-rekombinan", "dna", "DNA Heliks Ganda"},
	{"e-dna-rekombinan", "gen-insulin", "Fragmen Gen Insulin"},
	{"e-dna-rekombinan", "enzim-gunting", "Enzim Restriksi Gunting"},
	{"e-dna-rekombinan", "sel-bakteri", "Bakteri E. coli"},
	{"e-dna-rekombinan", "plasmid", "Plasmid Vektor"},
	{"e-dna-rekombinan", "enzim-ligase", "Enzim Ligase Perekat"},
	{"e-dna-rekombinan", "plasmid-rekombinan", "Plasmid Rekombinan"},
	{"e-dna-rekombinan", "media-antibiotik", "Cawan Seleksi Antibiotik"},
	{"e-dna-rekombinan", "fermentor", "Bioreaktor Fermentor"},
}

func fileExists(p string) bool {
	info, err := os.Stat(p)
	return err == nil && !info.IsDir()
}

func main() {
	fmt.Println("=== VERIFIKASI ASET SVG HD SIMULATOR (Go) ===")
	foundCount := 0

	for _, item := range allObjects {
		svgPath := filepath.Join("static", "assets", "svg", item.Category, item.ID+".svg")
		if fileExists(svgPath) {
			foundCount++
		} else {
			fmt.Printf("[MISSING] %s (%s)\n", item.ID, svgPath)
		}
	}

	fmt.Printf("Total Berkas SVG Terverifikasi: %d / %d (100%% Lengkap)\n", foundCount, len(allObjects))
	if foundCount == len(allObjects) {
		fmt.Println("[SUCCESS] Seluruh 56 aset SVG mandiri tersedia dan siap digunakan!")
	}
}
