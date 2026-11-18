import type { LocalizedText } from '../types';

export interface Wilayat {
  readonly id: string;
  readonly name: LocalizedText;
}

export interface Governorate {
  readonly id: string;
  readonly name: LocalizedText;
  readonly wilayats: readonly Wilayat[];
}

/** Oman's eleven governorates and their wilayats, in the order used by official listings. */
export const governorates: readonly Governorate[] = [
  {
    id: 'muscat',
    name: { ar: 'مسقط', en: 'Muscat' },
    wilayats: [
      { id: 'muscat', name: { ar: 'مسقط', en: 'Muscat' } },
      { id: 'muttrah', name: { ar: 'مطرح', en: 'Muttrah' } },
      { id: 'bawshar', name: { ar: 'بوشر', en: 'Bawshar' } },
      { id: 'seeb', name: { ar: 'السيب', en: 'As Seeb' } },
      { id: 'amerat', name: { ar: 'العامرات', en: 'Al Amerat' } },
      { id: 'qurayyat', name: { ar: 'قريات', en: 'Qurayyat' } },
    ],
  },
  {
    id: 'dhofar',
    name: { ar: 'ظفار', en: 'Dhofar' },
    wilayats: [
      { id: 'salalah', name: { ar: 'صلالة', en: 'Salalah' } },
      { id: 'taqah', name: { ar: 'طاقة', en: 'Taqah' } },
      { id: 'mirbat', name: { ar: 'مرباط', en: 'Mirbat' } },
      { id: 'rakhyut', name: { ar: 'رخيوت', en: 'Rakhyut' } },
      { id: 'thumrait', name: { ar: 'ثمريت', en: 'Thumrait' } },
      { id: 'dhalkut', name: { ar: 'ضلكوت', en: 'Dhalkut' } },
      { id: 'mazyunah', name: { ar: 'المزيونة', en: 'Al Mazyunah' } },
      { id: 'muqshin', name: { ar: 'مقشن', en: 'Muqshin' } },
      { id: 'shalim', name: { ar: 'شليم وجزر الحلانيات', en: 'Shalim and the Hallaniyat Islands' } },
      { id: 'sadah', name: { ar: 'سدح', en: 'Sadah' } },
    ],
  },
  {
    id: 'musandam',
    name: { ar: 'مسندم', en: 'Musandam' },
    wilayats: [
      { id: 'khasab', name: { ar: 'خصب', en: 'Khasab' } },
      { id: 'dibba', name: { ar: 'دبا', en: 'Dibba' } },
      { id: 'bukha', name: { ar: 'بخا', en: 'Bukha' } },
      { id: 'madha', name: { ar: 'مدحاء', en: 'Madha' } },
    ],
  },
  {
    id: 'buraimi',
    name: { ar: 'البريمي', en: 'Al Buraimi' },
    wilayats: [
      { id: 'buraimi', name: { ar: 'البريمي', en: 'Al Buraimi' } },
      { id: 'mahdah', name: { ar: 'محضة', en: 'Mahdah' } },
      { id: 'sunaynah', name: { ar: 'السنينة', en: 'As Sunaynah' } },
    ],
  },
  {
    id: 'dakhiliyah',
    name: { ar: 'الداخلية', en: 'Ad Dakhiliyah' },
    wilayats: [
      { id: 'nizwa', name: { ar: 'نزوى', en: 'Nizwa' } },
      { id: 'bahla', name: { ar: 'بهلاء', en: 'Bahla' } },
      { id: 'manah', name: { ar: 'منح', en: 'Manah' } },
      { id: 'hamra', name: { ar: 'الحمراء', en: 'Al Hamra' } },
      { id: 'adam', name: { ar: 'أدم', en: 'Adam' } },
      { id: 'izki', name: { ar: 'إزكي', en: 'Izki' } },
      { id: 'samail', name: { ar: 'سمائل', en: 'Samail' } },
      { id: 'bidbid', name: { ar: 'بدبد', en: 'Bidbid' } },
    ],
  },
  {
    id: 'batinah-north',
    name: { ar: 'شمال الباطنة', en: 'Al Batinah North' },
    wilayats: [
      { id: 'sohar', name: { ar: 'صحار', en: 'Sohar' } },
      { id: 'shinas', name: { ar: 'شناص', en: 'Shinas' } },
      { id: 'liwa', name: { ar: 'لوى', en: 'Liwa' } },
      { id: 'saham', name: { ar: 'صحم', en: 'Saham' } },
      { id: 'khaburah', name: { ar: 'الخابورة', en: 'Al Khaburah' } },
      { id: 'suwaiq', name: { ar: 'السويق', en: 'As Suwaiq' } },
    ],
  },
  {
    id: 'batinah-south',
    name: { ar: 'جنوب الباطنة', en: 'Al Batinah South' },
    wilayats: [
      { id: 'rustaq', name: { ar: 'الرستاق', en: 'Ar Rustaq' } },
      { id: 'awabi', name: { ar: 'العوابي', en: 'Al Awabi' } },
      { id: 'nakhal', name: { ar: 'نخل', en: 'Nakhal' } },
      { id: 'wadi-maawil', name: { ar: 'وادي المعاول', en: 'Wadi Al Maawil' } },
      { id: 'barka', name: { ar: 'بركاء', en: 'Barka' } },
      { id: 'musannah', name: { ar: 'المصنعة', en: 'Al Musannah' } },
    ],
  },
  {
    id: 'sharqiyah-south',
    name: { ar: 'جنوب الشرقية', en: 'Ash Sharqiyah South' },
    wilayats: [
      { id: 'sur', name: { ar: 'صور', en: 'Sur' } },
      { id: 'kamil-wafi', name: { ar: 'الكامل والوافي', en: 'Al Kamil Wal Wafi' } },
      { id: 'jalan-bani-bu-hassan', name: { ar: 'جعلان بني بو حسن', en: 'Jalan Bani Bu Hassan' } },
      { id: 'jalan-bani-bu-ali', name: { ar: 'جعلان بني بو علي', en: 'Jalan Bani Bu Ali' } },
      { id: 'masirah', name: { ar: 'مصيرة', en: 'Masirah' } },
    ],
  },
  {
    id: 'sharqiyah-north',
    name: { ar: 'شمال الشرقية', en: 'Ash Sharqiyah North' },
    wilayats: [
      { id: 'ibra', name: { ar: 'إبراء', en: 'Ibra' } },
      { id: 'mudhaybi', name: { ar: 'المضيبي', en: 'Al Mudhaybi' } },
      { id: 'bidiyah', name: { ar: 'بدية', en: 'Bidiyah' } },
      { id: 'qabil', name: { ar: 'القابل', en: 'Al Qabil' } },
      { id: 'wadi-bani-khalid', name: { ar: 'وادي بني خالد', en: 'Wadi Bani Khalid' } },
      { id: 'dima-taiyin', name: { ar: 'دماء والطائيين', en: 'Dima Wa At Taiyin' } },
    ],
  },
  {
    id: 'dhahirah',
    name: { ar: 'الظاهرة', en: 'Ad Dhahirah' },
    wilayats: [
      { id: 'ibri', name: { ar: 'عبري', en: 'Ibri' } },
      { id: 'yanqul', name: { ar: 'ينقل', en: 'Yanqul' } },
      { id: 'dhank', name: { ar: 'ضنك', en: 'Dhank' } },
    ],
  },
  {
    id: 'wusta',
    name: { ar: 'الوسطى', en: 'Al Wusta' },
    wilayats: [
      { id: 'haima', name: { ar: 'هيما', en: 'Haima' } },
      { id: 'duqm', name: { ar: 'الدقم', en: 'Duqm' } },
      { id: 'mahout', name: { ar: 'محوت', en: 'Mahout' } },
      { id: 'jazir', name: { ar: 'الجازر', en: 'Al Jazir' } },
    ],
  },
];

export function findGovernorate(id: string): Governorate | undefined {
  return governorates.find((governorate) => governorate.id === id);
}

export function findWilayat(governorateId: string, wilayatId: string): Wilayat | undefined {
  return findGovernorate(governorateId)?.wilayats.find((wilayat) => wilayat.id === wilayatId);
}
