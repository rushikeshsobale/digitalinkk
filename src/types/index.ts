
export type Offer =
  | { type: "percentage"; value: number }          
  | { type: "bogo"; value: number }              
  | { type: "cross"; relatedProductId: string; discount: number };
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity?:number;
  offer?: Offer; 
  isOfferApplicable?:boolean;
}
export interface CartItem extends Product {
  quantity: number;
  appliedOffer?: Offer; 
}


