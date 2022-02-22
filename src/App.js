import { Layout, Dropdown, Menu, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import React from "react";
import LoginPage from "./components/LoginPage";
import HostHomePage from "./components/HostHomePage";
import GuestHomePage from "./components/GuestHomePage";

const { Header, Content } = Layout; 
 
class App extends React.Component { // 定义class 且让他继承react component
  state = {  //状态，每次state 改变的时候会re render， render 是 把data --> view 
    authed: false,  //登陆与否的状态
    asHost: false,  //登陆的身份
  };
 
  // life cycle event 
  componentDidMount() { //did mount， 这个函数会在第一次render的时候会执行出来
    const authToken = localStorage.getItem("authToken"); //检查token是否存在，从localstorage把token拿出来
    const asHost = localStorage.getItem("asHost") === "true"; //从localstorage把身份拿出来
    this.setState({  //间接的刷新页面，更新state，会re render一次，等于新建了一个和上面老的那个state做merge，老的会被保留，新的property会被加上
      authed: authToken !== null,
      asHost,
    });
  }
 
  //event handler 
  handleLoginSuccess = (token, asHost) => { //如果log in成功，那么把他们存在local storage，存在里面的好处是能让用户一直保持登陆
    localStorage.setItem("authToken", token);
    localStorage.setItem("asHost", asHost);
    this.setState({
      authed: true,
      asHost,
    });
  };
 
  handleLogOut = () => { //登出就直接把local s里面的清除， 但我们这里做的简单，没有通知后端
    localStorage.removeItem("authToken");
    localStorage.removeItem("asHost");
    this.setState({
      authed: false,
    });
  };
 

  renderContent = () => { //拆解一下各种情况，负责页面内容

    if (!this.state.authed) {
      return <LoginPage handleLoginSuccess={this.handleLoginSuccess}/>; //把这些情况对应的操作 写成一个个component
    }
 
    if (this.state.asHost) {
      return <HostHomePage />; //host
    }
 
    return <GuestHomePage />;//guest
  };
 
  userMenu = (
    <Menu>
      <Menu.Item key="logout" onClick={this.handleLogOut}>
        Log Out
      </Menu.Item>
    </Menu>
  );
 
  render() { //layout， header， content 都是从antd design lib来的，就是个组件库
            // 100vh 的vh是view height，就是用户正在看的
            //Header 里 display flex的意思是，用flexbox的各种属性
            //this.state.authed && 后面就是登陆成功后给一个dropdown 里面包着一个button。 就像{flag && obj},flag true就返回右边
    return (
      <Layout style={{ height: "100vh" }}> 
        <Header style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: "white" }}>
            Stays Booking
          </div>
          {this.state.authed && (
            <div>
              <Dropdown trigger="click" overlay={this.userMenu}>
                <Button icon={<UserOutlined />} shape="circle" />
              </Dropdown>
            </div>
          )}
        </Header>
        <Content
          style={{ height: "calc(100% - 64px)", margin: 20, overflow: "auto" }}
        >
          {this.renderContent()}
        </Content>
      </Layout>
    );
  }
}
//content 里面 高度 100% -64px，是他爹的100% - 64， overflow的意思就是超过了给个scroll bar
 
export default App;
