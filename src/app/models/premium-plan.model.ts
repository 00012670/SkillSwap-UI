export interface ICustomerPortal {
  url: string;
}

export interface ISession {
  sessionId: string;
  publicKey: string;
}

export interface IPremiumPlan {
  id: string;
  priceId: string;
  name: string;
  price: string;
  features: string[];
}
