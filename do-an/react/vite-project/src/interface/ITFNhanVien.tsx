export interface Props {}

export interface State {
  showModal: boolean;
  showDetailModal: boolean;
  currentEmployee: DataType | null;
  searchTerm: string;
  employees: DataType[];
}

export interface DataType {
  key: string;
  employeeName: string;
  position: string;
  department: string;
  status: string;
  dateOfJoining: string;
}

export interface FieldType {
  key: string;
  employeeName: string;
  position: string;
  department: string;
  status: string;
  dateOfJoining: string;
}
