document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const competitionCards = document.querySelectorAll('.competition-card');
    const searchInput = document.getElementById('yarisma-ara');
    const searchButton = document.querySelector('.search-btn'); // Arama butonu eklendi

    // --- Tarihe Göre Otomatik Kategorize Etme ve Yıl/İmza Güncelleme ---
    function initializePageDetails() {
        const today = new Date();
        const currentYear = today.getFullYear();

        // Yıl bilgisini footer'a ekle
        const currentYearSpan = document.getElementById('currentYear');
        if (currentYearSpan) {
            currentYearSpan.textContent = currentYear;
        }
        
        // Ziyaretçi ve oluşturulma tarihi (HTML'de statik olarak eklendi, gerekirse dinamikleştirilebilir)
        // const visitorNameSpan = document.getElementById('visitorName');
        // if (visitorNameSpan) visitorNameSpan.textContent = "Bir Ziyaretçi"; // Örnek
        // const creationDateSpan = document.getElementById('creationDate');
        // if (creationDateSpan) creationDateSpan.textContent = new Date().toLocaleDateString('tr-TR'); // Örnek

        competitionCards.forEach(card => {
            const dateBadge = card.querySelector('.competition-date-badge');
            if (!dateBadge) return;

            const dayText = dateBadge.querySelector('.day')?.textContent;
            const monthText = dateBadge.querySelector('.month')?.textContent;
            const yearText = dateBadge.querySelector('.year')?.textContent; // Yıl span'ı eklendi

            if (!dayText || !monthText || !yearText) return; // Gerekli elemanlar yoksa atla

            const day = parseInt(dayText);
            const year = parseInt(yearText);

            const monthMap = {
                'OCA': 0, 'ŞUB': 1, 'MAR': 2, 'NİS': 3, 'MAY': 4, 'HAZ': 5,
                'TEM': 6, 'AĞU': 7, 'EYL': 8, 'EKİ': 9, 'KAS': 10, 'ARA': 11
            };
            const month = monthMap[monthText.toUpperCase()];

            if (typeof month === 'undefined') return; // Ay bulunamazsa atla

            const cardDate = new Date(year, month, day);

            // Saati ve dakikayı da karşılaştırmaya dahil etmek için günün sonuna ayarla
            const todayEndOfDay = new Date(today);
            todayEndOfDay.setHours(23, 59, 59, 999);


            if (cardDate < todayEndOfDay && !(cardDate.getDate() === today.getDate() && cardDate.getMonth() === today.getMonth() && cardDate.getFullYear() === today.getFullYear())) {
                card.setAttribute('data-category', 'gecmis');
                dateBadge.classList.add('past');
            } else {
                // data-category="yakin" zaten HTML'de varsayılan olarak ayarlanmış olabilir,
                // ama emin olmak için burada da ayarlanabilir.
                // Eğer HTML'de özellikle "gecmis" değilse "yakin" kabul edilebilir.
                if (card.getAttribute('data-category') !== 'gecmis') {
                     card.setAttribute('data-category', 'yakin');
                }
            }
        });
    }

    // --- Filtreleme İşlevi ---
    function filterCompetitions(filterValue) {
        competitionCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            if (filterValue === 'all' || cardCategory === filterValue) {
                card.style.display = 'flex'; // Kartları göstermek için display: flex kullandık (CSS'e göre)
            } else {
                card.style.display = 'none';
            }
        });
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const filterValue = this.getAttribute('data-filter');
            filterCompetitions(filterValue);
        });
    });

    // --- Arama İşlevi ---
    function searchCompetitions() {
        const searchTerm = searchInput.value.toLowerCase().trim();

        competitionCards.forEach(card => {
            const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
            const description = card.querySelector('.description')?.textContent.toLowerCase() || '';
            const location = card.querySelector('.meta-info i.fa-map-marker-alt')?.nextSibling.textContent.trim().toLowerCase() || '';
            
            // Aktif filtreyi de göz önünde bulundurarak arama yap
            const currentFilterButton = document.querySelector('.filter-btn.active');
            const currentFilter = currentFilterButton ? currentFilterButton.getAttribute('data-filter') : 'all';
            
            const cardCategory = card.getAttribute('data-category');
            const isVisibleByFilter = (currentFilter === 'all' || cardCategory === currentFilter);

            if (isVisibleByFilter && (title.includes(searchTerm) || description.includes(searchTerm) || location.includes(searchTerm))) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }

    searchInput.addEventListener('keyup', searchCompetitions);
    if (searchButton) { // Arama butonu varsa click event'i ekle
        searchButton.addEventListener('click', searchCompetitions);
    }

    // --- Detay ve Kayıt Butonları için Örnek İşlevler (Şimdilik Alert) ---
    const detailButtons = document.querySelectorAll('.details-link-btn');
    detailButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault(); // Sayfanın en üstüne gitmesini engelle
            const cardTitle = this.closest('.competition-card')?.querySelector('h3')?.textContent || 'Yarışma';
            // Gerçek uygulamada buraya modal (popup) açma veya detay sayfasına yönlendirme eklenebilir.
            alert(`"${cardTitle}" detayları ve başvuru sayfası henüz hazırlanmamıştır.`);
        });
    });

    const registrationButton = document.querySelector('.generic-btn'); // Genel buton için seçici güncellendi
    if (registrationButton && registrationButton.textContent.includes("Duyuruları")) {
        registrationButton.addEventListener('click', function(e) {
            e.preventDefault();
             // Gerçek uygulamada buraya okul duyuruları sayfasına yönlendirme eklenebilir
            alert('Okul duyuruları sayfası henüz hazırlanmamıştır.');
            // window.location.href = '/okul-duyurulari'; // Örnek yönlendirme
        });
    }

    // --- Sayfa Yüklendiğinde Başlangıç Ayarları ---
    initializePageDetails(); // Tarihleri kontrol et ve kategorileri ayarla

    // Başlangıçta "Tümü" filtresini aktif yap ve tüm kartları göster
    const allFilterBtn = document.querySelector('.filter-btn[data-filter="all"]');
    if (allFilterBtn) {
        allFilterBtn.click(); // Otomatik tıklama ile filtrelemeyi başlatır
    } else {
        filterCompetitions('all'); // Eğer buton bulunamazsa varsayılan olarak tümünü göster
    }
});