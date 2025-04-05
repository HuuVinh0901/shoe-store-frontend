import React, { useEffect, useState } from 'react';
import {
  Card,
  Row,
  Col,
  Input,
  Button,
  Typography,
  Table,
  Tag,
  Space,
  Avatar,
  Divider,
  message,
} from 'antd';
import {
  MoreOutlined,
  ArrowLeftOutlined,
  ShoppingCartOutlined,
  DollarCircleOutlined,
} from '@ant-design/icons';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import EditDetail from './EditDetail';
import { fetchOrderByUser } from '../../../services/orderService';
import { updateUserInfo, updateUserStatus } from '../../../services/userService';

const { Title, Text } = Typography;

const ordersColumns = [
  { title: 'ORDER', dataIndex: 'order', key: 'order', render: (text) => <Space>{text}</Space> },
  { title: 'DATE', dataIndex: 'date', key: 'date' },
  {
    title: 'STATUS',
    dataIndex: 'status',
    key: 'status',
    render: (text, record) => (
      <Tag color={record.statusColor} style={{ fontWeight: 'bold' }}>
        {text}
      </Tag>
    ),
  },
  { title: 'SPENT', dataIndex: 'spent', key: 'spent' },
];

const CustomerDetail = () => {
  const { id: customerId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [customerData, setCustomerData] = useState(null);
  const [ordersData, setOrdersData] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (location.state && location.state.customer) {
      setCustomerData({
        id: location.state.customer.key,
        name: location.state.customer.customerName,
        email: location.state.customer.email,
        phoneNumber: location.state.customer.phoneNumber,
        status: location.state.customer.status,
        ordersCount: location.state.customer.order,
        totalSpent: location.state.customer.totalSpent,
        username: location.state.customer.customerName,
        customerGroup: location.state.customer.customerGroup,
        avatar: null,
        password: '',
      });
    }
  }, [location.state]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersResponse = await fetchOrderByUser(customerId);
        console.log("data: ", ordersResponse)
        if (ordersResponse) {
          const formattedOrders = ordersResponse.map((order) => ({
            key: order.orderID,
            order: `#${order.orderID}`,
            date: order.orderDate,
            status: order.status,
            statusColor: order.status === 'DELIVERED' ? 'blue' : 'red',
            spent: order.total,
          }));
          setOrdersData(formattedOrders);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    fetchOrders();
  }, [customerId]);

  const handleBack = () => {
    navigate('/admin/customers');
  };

  const handleEditClick = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleSave = async (updatedCustomer) => {
    try {
      const userDTO = {
        userID: customerData.id,
        name: updatedCustomer.name,
        email: updatedCustomer.email,
        password: customerData.password || 'defaultPassword',
        phoneNumber: updatedCustomer.phoneNumber,
        status: customerData.status,
        CI: customerData.CI || '',
        roles: customerData.roles || [{ roleName: 'CUSTOMER' }],
      };
      const updatedData = await updateUserInfo(customerData.id, userDTO);
      setCustomerData({
        ...customerData,
        name: updatedData.name,
        email: updatedData.email,
        phoneNumber: updatedData.phoneNumber,
      });
      setShowModal(false);

      if (location.state && location.state.onUpdate) {
        location.state.onUpdate();
      }
    } catch (error) {
      console.error('Error updating customer:', error);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const statusData = { status: newStatus };
      const updatedData = await updateUserStatus(customerData.id, statusData);
      console.log(updatedData)
      setCustomerData({
        ...customerData,
        status: updatedData.status || newStatus,
      });
      message.success(`Customer status updated to ${newStatus} successfully`);

      if (location.state && location.state.onUpdate) {
        location.state.onUpdate();
      }
    } catch (error) {
      console.error('Error changing customer status:', error);
      message.error('Failed to update customer status');
    }
  };

  if (!customerData) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: 8, height: 'calc(100vh - 24px)', overflow: 'hidden', background: '#f7f7f7' }}>
      <Card style={{ borderRadius: 8 }}>
        <Row justify="space-between" align="middle" gutter={[16, 16]}>
          <Col>
            <Button icon={<ArrowLeftOutlined />} onClick={handleBack} />
          </Col>
          <Col>
            <Title level={2} style={{ margin: 0 }}>
              Customer ID: {customerId}
            </Title>
          </Col>
          <Col>
            {customerData.status === 'Active' ? (
              <Button type="primary" danger onClick={() => handleStatusChange('Inactive')}>
                Deactivate Customer
              </Button>
            ) : (
              <Button type="primary" onClick={() => handleStatusChange('Active')}>
                Activate Customer
              </Button>
            )}
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col xs={24} lg={8}>
            <Card style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <Avatar src={customerData.avatar} size={80} />
              </div>
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <Title level={4} style={{ margin: 0 }}>
                  {customerData.name}
                </Title>
                <Text type="secondary">Customer ID #{customerData.id}</Text>
              </div>

              <Row justify="space-around" style={{ marginBottom: 16 }}>
                <Col style={{ display: 'flex', flexDirection: 'row' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '100%',
                      padding: 12,
                      background: '#E6F4FF',
                      borderRadius: 10,
                      marginRight: 5,
                    }}
                  >
                    <ShoppingCartOutlined style={{ fontSize: 24, color: '#4096FF' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Title level={4} style={{ margin: 0 }}>
                      {customerData.ordersCount}
                    </Title>
                    <Text type="secondary">Orders</Text>
                  </div>
                </Col>
                <Col style={{ display: 'flex', flexDirection: 'row' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '100%',
                      padding: 12,
                      background: '#E6F4FF',
                      borderRadius: 10,
                      marginRight: 5,
                    }}
                  >
                    <DollarCircleOutlined style={{ fontSize: 24, color: '#4096FF' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Title level={4} style={{ margin: 0 }}>
                      {customerData.totalSpent}
                    </Title>
                    <Text type="secondary">Spent</Text>
                  </div>
                </Col>
              </Row>

              <div style={{ padding: '0 16px' }}>
                <Title level={5} style={{ marginBottom: 8 }}>
                  Details
                </Title>
                <Divider />
                <p><strong>Username:</strong> {customerData.username}</p>
                <p><strong>Email:</strong> {customerData.email}</p>
                <p>
                  <strong>Status:</strong>{' '}
                  <Text style={{ color: customerData.status === 'Active' ? '#52c41a' : '#ff4d4f' }}>
                    {customerData.status}
                  </Text>
                </p>
                <p><strong>Contact:</strong> {customerData.phoneNumber}</p>
              </div>

              <Button type="primary" block style={{ marginTop: 16 }} onClick={handleEditClick}>
                Edit Details
              </Button>
            </Card>
          </Col>

          <Col xs={24} lg={16}>
            <Card style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <Row justify="space-between" align="middle">
                <Col>
                  <Title level={4}>Orders placed</Title>
                </Col>
                <Col>
                  <Input.Search placeholder="Search order" style={{ width: 200 }} />
                </Col>
              </Row>
              <Table
                onRow={(record) => ({
                  onClick: () => navigate(`/admin/orders/${record.orderId}`),
                  style: { cursor: 'pointer' },
                })}
                columns={ordersColumns}
                dataSource={ordersData}
                pagination={{ pageSize: 6 }}
                rowSelection={{}}
                bordered
                style={{ marginTop: 16 }}
              />
            </Card>
          </Col>
        </Row>
      </Card>
      <EditDetail
        open={showModal}
        onCancel={handleClose}
        customer={customerData}
        handleSave={handleSave}
        mode="edit"
      />
    </div>
  );
};

export default CustomerDetail;