export interface MapDefinition {
  name: string;
  navLinkName?: string;
  img: string;
  link: string;
  
  credit?: MapCredit;
}

export interface MapCredit {
  creditText: string;
  creditLink: string;
}