import React, { Component, CSSProperties, ReactNode } from "react";
import { Layout, Menu } from "antd";
import {
  ShoppingOutlined,
  ProductOutlined,
  UserOutlined,
  TeamOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { Link, Navigate, Outlet } from "react-router-dom";
import { Props, State, MyMenuItem, CurrentUser } from './interface/Menu';
import './App.css';

const { Header, Sider, Content } = Layout;

const contentStyle: React.CSSProperties = {
  textAlign: "center",
  minHeight: 120,
  lineHeight: "120px",
  color: "#fff",
  backgroundColor: "#dddddd",
};

const layoutStyle: CSSProperties = {
  overflow: "auto",
  width: "100%",
  minHeight: "100vh",
  height: "100%",
};

const item: MyMenuItem[] = [
  {
    key: "item01",
    label: "Sản Phẩm",
    icon: <ProductOutlined />,
    href: "sanpham",
    children: [
      {
        key: "item02",
        label: "Giày",
        href: "giay",
      },
      {
        key: "item03",
        label: "Dép",
        href: "dep",
      }
    ],
  },
  {
    key: "item04",
    label: "Đơn Hàng",
    icon: <ShoppingOutlined />,
    href: "donhang",
    children: [
      {
        key: "item05",
        label: "Trạng Thái Đơn",
        href: "trangthaidonhang",
      },
      {
        key: "item06",
        label: "Lịch Sử Bán Hàng",
        href: "lichsubanhang",
      },
    ],
  },
  {
    key: "item07",
    label: "Khách Hàng",
    icon: <TeamOutlined />,
    href: "khachhang",
  },
  {
    key: "item08",
    label: "Báo Cáo - Phân Tích",
    icon: <BarChartOutlined />,
    href: "baocao-phantich",
  },
  {
    key: "item09",
    label: "Nhân Viên",
    icon: <UserOutlined />,
    href: "nhanvien",
  },
];

export default class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const jsonUser: string | null = localStorage.getItem("isLoggedIn");
    const user: CurrentUser = jsonUser !== null ? JSON.parse(jsonUser) : { username: '', password: '' };
    this.state = {
      collapsed: false,
      isloggedIn: user.username === "admin" && user.password === "123",
      username: user.username,
    };
  }

  handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    this.setState({ isloggedIn: false });
  };

  toggleCollapsed = () => {
    this.setState({ collapsed: !this.state.collapsed });
  };

  render(): ReactNode {
    const { collapsed } = this.state;
  
    return this.state.isloggedIn ? (
      <>
        <Layout style={layoutStyle}>
          <Sider collapsed={collapsed}>
            {collapsed ? "" :
              <div>
                <span id="logoprofile" className="fa-regular fa-circle-user"></span>
                <span id="hi">{this.state.username}</span>
              </div>
            }
            <Menu theme="dark" mode="inline" defaultSelectedKeys={["item01"]}>
              {item.map((item) => {
                return !item.children ? (
                  <Menu.Item key={item.key} icon={item.icon}>
                    <Link to={item.href}>{item.label}</Link>
                  </Menu.Item>
                ) : (
                  <Menu.SubMenu key={item.key} title={item.label} icon={item.icon}>
                    {item.children.map((child) => (
                      <Menu.Item key={child.key} icon={child.icon}>
                        <Link to={child.href}>{child.label}</Link>
                      </Menu.Item>
                    ))}
                  </Menu.SubMenu>
                );
              })}
            </Menu>
          </Sider>
          <Layout>
            <Header className="header">
              <img className="logoImage" src="https://clipart-library.com/img/2102477.png" alt="logo" onClick={this.toggleCollapsed} />
              <div className='logo'>
                <Link to='/pages'>
                  <p>SHOES SHOP</p>
                </Link>
              </div>
              <div className='user'>
                <span className="fa-regular fa-circle-user"/>
                <span>Xin Chào: {this.state.username}</span>
                <span id="logout" onClick={this.handleLogout} className='fa-solid fa-sign-out-alt'></span>
              </div>
            </Header>
            <Content style={contentStyle} className="content">
              <Outlet />
              
            </Content> 
          </Layout>
        </Layout>
      </>
    ) : (
      <Navigate to="/" />
    );
  }  
}