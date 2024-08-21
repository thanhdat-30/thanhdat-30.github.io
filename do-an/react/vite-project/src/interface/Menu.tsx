export interface MyMenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  children?: MyMenuItem[];
  href: string;
}

export interface CurrentUser {
  username: string;
  password: string;
}

export interface State {
  isloggedIn: boolean;
  username: string;
  collapsed: boolean;
}

export interface Props {}