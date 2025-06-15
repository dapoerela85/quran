// Cache for Quran data
let quranData = null;

// Fetch Quran data from CDN
async function fetchQuranData() {
    try {
        if (quranData) return quranData;
        
        const response = await fetch('https://cdn.jsdelivr.net/npm/quran-cloud@1.0.0/dist/quran_en.json');
        if (!response.ok) throw new Error('Network response was not ok');
        
        quranData = await response.json();
        if (!quranData || !quranData.surahs) {
            throw new Error('Invalid Quran data format');
        }
        
        return quranData;
    } catch (error) {
        console.error('Error loading Quran data:', error);
        showError('Failed to load Quran data. Please try again later.');
        return null;
    }
}

function showError(message) {
    const container = document.querySelector('.container') || document.body;
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-danger';
    errorDiv.textContent = message;
    container.prepend(errorDiv);
}

// Load all surahs on the homepage
async function loadSurahs() {
    const container = document.getElementById('surahs-container');
    if (!container) return;
    
    container.innerHTML = '<div class="text-center">Loading surahs...</div>';
    
    const quranData = await fetchQuranData();
    if (!quranData) return;
    
    container.innerHTML = '';
    
    quranData.surahs.forEach(surah => {
        const surahCard = document.createElement('div');
        surahCard.className = 'col-md-4 col-sm-6 mb-4';
        surahCard.innerHTML = `
            <div class="card surah-card h-100">
                <div class="card-body">
                    <h5 class="card-title">${surah.number}. ${surah.name} (${surah.englishName})</h5>
                    <p class="card-text">${surah.englishNameTranslation}</p>
                    <p class="card-text"><small class="text-muted">${surah.ayahs.length} verses • ${surah.revelationType}</small></p>
                    <a href="surah.html?surah=${surah.number}" class="btn btn-primary">Read Surah</a>
                </div>
            </div>
        `;
        container.appendChild(surahCard);
    });
}

// Load a single surah
async function loadSurah(surahNumber) {
    surahNumber = parseInt(surahNumber);
    if (isNaN(surahNumber) || surahNumber < 1 || surahNumber > 114) {
        showError('Invalid surah number');
        setTimeout(() => window.location.href = 'index.html', 2000);
        return;
    }

    const surahInfo = document.getElementById('surah-info');
    const versesContainer = document.getElementById('verses-container');
    
    if (surahInfo) surahInfo.innerHTML = '<div class="text-center">Loading surah info...</div>';
    if (versesContainer) versesContainer.innerHTML = '<div class="text-center">Loading verses...</div>';
    
    const quranData = await fetchQuranData();
    if (!quranData) return;
    
    const surah = quranData.surahs.find(s => s.number === surahNumber);
    if (!surah) {
        showError('Surah not found');
        setTimeout(() => window.location.href = 'index.html', 2000);
        return;
    }

    if (surahInfo) {
        surahInfo.innerHTML = `
            <div class="surah-info">
                <h2>${surah.number}. ${surah.name} (${surah.englishName})</h2>
                <h3 class="text-muted">${surah.englishNameTranslation}</h3>
                <p>Revelation Type: ${surah.revelationType} | Verses: ${surah.ayahs.length}</p>
            </div>
        `;
    }

    if (versesContainer) {
        versesContainer.innerHTML = '';
        
        surah.ayahs.forEach(ayah => {
            const verseCard = document.createElement('div');
            verseCard.className = 'verse-card mb-3 p-3 border rounded';
            verseCard.innerHTML = `
                <div>
                    <span class="verse-number badge bg-primary">${ayah.numberInSurah}</span>
                    <span class="arabic-text">${ayah.text}</span>
                </div>
                <div class="translation mt-2">${ayah.translation}</div>
                <div class="mt-2">
                    <a href="verse.html?surah=${surah.number}&verse=${ayah.numberInSurah}" class="btn btn-sm btn-outline-primary">View Verse</a>
                </div>
            `;
            versesContainer.appendChild(verseCard);
        });
    }
}

// Load a single verse
async function loadVerse(surahNumber, verseNumber) {
    surahNumber = parseInt(surahNumber);
    verseNumber = parseInt(verseNumber);
    
    if (isNaN(surahNumber) || surahNumber < 1 || surahNumber > 114) {
        showError('Invalid surah number');
        setTimeout(() => window.location.href = 'index.html', 2000);
        return;
    }
    
    if (isNaN(verseNumber) || verseNumber < 1) {
        showError('Invalid verse number');
        setTimeout(() => window.location.href = `surah.html?surah=${surahNumber}`, 2000);
        return;
    }

    const verseContainer = document.getElementById('verse-container');
    if (verseContainer) verseContainer.innerHTML = '<div class="text-center">Loading verse...</div>';
    
    const quranData = await fetchQuranData();
    if (!quranData) return;
    
    const surah = quranData.surahs.find(s => s.number === surahNumber);
    if (!surah) {
        showError('Surah not found');
        setTimeout(() => window.location.href = 'index.html', 2000);
        return;
    }

    const verse = surah.ayahs.find(a => a.numberInSurah === verseNumber);
    if (!verse) {
        showError('Verse not found');
        setTimeout(() => window.location.href = `surah.html?surah=${surahNumber}`, 2000);
        return;
    }

    if (verseContainer) {
        verseContainer.innerHTML = `
            <div class="single-verse">
                <h3>Surah ${surah.englishName} (${surah.name}), Verse ${verse.numberInSurah}</h3>
                <div class="arabic-text mt-4 fs-4 text-end">
                    ${verse.text}
                </div>
                <div class="translation mt-4">
                    <h4>Translation:</h4>
                    <p>${verse.translation}</p>
                </div>
                <a href="surah.html?surah=${surah.number}" class="btn btn-secondary mt-3">Back to Surah</a>
            </div>
        `;
    }
}