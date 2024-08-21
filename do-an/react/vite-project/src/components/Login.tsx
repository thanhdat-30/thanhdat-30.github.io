import '../styles/login.css';
import React, { Component } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { message } from 'antd';
import { Props, State, CurrentUser } from '../interface/Login';

export default class Login extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const jsonUser: string | null = localStorage.getItem("isLoggedIn");
    const user: CurrentUser = jsonUser !== null ? JSON.parse(jsonUser) : { username: '', password: '' };
    this.state = {
      username: '',
      password: '',
      showPassword: false,
      isLoggedIn: user.username === "admin" && user.password === "123",
    };
  }

  inputName = (name: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      username: name.currentTarget.value,
    });
  };

  inputPass = (pass: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      password: pass.currentTarget.value,
    });
  };

  togglePasswordVisibility = () => {
    this.setState(prevState => ({
      showPassword: !prevState.showPassword,
    }));
  };

  handleLogin = () => {
    if (this.state.username === "admin" && this.state.password === "123") {
      const user: CurrentUser = {
        username: this.state.username,
        password: this.state.password };
      localStorage.setItem("isLoggedIn", JSON.stringify(user));
      this.setState({ isLoggedIn: true });
      this.props.navigate('/pages');
      return;
    }
    message.error("Thông tin đăng nhập chưa đúng!");
  };

  render() {
    return this.state.isLoggedIn ? <Navigate to="/pages" /> : (
      <div className="screen-login">
        <div className="login">
          <h1>Đăng nhập</h1>
          <input className='taikhoan' placeholder='Email hoặc số điện thoại' type='text' value={this.state.username} onChange={this.inputName} />
          <div className="password">
            <input
              className='pass'
              placeholder='Mật khẩu'
              type={this.state.showPassword ? 'text' : 'password'}
              value={this.state.password}
              onChange={this.inputPass}
            />
            <i className='show' onClick={this.togglePasswordVisibility}>
              {this.state.showPassword ? <i className="fa-regular fa-eye-slash"></i> : <i className="fa-regular fa-eye"></i>}
            </i>
          </div>
          <button onClick={this.handleLogin} type="submit">Đăng nhập</button>
        </div>
        <div>
          <Outlet />
        </div>
      </div>
    );
  }
}