import type { Locale, LocalizedText, Product } from '../types';

export const copy = {
  nav: {
    label: { ar: 'التنقل الرئيسي', en: 'Main navigation' },
    collection: { ar: 'المجموعة', en: 'Collection' },
    about: { ar: 'قصّتنا', en: 'Our story' },
    service: { ar: 'الخدمة', en: 'Service' },
    craft: { ar: 'الحرفة', en: 'Atelier' },
  },
  header: {
    skip: { ar: 'تخطّي إلى المحتوى', en: 'Skip to content' },
    menuOpen: { ar: 'فتح القائمة', en: 'Open menu' },
    menuClose: { ar: 'إغلاق القائمة', en: 'Close menu' },
    bag: { ar: 'فتح الحقيبة', en: 'Open bag' },
    language: { ar: 'English', en: 'العربية' },
  },
  hero: {
    title: { ar: 'ألوانٌ لها حضور', en: 'Colour, with presence' },
    action: { ar: 'اكتشفي المجموعة الأولى', en: 'Discover the first collection' },
    imageAlt: {
      ar: 'امرأة عمانية ترتدي عباية بلون الرمان مع تطريز نحاسي في فناء دافئ',
      en: 'Omani woman in a pomegranate abaya with copper embroidery in a warm courtyard',
    },
  },
  collection: {
    title: { ar: 'المجموعة الأولى', en: 'The first collection' },
    secondary: { ar: 'ألوان مستوحاة من أرض عُمان، بقصّات تعيش اليوم.', en: 'Colours drawn from Oman, cut for the present.' },
    body: {
      ar: 'ثلاث قطع، لكل واحدة حضورها. حرير كريب منسدل، تطريز يدوي، وتفاصيل لا تظهر دفعة واحدة.',
      en: 'Three pieces, each with its own presence. Fluid silk crepe, hand embroidery and details that reveal themselves slowly.',
    },
    productAction: { ar: 'تفاصيل القطعة', en: 'View details' },
    all: { ar: 'اكتشفي جميع القطع', en: 'Explore every piece' },
    goTo: { ar: 'اذهبي إلى', en: 'Go to' },
  },
  craft: {
    title: { ar: 'تفاصيل تُرى وتُحس', en: 'Detail, seen and felt' },
    body: {
      ar: 'يبدأ كل تصميم بخط واضح، ثم تمنحه الخامة حركته، وتمنحه اليد شخصيته.',
      en: 'Each design begins with a clear line. Fabric gives it movement; the hand gives it character.',
    },
    imageAlt: {
      ar: 'تطريز يدوي بخيط نحاسي على قماش بلون الرمان',
      en: 'Copper-thread hand embroidery on pomegranate fabric',
    },
  },
  story: {
    title: { ar: 'من عُمان، للعالم', en: 'From Oman, to the world' },
    body: {
      ar: 'MB Design دار أزياء عمانية معاصرة. نعيد النظر في العباية كقطعة تعبّر عن المرأة، لا كزيّ يختصرها.',
      en: 'MB Design is a contemporary Omani fashion house. We see the abaya as an expression of the woman, never a definition of her.',
    },
    action: { ar: 'اقرئي قصّتنا', en: 'Read our story' },
    imageAlt: {
      ar: 'امرأة عمانية تمشي بعباية قرفة منسدلة أمام جدار دافئ',
      en: 'Omani woman walking in a flowing cinnamon abaya against a warm wall',
    },
  },
  services: [
    {
      id: 'delivery',
      title: { ar: 'توصيل داخل عُمان', en: 'Delivery in Oman' },
      body: { ar: 'الموعد النهائي يُعتمد قبل الإطلاق', en: 'Final timing to be confirmed before launch' },
    },
    {
      id: 'alterations',
      title: { ar: 'ضبط المقاس', en: 'Made to fit' },
      body: { ar: 'خدمة التعديل تُعتمد مع العيّنات', en: 'Alterations to be confirmed with final samples' },
    },
    {
      id: 'whatsapp',
      title: { ar: 'خدمة شخصية', en: 'Personal service' },
      body: { ar: 'قناة واتساب بانتظار التفعيل', en: 'WhatsApp channel pending activation' },
    },
  ],
  product: {
    size: { ar: 'المقاس', en: 'Size' },
    chooseSize: { ar: 'اختاري المقاس أولاً', en: 'Choose a size first' },
    customFit: {
      action: { ar: 'خصّصي هذا المقاس', en: 'Customise this size' },
      remove: { ar: 'إلغاء التعديلات', en: 'Remove adjustments' },
      title: { ar: 'تعديلات بسيطة', en: 'Simple adjustments' },
      intro: {
        ar: 'يبقى المقاس المختار هو الأساس. أضيفي فقط التعديلات التي تحتاجينها.',
        en: 'Your selected size remains the base. Add only the adjustments you need.',
      },
      length: { ar: 'الطول الكامل', en: 'Overall length' },
      lengthHelp: {
        ar: 'من أعلى الكتف إلى الطول المطلوب.',
        en: 'Measure from the shoulder to the desired hem.',
      },
      sleeve: { ar: 'طول الكم', en: 'Sleeve length' },
      sleeveHelp: {
        ar: 'من نقطة الكتف إلى المعصم.',
        en: 'Measure from the shoulder point to the wrist.',
      },
      bodyFit: { ar: 'اتساع القصّة', en: 'Body fit' },
      bodyFitHelp: {
        ar: 'حافظي على القصّة الأصلية أو اختاري اتساعاً أكبر.',
        en: 'Keep the original cut or allow more room.',
      },
      standard: { ar: 'أساسي', en: 'Standard' },
      relaxed: { ar: 'أوسع', en: 'Relaxed' },
      unit: { ar: 'سم', en: 'cm' },
      addOne: { ar: 'أضيفي تعديلاً واحداً على الأقل.', en: 'Add at least one adjustment.' },
      cartLabel: { ar: 'تعديلات المقاس', en: 'Custom adjustments' },
    },
    add: { ar: 'أضيفي إلى الحقيبة', en: 'Add to bag' },
    specifications: { ar: 'مواصفات القطعة', en: 'Product specifications' },
    fabric: { ar: 'الخامة', en: 'Fabric' },
    availableSizes: { ar: 'المقاسات المتاحة', en: 'Available sizes' },
    cut: { ar: 'القصّة', en: 'Cut' },
    signature: { ar: 'التفصيل المميّز', en: 'Signature detail' },
    details: { ar: 'التصميم والخامة', en: 'Design and fabric' },
    fit: { ar: 'المقاس والقصّة', en: 'Size and cut' },
    fitBody: {
      ar: 'قصّة منسدلة بطول كامل. يُضاف دليل المقاسات النهائي بعد اعتماد العيّنات.',
      en: 'A full-length fluid cut. Final sizing guidance will follow sample approval.',
    },
    delivery: { ar: 'التوصيل والإرجاع', en: 'Delivery and returns' },
    deliveryBody: {
      ar: 'السياسة النهائية بانتظار اعتماد التشغيل قبل الإطلاق.',
      en: 'The final policy awaits operational approval before launch.',
    },
    close: { ar: 'إغلاق تفاصيل القطعة', en: 'Close product details' },
  },
  cart: {
    title: { ar: 'الحقيبة', en: 'Bag' },
    close: { ar: 'إغلاق الحقيبة', en: 'Close bag' },
    empty: { ar: 'حقيبتك هادئة الآن.', en: 'Your bag is quiet for now.' },
    emptyBody: {
      ar: 'تصفّحي المجموعة الأولى وأضيفي القطعة التي تناسبك.',
      en: 'Browse the first collection and add the piece that suits you.',
    },
    remove: { ar: 'إزالة', en: 'Remove' },
    decrease: { ar: 'تقليل الكمية', en: 'Decrease quantity' },
    increase: { ar: 'زيادة الكمية', en: 'Increase quantity' },
    total: { ar: 'المجموع', en: 'Total' },
    checkout: { ar: 'إكمال البيانات', en: 'Continue' },
    back: { ar: 'العودة إلى الحقيبة', en: 'Back to bag' },
    previewNote: {
      ar: 'تجربة واجهة فقط. لا تُرسل الطلبات في هذه النسخة.',
      en: 'Storefront preview only. Orders are not sent in this build.',
    },
  },
  checkout: {
    title: { ar: 'بيانات الطلب التجريبي', en: 'Preview order details' },
    name: { ar: 'الاسم', en: 'Name' },
    mobile: { ar: 'رقم الهاتف', en: 'Mobile number' },
    area: { ar: 'الولاية', en: 'Area' },
    address: { ar: 'عنوان التوصيل', en: 'Delivery address' },
    submit: { ar: 'حفظ الطلب التجريبي', en: 'Save preview order' },
    confirmedTitle: { ar: 'تم حفظ الطلب التجريبي', en: 'Preview order saved' },
    confirmedBody: {
      ar: 'لم يُرسل أي طلب ولم يُسجَّل أي دفع. هذه تجربة واجهة فقط.',
      en: 'No order was sent and no payment was taken. This is a storefront preview only.',
    },
  },
  preview: {
    title: { ar: 'نسخة تطويرية', en: 'Development preview' },
    body: {
      ar: 'التصاميم والأسعار والصور مفاهيم إطلاق، وتحتاج اعتماد العيّنات والتصوير النهائي قبل البيع.',
      en: 'Designs, prices and imagery are launch concepts requiring final samples and photography before sale.',
    },
  },
  footer: {
    statement: {
      ar: 'دار أزياء عمانية معاصرة. لون محسوب، خط واضح، وحضور لا يتكلّف.',
      en: 'A contemporary Omani fashion house. Considered colour, a clear line and effortless presence.',
    },
    navLabel: { ar: 'روابط الأقسام', en: 'Section links' },
    rights: { ar: 'جميع الحقوق محفوظة', en: 'All rights reserved' },
  },
} as const;

export const products: readonly Product[] = [
  {
    id: 'joud',
    name: { ar: 'جود', en: 'Joud' },
    priceOmr: 165,
    image: '/assets/collection-v2/joud-jade.webp',
    imageAlt: {
      ar: 'عباية جود بلون اليشم مع تطريز وخطوط نحاسية',
      en: 'Joud jade abaya with copper piping and embroidery',
    },
    imagePosition: '50% 40%',
    description: {
      ar: 'يشم عميق بخط نحاسي واحد يطيل القصّة ويترك للأكمام حركتها.',
      en: 'Deep jade, defined by one copper line and sleeves cut to move.',
    },
    details: {
      ar: 'حرير كريب منسدل، حواف نحاسية، وتطريز سعف ناعم على الأكمام.',
      en: 'Fluid silk crepe, copper edging and restrained palm-frond embroidery at the cuffs.',
    },
    fabric: { ar: 'حرير كريب منسدل', en: 'Fluid silk crepe' },
    cut: { ar: 'قصّة انسيابية بخط نحاسي طولي', en: 'Fluid cut with a single vertical copper line' },
    signature: { ar: 'تطريز سعف ناعم عند الأكمام', en: 'Restrained palm-frond cuff embroidery' },
    colorHex: '#155C55',
    sizes: ['52', '54', '56', '58'],
  },
  {
    id: 'shams',
    name: { ar: 'شمس', en: 'Shams' },
    priceOmr: 175,
    image: '/assets/collection-v2/shams-saffron.webp',
    imageAlt: {
      ar: 'عباية شمس بلون الزعفران مع بطانة رمانية',
      en: 'Shams saffron abaya with pomegranate lining',
    },
    imagePosition: '50% 40%',
    description: {
      ar: 'قرفة مضيئة وبطانة رمانية تظهر مع الخطوة، لا قبلها.',
      en: 'Luminous cinnamon with a pomegranate lining revealed in motion.',
    },
    details: {
      ar: 'حرير كريب لامع بخفة، أكمام واسعة، وتطريز هندسي متناغم مع اللون.',
      en: 'Lightly lustrous silk crepe, generous sleeves and tonal geometric embroidery.',
    },
    fabric: { ar: 'حرير كريب بلمعة خفيفة', en: 'Lightly lustrous silk crepe' },
    cut: { ar: 'قصّة منسدلة بأكمام واسعة', en: 'Fluid cut with generous sleeves' },
    signature: { ar: 'بطانة رمانية وتطريز هندسي متناغم', en: 'Pomegranate lining with tonal geometric embroidery' },
    colorHex: '#C06F27',
    groundHex: '#7E4412',   // 7.38:1 with pearl; the swatch itself is 3.62:1
    sizes: ['52', '54', '56', '58'],
  },
  {
    id: 'layan',
    name: { ar: 'ليان', en: 'Layan' },
    priceOmr: 180,
    image: '/assets/collection-v2/layan-plum.webp',
    imageAlt: {
      ar: 'عباية ليان بلون البرقوق مع بطانة وتطريز رماني',
      en: 'Layan plum abaya with pomegranate panels and embroidery',
    },
    imagePosition: '50% 40%',
    description: {
      ar: 'برقوق داكن بطبقات رمانية وخط كتف مفصّل كالمعطف.',
      en: 'Dark plum, layered with pomegranate and tailored like a light coat.',
    },
    details: {
      ar: 'حرير كريب ثقيل، ياقة مفتوحة، حواف نحاسية، وتطريز نباتي رماني.',
      en: 'Weighted silk crepe, an open lapel, copper edging and pomegranate botanical embroidery.',
    },
    fabric: { ar: 'حرير كريب ثقيل', en: 'Weighted silk crepe' },
    cut: { ar: 'قصّة مفصّلة كالمعطف بياقة مفتوحة', en: 'Coat-inspired tailoring with an open lapel' },
    signature: { ar: 'طبقات رمانية وتطريز نباتي', en: 'Pomegranate layers with botanical embroidery' },
    colorHex: '#3A1934',
    sizes: ['52', '54', '56', '58'],
  },
];

export function localize(text: LocalizedText, locale: Locale): string {
  return text[locale];
}

/**
 * Digits outside a price. Arabic uses Arabic-Indic numerals here for the same reason
 * `formatOmr` does — a Latin "3" beside a price reading "١٦٥ ر.ع." reads as two languages.
 */
export function formatNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(locale === 'ar' ? 'ar-OM' : 'en-OM').format(value);
}

export function formatOmr(value: number, locale: Locale): string {
  const formatted = new Intl.NumberFormat(locale === 'ar' ? 'ar-OM' : 'en-OM', {
    maximumFractionDigits: 0,
  }).format(value);

  return locale === 'ar' ? `${formatted} ر.ع.` : `OMR ${formatted}`;
}
