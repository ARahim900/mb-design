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
    documentTitle: {
      ar: 'MB Design | عبايات عُمانية معاصرة',
      en: 'MB Design | Contemporary Omani abayas',
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
  services: {
    delivery: {
      title: { ar: 'توصيل داخل عُمان', en: 'Delivery across Oman' },
      body: { ar: 'تصل قطعتك إلى باب بيتك أينما كنتِ في عُمان.', en: 'Delivered to your door, wherever you are in Oman.' },
    },
    alterations: {
      title: { ar: 'ضبط المقاس', en: 'Made to fit' },
      body: {
        ar: 'ابدئي من مقاسك، ثم عدّلي الطول والكم واتساع القصّة.',
        en: 'Start from your size, then adjust the length, sleeve and fit.',
      },
    },
    whatsapp: {
      title: { ar: 'خدمة شخصية', en: 'Personal service' },
      body: {
        ar: 'تحدّثي معنا عبر واتساب عن المقاس أو القطعة التي تناسبك.',
        en: 'Talk to us on WhatsApp about sizing or the piece that suits you.',
      },
      action: { ar: 'راسلينا على واتساب', en: 'Message us on WhatsApp' },
    },
    pace: {
      title: { ar: 'على مهلك', en: 'At your own pace' },
      body: {
        ar: 'احتفظي بالقطع في حقيبتك وراجعي المقاس والتعديلات قبل إكمال الطلب.',
        en: 'Keep pieces in your bag and review size and adjustments before you order.',
      },
    },
    newTab: { ar: '(يفتح في نافذة جديدة)', en: '(opens in a new tab)' },
  },
  product: {
    size: { ar: 'المقاس', en: 'Size' },
    chooseSize: { ar: 'اختاري المقاس أولاً', en: 'Choose a size first' },
    customFit: {
      action: { ar: 'خصّصي هذا المقاس', en: 'Customise this size' },
      remove: { ar: 'إلغاء التعديلات', en: 'Remove adjustments' },
      title: { ar: 'تعديلات بسيطة', en: 'Simple adjustments' },
      intro: {
        ar: 'يبقى المقاس المختار هو الأساس. املئي فقط ما تريدين تعديله، وتبقى الحقول الفارغة على المقاس الأساسي.',
        en: 'Your selected size remains the base. Fill in only what you want changed; empty fields keep the standard measurements.',
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
      outOfRange: {
        ar: 'أدخلي رقماً بين {min} و{max} سم.',
        en: 'Enter a number between {min} and {max} cm.',
      },
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
      ar: 'قصّة منسدلة بطول كامل. إن احتجتِ طولاً أو كمّاً مختلفاً، اختاري «خصّصي هذا المقاس» وأدخلي القياس الذي يناسبك.',
      en: 'A full-length, fluid cut. If you need a different length or sleeve, choose “Customise this size” and enter the measurement that suits you.',
    },
    delivery: { ar: 'التوصيل والإرجاع', en: 'Delivery and returns' },
    deliveryTime: { ar: 'التوصيل خلال {time}', en: 'Delivery in {time}' },
    deliveryFee: { ar: 'رسوم التوصيل {fee}', en: 'Delivery fee {fee}' },
    freeDelivery: { ar: 'توصيل مجاني داخل عُمان', en: 'Free delivery within Oman' },
    sizeGuide: {
      open: { ar: 'دليل المقاسات', en: 'Size guide' },
      title: { ar: 'دليل المقاسات', en: 'Size guide' },
      size: { ar: 'المقاس', en: 'Size' },
      height: { ar: 'طولكِ (سم)', en: 'Your height (cm)' },
      length: { ar: 'طول العباية (سم)', en: 'Garment length (cm)' },
      howTo: {
        ar: 'اختاري المقاس الذي يناسب طولكِ. يُقاس طول العباية من أعلى الكتف حتى الحافة السفلية.',
        en: 'Choose the size that matches your height. Garment length is measured from the top of the shoulder to the hem.',
      },
    },
    gallery: {
      label: { ar: 'صور القطعة', en: 'Product photos' },
      previous: { ar: 'الصورة السابقة', en: 'Previous photo' },
      next: { ar: 'الصورة التالية', en: 'Next photo' },
      show: { ar: 'عرض الصورة {index}', en: 'Show photo {index}' },
      slide: { ar: 'صورة {index} من {count}', en: 'Photo {index} of {count}' },
      carouselRole: { ar: 'معرض صور', en: 'carousel' },
      slideRole: { ar: 'صورة', en: 'slide' },
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
    quantity: { ar: 'الكمية', en: 'Qty' },
    total: { ar: 'المجموع', en: 'Total' },
    checkout: { ar: 'متابعة إلى البيانات', en: 'Continue to details' },
    back: { ar: 'رجوع', en: 'Back' },
    steps: {
      label: { ar: 'مراحل الطلب', en: 'Order steps' },
      bag: { ar: 'الحقيبة', en: 'Bag' },
      details: { ar: 'البيانات', en: 'Details' },
      confirm: { ar: 'التأكيد', en: 'Confirm' },
    },
  },
  checkout: {
    title: { ar: 'بيانات الطلب', en: 'Order details' },
    confirmTitle: { ar: 'تأكيد الطلب', en: 'Confirm order' },
    summary: { ar: 'ملخّص الطلب', en: 'Order summary' },
    subtotal: { ar: 'المجموع الفرعي', en: 'Subtotal' },
    delivery: { ar: 'التوصيل', en: 'Delivery' },
    deliveryFree: { ar: 'توصيل مجاني', en: 'Free delivery' },
    deliveryPending: { ar: 'تُؤكَّد الرسوم عبر واتساب', en: 'Fee confirmed on WhatsApp' },
    total: { ar: 'المجموع', en: 'Total' },
    totalBeforeDelivery: { ar: 'المجموع قبل التوصيل', en: 'Total before delivery' },
    contact: { ar: 'بيانات التواصل', en: 'Contact' },
    address: { ar: 'عنوان التوصيل', en: 'Delivery address' },
    name: { ar: 'الاسم الكامل', en: 'Full name' },
    mobile: { ar: 'رقم الهاتف', en: 'Mobile number' },
    mobileHelp: { ar: 'ثمانية أرقام تبدأ بـ 7 أو 9.', en: '8 digits starting with 7 or 9.' },
    governorate: { ar: 'المحافظة', en: 'Governorate' },
    wilayat: { ar: 'الولاية', en: 'Wilayat' },
    choose: { ar: 'اختاري', en: 'Select' },
    chooseGovernorateFirst: { ar: 'اختاري المحافظة أولاً', en: 'Select a governorate first' },
    area: { ar: 'المنطقة أو الحي', en: 'Area' },
    street: { ar: 'الشارع', en: 'Street' },
    house: { ar: 'رقم المنزل أو المبنى', en: 'House or building number' },
    optional: { ar: '(اختياري)', en: '(optional)' },
    errors: {
      name: { ar: 'اكتبي اسمك.', en: 'Enter your name.' },
      mobileRequired: { ar: 'اكتبي رقم هاتفك.', en: 'Enter your mobile number.' },
      mobileInvalid: { ar: 'أدخلي ثمانية أرقام تبدأ بـ 7 أو 9.', en: 'Enter 8 digits starting with 7 or 9.' },
      governorate: { ar: 'اختاري المحافظة.', en: 'Select your governorate.' },
      wilayat: { ar: 'اختاري الولاية.', en: 'Select your wilayat.' },
      area: { ar: 'اكتبي المنطقة أو الحي.', en: 'Enter your area.' },
      house: { ar: 'اكتبي رقم المنزل أو المبنى.', en: 'Enter your house or building number.' },
    },
    review: { ar: 'مراجعة الطلب', en: 'Review order' },
    deliverTo: { ar: 'التوصيل إلى', en: 'Deliver to' },
    editDetails: { ar: 'تعديل البيانات', en: 'Edit details' },
    send: { ar: 'أرسلي الطلب عبر واتساب', en: 'Send order on WhatsApp' },
    sendHint: {
      ar: 'يُفتح واتساب برسالة جاهزة تتضمّن طلبك وبياناتك.',
      en: 'WhatsApp opens with your order and details ready to send.',
    },
    newTab: { ar: '(يُفتح في نافذة جديدة)', en: '(opens in a new tab)' },
    unavailable: {
      ar: 'الطلب عبر واتساب يُتاح قريباً.',
      en: 'Ordering on WhatsApp opens soon.',
    },
    sentTitle: { ar: 'طلبك جاهز في واتساب', en: 'Your order is ready in WhatsApp' },
    sentBody: {
      ar: 'فتحنا واتساب برسالة طلبك. أرسلي الرسالة لتأكيد الطلب.',
      en: 'We have opened WhatsApp with your order. Send the message to confirm.',
    },
    reopen: { ar: 'افتحي واتساب مجدداً', en: 'Open WhatsApp again' },
    clearBag: { ar: 'إفراغ الحقيبة', en: 'Clear the bag' },
    continueShopping: { ar: 'متابعة التسوّق', en: 'Continue shopping' },
    message: {
      greeting: { ar: 'مرحباً MB Design، أودّ طلب:', en: 'Hello MB Design, I would like to order:' },
      customer: { ar: 'بيانات التوصيل', en: 'Delivery details' },
    },
  },
  footer: {
    statement: {
      ar: 'دار أزياء عمانية معاصرة. لون محسوب، خط واضح، وحضور لا يتكلّف.',
      en: 'A contemporary Omani fashion house. Considered colour, a clear line and effortless presence.',
    },
    navLabel: { ar: 'روابط الأقسام', en: 'Section links' },
    contactLabel: { ar: 'تواصلي معنا', en: 'Contact' },
    whatsapp: { ar: 'واتساب', en: 'WhatsApp' },
    instagram: { ar: 'إنستغرام', en: 'Instagram' },
    email: { ar: 'البريد الإلكتروني', en: 'Email' },
    policiesLabel: { ar: 'السياسات', en: 'Policies' },
    cr: { ar: 'السجل التجاري رقم', en: 'CR No.' },
    rights: { ar: 'جميع الحقوق محفوظة', en: 'All rights reserved' },
    closePolicy: { ar: 'إغلاق', en: 'Close' },
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

/** Replaces each `{name}` in a localised template. */
export function fillTemplate(template: string, values: Readonly<Record<string, string>>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match);
}

/**
 * Western digits in both languages. Sizes such as "54" and centimetre inputs are always typed
 * in Western digits, so prices and counts follow them; one digit style keeps the page from
 * reading as two languages. `nu-latn` keeps the Arabic locale's grouping and separators.
 */
const numberLocale: Record<Locale, string> = { ar: 'ar-OM-u-nu-latn', en: 'en-OM' };

export function formatNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(numberLocale[locale]).format(value);
}

/** Arabic keeps "ر.ع." after the number; English leads with "OMR". */
export function formatOmr(value: number, locale: Locale): string {
  const formatted = new Intl.NumberFormat(numberLocale[locale], {
    maximumFractionDigits: 0,
  }).format(value);

  return locale === 'ar' ? `${formatted} ر.ع.` : `OMR ${formatted}`;
}
