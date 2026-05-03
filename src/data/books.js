// ─── BOOKS DATA ───────────────────────────────────────────────────────────────
// Add your books here. archiveId is the Archive.org identifier.
// The reader uses: https://archive.org/embed/{archiveId}
// Download:        https://archive.org/download/{archiveId}
// Archive page:    https://archive.org/details/{archiveId}

export const books = [
  {
    id: 'book-001',
    title: 'Kitab al-Tawhid',
    titleAr: 'كتاب التوحيد',
    author: 'Muhammad ibn Abd al-Wahhab',
    authorAr: 'محمد بن عبد الوهاب',
    description: 'The foundational text on Islamic monotheism, examining the meaning of tawhid and the conditions of the shahada with textual evidences from Quran and Sunnah.',
    descriptionAr: 'الكتاب الأساسي في التوحيد، يتناول معنى التوحيد وشروط الشهادة بالأدلة من القرآن والسنة.',
    category: 'aqeedah',
    language: 'ar',
    size: '2.1 MB',
    archiveId: 'KitabAtTawheedMuhammadIbnAbdulWahhab',
  },
  {
    id: 'book-002',
    title: 'The Three Fundamental Principles',
    titleAr: 'الأصول الثلاثة',
    author: 'Muhammad ibn Abd al-Wahhab',
    authorAr: 'محمد بن عبد الوهاب',
    description: 'A concise treatise covering three essential questions every Muslim must know: Who is your Lord? What is your religion? Who is your Prophet?',
    descriptionAr: 'رسالة موجزة في الأصول الثلاثة التي يجب على كل مسلم معرفتها.',
    category: 'aqeedah',
    language: 'en',
    size: '0.8 MB',
    archiveId: 'three-fundamental-principles-en',
  },
  {
    id: 'book-003',
    title: 'Riyad al-Salihin',
    titleAr: 'رياض الصالحين',
    author: 'Imam al-Nawawi',
    authorAr: 'الإمام النووي',
    description: 'Gardens of the Righteous — a comprehensive collection of Prophetic hadith organized by theme, covering worship, manners, remembrance, and daily conduct.',
    descriptionAr: 'مجموعة شاملة من الأحاديث النبوية مرتبة بحسب الموضوع، تشمل العبادات والآداب والأذكار.',
    category: 'hadith',
    language: 'ar',
    size: '8.4 MB',
    archiveId: 'RiyadhAlSalehin',
  },
  {
    id: 'book-004',
    title: 'Usul al-Sunnah',
    titleAr: 'أصول السنة',
    author: 'Imam Ahmad ibn Hanbal',
    authorAr: 'الإمام أحمد بن حنبل',
    description: 'The foundational creed of Imam Ahmad, outlining the beliefs of Ahl al-Sunnah wa al-Jamaah with clarity and precision.',
    descriptionAr: 'عقيدة الإمام أحمد الأساسية، تُبيّن معتقد أهل السنة والجماعة بوضوح ودقة.',
    category: 'aqeedah',
    language: 'ar',
    size: '1.2 MB',
    archiveId: 'usul-al-sunnah-ahmad',
  },
  {
    id: 'book-005',
    title: 'Explanation of the Creed',
    titleAr: 'شرح العقيدة',
    author: 'Imam al-Barbahari',
    authorAr: 'الإمام البربهاري',
    description: 'Sharh al-Sunnah — a detailed exposition of the creed of the Salaf, covering major theological issues with the positions of the early Muslims.',
    descriptionAr: 'شرح السنة — بيان مفصّل لعقيدة السلف في المسائل الكبرى.',
    category: 'aqeedah',
    language: 'en',
    size: '1.8 MB',
    archiveId: 'explanation-creed-barbahari-en',
  },
  {
    id: 'book-006',
    title: 'Bulugh al-Maram',
    titleAr: 'بلوغ المرام',
    author: 'Ibn Hajar al-Asqalani',
    authorAr: 'ابن حجر العسقلاني',
    description: 'Attainment of the Objective — a collection of hadith related to Islamic jurisprudence, widely used in fiqh studies across the Muslim world.',
    descriptionAr: 'مجموعة من الأحاديث الفقهية، يُعدّ من أهم المتون الحديثية المستخدمة في دراسة الفقه.',
    category: 'fiqh',
    language: 'ar',
    size: '5.6 MB',
    archiveId: 'BulughAlMaram',
  },
];

export const CATEGORIES = ['aqeedah', 'fiqh', 'hadith', 'tafsir', 'seerah', 'other'];
export const LANGUAGES  = ['ar', 'en', 'mixed'];
