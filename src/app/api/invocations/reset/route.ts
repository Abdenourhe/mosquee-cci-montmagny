import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const INVOCATIONS = [
  // ═══════════════════════════════════════════════════════════
  // CATÉGORIE : DAILY (Invocations du jour) — 30 invocations
  // ═══════════════════════════════════════════════════════════
  
  // ── Côté GAUCHE ──
  {
    label: "Basmala",
    arabic: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ",
    french: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux.",
    side: "left", order: 1, category: "daily",
  },
  {
    label: "Invocation du matin",
    arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ",
    french: "Ô Allah, c'est grâce à Toi que nous accueillons le matin, c'est par Toi que nous vivons et mourons, et c'est vers Toi que sera la résurrection.",
    side: "left", order: 2, category: "daily",
  },
  {
    label: "Invocation du soir",
    arabic: "اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ",
    french: "Ô Allah, c'est grâce à Toi que nous accueillons le soir, c'est par Toi que nous vivons et mourons, et c'est vers Toi que nous retournons.",
    side: "left", order: 3, category: "daily",
  },
  {
    label: "Avant de manger",
    arabic: "اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ",
    french: "Ô Allah, bénis ce que Tu nous as accordé comme subsistance et préserve-nous du châtiment du Feu.",
    side: "left", order: 4, category: "daily",
  },
  {
    label: "Après manger",
    arabic: "الحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلاَ قُوَّةٍ",
    french: "Louange à Allah qui m'a nourri de ceci et me l'a accordé sans force ni puissance de ma part.",
    side: "left", order: 5, category: "daily",
  },
  {
    label: "En sortant de chez soi",
    arabic: "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ لاَ حَوْلَ وَلاَ قُوَّةَ إِلَّا بِاللَّهِ",
    french: "Au nom d'Allah, je mets ma confiance en Allah. Il n'y a de force et de puissance qu'en Allah.",
    side: "left", order: 6, category: "daily",
  },
  {
    label: "Pour le voyage",
    arabic: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ",
    french: "Gloire à Celui qui nous a soumis cela alors que nous n'en étions pas capables. Et c'est vers notre Seigneur que nous retournerons.",
    side: "left", order: 7, category: "daily",
  },
  {
    label: "Protection contre le mal",
    arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
    french: "Je cherche refuge dans les paroles parfaites d'Allah contre le mal de ce qu'Il a créé.",
    side: "left", order: 8, category: "daily",
  },
  {
    label: "Sayyid al-Istighfar",
    arabic: "اللَّهُمَّ أَنْتَ رَبِّي لاَ إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ",
    french: "Ô Allah, Tu es mon Seigneur. Il n'y a de divinité que Toi. Tu m'as créé et je suis Ton serviteur, fidèle à mon engagement et ma promesse envers Toi.",
    side: "left", order: 9, category: "daily",
  },
  {
    label: "Pour la santé",
    arabic: "اللَّهُمَّ عَافِنِي فِي بَدَنِي اللَّهُمَّ عَافِنِي فِي سَمْعِي اللَّهُمَّ عَافِنِي فِي بَصَرِي",
    french: "Ô Allah, accorde-moi la santé dans mon corps. Ô Allah, accorde-moi la santé dans mon ouïe. Ô Allah, accorde-moi la santé dans ma vue.",
    side: "left", order: 10, category: "daily",
  },
  {
    label: "Pour la guidance (Coran 3:8)",
    arabic: "رَبَّنَا لاَ تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً",
    french: "Notre Seigneur, ne laisse pas nos cœurs dévier après que Tu nous as guidés, et accorde-nous une miséricorde venant de Toi.",
    side: "left", order: 11, category: "daily",
  },
  {
    label: "Pour les parents (Coran 71:28)",
    arabic: "رَّبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَلِمَن دَخَلَ بَيْتِيَ مُؤْمِنًا وَلِلْمُؤْمِنِينَ وَالْمُؤْمِنَاتِ",
    french: "Mon Seigneur, pardonne-moi, à mes parents, et à celui qui entre dans ma maison croyant, ainsi qu'aux croyants et croyantes.",
    side: "left", order: 12, category: "daily",
  },
  {
    label: "Tahlil — Unicité d'Allah",
    arabic: "لاَ إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
    french: "Il n'y a de divinité qu'Allah, seul, sans associé. À Lui le règne et la louange. Il est Omnipotent.",
    side: "left", order: 13, category: "daily",
  },
  {
    label: "Pour la subsistance (rizq)",
    arabic: "اللَّهُمَّ اكْفِنِي بِحَلاَلِكَ عَنْ حَرَامِكَ وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ",
    french: "Ô Allah, rends-moi suffisant par ce que Tu as rendu licite, sans avoir besoin de l'illicite, et enrichis-moi par Ta générosité sans dépendre d'autrui.",
    side: "left", order: 14, category: "daily",
  },
  {
    label: "Kafarat al-Majlis",
    arabic: "سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ أَشْهَدُ أَنْ لاَ إِلَهَ إِلاَّ أَنْتَ أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ",
    french: "Gloire à Toi ô Allah et Ta louange. J'atteste qu'il n'y a de divinité que Toi. Je Te demande pardon et me repens auprès de Toi.",
    side: "left", order: 15, category: "daily",
  },

  // ── Côté DROITE ──
  {
    label: "Ayat al-Kursi (Coran 2:255)",
    arabic: "اللَّهُ لاَ إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لاَ تَأْخُذُهُ سِنَةٌ وَلاَ نَوْمٌ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الأَرْضِ",
    french: "Allah — il n'y a de Divinité que Lui, le Vivant, Celui qui subsiste par Lui-même. Ni somnolence ni sommeil ne Le saisissent. À Lui appartient tout ce qui est dans les cieux et sur terre.",
    side: "right", order: 1, category: "daily",
  },
  {
    label: "Al-Fatiha (Coran 1:2-4)",
    arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ مَـٰلِكِ يَوْمِ ٱلدِّينِ",
    french: "Louange à Allah, Seigneur de l'univers. Le Tout Miséricordieux, le Très Miséricordieux. Maître du Jour de la rétribution.",
    side: "right", order: 2, category: "daily",
  },
  {
    label: "Subhanallah al-'Azim",
    arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ سُبْحَانَ اللَّهِ الْعَظِيمِ",
    french: "Gloire à Allah et Sa louange. Gloire à Allah le Très Grand.",
    side: "right", order: 3, category: "daily",
  },
  {
    label: "Avant de dormir",
    arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    french: "En Ton nom, ô Allah, je meurs et je vis.",
    side: "right", order: 4, category: "daily",
  },
  {
    label: "Au réveil",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
    french: "Louange à Allah qui nous a redonné la vie après nous avoir donné la mort. C'est vers Lui que sera la résurrection.",
    side: "right", order: 5, category: "daily",
  },
  {
    label: "En entrant à la mosquée",
    arabic: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
    french: "Ô Allah, ouvre-moi les portes de Ta miséricorde.",
    side: "right", order: 6, category: "daily",
  },
  {
    label: "En sortant de la mosquée",
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ",
    french: "Ô Allah, je Te demande de Ta générosité.",
    side: "right", order: 7, category: "daily",
  },
  {
    label: "Pendant la pluie",
    arabic: "اللَّهُمَّ صَيِّبًا نَافِعًا",
    french: "Ô Allah, fais en sorte que ce soit une pluie bénéfique.",
    side: "right", order: 8, category: "daily",
  },
  {
    label: "Dua de Yunus ﷺ (Coran 21:87)",
    arabic: "لاَ إِلَهَ إِلاَّ أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ",
    french: "Il n'y a de divinité que Toi, Gloire à Toi ! En vérité, j'ai été parmi les injustes.",
    side: "right", order: 9, category: "daily",
  },
  {
    label: "Hasbiya Allah (Coran 9:129)",
    arabic: "حَسْبِيَ اللَّهُ لاَ إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ",
    french: "Allah me suffit. Il n'y a de divinité qu'Il. En Lui je mets ma confiance. Il est le Seigneur du Trône immense.",
    side: "right", order: 10, category: "daily",
  },
  {
    label: "Salat sur le Prophète ﷺ",
    arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ",
    french: "Ô Allah, bénis Muhammad et la famille de Muhammad, comme Tu as béni Ibrahim et la famille d'Ibrahim.",
    side: "right", order: 11, category: "daily",
  },
  {
    label: "Pour les malades",
    arabic: "اللَّهُمَّ رَبَّ النَّاسِ أَذْهِبِ الْبَأْسَ اشْفِ أَنْتَ الشَّافِي لاَ شِفَاءَ إِلاَّ شِفَاؤُكَ شِفَاءً لاَ يُغَادِرُ سَقَمًا",
    french: "Ô Allah, Seigneur des gens, éloigne la souffrance. Guéris car Tu es le Guérisseur. Il n'y a de guérison que la Tienne, une guérison qui ne laisse aucune maladie.",
    side: "right", order: 12, category: "daily",
  },
  {
    label: "Dua al-Qunoot",
    arabic: "اللَّهُمَّ اهْدِنِي فِيمَنْ هَدَيْتَ وَعَافِنِي فِيمَنْ عَافَيْتَ وَتَوَلَّنِي فِيمَنْ تَوَلَّيْتَ",
    french: "Ô Allah, guide-moi parmi ceux que Tu as guidés, préserve-moi parmi ceux que Tu as préservés, et prends soin de moi parmi ceux dont Tu as pris soin.",
    side: "right", order: 13, category: "daily",
  },
  {
    label: "En entrant chez soi",
    arabic: "بِسْمِ اللَّهِ وَلَجْنَا وَبِسْمِ اللَّهِ خَرَجْنَا وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا",
    french: "Au nom d'Allah nous sommes entrés, au nom d'Allah nous sommes sortis, et en Allah notre Seigneur nous avons mis notre confiance.",
    side: "right", order: 14, category: "daily",
  },
  {
    label: "Istighfar puissant",
    arabic: "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لاَ إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ",
    french: "Je demande pardon à Allah le Très Grand, en dehors de qui il n'y a pas de divinité, le Vivant, l'Éternel, et je me repens auprès de Lui.",
    side: "right", order: 15, category: "daily",
  },

  // ═══════════════════════════════════════════════════════════
  // CATÉGORIE : RAMADAN — 15 invocations
  // ═══════════════════════════════════════════════════════════
  {
    label: "Dou'â pour le début du Ramadan",
    arabic: "اللَّهُمَّ بَارِكْ لَنَا فِي رَجَبٍ وَشَعْبَانَ وَبَلِّغْنَا رَمَضَانَ",
    french: "Ô Allah, bénis-nous en Rajab et Sha'ban, et fais-nous atteindre Ramadan.",
    side: "left", order: 1, category: "ramadan",
  },
  {
    label: "Invocation pour le jeûne",
    arabic: "اللَّهُمَّ لَكَ صُمْتُ وَبِكَ آمَنْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ",
    french: "Ô Allah, c'est pour Toi que j'ai jeûné, en Toi j'ai cru, et sur Ta provision je romps mon jeûne.",
    side: "left", order: 2, category: "ramadan",
  },
  {
    label: "Dou'â de Laylat al-Qadr",
    arabic: "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي",
    french: "Ô Allah, Tu es Celui qui pardonne, Tu aimes le pardon, alors pardonne-moi.",
    side: "left", order: 3, category: "ramadan",
  },
  {
    label: "Invocation pour la rupture du jeûne",
    arabic: "ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الأَجْرُ إِنْ شَاءَ اللَّهُ",
    french: "La soif est étanchée, les veines sont humides, et la récompense est acquise, inshallah.",
    side: "right", order: 1, category: "ramadan",
  },
  {
    label: "Dou'â pour la famille en Ramadan",
    arabic: "اللَّهُمَّ أَعِزَّ الإِسْلاَمَ وَالمُسْلِمِينَ وَاجْعَلْنَا مِنَ الصَّائِمِينَ وَالْقَائِمِينَ",
    french: "Ô Allah, honore l'Islam et les musulmans, et fais-nous parmi ceux qui jeûnent et prient.",
    side: "right", order: 2, category: "ramadan",
  },
  {
    label: "Invocation pour le Tarawih",
    arabic: "سُبْحَانَ ذِي الْمُلْكِ وَالْمَلَكُوتِ",
    french: "Gloire au Possesseur du règne et de la souveraineté.",
    side: "left", order: 4, category: "ramadan",
  },
  {
    label: "Dou'â pour le pardon",
    arabic: "اللَّهُمَّ إِنَّكَ عَفُوٌّ كَرِيمٌ تُحِبُّ الْعَفْوَ فَاعْفُ عَنَّا",
    french: "Ô Allah, Tu es Celui qui pardonne, le Noble, Tu aimes le pardon, alors pardonne-nous.",
    side: "right", order: 3, category: "ramadan",
  },
  {
    label: "Invocation pour les défunts",
    arabic: "اللَّهُمَّ اغْفِرْ لِلْمُؤْمِنِينَ وَالْمُؤْمِنَاتِ الأَحْيَاءِ مِنْهُمْ وَالأَمْوَاتِ",
    french: "Ô Allah, pardonne aux croyants et croyantes, parmi eux les vivants et les morts.",
    side: "left", order: 5, category: "ramadan",
  },
  {
    label: "Dou'â pour la fin du Ramadan",
    arabic: "اللَّهُمَّ تَقَبَّلْ مِنَّا صِيَامَنَا وَقِيَامَنَا وَتَقَبَّلْ مِنَّا الصَّالِحَاتِ",
    french: "Ô Allah, accepte de nous notre jeûne, notre prière nocturne, et accepte nos bonnes œuvres.",
    side: "right", order: 4, category: "ramadan",
  },
  {
    label: "Invocation pour l'Aïd",
    arabic: "اللَّهُمَّ أَعِزَّ الإِسْلاَمَ وَالمُسْلِمِينَ وَأَذِلَّ الشِّرْكَ وَالمُشْرِكِينَ",
    french: "Ô Allah, honore l'Islam et les musulmans, et humilie le polythéisme et les polythéistes.",
    side: "left", order: 6, category: "ramadan",
  },

  // ═══════════════════════════════════════════════════════════
  // CATÉGORIE : EID_EL_FITR — 12 invocations
  // ═══════════════════════════════════════════════════════════
  {
    label: "Takbirat al-Eid",
    arabic: "اللَّهُ أَكْبَرُ اللَّهُ أَكْبَرُ اللَّهُ أَكْبَرُ لاَ إِلَهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ اللَّهُ أَكْبَرُ وَلِلَّهِ الْحَمْدُ",
    french: "Allah est le plus Grand, Allah est le plus Grand, Allah est le plus Grand. Il n'y a de divinité qu'Allah. Allah est le plus Grand, Allah est le plus Grand, et à Allah toute louange.",
    side: "left", order: 1, category: "eid_el_fitr",
  },
  {
    label: "Invocation de l'Aïd El Fitr",
    arabic: "اللَّهُمَّ أَعِزَّ الإِسْلاَمَ وَالمُسْلِمِينَ وَأَذِلَّ الشِّرْكَ وَالمُشْرِكِينَ وَدَمِّرْ أَعْدَاءَ الدِّينِ",
    french: "Ô Allah, honore l'Islam et les musulmans, humilie le polythéisme et les polythéistes, et anéantis les ennemis de la religion.",
    side: "left", order: 2, category: "eid_el_fitr",
  },
  {
    label: "Dou'â de gratitude",
    arabic: "اللَّهُمَّ تَقَبَّلْ مِنَّا صِيَامَنَا وَقِيَامَنَا وَرُكُوعَنَا وَسُجُودَنَا",
    french: "Ô Allah, accepte de nous notre jeûne, notre prière nocturne, nos prosternations et nos génuflexions.",
    side: "left", order: 3, category: "eid_el_fitr",
  },
  {
    label: "Pour la communauté musulmane",
    arabic: "اللَّهُمَّ أَجْمَعْنَا وَأَجْمَعْ شَمْلَنَا وَأَصْلِحْ ذَاتَ بَيْنِنَا",
    french: "Ô Allah, rassemble-nous, réunis notre communauté, et réconcilie-nous entre nous.",
    side: "left", order: 4, category: "eid_el_fitr",
  },
  {
    label: "Pour les enfants et la famille",
    arabic: "اللَّهُمَّ بَارِكْ لَنَا فِي أَهْلِنَا وَذُرِّيَّاتِنَا وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا",
    french: "Ô Allah, bénis nos familles et nos descendants, et fais-nous des modèles pour les pieux.",
    side: "right", order: 1, category: "eid_el_fitr",
  },
  {
    label: "Pour les nécessiteux",
    arabic: "اللَّهُمَّ أَعْطِ كُلَّ مَنْ سَأَلَنَا مِنْ فَضْلِكَ وَلاَ تَرُدَّ يَدَ سَائِلٍ خَائِبَةً",
    french: "Ô Allah, donne à tous ceux qui nous demandent de Ta générosité, et ne laisse pas la main d'un mendiant revenir vide.",
    side: "right", order: 2, category: "eid_el_fitr",
  },
  {
    label: "Pour la paix mondiale",
    arabic: "اللَّهُمَّ اجْعَلْ هَذَا الْبَلَدَ آمِنًا وَارْزُقْ أَهْلَهُ مِنَ الثَّمَرَاتِ",
    french: "Ô Allah, rends ce pays sûr et accorde à ses habitants des fruits de toute sorte.",
    side: "right", order: 3, category: "eid_el_fitr",
  },
  {
    label: "Pour la santé et la prospérité",
    arabic: "اللَّهُمَّ إِنَّا نَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا طَيِّبًا وَعَمَلًا مُتَقَبَّلًا",
    french: "Ô Allah, nous Te demandons un savoir bénéfique, une subsistance pure et une œuvre acceptée.",
    side: "right", order: 4, category: "eid_el_fitr",
  },
  {
    label: "Pour les défunts",
    arabic: "اللَّهُمَّ اغْفِرْ لِلْمُؤْمِنِينَ وَالْمُؤْمِنَاتِ الأَحْيَاءِ مِنْهُمْ وَالأَمْوَاتِ",
    french: "Ô Allah, pardonne aux croyants et croyantes, parmi eux les vivants et les morts.",
    side: "left", order: 5, category: "eid_el_fitr",
  },
  {
    label: "Pour la protection",
    arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
    french: "Je cherche refuge dans les paroles parfaites d'Allah contre le mal de ce qu'Il a créé.",
    side: "right", order: 5, category: "eid_el_fitr",
  },
  {
    label: "Pour l'unité de la Oumma",
    arabic: "وَاعْتَصِمُواْ بِحَبْلِ اللَّهِ جَمِيعًا وَلاَ تَفَرَّقُواْ",
    french: "Et cramponnez-vous tous ensemble à la corde d'Allah, et ne vous divisez pas. (Coran 3:103)",
    side: "left", order: 6, category: "eid_el_fitr",
  },
  {
    label: "Salat al-Eid",
    arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ",
    french: "Ô Allah, bénis Muhammad et la famille de Muhammad, comme Tu as béni Ibrahim et la famille d'Ibrahim. Tu es certes Dignes de louange et Majestueux.",
    side: "right", order: 6, category: "eid_el_fitr",
  },
    // ═══════════════════════════════════════════════════════════
  // CATÉGORIE : ASHOURA — 10 invocations
  // ═══════════════════════════════════════════════════════════
  {
    label: "Invocation de jeûne d'Ashoura",
    arabic: "اللَّهُمَّ إِنِّي صُمْتُ يَوْمَ عَاشُورَاءَ لِلَّهِ تَعَالَى فَتَقَبَّلْ مِنِّي",
    french: "Ô Allah, j'ai jeûné le jour d'Ashoura pour Allah le Très Haut, alors accepte de moi.",
    side: "left", order: 1, category: "ashoura",
  },
  {
    label: "Dou'â pour la protection du Prophète Moussa",
    arabic: "اللَّهُمَّ نَجِّنِي مِنَ الظَّالِمِينَ كَمَا نَجَّيْتَ مُوسَى مِنْ فِرْعَوْنَ",
    french: "Ô Allah, sauve-moi des oppresseurs comme Tu as sauvé Moussa de Pharaon.",
    side: "left", order: 2, category: "ashoura",
  },
  {
    label: "Invocation de gratitude pour la délivrance",
    arabic: "اللَّهُمَّ لَكَ الْحَمْدُ كَمَا نَجَّيْتَ بَنِي إِسْرَائِيلَ مِنَ الْبَحْرِ",
    french: "Ô Allah, à Toi la louange comme Tu as sauvé les enfants d'Israël de la mer.",
    side: "left", order: 3, category: "ashoura",
  },
  {
    label: "Pour le pardon des péchés passés",
    arabic: "اللَّهُمَّ اغْفِرْ لِي مَا تَقَدَّمَ مِنْ ذَنْبِي وَمَا تَأَخَّرَ وَمَا أَسْرَرْتُ وَمَا أَعْلَنْتُ",
    french: "Ô Allah, pardonne-moi mes péchés passés et futurs, ceux que j'ai cachés et ceux que j'ai rendus publics.",
    side: "left", order: 4, category: "ashoura",
  },
  {
    label: "Pour la santé et la guérison",
    arabic: "اللَّهُمَّ اشْفِنِي وَعَافِنِي فِي بَدَنِي وَسَمْعِي وَبَصَرِي",
    french: "Ô Allah, guéris-moi et accorde-moi la santé dans mon corps, mon ouïe et ma vue.",
    side: "left", order: 5, category: "ashoura",
  },
  {
    label: "Pour la subsistance et le rizq",
    arabic: "اللَّهُمَّ ارْزُقْنِي رِزْقًا حَلَالًا طَيِّبًا وَبَارِكْ لِي فِيهِ",
    french: "Ô Allah, accorde-moi une subsistance licite et pure, et bénis-la pour moi.",
    side: "right", order: 1, category: "ashoura",
  },
  {
    label: "Pour la patience et la persévérance",
    arabic: "اللَّهُمَّ أَعِنِّي عَلَى الصَّبْرِ وَالثَّبَاتِ كَمَا صَبَرَ مُوسَى عَلَيْهِ السَّلاَمُ",
    french: "Ô Allah, aide-moi à être patient et persévérant comme l'a été Moussa, paix sur lui.",
    side: "right", order: 2, category: "ashoura",
  },
  {
    label: "Pour la victoire sur les oppresseurs",
    arabic: "اللَّهُمَّ انْصُرْنِي عَلَى مَنْ ظَلَمَنِي كَمَا نَصَرْتَ مُوسَى عَلَى فِرْعَوْنَ",
    french: "Ô Allah, accorde-moi la victoire sur ceux qui m'oppriment comme Tu as accordé la victoire à Moussa sur Pharaon.",
    side: "right", order: 3, category: "ashoura",
  },
  {
    label: "Pour la famille et les proches",
    arabic: "اللَّهُمَّ بَارِكْ لِي فِي أَهْلِي وَذُرِّيَّتِي وَاجْعَلْنَا مِنَ الصَّابِرِينَ",
    french: "Ô Allah, bénis ma famille et mes descendants, et fais-nous parmi les patients.",
    side: "right", order: 4, category: "ashoura",
  },
  {
    label: "Dou'â de clôture du jeûne",
    arabic: "اللَّهُمَّ تَقَبَّلْ صِيَامِي وَقِيَامِي وَاجْعَلْنِي مِنَ الْمُتَقِّينَ",
    french: "Ô Allah, accepte mon jeûne et ma prière nocturne, et fais-moi parmi les pieux.",
    side: "right", order: 5, category: "ashoura",
  },
];

export async function POST() {
  try {
    // Supprimer toutes les invocations existantes
    await prisma.invocation.deleteMany();

    // Créer les nouvelles invocations
    const created = await prisma.invocation.createMany({
      data: INVOCATIONS,
    });

    return NextResponse.json({
      success: true,
      message: `${created.count} invocations initialisées avec succès`,
      count: created.count,
      categories: {
        daily: INVOCATIONS.filter(i => i.category === "daily").length,
        ramadan: INVOCATIONS.filter(i => i.category === "ramadan").length,
        eid_el_fitr: INVOCATIONS.filter(i => i.category === "eid_el_fitr").length,
        ashoura: INVOCATIONS.filter(i => i.category === "ashoura").length,    
      },
    });
  } catch (error) {
    console.error("Erreur lors de l'initialisation des invocations:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de l'initialisation des invocations" },
      { status: 500 }
    );
  }
}