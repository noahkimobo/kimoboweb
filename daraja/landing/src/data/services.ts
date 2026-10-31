export interface ServiceItem {
  title: string;
  body: string;
}

export interface ServiceStep {
  title: string;
  body: string;
}

export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface Service {
  slug: string;
  num: string;
  /** Full service name, used as the H3 on listings and the H1 on its own page. */
  title: string;
  /** Short name for navigation and links. */
  shortTitle: string;
  summary: string;
  /** One-sentence description used in meta tags. */
  metaDescription: string;
  intro: string;
  points: string[];
  items: ServiceItem[];
  steps: ServiceStep[];
  who: string[];
  faq: ServiceFaq[];
  closing: string;
}

export const services: Service[] = [
  {
    slug: 'valuation-and-migration',
    num: '01',
    title: 'Business Valuation & Hybrid Migration',
    shortTitle: 'Valuation and migration',
    summary:
      'We perform complete valuation of your inventory, bank & M-Pesa transaction histories, and structure a warehouse delivery model to slash physical overhead.',
    metaDescription:
      'Value your inventory, review your bank and M-Pesa history, and move to a hybrid warehouse delivery model that cuts rent and overhead. Nairobi, Kenya.',
    intro:
      'Before you move online, know exactly what you are moving. We value the business first, then design a delivery model that costs less to run than a shopfront.',
    points: [
      'Inventory valuation, item by item',
      'Bank and M-Pesa history review',
      'Warehouse delivery model and overhead plan',
    ],
    items: [
      {
        title: 'Inventory valuation',
        body: 'Every item counted and costed, with margin per item and a clear view of slow movers that tie up cash.',
      },
      {
        title: 'Bank and M-Pesa review',
        body: 'We read the statements you choose to share to see what sells, when it sells and how cash moves through the week.',
      },
      {
        title: 'Warehouse delivery model',
        body: 'Stock held in one low-cost place and sent out by delivery, instead of waiting for walk-in customers.',
      },
      {
        title: 'Overhead reduction plan',
        body: 'Rent, staffing and shop hours set against the cost of fulfilment, so the saving is a number, not a hope.',
      },
      {
        title: 'Online-readiness plan',
        body: 'What to list first, how to price it, how customers pay, and which areas you can deliver to.',
      },
      {
        title: 'Handover report',
        body: 'One written report with the valuation, the model and the launch order, yours to keep and act on.',
      },
    ],
    steps: [
      { title: 'Gather', body: 'You share stock lists and the bank and M-Pesa statements you are comfortable sharing.' },
      { title: 'Value', body: 'We cost the inventory and read the transaction history.' },
      { title: 'Design', body: 'We build the hybrid delivery model and the overhead plan around your numbers.' },
      { title: 'Launch plan', body: 'You get the order of work to go live, with Daraja services lined up if you want them.' },
    ],
    who: [
      'Shop owners paying high rent for low foot traffic',
      'Sellers holding stock that is not moving',
      'Businesses taking most orders by WhatsApp and cash',
      'Owners who want to know if going online will actually pay',
    ],
    faq: [
      {
        question: 'Do I have to close my shop?',
        answer:
          'No. Hybrid means the numbers decide. Some owners keep a showroom, some close the shopfront, and some keep it as it is and add delivery.',
      },
      {
        question: 'What happens to my M-Pesa and bank statements?',
        answer:
          'We use only what you choose to share, and only for the valuation. We never need your M-Pesa PIN or your banking passwords, and we will never ask for them.',
      },
      {
        question: 'How long does it take and what does it cost?',
        answer:
          'It depends on the size of the stock and how much history there is. We confirm the timeline and the price in writing after a first conversation.',
      },
    ],
    closing: 'Find out what your business is really worth before you move it.',
  },
  {
    slug: 'rebranding-and-design',
    num: '02',
    title: 'Visual Re-Branding & Graphic Design',
    shortTitle: 'Re-branding and design',
    summary:
      'Creation of digital product catalogs, brand guidelines, posters, motion graphic promos, and high-converting real photo shot standards.',
    metaDescription:
      'Digital product catalogs, brand guidelines, posters, motion graphic promos and photo shot standards for businesses moving online in Nairobi.',
    intro:
      'Online, customers judge you in a second, from a thumbnail. We give your business a look that is consistent, easy to trust and easy to keep producing yourself.',
    points: [
      'Digital product catalogs',
      'Brand guidelines, posters and motion graphic promos',
      'Real photo shot standards your team can repeat',
    ],
    items: [
      {
        title: 'Digital product catalogs',
        body: 'Your full range laid out cleanly with names, prices and photos, ready to send on WhatsApp or post as a link.',
      },
      {
        title: 'Brand guidelines',
        body: 'Logo use, colors, fonts and tone of voice on a few pages, so every post and flyer looks like the same business.',
      },
      {
        title: 'Posters and print',
        body: 'Posters for the shopfront, promotions and events, built from your brand rather than from scratch each time.',
      },
      {
        title: 'Motion graphic promos',
        body: 'Short animated promos for launches and offers, sized for TikTok, Instagram and Facebook.',
      },
      {
        title: 'Photo shot standards',
        body: 'A simple shot list for product photos covering angle, light, background and framing, so any phone gives you consistent images.',
      },
      {
        title: 'Editable templates',
        body: 'Post and story templates your team can fill in without a designer, so the look holds up after we leave.',
      },
    ],
    steps: [
      { title: 'Review', body: 'We look at your current logo, photos and posts and note what helps and what hurts.' },
      { title: 'Direction', body: 'We agree one look for the business: colors, type and tone.' },
      { title: 'Produce', body: 'Catalog, posters, promos and photo standards, in the agreed look.' },
      { title: 'Hand over', body: 'You receive the files and templates, with a short guide to using them.' },
    ],
    who: [
      'Businesses whose posts and flyers all look different',
      'Sellers whose product photos do not convert',
      'Shops about to launch online who want to start with a clear look',
      'Owners who send prices by typing them into chats',
    ],
    faq: [
      {
        question: 'Do I need a new logo?',
        answer:
          'Not always. If your logo works, we keep it and build the rest around it. If it does not, we say so and propose a replacement.',
      },
      {
        question: 'Can we really shoot good photos on a phone?',
        answer:
          'Yes. The shot standards are written for a phone camera and a window or lamp, so you can repeat them without a studio.',
      },
      {
        question: 'Which files do I receive?',
        answer:
          'Editable source files and ready-to-post exports for each channel, so you can change a price or a date without calling us.',
      },
    ],
    closing: 'Make the first second count.',
  },
  {
    slug: 'software-mpesa-pos-delivery-apps',
    num: '03',
    title: 'Software, M-Pesa POS & Delivery Apps',
    shortTitle: 'Software and apps',
    summary:
      'Cross-platform Flutter web storefronts with automated M-Pesa STK Push payment routing, Bluetooth receipt printing, and rider dispatch apps.',
    metaDescription:
      'Flutter web storefronts with M-Pesa STK Push payments, a POS with Bluetooth receipt printing, and rider dispatch apps for Nairobi businesses.',
    intro:
      'Customers in Kenya pay with M-Pesa, so your storefront should too. We build Flutter storefronts and tools that take the payment, print the receipt and send the rider out.',
    points: [
      'Flutter web storefront with M-Pesa STK Push',
      'POS with Bluetooth receipt printing',
      'Rider dispatch app',
    ],
    items: [
      {
        title: 'Flutter web storefront',
        body: 'A fast store that opens in the customer’s browser, with your catalog, cart and checkout. No app download needed.',
      },
      {
        title: 'M-Pesa STK Push payments',
        body: 'The customer gets the payment prompt on their phone and the order confirms itself when they pay.',
      },
      {
        title: 'POS with Bluetooth receipts',
        body: 'A till for the counter or the market stall that records sales and prints receipts on a Bluetooth printer.',
      },
      {
        title: 'Rider dispatch app',
        body: 'Assign orders to riders, and let them mark each delivery picked up and delivered.',
      },
      {
        title: 'Orders and stock view',
        body: 'One place to see new orders, what is paid, and what is running low.',
      },
      {
        title: 'One codebase, many screens',
        body: 'Flutter means the same product works across web and phones, which keeps cost and upkeep lower.',
      },
    ],
    steps: [
      { title: 'Scope', body: 'We agree what the first version must do and what can wait.' },
      { title: 'Design', body: 'You see the screens before anything is built.' },
      { title: 'Build', body: 'We build in stages and show you working pieces, including a real M-Pesa test payment.' },
      { title: 'Launch and support', body: 'We go live with you and stay on hand for fixes.' },
    ],
    who: [
      'Shops that want their own store, not only a social media page',
      'Sellers who deliver and need to track riders and orders',
      'Counters and stalls that need a simple till and printed receipts',
      'Owners tired of matching M-Pesa messages to orders by hand',
    ],
    faq: [
      {
        question: 'Do my customers need to install an app?',
        answer: 'No. The storefront runs in the browser. Rider and till apps are for your own team.',
      },
      {
        question: 'What do I need to take M-Pesa payments?',
        answer:
          'An M-Pesa business shortcode, either a Paybill or a Till. We connect the store to it and test it with you. Payment requests are sent from our server, so no payment secret ever sits in a customer’s browser.',
      },
      {
        question: 'Which receipt printers work?',
        answer: 'Bluetooth thermal printers. Tell us the model and we confirm before we build.',
      },
    ],
    closing: 'Let customers pay the way they already do.',
  },
  {
    slug: 'social-media-ads-and-audits',
    num: '04',
    title: 'Algorithmic Social Media Ads & Audits',
    shortTitle: 'Social media ads and audits',
    summary:
      'Full channel audits for TikTok, Instagram, and Facebook profiles, direct script writing, FAQ videos, and targeted Meta/TikTok paid ad execution.',
    metaDescription:
      'TikTok, Instagram and Facebook channel audits, script writing, FAQ videos and targeted Meta and TikTok paid ads for Nairobi businesses.',
    intro:
      'Posting is not a strategy. We audit your TikTok, Instagram and Facebook, find what is holding them back, then make the content and run the ads that bring buyers.',
    points: ['Full channel audits', 'Script writing and FAQ videos', 'Targeted Meta and TikTok paid ads'],
    items: [
      {
        title: 'Full channel audit',
        body: 'We review your TikTok, Instagram and Facebook profiles: bio, content, posting pattern, and how people respond.',
      },
      {
        title: 'Findings you can act on',
        body: 'A short written list of what to fix first, in plain language, ranked by what is most likely to help.',
      },
      {
        title: 'Script writing',
        body: 'Direct scripts for short videos, written around your products and the way your customers talk.',
      },
      {
        title: 'FAQ videos',
        body: 'Short videos answering the questions customers keep sending you, so you stop answering them one chat at a time.',
      },
      {
        title: 'Meta and TikTok paid ads',
        body: 'Targeted ad campaigns set up and run for you, aimed at the people most likely to buy.',
      },
      {
        title: 'Ongoing adjustment',
        body: 'We watch what the audience actually does and shift the content and ad targeting to match.',
      },
    ],
    steps: [
      { title: 'Audit', body: 'We go through each channel and note what works, what does not, and why.' },
      { title: 'Plan', body: 'We agree the content and ad plan, tied to what you want to sell.' },
      { title: 'Produce', body: 'Scripts and videos are written and made, then posted or put behind ads.' },
      { title: 'Run and adjust', body: 'Ads run, results come back, and we change the plan from what they show.' },
    ],
    who: [
      'Businesses posting every day with few enquiries',
      'Sellers whose customers keep asking the same questions',
      'Owners who tried boosting a post and are not sure it worked',
      'Brands launching a new product or offer',
    ],
    faq: [
      {
        question: 'Do I need an audit before ads?',
        answer: 'We recommend it. Ads sent to a weak profile waste money, so we fix the profile first.',
      },
      {
        question: 'Who pays for the ads?',
        answer:
          'Ad spend comes from your budget and goes straight to Meta or TikTok. Our fee for running the ads is separate and agreed in writing.',
      },
      {
        question: 'How do I know it is working?',
        answer:
          'We agree what to measure at the start, such as enquiries, orders or followers, and report against it. In your Daraja account you can also record your own follower counts before and after.',
      },
    ],
    closing: 'Find out why your posts are not turning into orders.',
  },
];

export function getService(slug: string): Service {
  const found = services.find((s) => s.slug === slug);
  if (!found) throw new Error(`Unknown service slug: ${slug}`);
  return found;
}

export function relatedServices(slug: string): Service[] {
  return services.filter((s) => s.slug !== slug);
}
