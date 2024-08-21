export interface Props {}

export interface State {
  showModal: boolean;
  showDetailModal: boolean;
  currentOrder: DataType | null;
  searchTerm: string;
  orders: DataType[];
}

export interface DataType {
  key: string;
  customerName: string;
  status: string;
  orderDate: string;
  totalAmount: number;
  productName: string;
  productType: string;
}

export interface FieldType {
  key: string;
  customerName: string;
  status: string;
  orderDate: string;
  totalAmount: number;
  productName: string;
  productType: string;
}