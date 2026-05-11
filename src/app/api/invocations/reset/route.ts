import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const INVOCATIONS = [
  // ── Côté GAUCHE (français en vedette) ─────────────────────────────────────
  {
    label: "Basmala",
    arabic: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ",
    french: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux.",
    side: "left", order: 1,
  },
  {
    label: "Invocation du matin",
    arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ",
    french: "Ô Allah, c'est grâce à Toi que nous accueillons le matin, c'est par Toi que nous vivons et mourons, et c'est vers Toi que sera la résurrection.",
    side: "left", order: 2,
  },
  {
    label: "Invocation du soir",
    arabic: "اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ",
    french: "Ô Allah, c'est grâce à Toi que nous accueillons le soir, c'est par Toi que nous vivons et mourons, et c'est vers Toi que nous retournons.",
    side: "left", order: 3,
  },
  {
    label: "Avant de manger",
    arabic: "اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ",
    french: "Ô Allah, bénis ce que Tu nous as accordé comme subsistance et préserve-nous du châtiment du Feu.",
    side: "left", order: 4,
  },
  {
    label: "Après manger",
    arabic: "الحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلاَ قُوَّةٍ",
    french: "Louange à Allah qui m'a nourri de ceci et me l'a accordé sans force ni puissance de ma part.",
    side: "left", order: 5,
  },
  {
    label: "En sortant de chez soi",
    arabic: "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ لاَ حَوْلَ وَلاَ قُوَّةَ إِلَّا بِاللَّهِ",
    french: "Au nom d'Allah, je mets ma confiance en Allah. Il n'y a de force et de puissance qu'en Allah.",
    side: "left", order: 6,
  },
  {
    label: "Pour le voyage",
    arabic: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ",
    french: "Gloire à Celui qui nous a soumis cela alors que nous n'en étions pas capables. Et c'est vers notre Seigneur que nous retournerons.",
    side: "left", order: 7,
  },
  {
    label: "Protection contre le mal",
    arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
    french: "Je cherche refuge dans les paroles parfaites d'Allah contre le mal de ce qu'Il a créé.",
    side: "left", order: 8,
  },
  {
    label: "Sayyid al-Istighfar",
    arabic: "اللَّهُمَّ أَنْتَ رَبِّي لاَ إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ",
    french: "Ô Allah, Tu es mon Seigneur. Il n'y a de divinité que Toi. Tu m'as créé et je suis Ton serviteur, fidèle à mon engagement et ma promesse envers Toi.",
    side: "left", order: 9,
  },
  {
    label: "Pour la santé",
    arabic: "اللَّهُمَّ عَافِنِي فِي بَدَنِي اللَّهُمَّ عَافِنِي فِي سَمْعِي اللَّهُمَّ عَافِنِي فِي بَصَرِي",
    french: "Ô Allah, accorde-moi la santé dans mon corps. Ô Allah, accorde-moi la santé dans mon ouïe. Ô Allah, accorde-moi la santé dans ma vue.",
    side: "left", order: 10,
  },
  {
    label: "Pour la guidance (Coran 3:8)",
    arabic: "رَبَّنَا لاَ تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً",
    french: "Notre Seigneur, ne laisse pas nos cœurs dévier après que Tu nous as guidés, et accorde-nous une miséricorde venant de Toi.",
    side: "left", order: 11,
  },
  {
    label: "Pour les parents (Coran 71:28)",
    arabic: "رَّبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَلِمَن دَخَلَ بَيْتِيَ مُؤْمِنًا وَلِلْمُؤْمِنِينَ وَالْمُؤْمِنَاتِ",
    french: "Mon Seigneur, pardonne-moi, à mes parents, et à celui qui entre dans ma maison croyant, ainsi qu'aux croyants et croyantes.",
    side: "left", order: 12,
  },
  {
    label: "Tahlil — Unicité d'Allah",
    arabic: "لاَ إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
    french: "Il n'y a de divinité qu'Allah, seul, sans associé. À Lui le règne et la louange. Il est Omnipotent.",
    side: "left", order: 13,
  },
  {
    label: "Pour la subsistance (rizq)",
    arabic: "اللَّهُمَّ اكْفِنِي بِحَلاَلِكَ عَنْ حَرَامِكَ وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ",
    french: "Ô Allah, rends-moi suffisant par ce que Tu as rendu licite, sans avoir besoin de l'illicite, et enrichis-moi par Ta générosité sans dépendre d'autrui.",
    side: "left", order: 14,
  },
  {
    label: "Kafarat al-Majlis",
    arabic: "سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ أَشْهَدُ أَنْ لاَ إِلَهَ إِلاَّ أَنْتَ أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ",
    french: "Gloire à Toi ô Allah et Ta louange. J'atteste qu'il n'y a de divinité que Toi. Je Te demande pardon et me repens auprès de Toi.",
    side: "left", order: 15,
  },

  // ── Côté DROIT (arabe en vedette) ─────────────────────────────────────────
  {
    label: "Ayat al-Kursi (Coran 2:255)",
    arabic: "اللَّهُ لاَ إِلَهَ إِلاَّ هُوَ الْحَيُّ الْقَيُّومُ لاَ تَأْخُذُهُ سِنَةٌ وَلاَ نَوْمٌ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الأَرْضِ",
    french: "Allah — il n'y a de Divinité que Lui, le Vivant, Celui qui subsiste par Lui-même. Ni somnolence ni sommeil ne Le saisissent. À Lui appartient tout ce qui est dans les cieux et sur terre.",
    side: "right", order: 1,
  },
  {
    label: "Al-Fatiha (Coran 1:2-4)",
    arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ مَـٰلِكِ يَوْمِ ٱلدِّينِ",
    french: "Louange à Allah, Seigneur de l'univers. Le Tout Miséricordieux, le Très Miséricordieux. Maître du Jour de la rétribution.",
    side: "right", order: 2,
  },
  {
    label: "Subhanallah al-'Azim",
    arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ سُبْحَانَ اللَّهِ الْعَظِيمِ",
    french: "Gloire à Allah et Sa louange. Gloire à Allah le Très Grand.",
    side: "right", order: 3,
  },
  {
    label: "Avant de dormir",
    arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    french: "En Ton nom, ô Allah, je meurs et je vis.",
    side: "right", order: 4,
  },
  {
    label: "Au réveil",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
    french: "Louange à Allah qui nous a redonné la vie après nous avoir donné la mort. C'est vers Lui que sera la résurrection.",
    side: "right", order: 5,
  },
  {
    label: "En entrant à la mosquée",
    arabic: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
    french: "Ô Allah, ouvre-moi les portes de Ta miséricorde.",
    side: "right", order: 6,
  },
  {
    label: "En sortant de la mosquée",
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ",
    french: "Ô Allah, je Te demande de Ta générosité.",
    side: "right", order: 7,
  },
  {
    label: "Pendant la pluie",
    arabic: "اللَّهُمَّ صَيِّبًا نَافِعًا",
    french: "Ô Allah, fais en sorte que ce soit une pluie bénéfique.",
    side: "right", order: 8,
  },
  {
    label: "Dua de Yunus ﷺ (Coran 21:87)",
    arabic: "لاَ إِلَهَ إِلاَّ أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ",
    french: "Il n'y a de divinité que Toi, Gloire à Toi ! En vérité, j'ai été parmi les injustes.",
    side: "right", order: 9,
  },
  {
    label: "Hasbiya Allah (Coran 9:129)",
    arabic: "حَسْبِيَ اللَّهُ لاَ إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ",
    french: "Allah me suffit. Il n'y a de divinité qu'Il. En Lui je mets ma confiance. Il est le Seigneur du Trône immense.",
    side: "right", order: 10,
  },
  {
    label: "Salat sur le Prophète ﷺ",
    arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ",
    french: "Ô Allah, bénis Muhammad et la famille de Muhammad, comme Tu as béni Ibrahim et la famille d'Ibrahim.",
    side: "right", order: 11,
  },
  {
    label: "Pour les malades",
    arabic: "اللَّهُمَّ رَبَّ النَّاسِ أَذْهِبِ الْبَأْسَ اشْفِ أَنْتَ الشَّافِي لاَ شِفَاءَ إِلاَّ شِفَاؤُكَ شِفَاءً لاَ يُغَادِرُ سَقَمًا",
    french: "Ô Allah, Seigneur des gens, éloigne la souffrance. Guéris car Tu es le Guérisseur. Il n'y a de guérison que la Tienne, une guérison qui ne laisse aucune maladie.",
    side: "right", order: 12,
  },
  {
    label: "Dua al-Qunoot",
    arabic: "اللَّهُمَّ اهْدِنِي فِيمَنْ هَدَيْتَ وَعَافِنِي فِيمَنْ عَافَيْتَ وَتَوَلَّنِي فِيمَنْ تَوَلَّيْتَ",
    french: "Ô Allah, guide-moi parmi ceux que Tu as guidés, préserve-moi parmi ceux que Tu as préservés, et prends soin de moi parmi ceux dont Tu as pris soin.",
    side: "right", order: 13,
  },
  {
    label: "En entrant chez soi",
    arabic: "بِسْمِ اللَّهِ وَلَجْنَا وَبِسْمِ اللَّهِ خَرَجْنَا وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا",
    french: "Au nom d'Allah nous sommes entrés, au nom d'Allah nous sommes sortis, et en Allah notre Seigneur nous avons mis notre confiance.",
    side: "right", order: 14,
  },
  {
    label: "Istighfar puissant",
    arabic: "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لاَ إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ",
    french: "Je demande pardon à Allah le Très Grand, en dehors de qui il n'y a pas de divinité, le Vivant, l'Éternel, et je me repens auprès de Lui.",
    side: "right", order: 15,
  },
];

export async function POST() {
  try {
    // Delete existing invocations and re-seed
    await prisma.invocation.deleteMany();

    const created = await prisma.invocation.createMany({
      data: INVOCATIONS.map((inv) => ({ ...inv, active: true })),
    });

    return NextResponse.json({
      success: true,
      count: created.count,
      message: `${created.count} invocations insérées avec succès`,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur lors du seeding" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const count = await prisma.invocation.count();
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
