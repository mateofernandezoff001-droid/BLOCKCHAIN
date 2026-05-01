export interface TransactionMovement {
  date: string;
  amountUSD: number;
  amountEUR: number;
}

export interface Transaction {
  id?: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  walletAddress: string;
  amountUSD: number;
  amountEUR: number;
  cryptoSymbol: string;
  cryptoAmount: number;
  timestamp: string;
  movements: TransactionMovement[];
}

export interface CryptoPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
}
