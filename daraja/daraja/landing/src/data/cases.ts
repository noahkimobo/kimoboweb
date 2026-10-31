export interface CaseStudy {
  client: string;
  service: string;
  before: string;
  whatWeDid: string;
  result: string;
}

/**
 * Left empty on purpose. The Work page tells visitors that case studies are on
 * the way and asks search engines not to index it until you add one.
 */
export const cases: CaseStudy[] = [];
