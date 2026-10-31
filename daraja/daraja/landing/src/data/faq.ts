export interface FaqEntry {
  question: string;
  answer: string;
}

export interface FaqGroup {
  title: string;
  entries: FaqEntry[];
}

/**
 * Answers are written for people first. The same text feeds the visible FAQ
 * and the FAQPage JSON-LD, so the markup always matches what visitors read
 * (a Google requirement for structured data).
 */
export const faqGroups: FaqGroup[] = [
  {
    title: 'Getting started',
    entries: [
      {
        question: 'What does hybrid mean?',
        answer:
          'Part of the business moves online and part stays physical. Which part is decided by your numbers, not by a template.',
      },
      {
        question: 'I am not online at all. Where do we begin?',
        answer:
          'With the valuation of your stock and your bank and M-Pesa history. It tells us what to sell online first and what the move will cost.',
      },
      {
        question: 'I am already online. Do I still need migration?',
        answer: 'Probably not. Start with a channel audit and the social media services.',
      },
    ],
  },
  {
    title: 'Payments and apps',
    entries: [
      {
        question: 'Can customers pay with M-Pesa?',
        answer:
          'Yes. Storefronts use M-Pesa STK Push, so the customer approves the payment on their phone and the order confirms itself.',
      },
      {
        question: 'Can you print receipts?',
        answer: 'Yes, from the POS to a Bluetooth printer. Tell us your printer model first.',
      },
      {
        question: 'Do you build delivery tools?',
        answer: 'Yes. A rider dispatch app lets you assign orders and track each one to delivery.',
      },
    ],
  },
  {
    title: 'Social media',
    entries: [
      {
        question: 'Which platforms do you work on?',
        answer: 'TikTok, Instagram and Facebook, with paid ads on Meta and TikTok.',
      },
      {
        question: 'Do you make the videos?',
        answer: 'We write the scripts and make FAQ videos built from the questions your customers already ask.',
      },
      {
        question: 'Who pays for the ads?',
        answer:
          'Ad spend comes from your budget and goes straight to the platform. Our fee is separate and agreed in writing.',
      },
    ],
  },
  {
    title: 'Working with us',
    entries: [
      {
        question: 'How much does it cost?',
        answer:
          'Each service has levels, and each level has its own price. We confirm the price in writing after we understand the business.',
      },
      {
        question: 'Will you ever ask for my M-Pesa PIN or bank password?',
        answer: 'Never. We only work with statements and exports that you choose to share.',
      },
      {
        question: 'Where are you based?',
        answer: 'Nairobi, Kenya.',
      },
    ],
  },
];

/** The shorter set shown on the home page. */
export const homeFaq: FaqEntry[] = [
  faqGroups[0]!.entries[0]!,
  faqGroups[0]!.entries[1]!,
  faqGroups[1]!.entries[0]!,
  faqGroups[2]!.entries[2]!,
  faqGroups[3]!.entries[0]!,
  faqGroups[3]!.entries[1]!,
];
