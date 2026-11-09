export interface Offering {
  title: string;
  slug: string;
  summary: string;
  intro: string;
  includes: string[];
  goodFitFor: string[];
  showcase?: {
    heading: string;
    description: string;
    images: {
      src: string;
      alt: string;
      caption: string;
    }[];
  };
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
        intro:
          'Bring your online activity into one clear plan. We help you choose the channels, messages and next steps that make sense for your customers and your available resources.',
        includes: [
          'A review of your current online presence, audience and business priorities.',
          'Channel and campaign recommendations matched to your goals and capacity.',
          'A practical action plan with priorities, responsibilities and ways to review progress.',
        ],
        goodFitFor: ['Businesses unsure where to focus their marketing effort.', 'Teams that want their website, social channels and campaigns working together.'],
      },
      {
        title: 'Google / PPC Advertising',
        slug: 'google-ppc-advertising',
        summary: 'Search and pay-per-click campaigns designed around what your customers are looking for.',
        intro:
          'Reach people while they are actively searching for a product or service like yours. We plan and manage paid search campaigns around relevant searches, clear landing pages and an agreed advertising budget.',
        includes: [
          'Keyword and audience research based on the services you want to promote.',
          'Campaign structure, ad copy and recommendations for relevant landing pages.',
          'Performance reviews against agreed measures such as calls, enquiries or sales.',
        ],
        goodFitFor: ['Businesses with a clear offer and a defined area or audience to reach.', 'Teams ready to set aside an advertising budget separate from management fees.'],
      },
      {
        title: 'Social Media Marketing',
        slug: 'social-media-marketing',
        summary: 'Build a consistent social presence with a clear content and audience plan.',
        intro:
          'Use social media to show what your business does, answer customer questions and build a more consistent relationship with your audience. We use your analytics to understand what is changing, make informed decisions and anticipate promising content and audience trends—then adapt the plan as new results come in.',
        includes: [
          'A review of your social profiles, audience and current content.',
          'A channel plan with content themes, posting rhythm and calls to action.',
          'Content support and regular reviews of engagement, reach and enquiries to guide next steps.',
        ],
        goodFitFor: ['Businesses that post irregularly or without a clear purpose.', 'Owners who want their social content to support real customer conversations.'],
        showcase: {
          heading: 'A look at social performance',
          description:
            'We use analytics like these to see what is gaining attention, where viewers discover content and how performance changes over time. Those patterns inform practical decisions and help us anticipate opportunities—not promise exact future results. Every audience and account is different.',
          images: [
            {
              src: '/services/social-media-marketing/overview-7-days.webp',
              alt: 'Seven-day social analytics overview showing 23.9 thousand post views, 309 profile views, 514 likes, 13 comments and 13 shares.',
              caption: 'Overview · 7 days',
            },
            {
              src: '/services/social-media-marketing/viewers-7-days.webp',
              alt: 'Seven-day viewer analytics showing 18.6 thousand total viewers and 16.7 thousand new viewers.',
              caption: 'Viewer insights · 7 days',
            },
            {
              src: '/services/social-media-marketing/viewers-365-days.webp',
              alt: 'Annual viewer analytics from November 8, 2025 to November 7, 2026 showing 428.9 thousand total viewers and 361.9 thousand new viewers.',
              caption: 'Viewer insights · 365 days',
            },
            {
              src: '/services/social-media-marketing/overview-365-days.webp',
              alt: 'Annual social analytics overview from November 8, 2025 to November 7, 2026 showing 527.2 thousand post views, 4 thousand profile views, 13.1 thousand likes, 425 comments and 574 shares.',
              caption: 'Overview · 365 days',
            },
            {
              src: '/services/social-media-marketing/traffic-sources.webp',
              alt: 'Social traffic sources: For You 54.8 percent, Search 41.9 percent, Personal profile 3.1 percent and Following 0.2 percent.',
              caption: 'Traffic sources · 365 days',
            },
          ],
        },
      },
      {
        title: 'Influencer Marketing',
        slug: 'influencer-marketing',
        summary: 'Plan creator partnerships that connect your products with relevant audiences.',
        intro:
          'Work with creators whose audiences and style make sense for your brand. We help shape the campaign, agree expectations and keep deliverables clear for both the business and the creator.',
        includes: [
          'Campaign goals, creator selection criteria and a proposed brief.',
          'Coordination of agreed content, timelines and approval steps.',
          'A post-campaign review using the available reach, engagement and response data.',
        ],
        goodFitFor: ['Brands launching a product, promotion or local campaign.', 'Businesses that want creator partnerships to feel relevant and well-organized.'],
      },
      {
        title: 'TikTok Advertising',
        slug: 'tiktok-advertising',
        summary: 'Short-form video campaigns made to introduce your business and reach new customers.',
        intro:
          'Introduce your business through short-form video ads designed for the way people use TikTok. We help plan the message, creative direction, audience and campaign review before spend is committed.',
        includes: [
          'Campaign objectives and audience recommendations.',
          'Short-form video concepts and ad copy suited to the platform.',
          'Setup guidance and reviews of delivery and agreed campaign measures.',
        ],
        goodFitFor: ['Businesses with a visual product or service that can be shown quickly.', 'Teams prepared to test creative and learn from campaign results.'],
      },
      {
        title: 'YouTube Advertising',
        slug: 'youtube-advertising',
        summary: 'Video campaigns that help your business get discovered across YouTube.',
        intro:
          'Put a clear video message in front of audiences on YouTube. We help define who the campaign should reach, what the video needs to communicate and how results will be reviewed.',
        includes: [
          'Audience, placement and campaign objective recommendations.',
          'Guidance on video length, message and the next step for viewers.',
          'Campaign setup support and reporting against agreed measures.',
        ],
        goodFitFor: ['Businesses with a video story, demonstration or offer to share.', 'Teams looking to add video reach to an existing marketing plan.'],
      },
      {
        title: 'Events Digital Marketing',
        slug: 'events-digital-marketing',
        summary: 'Promote events online with coordinated content, audience targeting and follow-up.',
        intro:
          'Build awareness before an event, help the right people decide to attend and keep communication useful after it ends. Campaign activity is planned around your event date, audience and registration process.',
        includes: [
          'A promotion timeline with key messages and audience touchpoints.',
          'Digital content and advertising recommendations for event registration.',
          'Post-event follow-up ideas and a review of available response data.',
        ],
        goodFitFor: ['Organizers promoting a public, business or community event.', 'Teams that need online promotion coordinated around a fixed event date.'],
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
        intro:
          'Make it easier for people to find and understand your business in search. We review your website and priorities, then recommend a focused mix of technical, on-page and local improvements.',
        includes: [
          'A search visibility and website structure review.',
          'Prioritized recommendations for technical fixes and useful content.',
          'A clear plan for tracking search visibility and meaningful visits.',
        ],
        goodFitFor: ['Businesses that depend on people discovering them online.', 'Teams looking for a joined-up search plan rather than isolated fixes.'],
      },
      {
        title: 'AI SEO',
        slug: 'ai-seo',
        summary: 'Make your site clearer and more useful for AI-powered search and answer experiences.',
        intro:
          'Help search systems understand your business by making your website accurate, well-structured and genuinely useful. We focus on strong information and accessible site foundations, not promises of placement in AI answers.',
        includes: [
          'A review of how clearly your services, expertise and business details are explained.',
          'Recommendations for page structure, original content and accurate supporting information.',
          'Improvements to relevant technical and structured-data foundations where appropriate.',
        ],
        goodFitFor: ['Organizations reviewing their search strategy as discovery tools evolve.', 'Businesses with useful expertise that is not yet clearly represented on their website.'],
      },
      {
        title: 'eCommerce SEO',
        slug: 'ecommerce-seo',
        summary: 'Improve how product and category pages are structured for search discovery.',
        intro:
          'Help shoppers discover the right products through search. We review product and category pages, then prioritize improvements to page content, navigation and technical signals.',
        includes: [
          'Product and category page structure and content recommendations.',
          'Guidance for product titles, descriptions and internal links.',
          'A review of indexing and discoverability issues affecting the store.',
        ],
        goodFitFor: ['Online stores with products that customers search for by name or need.', 'Store owners who want to improve organic discovery without confusing shoppers.'],
      },
      {
        title: 'Local SEO',
        slug: 'local-seo',
        summary: 'Strengthen your visibility for customers searching for services in your area.',
        intro:
          'Make your location, service area and business information easier for nearby customers to confirm. We focus on accurate listings and useful local pages that reflect how you actually serve customers.',
        includes: [
          'A review of local business details and directory consistency.',
          'Recommendations for location pages and locally relevant website content.',
          'Guidance on requesting and responding to customer reviews appropriately.',
        ],
        goodFitFor: ['Businesses serving customers in a specific town, neighborhood or region.', 'Organizations with outdated or inconsistent location information online.'],
      },
      {
        title: 'On-Page SEO',
        slug: 'on-page-seo',
        summary: 'Improve page titles, headings, copy and internal links around customer searches.',
        intro:
          'Make each important page easier for visitors and search engines to understand. We refine page structure and content around real customer questions while keeping the message natural and useful.',
        includes: [
          'Page title, heading and description recommendations.',
          'Content improvements aligned with relevant customer searches.',
          'Internal linking suggestions that help visitors find related information.',
        ],
        goodFitFor: ['Websites with valuable services that are difficult to understand from their pages.', 'Teams refreshing existing content instead of starting from scratch.'],
      },
      {
        title: 'Technical SEO',
        slug: 'technical-seo',
        summary: 'Address site structure, indexing and performance issues that make pages harder to find.',
        intro:
          'Resolve technical barriers that can make a website difficult to crawl, index or use. We identify issues, explain their impact and prioritize practical fixes with your development team.',
        includes: [
          'A review of crawlability, indexing and important site signals.',
          'Checks for broken paths, duplicate pages and structural problems.',
          'A prioritized technical action list with explanations for implementation.',
        ],
        goodFitFor: ['Websites with pages missing from search or recurring technical issues.', 'Teams planning a redesign, migration or substantial content update.'],
      },
      {
        title: 'Conversion Rate Optimization',
        slug: 'conversion-rate-optimization',
        summary: 'Find and improve the points where visitors can become enquiries or customers.',
        intro:
          'Help more of the right visitors take a useful next step. We examine the journey from landing page to enquiry or purchase and identify changes that can be tested and measured.',
        includes: [
          'A review of key pages, calls to action and customer journeys.',
          'A prioritized list of usability and content improvements.',
          'A measurement plan for evaluating changes against agreed conversion events.',
        ],
        goodFitFor: ['Businesses already receiving visits but seeing few enquiries or orders.', 'Teams able to review performance data and test changes over time.'],
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
        intro:
          'Put the essential pieces of your website in place with a domain and hosting setup suited to your needs. We help you understand the options and keep account ownership and renewal details clear.',
        includes: [
          'Help selecting and registering an available domain name.',
          'Hosting recommendations based on your website and expected usage.',
          'Setup guidance, renewal information and access handover.',
        ],
        goodFitFor: ['Businesses preparing to launch their first website.', 'Owners who want clearer control of their existing domain and hosting accounts.'],
      },
      {
        title: 'Website Design',
        slug: 'website-design',
        summary: 'Create a clear, mobile-friendly website that introduces your business and services.',
        intro:
          'Give your business a helpful online home. We organize the pages, content and visual direction around what customers need to know, with mobile use and clear next steps in mind.',
        includes: [
          'Page structure and design direction based on your business goals.',
          'Responsive page layouts for essential business information.',
          'Contact paths, content setup and guidance for keeping pages current.',
        ],
        goodFitFor: ['Businesses without a website or with an outdated one.', 'Owners who need their services and contact options to be easier to find.'],
      },
      {
        title: 'eCommerce Website Design',
        slug: 'ecommerce-website-design',
        summary: 'Give customers an easy way to browse products, place orders and take the next step.',
        intro:
          'Create an online store where customers can browse products, understand their options and place orders with confidence. The design is planned around your catalog, fulfilment and payment needs.',
        includes: [
          'Store structure for product categories, product details and search.',
          'A customer journey for cart, checkout and order confirmation.',
          'Guidance on product content, payment options and order fulfilment setup.',
        ],
        goodFitFor: ['Retailers ready to sell beyond a physical location or social inbox.', 'Businesses that need product browsing and ordering in one place.'],
      },
      {
        title: 'Website Maintenance',
        slug: 'website-maintenance',
        summary: 'Keep website content, software and essential pages up to date over time.',
        intro:
          'Keep your website useful after launch with planned updates and routine checks. We agree what is covered, how requests are handled and which tasks remain with your team.',
        includes: [
          'Content and essential page updates within an agreed scope.',
          'Routine checks of key site functions and available software updates.',
          'A clear record of completed work and any items needing specialist attention.',
        ],
        goodFitFor: ['Organizations whose website information changes regularly.', 'Owners who want a dependable process for routine website upkeep.'],
      },
      {
        title: 'Content Creation',
        slug: 'content-creation',
        summary: 'Plan and produce useful visual and written content for your business channels.',
        intro:
          'Create content that helps customers understand your offer and gives your channels a consistent voice. We plan around your audience, available materials and the places you intend to publish.',
        includes: [
          'Content themes and formats suited to your communication goals.',
          'Agreed written or visual assets for your website and digital channels.',
          'Publishing guidance so your team can use and maintain the content.',
        ],
        goodFitFor: ['Businesses that have useful expertise but struggle to communicate it consistently.', 'Teams that need a practical bank of content for planned campaigns.'],
      },
      {
        title: 'Content Writing',
        slug: 'content-writing',
        summary: 'Explain your products and services with clear, customer-focused website copy.',
        intro:
          'Explain what you offer in language customers can follow. We shape website copy around your audience, answer common questions and make the next step clear without overstating what your business does.',
        includes: [
          'Discovery and content structure for agreed website pages.',
          'Draft copy based on your services, tone and customer questions.',
          'A review and revision process before the final copy is handed over.',
        ],
        goodFitFor: ['Businesses rewriting unclear, outdated or overly technical website copy.', 'Teams launching new services that need clear page content.'],
      },
      {
        title: 'Pricing & Packages',
        slug: 'pricing-packages',
        summary: 'Compare service options and shape a package around your business priorities.',
        intro:
          'Choose support that fits your current priorities and resources. We discuss the work you need, explain what is included and agree the scope and price before anything begins.',
        includes: [
          'A conversation about your goals, timeline and available budget.',
          'A written scope showing deliverables, responsibilities and assumptions.',
          'A clear quotation for the agreed work, with optional items identified separately.',
        ],
        goodFitFor: ['Owners comparing support options before committing.', 'Teams that want a focused scope rather than an unclear bundle of services.'],
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
        intro:
          'Take a concise campaign message into public spaces. We help consider the audience, location, timing and creative requirements so the placement supports a clear business objective.',
        includes: [
          'Audience and location planning for the intended campaign area.',
          'Creative direction and artwork requirements for the selected format.',
          'Coordination and review of placement details before the campaign runs.',
        ],
        goodFitFor: ['Brands seeking visibility in defined towns, routes or neighborhoods.', 'Campaigns with a message that can be understood quickly at a distance.'],
      },
      {
        title: 'Roadshows & Activations',
        slug: 'roadshows-activations',
        summary: 'Take your brand to customers through planned roadshows and on-the-ground activations.',
        intro:
          'Meet customers where they are with a planned roadshow or brand activation. We help turn the campaign idea into a practical schedule, location plan and on-site experience.',
        includes: [
          'Activation concept, audience and location planning.',
          'A schedule covering setup, on-site activity and team responsibilities.',
          'Materials and follow-up recommendations aligned with campaign goals.',
        ],
        goodFitFor: ['Brands launching products or building awareness in local communities.', 'Teams that want face-to-face engagement supported by an organized plan.'],
      },
      {
        title: 'Experiential Marketing',
        slug: 'experiential-marketing',
        summary: 'Create interactive brand experiences that invite people to participate.',
        intro:
          'Give people a reason to take part in your campaign, not just see it. We develop an interactive concept around your brand and plan the practical details needed to deliver it consistently.',
        includes: [
          'An experience concept and participation flow for the intended audience.',
          'Recommendations for venue, materials and brand touchpoints.',
          'A delivery checklist and ways to gather useful participant feedback.',
        ],
        goodFitFor: ['Brands that want product trials, demonstrations or direct audience interaction.', 'Organizations planning a campaign where participation is central to the message.'],
      },
      {
        title: 'Corporate Event Staffing',
        slug: 'corporate-event-staffing',
        summary: 'Arrange event staff to support guest engagement and on-site brand activity.',
        intro:
          'Help your event run smoothly with staff who understand their roles and the experience you want guests to have. We clarify the brief, staffing requirements and on-site coordination before the event.',
        includes: [
          'Role and staffing requirements based on the event plan.',
          'Briefing notes covering guest interaction, schedule and escalation points.',
          'Coordination guidance for event-day arrival and team communication.',
        ],
        goodFitFor: ['Organizations hosting launches, conferences or public-facing events.', 'Event teams that need additional guest-facing or activation support.'],
      },
      {
        title: 'Printing & Branding',
        slug: 'printing-branding',
        summary: 'Prepare branded print materials for campaigns, events and everyday business use.',
        intro:
          'Make sure printed materials look consistent and communicate the right details. We help prepare the design, check specifications and coordinate the files needed for production.',
        includes: [
          'Design or adaptation of agreed branded print materials.',
          'Checks for dimensions, color setup, copy and print-ready file requirements.',
          'Coordination support for quantities, production details and delivery timing.',
        ],
        goodFitFor: ['Businesses preparing event, retail or promotional materials.', 'Teams that need print assets aligned with existing brand guidelines.'],
      },
      {
        title: 'Radio Advertising',
        slug: 'radio-advertising',
        summary: 'Plan radio advertising to share your message with listeners in your target market.',
        intro:
          'Share a memorable message with listeners through a planned radio campaign. We help define the audience, station and timing considerations, and shape a script around one clear action.',
        includes: [
          'Campaign audience, station and schedule considerations.',
          'Script direction and production requirements for the agreed spot.',
          'A review plan based on available campaign and response information.',
        ],
        goodFitFor: ['Businesses whose customers listen to relevant local or regional stations.', 'Campaigns that benefit from a concise, repeatable message and clear call to action.'],
      },
      {
        title: 'Graphic Design',
        slug: 'graphic-design',
        summary: 'Design consistent visual assets for your campaigns, social channels and business.',
        intro:
          'Create visual materials that make your message easier to recognize and understand. We work from your brand direction and intended use to prepare designs for the right formats.',
        includes: [
          'Creative direction and design concepts for the agreed brief.',
          'Assets prepared for specified print or digital placements.',
          'Final exports and, where agreed, editable working files.',
        ],
        goodFitFor: ['Businesses that need a consistent look across campaign materials.', 'Teams preparing a launch, promotion or regular stream of visual content.'],
      },
    ],
  },
];

export function getOffering(slug: string): { group: OfferingGroup; offering: Offering } | undefined {
  for (const group of offeringGroups) {
    const offering = group.offerings.find((item) => item.slug === slug);
    if (offering) return { group, offering };
  }
  return undefined;
}
