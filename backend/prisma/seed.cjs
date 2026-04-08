const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');

const prisma = new PrismaClient({
  adapter: new PrismaMariaDb(process.env.DATABASE_URL),
});

const productsData = [
  // --- SHOWCASE PRODUCTS ---
  {
    placement: 'SHOWCASE',
    badgeColor: '#000000',
    titleColor: '#000000',
    descColor: '#000000',
    btn1Color: '#d2d1d1',
    btn1BgColor: '#000000',
    btn2Color: '#000000',
    btn2BgColor: '#ffffff',
    imgUrl: '/uploads/apple-98dd.jpg',
    backgroundColor: '#ffffff',
    translations: {
      en: {
        title: 'iPhone',
        desc: 'Say hello to the latest generation of iPhone.',
      },
      uz: {
        title: 'iPhone',
        desc: 'Say hello to the latest generation of iPhone.',
      },
      ru: {
        title: 'iPhone',
        desc: 'Say hello to the latest generation of iPhone.',
      },
    },
  },
  {
    placement: 'SHOWCASE',
    badgeColor: '#000000',
    titleColor: '#000000',
    descColor: '#000000',
    btn1Color: '#ffffff',
    btn1BgColor: '#000000',
    btn2Color: '#000000',
    btn2BgColor: '#ffffff',
    imgUrl: '/uploads/airpods-027f.jpg',
    backgroundColor: '#ffffff',
    translations: {
      en: {
        title: 'AirPods Pro 3',
        desc: 'The world’s best in-ear Active Noise Cancellation.',
      },
      uz: {
        title: 'AirPods Pro 3',
        desc: 'The world’s best in-ear Active Noise Cancellation.',
      },
      ru: {
        title: 'AirPods Pro 3',
        desc: 'The world’s best in-ear Active Noise Cancellation.',
      },
    },
  },
  // --- GRID PRODUCTS ---
  {
    placement: 'GRID',
    badgeColor: '#000000',
    titleColor: '#000000',
    descColor: '#000000',
    btn1Color: '#ffffff',
    btn1BgColor: '#b52121',
    btn2Color: '#000000',
    btn2BgColor: '#ffffff',
    imgUrl: '/uploads/ipad-afdc.jpg',
    backgroundColor: '#b29f49',
    translations: {
      en: {
        title: 'iPhone',
        desc: 'Now with the speed of the A16 chip and double the ...',
      },
      uz: {
        title: 'iPhone',
        desc: 'Now with the speed of the A16 chip and double the ...',
      },
      ru: {
        title: 'iPhone',
        desc: 'Now with the speed of the A16 chip and double the ...',
      },
    },
  },
  {
    placement: 'GRID',
    badgeColor: '#000000',
    titleColor: '#000000',
    descColor: '#000000',
    btn1Color: '#ffffff',
    btn1BgColor: '#000000',
    btn2Color: '#000000',
    btn2BgColor: '#ffffff',
    imgUrl: '/uploads/watch-9ec1.jpg',
    backgroundColor: '#ffffff',
    translations: {
      en: { title: 'Watch SE 3', desc: 'Walk it. Talk it. Track it. Love it.' },
      uz: { title: 'Watch SE 3', desc: 'Walk it. Talk it. Track it. Love it.' },
      ru: { title: 'Watch SE 3', desc: 'Walk it. Talk it. Track it. Love it.' },
    },
  },
  {
    placement: 'GRID',
    badgeColor: '#000000',
    titleColor: '#000000',
    descColor: '#000000',
    btn1Color: '#ffffff',
    btn1BgColor: '#000000',
    btn2Color: '#000000',
    btn2BgColor: '#ffffff',
    imgUrl: '/uploads/macbook-45c3.jpg',
    backgroundColor: '#ffffff',
    translations: {
      en: {
        title: 'MacBook Air',
        desc: 'Sky blue color. Sky high performance with M4.',
      },
      uz: {
        title: 'MacBook Air',
        desc: 'Sky blue color. Sky high performance with M4.',
      },
      ru: {
        title: 'MacBook Air',
        desc: 'Sky blue color. Sky high performance with M4.',
      },
    },
  },
  {
    placement: 'GRID',
    badgeColor: '#000000',
    titleColor: '#000000',
    descColor: '#000000',
    btn1Color: '#ffffff',
    btn1BgColor: '#000000',
    btn2Color: '#000000',
    btn2BgColor: '#ffffff',
    imgUrl: '/uploads/smartwatch-b479.jpg',
    backgroundColor: '#ffffff',
    translations: {
      en: {
        title: 'Watch series 11',
        desc: 'The ultimate way to watch your health.',
      },
      uz: {
        title: 'Watch series 11',
        desc: 'The ultimate way to watch your health.',
      },
      ru: {
        title: 'Watch series 11',
        desc: 'The ultimate way to watch your health.',
      },
    },
  },
];

const staffData = [
  {
    imageUrl: '/uploads/staff/staff-ceo.png',
    order: 0,
    translations: {
      en: { name: 'Jasur Husanov', position: 'Chief Executive Officer' },
      uz: { name: 'Jasur Husanov', position: 'Bosh ijrochi direktor' },
      ru: { name: 'Жасур Хусанов', position: 'Генеральный директор' },
    },
  },
  {
    imageUrl: '/uploads/staff/staff-cto.png',
    order: 1,
    translations: {
      en: { name: 'Sardor Karimov', position: 'Chief Technology Officer' },
      uz: { name: 'Sardor Karimov', position: "Texnologiya bo'yicha direktor" },
      ru: { name: 'Сардор Каримов', position: 'Технический директор' },
    },
  },
  {
    imageUrl: '/uploads/staff/staff-coo.png',
    order: 2,
    translations: {
      en: { name: 'Nodira Umarova', position: 'Chief Operations Officer' },
      uz: { name: 'Nodira Umarova', position: 'Operatsion direktor' },
      ru: { name: 'Нодира Умарова', position: 'Операционный директор' },
    },
  },
  {
    imageUrl: '/uploads/staff/staff-design-lead.png',
    order: 3,
    translations: {
      en: { name: 'Dilnoza Rashidova', position: 'Head of Design' },
      uz: { name: 'Dilnoza Rashidova', position: "Dizayn bo'limi boshlig'i" },
      ru: { name: 'Дилноза Рашидова', position: 'Руководитель отдела дизайна' },
    },
  },
];

async function main() {
  // Clear existing data (Order matters due to Foreign Keys)
  await prisma.staffMemberTranslation.deleteMany({});
  await prisma.staffMember.deleteMany({});
  await prisma.productTranslation.deleteMany({});
  await prisma.product.deleteMany({});

  for (const p of productsData) {
    await prisma.product.create({
      data: {
        placement: p.placement, // Prisma accepts the string name of the Enum
        badgeColor: p.badgeColor,
        titleColor: p.titleColor,
        descColor: p.descColor,
        btn1Color: p.btn1Color,
        btn1BgColor: p.btn1BgColor,
        btn2Color: p.btn2Color,
        btn2BgColor: p.btn2BgColor,
        imgUrl: p.imgUrl,
        backgroundColor: p.backgroundColor,
        translations: {
          create: ['en', 'uz', 'ru'].map((locale) => ({
            locale,
            title: p.translations[locale].title,
            desc: p.translations[locale].desc,
            badge: p.translations[locale].badge || null,
          })),
        },
      },
    });
  }

  for (const s of staffData) {
    await prisma.staffMember.create({
      data: {
        imageUrl: s.imageUrl,
        order: s.order,
        translations: {
          create: ['en', 'uz', 'ru'].map((locale) => ({
            locale,
            name: s.translations[locale].name,
            position: s.translations[locale].position,
          })),
        },
      },
    });
  }

  console.log(
    `Seeded ${productsData.length} products and ${staffData.length} staff members successfully.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
