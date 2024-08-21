export interface Props {}

export interface State {
  showModal: boolean;
  showDetailModal: boolean;
  currentLichsu: DataType | null;
  searchTerm: string;
  lichsubanhang: DataType[];
}

export interface DataType {
  key: string;
  customerName: string;
  diachi: string;
  sdt: string;
  orderDate: string;
  totalAmount: number;
  productName: string;
  productType: string;
}

export interface FieldType {
  key: string;
  customerName: string;
  diachi: string;
  sdt: string;
  orderDate: string;
  totalAmount: number;
  productName: string;
  productType: string;
}