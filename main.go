package main

import (
	"encoding/json"
	"fmt"
	"html/template"
	"io"
	"log"
	"math/rand" // Tambahan untuk fungsi acak (random)
	"net/http"
	"os"
	"sort"
	"sync"
	"time"
)

// --- STRUKTUR DATA MATERI ---
type Quiz struct {
	Question string   `json:"question"`
	Options  []string `json:"options"`
	Answer   int      `json:"answer"`
}

type Module struct {
	ID            string   `json:"id"`
	Title         string   `json:"title"`
	Summary       string   `json:"summary"`
	Icon          string   `json:"icon"`
	Theory        string   `json:"theory"`
	Procedure     []string `json:"procedure"`
	VideoURL      string   `json:"video_url"`
	SimulatorDesc string   `json:"simulator_desc"`
	Quizzes       []Quiz   `json:"quizzes"`
}

// --- STRUKTUR DATABASE LOKAL ---
type ScoreRecord struct {
	NPM      string `json:"npm"`
	Nama     string `json:"nama"`
	ModuleID string `json:"module_id"`
	Score    int    `json:"score"`
	Waktu    string `json:"waktu"`
}

type FeedbackRecord struct {
	NPM     string `json:"npm"`
	Nama    string `json:"nama"`
	Message string `json:"message"`
	Waktu   string `json:"waktu"`
}

type LocalDB struct {
	Scores    []ScoreRecord    `json:"scores"`
	Feedbacks []FeedbackRecord `json:"feedbacks"`
}

var (
	modules []Module
	tmpl    *template.Template
	db      LocalDB
	dbMutex sync.Mutex
)

// Fungsi membaca/membuat database.json
func loadDatabase() {
	dbMutex.Lock()
	defer dbMutex.Unlock()
	file, err := os.ReadFile("data/database.json")
	if err != nil {
		db = LocalDB{Scores: []ScoreRecord{}, Feedbacks: []FeedbackRecord{}}
		return
	}
	json.Unmarshal(file, &db)
}

func saveDatabase() {
	dbMutex.Lock()
	defer dbMutex.Unlock()
	data, _ := json.MarshalIndent(db, "", "  ")
	os.WriteFile("data/database.json", data, 0644)
}

func init() {
	// Baca materi
	file, _ := os.ReadFile("data/modules.json")
	json.Unmarshal(file, &modules)

	// Load DB Lokal
	loadDatabase()

	// Load Template
	tmpl = template.Must(template.ParseFiles(
		"templates/layout.html",
		"templates/home.html",
		"templates/module.html",
		"templates/login.html",
		"templates/katalog.html",
	))
}

// Middleware Cek Login
func getUser(r *http.Request) (string, string) {
	namaCookie, err1 := r.Cookie("nama")
	npmCookie, err2 := r.Cookie("npm")
	if err1 != nil || err2 != nil {
		return "", ""
	}
	return namaCookie.Value, npmCookie.Value
}

func main() {
	fs := http.FileServer(http.Dir("static"))
	http.Handle("/static/", http.StripPrefix("/static/", fs))
	http.Handle("/assets/", http.StripPrefix("/assets/", http.FileServer(http.Dir("static/assets"))))

	// Route Katalog Objek SVG
	http.HandleFunc("/katalog-objek", func(w http.ResponseWriter, r *http.Request) {
		tmpl.ExecuteTemplate(w, "katalog", nil)
	})

	// Route Login
	http.HandleFunc("/login", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == "POST" {
			nama := r.FormValue("nama")
			npm := r.FormValue("npm")
			if nama != "" && npm != "" {
				http.SetCookie(w, &http.Cookie{Name: "nama", Value: nama, Path: "/"})
				http.SetCookie(w, &http.Cookie{Name: "npm", Value: npm, Path: "/"})
				http.Redirect(w, r, "/", http.StatusSeeOther)
				return
			}
		}
		tmpl.ExecuteTemplate(w, "login.html", nil)
	})

	// Route Logout
	http.HandleFunc("/logout", func(w http.ResponseWriter, r *http.Request) {
		http.SetCookie(w, &http.Cookie{Name: "nama", Value: "", Path: "/", MaxAge: -1})
		http.SetCookie(w, &http.Cookie{Name: "npm", Value: "", Path: "/", MaxAge: -1})
		http.Redirect(w, r, "/login", http.StatusSeeOther)
	})

	// Route Home
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/" {
			http.NotFound(w, r)
			return
		}
		nama, npm := getUser(r)
		if nama == "" {
			http.Redirect(w, r, "/login", http.StatusSeeOther)
			return
		}
		tmpl.ExecuteTemplate(w, "layout", map[string]interface{}{
			"Modules": modules, "Page": "home", "Nama": nama, "NPM": npm,
		})
	})

	// Route Module
	http.HandleFunc("/module/", func(w http.ResponseWriter, r *http.Request) {
		nama, npm := getUser(r)
		if nama == "" {
			http.Redirect(w, r, "/login", http.StatusSeeOther)
			return
		}
		
		id := r.URL.Path[len("/module/"):]
		var selectedModule Module
		found := false
		
		// Cari modul berdasarkan ID
		for _, m := range modules {
			if m.ID == id {
				selectedModule = m // Salin data modul agar data asli (global) tidak rusak
				found = true
				break
			}
		}
		
		if !found {
			http.NotFound(w, r)
			return
		}

		// --- LOGIKA PENGACAKAN SOAL KUIS ---
		// 1. Buat salinan array kuis agar acakan tidak merubah data di memory utama
		quizzesCopy := make([]Quiz, len(selectedModule.Quizzes))
		copy(quizzesCopy, selectedModule.Quizzes)

		// 2. Acak urutan soal (Shuffle)
		rng := rand.New(rand.NewSource(time.Now().UnixNano()))
		rng.Shuffle(len(quizzesCopy), func(i, j int) {
			quizzesCopy[i], quizzesCopy[j] = quizzesCopy[j], quizzesCopy[i]
		})

		// 3. Batasi hanya maksimal 20 soal yang dikirim ke halaman UI
		limit := 20
		if len(quizzesCopy) < limit {
			limit = len(quizzesCopy) // Jika soal aslinya kurang dari 20, ambil semua
		}
		selectedModule.Quizzes = quizzesCopy[:limit]
		// ------------------------------------

		tmpl.ExecuteTemplate(w, "layout", map[string]interface{}{
			"Module": selectedModule, "Page": "module", "Nama": nama, "NPM": npm,
		})
	})

	// API Simpan Skor & Ambil Leaderboard
	http.HandleFunc("/api/score", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")

		// 1. HANDLE POST: SIMPAN SKOR
		if r.Method == http.MethodPost {
			sessionNama, npm := getUser(r)
			
			var data struct {
				ModuleID string `json:"module_id"`
				Name     string `json:"name"`
				Score    int    `json:"score"`
			}
			body, _ := io.ReadAll(r.Body)
			json.Unmarshal(body, &data)

			// Prioritaskan nama dari input kuis, jika kosong pakai nama dari session login
			finalName := data.Name
			if finalName == "" {
				finalName = sessionNama
			}

			// Simpan ke struct global db dengan aman
			dbMutex.Lock()
			db.Scores = append(db.Scores, ScoreRecord{
				NPM:      npm, 
				Nama:     finalName, 
				ModuleID: data.ModuleID, 
				Score:    data.Score, 
				Waktu:    time.Now().Format("2006-01-02 15:04:05"),
			})
			dbMutex.Unlock()
			
			saveDatabase() // Tulis ke file JSON

			json.NewEncoder(w).Encode(map[string]string{"status": "success"})
			return
		}

		// 2. HANDLE GET: AMBIL LEADERBOARD
		if r.Method == http.MethodGet {
			moduleID := r.URL.Query().Get("module")
			
			dbMutex.Lock()
			// Filter skor khusus untuk modul yang sedang dibuka
			var filteredScores []ScoreRecord
			for _, s := range db.Scores {
				if s.ModuleID == moduleID {
					filteredScores = append(filteredScores, s)
				}
			}
			dbMutex.Unlock()

			// Urutkan dari nilai tertinggi ke terendah
			sort.Slice(filteredScores, func(i, j int) bool {
				return filteredScores[i].Score > filteredScores[j].Score
			})

			// Ambil maksimal Top 5
			limit := 5
			if len(filteredScores) < limit {
				limit = len(filteredScores)
			}
			topScores := filteredScores[:limit]

			// Bentuk struktur data yang diharapkan frontend JS
			type LeaderboardEntry struct {
				Name  string `json:"name"`
				Score int    `json:"score"`
			}
			
			var response []LeaderboardEntry
			for _, s := range topScores {
				response = append(response, LeaderboardEntry{
					Name:  s.Nama,
					Score: s.Score,
				})
			}

			// Kirim data leaderboard ke frontend
			json.NewEncoder(w).Encode(response)
			return
		}

		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	})

	// API Simpan Feedback
	http.HandleFunc("/api/feedback", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == "POST" {
			nama, npm := getUser(r)
			var data struct {
				Message string `json:"message"`
			}
			body, _ := io.ReadAll(r.Body)
			json.Unmarshal(body, &data)

			dbMutex.Lock()
			db.Feedbacks = append(db.Feedbacks, FeedbackRecord{
				NPM: npm, Nama: nama, Message: data.Message, Waktu: time.Now().Format("2006-01-02 15:04:05"),
			})
			dbMutex.Unlock()
			
			saveDatabase()
			fmt.Fprint(w, "Feedback tersimpan")
		}
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("Server berjalan di http://localhost:%s\n", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}