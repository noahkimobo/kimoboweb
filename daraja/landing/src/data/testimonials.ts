export interface Testimonial {
  /** What the client said, in their words. Get written permission first. */
  quote: string;
  /** The client's name as they want it shown. */
  name: string;
  /** Business and the service used, for example "Mama Njeri Fabrics · Migration". */
  business: string;
}

/**
 * Left empty on purpose. While this list is empty the Testimonials section is
 * not rendered at all, so visitors never see a blank box. Add entries like:
 *
 *   { quote: '…', name: '…', business: '…' }
 */
export const testimonials: Testimonial[] = [];
