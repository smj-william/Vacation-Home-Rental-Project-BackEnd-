import React from "react";
import { Form, Button, Input, Space, Checkbox, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { login, register } from "../utils";
 
class LoginPage extends React.Component {
  formRef = React.createRef(); //制造个变量，用来接下面的form ref然后手动完成操作
  state = {
    asHost: false,
    loading: false,
  };
 
  onFinish = () => {
    console.log("finish form");
  };
 
  handleLogin = async () => {
    const formInstance = this.formRef.current;
 
    try {
      await formInstance.validateFields(); //await用的时候要在他所在函数上加async
    } catch (error) {
      return;
    }
 
    this.setState({
      loading: true,
    });
 
    try {
      const { asHost } = this.state; //解构语法es 6 destructor看box有没有被check
      const resp = await login(formInstance.getFieldsValue(true), asHost);
      this.props.handleLoginSuccess(resp.token, asHost);
    } catch (error) {
      message.error(error.message);
    } finally {
      this.setState({
        loading: false,
      });
    }
  };
 
  handleRegister = async () => {
    const formInstance = this.formRef.current;
 
    try {
      await formInstance.validateFields();
    } catch (error) {
      return;
    }
 
    this.setState({
      loading: true,
    });
 
    try {
      await register(formInstance.getFieldsValue(true), this.state.asHost);
      message.success("Register Successfully");
    } catch (error) {
      message.error(error.message);
    } finally {
      this.setState({
        loading: false,
      });
    }
  };
 
  handleCheckboxOnChange = (e) => {
    this.setState({
      asHost: e.target.checked,
    });
  };
 
  render() { //先看reder这个函数 //form是antd给的样式
    return ( //20px auto 是上下间距20，给了500是为了居中，用margin的模式。这个login form就是包含在这个里面
            // form ref就是拿到这个form的ref，然后把又赋值给
            //登陆界面 用的是ant design 的 form， 配合使用Form.item使用
      <div style={{ width: 500, margin: "20px auto" }}> 
        <Form ref={this.formRef} onFinish={this.onFinish}> 
          <Form.Item
            name="username" 
            rules={[
              {
                required: true,
                message: "Please input your Username!",
              },
            ]}
          >
            <Input
              disabled={this.state.loading}
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
            ]}
          >
            <Input.Password
              disabled={this.state.loading}
              placeholder="Password"
            />
          </Form.Item>
        </Form>
        <Space>
          <Checkbox
            disabled={this.state.loading}
            checked={this.state.asHost}
            onChange={this.handleCheckboxOnChange}
          >
            As Host
          </Checkbox>
          <Button
            onClick={this.handleLogin}
            disabled={this.state.loading}
            shape="round"
            type="primary"
          >
            Log in
          </Button>
          <Button
            onClick={this.handleRegister}
            disabled={this.state.loading}
            shape="round"
            type="primary"
          >
            Register
          </Button>
        </Space>
      </div>
    );
  }
}
 
export default LoginPage;