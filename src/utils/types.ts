export interface Merchant {
  uid: string;
  merchant_id: number;
  full_name: string;
  company_name: string;
  phone_number: string;
  city: string | null;
  payment_volume: string;
  balanceToDisburse: string;
  commissions: any[];
  createdAt: string;

};