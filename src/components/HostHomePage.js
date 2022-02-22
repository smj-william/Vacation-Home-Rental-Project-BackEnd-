import { message, Tabs, List, Card, Image, Carousel, Button, Tooltip, Space } from "antd";
import { LeftCircleFilled, RightCircleFilled, InfoCircleOutlined} from "@ant-design/icons";
import Text from "antd/lib/typography/Text";
import React from "react";
import { deleteStay, getStaysByHost, getReservationsByStay} from "../utils";
import Modal from "antd/lib/modal/Modal";
import UploadStay from "./UploadStay";
 
const { TabPane } = Tabs; //意味着tabpane 包含在tab里，antd的默认写法
 
//export就像public class， button点开有弹窗的功能， 就拆成component，对于这种information tab比较好操作
export class StayDetailInfoButton extends React.Component {
    state = {
      modalVisible: false, //设置可见性
    };
   
    openModal = () => {
      this.setState({
        modalVisible: true,
      });
    };
   
    handleCancel = () => {
      this.setState({
        modalVisible: false,
      });
    };
   
    render() {
      const { stay } = this.props; //通过props 传入数据， 拆卸下来 stay
      const { name, description, address, guest_number } = stay;
      const { modalVisible } = this.state;
      return (//节省空间 用个icon， 用tooltip
              //把那个stay右边i information tab 做成一个单独的component，会便利很多，就是下面这个 nfoCircleOutlined
        <>
          <Tooltip title="View Stay Details"> 
            <Button
              onClick={this.openModal}
              style={{ border: "none" }}
              size="large"
              icon={<InfoCircleOutlined />}
            />
          </Tooltip>
          {modalVisible && (
            <Modal
              title={name}
              centered={true}
              visible={modalVisible}
              closable={false}
              footer={null}
              onCancel={this.handleCancel}
            >
              <Space direction="vertical">
                <Text strong={true}>Description</Text> 
                <Text type="secondary">{description}</Text>
                <Text strong={true}>Address</Text>
                <Text type="secondary">{address}</Text>
                <Text strong={true}>Guest Number</Text>
                <Text type="secondary">{guest_number}</Text>
              </Space>
            </Modal>
          )}
        </>
      );
    }
  }

  class RemoveStayButton extends React.Component { //这个功能就只有host能用，所以是private， 不写export
    state = {
      loading: false,
    };
   
    handleRemoveStay = async () => {
      const { stay, onRemoveSuccess } = this.props; //通过props拉数据进来
      this.setState({
        loading: true,
      });
   
      try {
        await deleteStay(stay.id); //有async可以用try
        onRemoveSuccess();
      } catch (error) {
        message.error(error.message);
      } finally {
        this.setState({
          loading: false, //无论怎么样，转圈圈结束
        });
      }
    };
   
    render() {
      return ( // 就是个button
              //loading 要和上面的loading绑在一起
              //onclick的时候， 去handelremovestay
        <Button
          loading={this.state.loading}
          onClick={this.handleRemoveStay}
          danger={true}
          shape="round"
          type="primary"
        >
          Remove Stay
        </Button>
      );
    }
  }

  class ReservationList extends React.Component { //这个component是用来list所有的reservation
    state = {
      loading: false,
      reservations: [],
    };
   
    componentDidMount() { //载入数据
      this.loadData();
    }
   
    loadData = async () => { //载入数据函数
      this.setState({
        loading: true,
      });
   
      try {
        const resp = await getReservationsByStay(this.props.stayId);
        this.setState({
          reservations: resp,
        });
      } catch (error) {
        message.error(error.message);
      } finally {
        this.setState({
          loading: false,
        });
      }
    };
   
    render() {
      const { loading, reservations } = this.state;
   
      return (
        <List
          loading={loading}
          dataSource={reservations}
          renderItem={(item) => ( //用个list就够了，数据很少
            <List.Item>
              <List.Item.Meta
                title={<Text>Guest Name: {item.guest.username}</Text>}
                description={
                  <>
                    <Text>Checkin Date: {item.checkin_date}</Text>
                    <br />
                    <Text>Checkout Date: {item.checkout_date}</Text>
                  </>
                }
              />
            </List.Item>
          )}
        />
      );
    }
  }
   
  class ViewReservationsButton extends React.Component {
    state = {
      modalVisible: false, //维护弹开 或者关闭
    };
   
    openModal = () => {
      this.setState({
        modalVisible: true,
      });
    };
   
    handleCancel = () => {
      this.setState({
        modalVisible: false,
      });
    };
   
    render() {
      const { stay } = this.props; // 等效于 const stay =  this.props.stay
      const { modalVisible } = this.state;
   
      const modalTitle = `Reservations of ${stay.name}`;
   
      return (
        <>
          <Button onClick={this.openModal} shape="round">
            View Reservations
          </Button>
          {modalVisible && (
            <Modal
              title={modalTitle}
              centered={true}
              visible={modalVisible}
              closable={false}
              footer={null}
              onCancel={this.handleCancel}
              destroyOnClose={true}
            >
              <ReservationList stayId={stay.id} />
            </Modal>
          )}
        </>
      );
    }
  }

  

class HostHomePage extends React.Component {
  render() { //ant design 用个tabs component
             //defaultActiveKey 指的是默认进来看到的tab，每个tab对应一个key
             //destroyInactiveTabPane 切换tab的时候，就不显示不active的
    return (
      <Tabs defaultActiveKey="1" destroyInactiveTabPane={true}>
        <TabPane tab="My Stays" key="1">
          <MyStays /> 
        </TabPane>
        <TabPane tab="Upload Stay" key="2">
          <UploadStay />
        </TabPane>
      </Tabs>
    );
  }
  }

class MyStays extends React.Component {
    state = {
      loading: false, //拉数据就有这个state，告诉用户在loading 转圈圈
      data: [],       //用来存数据
    };
   
    //用didmount 拉取数据
    componentDidMount() {
      this.loadData();
    }
   
    //
    loadData = async () => {
      this.setState({
        loading: true, //先把圈圈转起来
      });
   
      try {
        const resp = await getStaysByHost(); // await语法，只有标记了async的函数内才能用此语法
        this.setState({
          data: resp, //把拿回来的数据放到data上
        });
      } catch (error) {
        message.error(error.message);
      } finally {
        this.setState({
          loading: false, //无论如何，成功与否，圈圈得停下
        });
      }
    };

    
   
    render() {
      return (
          //list of card 还能调整长宽（套路）
        <List
          loading={this.state.loading} //自带loading时候disable其他操作的功能
          grid={{  // 调整各种屏幕显示间距
            gutter: 16,
            xs: 1,
            sm: 3,
            md: 3,
            lg: 3,
            xl: 4,
            xxl: 4,
          }}
          dataSource={this.state.data} // 传进来data，用下面renderItem一个个放进去
          renderItem={(item) => (
            <List.Item>
              <Card
                key={item.id} //这里建议定义每个key，可以用来sort啊什么的
                title={
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Text ellipsis={true} style={{ maxWidth: 150 }}>
                      {item.name}
                    </Text>
                    <StayDetailInfoButton stay={item} />
                  </div>
                }
                actions={[<ViewReservationsButton stay={item} />]} //action：就是放卡片底下的
                extra={<RemoveStayButton stay={item} onRemoveSuccess={this.loadData}/>} //extra是card的prop，传进来的一堆virtual dom
                                                                                        //删除stay 的button 
                                                                                        //onRemove是call back，成功之后，调用 重写load
              >
                {
                  <Carousel //图片翻页效果，antd design给的没有，自己加的下面这些箭头翻页效果
                    dots={false}
                    arrows={true}
                    prevArrow={<LeftCircleFilled />}
                    nextArrow={<RightCircleFilled />}
                  >
                    {item.images.map((image, index) => (//mapping each item in the array to <Image/>
                      <div key={index}>
                        <Image src={image.url} width="100%" />
                      </div>
                    ))}
                  </Carousel>
                }
              </Card>
            </List.Item>
          )}
        />
      );
    }
  }
  

export default HostHomePage;