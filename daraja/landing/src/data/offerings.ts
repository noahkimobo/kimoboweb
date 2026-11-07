export interface Offering {
  title: string;
  slug: string;
  summary: string;
}

export interface OfferingGroup {
  title: string;
  slug: string;
  summary: string;
  offerings: Offering[];
}

export const offeringGroups: OfferingGroup[] = [
  {
    title: 'Paid Media & Performance',
    slug: 'paid-media-performance',
    summary: 'Reach the right people, improve campaign performance and turn attention into enquiries.',
    offerings: [
      {
        title: 'Digital Marketing Services',
        slug: 'digital-marketing-services',
        summary: 'A practical digital plan that brings channels, campaigns and business goals together.',
      },
      {
        title: 'Google / PPC Advertising',
        slug: 'google-ppc-advertising',
        summary: 'Search and pay-per-click campaigns designed around what your customers are looking for.',
      },
      {
        title: 'Social Media Marketing',
        slug: 'social-media-marketing',
        summary: 'Build a consistent social presence with a clear content and audience plan.',
      },
      {
        title: 'Influencer Marketing',
        slug: 'influencer-marketing',
        summary: 'Plan creator partnerships that connect your products with relevant audiences.',
      },
      {
        title: 'TikTok Advertising',
        slug: 'tiktok-advertising',
        summary: 'Short-form video campaigns made to introduce your business and reach new customers.',
      },
      {
        title: 'YouTube Advertising',
        slug: 'youtube-advertising',
        summary: 'Video campaigns that help your business get discovered across YouTube.',
      },
      {
        title: 'Events Digital Marketing',
        slug: 'events-digital-marketing',
        summary: 'Promote events online with coordinated content, audience targeting and follow-up.',
      },
    ],
  },
  {
    title: 'SEO & AI Search',
    slug: 'seo-ai-search',
    summary: 'Help customers find your business in search results and emerging AI-powered discovery.',
    offerings: [
      {
        title: 'Our SEO Services',
        slug: 'seo-services',
        summary: 'A search strategy covering the technical, content and local foundations of your website.',
      },
      {
        title: 'AI SEO',
        slug: 'ai-seo',
        summary: 'Make your site clearer and more useful for AI-powered search and answer experiences.',
      },
      {
        title: 'eCommerce SEO',
        slug: 'ecommerce-seo',
        summary: 'Improve how product and category pages are structured for search discovery.',
      },
      {
        title: 'Local SEO',
        slug: 'local-seo',
        summary: 'Strengthen your visibility for customers searching for services in your area.',
      },
      {
        title: 'On-Page SEO',
        slug: 'on-page-seo',
        summary: 'Improve page titles, headings, copy and internal links around customer searches.',
      },
      {
        title: 'Technical SEO',
        slug: 'technical-seo',
        summary: 'Address site structure, indexing and performance issues that make pages harder to find.',
      },
      {
        title: 'Conversion Rate Optimization',
        slug: 'conversion-rate-optimization',
        summary: 'Find and improve the points where visitors can become enquiries or customers.',
      },
    ],
  },
  {
    title: 'Websites & Content',
    slug: 'websites-content',
    summary: 'Build and maintain a useful online home for your business, products and stories.',
    offerings: [
      {
        title: 'Web Hosting & Domains',
        slug: 'web-hosting-domains',
        summary: 'Get the domain and hosting setup needed to keep your business website online.',
      },
      {
        title: 'Website Design',
        slug: 'website-design',
        summary: 'Create a clear, mobile-friendly website that introduces your business and services.',
      },
      {
        title: 'eCommerce Website Design',
        slug: 'ecommerce-website-design',
        summary: 'Give customers an easy way to browse products, place orders and take the next step.',
      },
      {
        title: 'Website Maintenance',
        slug: 'website-maintenance',
        summary: 'Keep website content, software and essential pages up to date over time.',
      },
      {
        title: 'Content Creation',
        slug: 'content-creation',
        summary: 'Plan and produce useful visual and written content for your business channels.',
      },
      {
        title: 'Content Writing',
        slug: 'content-writing',
        summary: 'Explain your products and services with clear, customer-focused website copy.',
      },
      {
        title: 'Pricing & Packages',
        slug: 'pricing-packages',
        summary: 'Compare service options and shape a package around your business priorities.',
      },
    ],
  },
  {
    title: 'Brand, BTL & Creative',
    slug: 'brand-btl-creative',
    summary: 'Bring your brand to life across public spaces, live experiences and creative materials.',
    offerings: [
      {
        title: 'Billboard Advertising',
        slug: 'billboard-advertising',
        summary: 'Plan outdoor advertising placements that put your message in front of local audiences.',
      },
      {
        title: 'Roadshows & Activations',
        slug: 'roadshows-activations',
        summary: 'Take your brand to customers through planned roadshows and on-the-ground activations.',
      },
      {
        title: 'Experiential Marketing',
        slug: 'experiential-marketing',
        summary: 'Create interactive brand experiences that invite people to participate.',
      },
      {
        title: 'Corporate Event Staffing',
        slug: 'corporate-event-staffing',
        summary: 'Arrange event staff to support guest engagement and on-site brand activity.',
      },
      {
        title: 'Printing & Branding',
        slug: 'printing-branding',
        summary: 'Prepare branded print materials for campaigns, events and everyday business use.',
      },
      {
        title: 'Radio Advertising',
        slug: 'radio-advertising',
        summary: 'Plan radio advertising to share your message with listeners in your target market.',
      },
      {
        title: 'Graphic Design',
        slug: 'graphic-design',
        summary: 'Design consistent visual assets for your campaigns, social channels and business.',
      },
    ],
  },
];
