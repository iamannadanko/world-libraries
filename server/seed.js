import dotenv from 'dotenv';
import prisma from './prisma.js';

dotenv.config();

const libraries = [
  {
    name: 'Бібліотека Конгресу',
    name_en: 'Library of Congress',
    country: 'США',
    city: 'Вашингтон',
    founded: 1800,
    collection_size: BigInt(173000000),
    description: 'Найбільша бібліотека у світі за кількістю одиниць зберігання. Заснована 24 квітня 1800 року, коли президент Джон Адамс підписав акт про перенесення столиці з Філадельфії до Вашингтона. Колекція включає понад 173 мільйони одиниць зберігання, зокрема книги, рукописи, фотографії, карти, ноти та фільми.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/LOC_Main_Reading_Room_Highsmith.jpg/1280px-LOC_Main_Reading_Room_Highsmith.jpg',
    website: 'https://www.loc.gov',
    fun_fact: 'Якби всі полиці бібліотеки поставити в ряд, вони розтягнулися б на 1349 км.'
  },
  {
    name: 'Британська бібліотека',
    name_en: 'British Library',
    country: 'Великобританія',
    city: 'Лондон',
    founded: 1973,
    collection_size: BigInt(170000000),
    description: 'Національна бібліотека Великої Британії, одна з найбільших у світі. Зберігає примірники кожної книги, опублікованої у Великобританії та Ірландії. Колекція включає Magna Carta, записні книжки Леонардо да Вінчі та рукописи The Beatles.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/British_Library_-_Kings_Library_-_London.jpg/1280px-British_Library_-_Kings_Library_-_London.jpg',
    website: 'https://www.bl.uk',
    fun_fact: 'Щороку колекція зростає на 3 мільйони одиниць зберігання.'
  },
  {
    name: 'Бібліотека і Архіви Канади',
    name_en: 'Library and Archives Canada',
    country: 'Канада',
    city: 'Оттава',
    founded: 1953,
    collection_size: BigInt(54000000),
    description: 'Національна бібліотека Канади, що зберігає документальну спадщину країни. Колекція включає книги, періодику, мікроформи, фотографії, кінофільми, музику та мистецтво. Є найбільшим зберігачем канадіани.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Library_and_Archives_Canada.jpg/1280px-Library_and_Archives_Canada.jpg',
    website: 'https://www.bac-lac.gc.ca',
    fun_fact: 'Зберігає понад 30 мільйонів фотографій, що документують історію Канади.'
  },
  {
    name: 'Нью-Йоркська публічна бібліотека',
    name_en: 'New York Public Library',
    country: 'США',
    city: 'Нью-Йорк',
    founded: 1895,
    collection_size: BigInt(55000000),
    description: 'Одна з найбільших публічних бібліотек у світі. Головна будівля на П\'ятій авеню — шедевр архітектури стилю бозар. Знаменита своїми мармуровими левами «Терпіння» та «Стійкість» біля входу.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/NYC_Public_Library_Research_Room_Jan_2006.jpg/1280px-NYC_Public_Library_Research_Room_Jan_2006.jpg',
    website: 'https://www.nypl.org',
    fun_fact: 'Два мармурових леви біля входу отримали імена «Терпіння» та «Стійкість» від мера Фіорелло Ла Гуардіа.'
  },
  {
    name: 'Німецька національна бібліотека',
    name_en: 'Deutsche Nationalbibliothek',
    country: 'Німеччина',
    city: 'Лейпциг / Франкфурт',
    founded: 1912,
    collection_size: BigInt(45000000),
    description: 'Центральна архівна бібліотека Німеччини, що зберігає всі публікації німецькою мовою з 1913 року. Має дві основні будівлі — у Лейпцигу та Франкфурті-на-Майні. Також включає Німецький музей книги та письма.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Deutsche_Nationalbibliothek_-_Erweiterung.jpg/1280px-Deutsche_Nationalbibliothek_-_Erweiterung.jpg',
    website: 'https://www.dnb.de',
    fun_fact: 'Щодня бібліотека отримує близько 2000 нових видань від видавців з усього світу.'
  },
  {
    name: 'Національна парламентська бібліотека Японії',
    name_en: 'National Diet Library',
    country: 'Японія',
    city: 'Токіо',
    founded: 1948,
    collection_size: BigInt(46000000),
    description: 'Єдина національна бібліотека Японії. Створена за зразком Бібліотеки Конгресу після Другої світової війни. Обслуговує членів парламенту та широку громадськість.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/National_Diet_Library_2019a.jpg/1280px-National_Diet_Library_2019a.jpg',
    website: 'https://www.ndl.go.jp',
    fun_fact: 'Має підземне сховище глибиною 8 поверхів під головною будівлею.'
  },
  {
    name: 'Національна бібліотека Китаю',
    name_en: 'National Library of China',
    country: 'Китай',
    city: 'Пекін',
    founded: 1909,
    collection_size: BigInt(41000000),
    description: 'Найбільша бібліотека Азії. Зберігає найповнішу колекцію китайських публікацій, а також рідкісні стародавні тексти. Сучасна будівля є однією з архітектурних визначних пам\'яток Пекіна.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/National_Library_of_China_pic_1.jpg/1280px-National_Library_of_China_pic_1.jpg',
    website: 'http://www.nlc.cn',
    fun_fact: 'Зберігає одну з найбільших у світі колекцій стародавніх китайських текстів на бамбукових пластинах.'
  },
  {
    name: 'Національна бібліотека Франції',
    name_en: 'Bibliothèque nationale de France',
    country: 'Франція',
    city: 'Париж',
    founded: 1461,
    collection_size: BigInt(40000000),
    description: 'Одна з найстаріших бібліотек у Європі. Заснована на основі королівської бібліотеки Карла V. Сучасний комплекс на березі Сени спроєктований архітектором Домініком Перро у формі чотирьох відкритих книг.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Biblioth%C3%A8que_nationale_de_France_%28site_Richelieu%29%2C_Paris_-_Salle_Ovale.jpg/1280px-Biblioth%C3%A8que_nationale_de_France_%28site_Richelieu%29%2C_Paris_-_Salle_Ovale.jpg',
    website: 'https://www.bnf.fr',
    fun_fact: 'Чотири башти будівлі мають форму відкритих книг заввишки 79 метрів.'
  },
  {
    name: 'Національна бібліотека Іспанії',
    name_en: 'Biblioteca Nacional de España',
    country: 'Іспанія',
    city: 'Мадрид',
    founded: 1712,
    collection_size: BigInt(34000000),
    description: 'Головна бібліотека Іспанії та одна з найбільших у Європі. Заснована королем Філіпом V. Зберігає найповнішу колекцію іспаномовних публікацій, рідкісні рукописи, гравюри Гойї та перші видання Сервантеса.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Biblioteca_Nacional_de_Espa%C3%B1a_%28Madrid%29_07.jpg/1280px-Biblioteca_Nacional_de_Espa%C3%B1a_%28Madrid%29_07.jpg',
    website: 'https://www.bne.es',
    fun_fact: 'Зберігає першу ілюстровану карту Америки, створену Хуаном де ла Коса у 1500 році.'
  },
  {
    name: 'Королівська данська бібліотека',
    name_en: 'Royal Danish Library',
    country: 'Данія',
    city: 'Копенгаген',
    founded: 1648,
    collection_size: BigInt(35000000),
    description: 'Національна бібліотека Данії та найбільша бібліотека Скандинавії. Сучасна прибудова з чорного граніту отримала прізвисько «Чорний діамант». Зберігає всі твори, надруковані данською з 1482 року.',
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Den_Sorte_Diamant_2.jpg/1280px-Den_Sorte_Diamant_2.jpg',
    website: 'https://www.kb.dk',
    fun_fact: 'Сучасну будівлю називають «Чорний діамант» через фасад із чорного граніту.'
  }
];

async function seed() {
  console.log('🌱 Заповнення бази даних бібліотеками...\n');

  try {
    // Очистити існуючі дані
    await prisma.library.deleteMany();
    console.log('🗑️  Старі дані видалено');

    // Вставити нові дані
    for (const lib of libraries) {
      const created = await prisma.library.create({ data: lib });
      console.log(`  ✅ ${created.name}`);
    }

    const count = await prisma.library.count();
    console.log(`\n🎉 Успішно додано ${count} бібліотек!`);
  } catch (err) {
    console.error('❌ Помилка:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
