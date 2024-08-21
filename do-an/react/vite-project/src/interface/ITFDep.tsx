export interface Props {}

export interface State {
  showModal: boolean;
  showDetailModal: boolean;
  currentDep: DataType | null;
  name: string;
  price: number;
  stock: number;
  brand: string;
  thumbnail: string;
  searchTerm: string;
  dep: DataType[];
}

export interface DataType {
  key: string;
  name: string;
  price: number;
  stock: number;
  brand: string;
  thumbnail: string;
}

export interface FieldType {
  key: string;
  name: string;
  price: number;
  stock: number;
  brand: string;
  thumbnail: string;
}