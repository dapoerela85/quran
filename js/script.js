// Cache for Quran data
let quranData = null;

// Fetch Quran data from CDN
async function fetchQuranData() {
    try {
        if (quranData) return quranData;
        
        const response = await fetch('https://cdn.jsdelivr.net/npm/quran-cloud@1.0.0/dist/quran_en.json');
        if (!response.ok) throw new Error('Network response was not ok');
        
        quranData = await response.json();
        if (!Array.isArray(quranData) || quranData.length !== 114) {
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
    const quranData = await fetchQuranData();
    if (!quranData) {
        alert('Failed to load Quran data. Please try again later.');
        return;
    }

    const container = document.getElementById('surahs-container');
    if (!container) return;
    
    container.innerHTML = ''; // Clear loading state
    
    quranData.forEach(surah => {
        const surahCard = document.createElement('div');
        surahCard.className = 'col-md-4 col-sm-6 mb-4';
        surahCard.innerHTML = `
            <div class="card surah-card h-100">
                <div class="card-body">
                    <h5 class="card-title">${surah.number}. ${surah.name} (${surah.englishName})</h5>
                    <p class="card-text">${surah.englishNameTranslation}</p>
                    <p class="card-text"><small class="text-muted">${surah.numberOfAyahs} verses • ${surah.revelationType}</small></p>
                    <a href="surah.html?surah=${surah.number}" class="btn btn-primary">Read Surah</a>
                </div>
            </div>
        `;
        container.appendChild(surahCard);
    });
}

// Load a single surah
async function loadSurah(surahNumber) {
    const quranData = await fetchQuranData();
    if (!quranData) {
        alert('Failed to load Quran data. Please try again later.');
        return;
    }

    const surah = quranData.find(s => s.number === surahNumber);
    if (!surah) {
        alert('Surah not found.');
        window.location.href = 'index.html';
        return;
    }

// In loadSurah function
if (isNaN(surahNumber) || surahNumber < 1 || surahNumber > 114) {
    alert('Invalid surah number.');
    window.location.href = 'index.html';
    return;
}

// In loadVerse function
if (isNaN(verseNumber) || verseNumber < 1) {
    alert('Invalid verse number.');
    window.location.href = `surah.html?surah=${surahNumber}`;
    return;
}

    // Display surah info
    const surahInfo = document.getElementById('surah-info');
    if (surahInfo) {
        surahInfo.innerHTML = `
            <div class="surah-info">
                <h2>${surah.number}. ${surah.name} (${surah.englishName})</h2>
                <h3 class="text-muted">${surah.englishNameTranslation}</h3>
                <p>Revelation Type: ${surah.revelationType} | Verses: ${surah.numberOfAyahs}</p>
            </div>
        `;
    }

    // Display verses
    const versesContainer = document.getElementById('verses-container');
    if (versesContainer) {
        versesContainer.innerHTML = ''; // Clear loading state
        
        surah.ayahs.forEach(ayah => {
            const verseCard = document.createElement('div');
            verseCard.className = 'verse-card';
            verseCard.innerHTML = `
                <div>
                    <span class="verse-number">${ayah.numberInSurah}</span>
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
    const quranData = await fetchQuranData();
    if (!quranData) {
        alert('Failed to load Quran data. Please try again later.');
        return;
    }

    const surah = quranData.find(s => s.number === surahNumber);
    if (!surah) {
        alert('Surah not found.');
        window.location.href = 'index.html';
        return;
    }

    const verse = surah.ayahs.find(a => a.numberInSurah === verseNumber);
    if (!verse) {
        alert('Verse not found.');
        window.location.href = `surah.html?surah=${surahNumber}`;
        return;
    }

    const verseContainer = document.getElementById('verse-container');
    if (verseContainer) {
        verseContainer.innerHTML = `
            <div class="single-verse">
                <h3>Surah ${surah.englishName} (${surah.name}), Verse ${verse.numberInSurah}</h3>
                <div class="arabic-text mt-4">
                    ${verse.text}
                </div>
                <div class="translation mt-4">
                    <h4>Translation:</h4>
                    <p>${verse.translation}</p>
                </div>
            </div>
        `;
    }
}
