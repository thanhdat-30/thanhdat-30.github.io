export interface Props {}

export interface State {
  showModal: boolean;
  showDetailModal: boolean;
  currentReport: ReportType | null;
  name: string;
  creator: string;
  status: string;
  date: string;
  searchTerm: string;
  reports: ReportType[];
}

export interface ReportType {
  key: string;
  name: string;
  creator: string;
  status: string;
  date: string;
}

export interface FieldType {
  key: string;
  name: string;
  creator: string;
  status: string;
  date: string;
}
