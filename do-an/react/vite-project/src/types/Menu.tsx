export interface Menu {
  icon?: string;
  text?: string;  
  thumbnail?: string;
  href ?: string;
}

export interface CurrentUser {
  username: string;
  password: string;
}

export interface State {
  username: string;
  password: string;
  showPassword: boolean;  
  isLoggedIn: boolean;
  searchTerm: string;
}

export interface Props {
    
}