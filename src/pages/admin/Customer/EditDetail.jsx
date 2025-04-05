import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, Select } from 'antd';

const { Option } = Select;

const EditDetail = ({ open, onCancel, customer, handleSave, mode }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (mode === 'edit' && customer) {
      form.setFieldsValue({
        name: customer.name,
        email: customer.email,
        phoneNumber: customer.phoneNumber,
        status: customer.status,
        customerGroup: customer.customerGroup,
      });
      console.log('Form values:', form.getFieldsValue());
    } else if (mode === 'add') {
      form.setFieldsValue({
        status: 'Active',
        roles: ['CUSTOMER'],
      });
    } else {
      form.resetFields();
    }
    
  }, [customer, form, mode]);

  const onFinish = (values) => {
    handleSave(values);
  };

  return (
    <Modal
      title={mode === 'add' ? 'Add New Customer' : 'Edit Customer Details'}
      open={open}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Name"
          name="name"
          rules={[
            { required: true, message: 'Name cannot be blank' },
            { max: 50, message: 'Name must not exceed 50 characters' },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Email cannot be blank' },
            { type: 'email', message: 'Invalid email format' },
          ]}
        >
          <Input />
        </Form.Item>

        {mode === 'add' && (
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Password cannot be blank' }]}
          >
            <Input.Password />
          </Form.Item>
        )}

        <Form.Item
          label="Phone Number"
          name="phoneNumber"
          rules={[
            { required: true, message: 'Phone number cannot be blank' },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Status"
          name="status"
          rules={[{ required: true, message: 'Status cannot be blank' }]}
        >
          <Select>
            <Option value="Active">Active</Option>
            <Option value="Inactive">Inactive</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="customerGroup"
          label="TYPE OF CUSTOMER"
          rules={[{ required: true, message: 'Please select type of customer' }]}
          initialValue={'NEW'}
        >
          <Select>
            <Option value="NEW">New Customer</Option>
            <Option value="EXISTING">Existing Customer</Option>
            <Option value="VIP">VIP Member</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
            {mode === 'add' ? 'Add Customer' : 'Save Changes'}
          </Button>
          <Button onClick={onCancel}>Cancel</Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditDetail;