import { useEffect, useState } from 'react';
import { Table, Row, Col, Input, Button, Tag, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { createCustomer, getCustomers, getDeliveredOrdersCount, getTotalAmountByUserId, searchUsers } from '../../../services/userService';
import { currencyFormat } from '../../../utils/helper';
import './Customer.scss';
import EditDetail from './EditDetail';

const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [refresh, setRefresh] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [totalItems, setTotalItems] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const isDetailView = location.pathname.includes('/admin/customers/');

  const loadCustomers = async (page = 1, size = 12) => {
    const data = await getCustomers(page, size);
    if (data.statusCode === 200) {
      const enhanced = await enhanceCustomers(data.data.items);
      setCustomers(enhanced);
      setTotalItems(data.data.totalElements);
      setCurrentPage(page);
      setPageSize(size);
    }
  };

  useEffect(() => {
    if (!location.pathname.includes("/admin/customers/")) {
      loadCustomers(currentPage, pageSize);
    }
  }, [location.pathname, refresh, currentPage, pageSize]);

  const enhanceCustomers = async (customers) => {
    return Promise.all(
      customers.map(async (customer) => {
        const count = await getDeliveredOrdersCount(customer.userID);
        const amount = await getTotalAmountByUserId(customer.userID);
        return {
          key: customer.userID,
          customerName: customer.name,
          email: customer.email,
          phoneNumber: customer.phoneNumber,
          status: customer.status,
          customerGroup: customer.customerGroup,
          order: count,
          totalSpent: currencyFormat(amount),
          initials: customer.name.split(' ').map(n => n[0]).join(''),
        };
      })
    );
  };

  const handleSearch = async (page = 1, size = 12) => {
    let data;
    if (searchKeyword.trim() === '') {
      data = await getCustomers(page, size);
    } else {
      data = await searchUsers(searchKeyword, page, size);
    }
    if (data.statusCode === 200) {
      const enhanced = await enhanceCustomers(data.data.items);
      setCustomers(enhanced);
      setTotalItems(data.data.totalElements);
      setCurrentPage(page);
      setPageSize(size);
    }
  };

  const handleAdd = async (newCustomer) => {
    try {
      newCustomer.customerGroup = newCustomer.customerGroup || 'NEW';
      const data = await createCustomer(newCustomer);
      if (data.statusCode === 201) {
        message.success('Customer added successfully');
        setRefresh(!refresh);
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error adding customer:', error);
      message.error('Failed to add customer');
    }
  };

  const columns = [
    {
      title: 'CUSTOMER',
      dataIndex: 'customerName',
      key: 'customer',
      render: (__, record) => (
        <div style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <div>{record.customerName}</div>
        </div>
      ),
    },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Phone number', dataIndex: 'phoneNumber', key: 'phoneNumber' },
    {
      title: 'Status',
      dataIndex: 'status',
      align: 'center',
      key: 'status',
      render: (__, record) => (
        <Tag
          color={record.status === 'Active' ? 'green' : 'red'}
          style={{ fontWeight: record.status === 'Active' ? 'bold' : 'normal' }}
        >
          {record.status}
        </Tag>
      ),
    },
    {
      title: 'CUSTOMER GROUP',
      dataIndex: 'customerGroup',
      align: 'center',
      key: 'customerGroup',
      render: (__, record) => {
        let color, fontWeight;
        switch (record.customerGroup) {
          case 'NEW':
            color = 'blue';
            fontWeight = 'bold';
            break;
          case 'EXISTING':
            color = 'gold';
            fontWeight = 'normal';
            break;
          case 'VIP':
            color = 'purple';
            fontWeight = 'bold';
            break;
          default:
            color = 'default';
            fontWeight = 'normal';
        }
        return (
          <Tag color={color} style={{ fontWeight }}>
            {record.customerGroup}
          </Tag>
        );
      },
    },
    { title: 'ORDER', dataIndex: 'order', key: 'order' },
    {
      title: 'TOTAL SPENT',
      dataIndex: 'totalSpent',
      key: 'totalSpent',
      render: (__, record) => (
        <div style={{ fontWeight: 'bold', color: 'red' }}>{record.totalSpent}</div>
      ),
    },
  ];

  const onRow = (record) => {
    return {
      onClick: () => {
        navigate(`/admin/customers/${record.key}`, {
          state: { customer: record, refresh: true },
        });
      },
    };
  };

  if (isDetailView) {
    return <Outlet />;
  }

  return (
    <div style={{ background: '#f7f7f7', padding: 8 }}>
      <div style={{ margin: 0, background: '#fff', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: 16, height: 'calc(120vh - 32px)' }}>
        <Row justify="space-between" align="middle" gutter={[16, 16]} style={{ marginBottom: 8 }}>
          <Col flex="1">
            <Input.Search
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onSearch={() => handleSearch(currentPage, pageSize)}
              placeholder="Search customer by name or email or phone number"
              allowClear
              style={{ width: '100%' }}
            />
          </Col>
          {/* <Col>
            <Button style={{ border: '1px solid #d9d9d9' }} icon={<DownloadOutlined />}>
              Export
            </Button>
          </Col> */}
          <Col>
            <Button type="primary" onClick={() => { setModalMode('add'); setShowModal(true); }}>
              + Add Customer
            </Button>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={customers}
          onRow={onRow}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: totalItems,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
            onChange: (page, pageSize) => {
              setCurrentPage(page);
              setPageSize(pageSize);
              if (searchKeyword.trim() === '') {
                loadCustomers(page, pageSize);
              } else {
                handleSearch(page, pageSize);
              }
            },
          }}
          rowClassName="clickable-row"
        />

        <EditDetail
          open={showModal}
          onCancel={() => setShowModal(false)}
          customer={null}
          handleSave={handleAdd}
          mode={modalMode}
        />
      </div>
    </div>
  );
};

export default Customer;