import {
  Button,
  Form,
  FormInstance,
  Input,
  message,
  Modal,
  Select,
  Table,
  TableColumnsType,
} from "antd";
import {
  SearchOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import React, { Component } from "react";
import { Props, State, DataType, FieldType } from "../interface/Don-Hang";
import "../styles/line.css";

const getStatusColor = (status: string) => {
  switch (status) {
    case "Đang xử lý":
      return "#FFA500";
    case "Đang giao":
      return "#00BFFF";
    case "Đã giao":
      return "#32CD32";
    case "Đã hủy":
      return "#FF0000";
    case "Hoàn trả":
      return "#FF6347";
    case "Chờ thanh toán":
      return "#FFD700";
    default:
      return "#000000";
  }
};

const columns = (
  handleDelete: (key: string) => void,
  handleDetail: (record: DataType) => void
): TableColumnsType<DataType> => [
  {
    key: "index",
    title: "ID",
    render: (_text, _record, index) => index + 1,
    align: "center",
  },
  {
    key: "productType",
    title: "Loại",
    dataIndex: "productType",
    filters: [
      { text: "Giày", value: "Giày" },
      { text: "Dép", value: "Dép" },
    ],
    onFilter(value, record) {
      return record.productType.includes(value as string);
    },
  },
  {
    key: "productName",
    title: "Tên Sản Phẩm",
    dataIndex: "productName",
  },
  {
    key: "customerName",
    title: "Tên khách hàng",
    dataIndex: "customerName",
  },
  {
    key: "status",
    title: "Trạng thái",
    dataIndex: "status",
    align: "center",
    filters: [
      { text: "Đang xử lý", value: "Đang xử lý" },
      { text: "Đang giao", value: "Đang giao" },
      { text: "Đã giao", value: "Đã giao" },
      { text: "Đã hủy", value: "Đã hủy" },
      { text: "Hoàn trả", value: "Hoàn trả" },
      { text: "Chờ thanh toán", value: "Chờ thanh toán" },
    ],
    onFilter(value, record) {
      return record.status.includes(value as string);
    },
    render: (status) => (
      <span
        style={{
          backgroundColor: getStatusColor(status),
          color: "white",
          borderRadius: "5px",
          padding: "5px",
        }}>
        {status}
      </span>
    ),
  },
  {
    key: "orderDate",
    title: "Ngày đặt hàng",
    dataIndex: "orderDate",
    align: "right",
    render(value) {
      return new Date(value).toLocaleDateString("vi-VN");
    },
  },
  {
    key: "totalAmount",
    title: "Tổng tiền",
    dataIndex: "totalAmount",
    align: "right",
    sorter: {
      compare: (a, b) => a.totalAmount - b.totalAmount,
    },
    render(value) {
      const amountNumber = Number(value);
      return !isNaN(amountNumber) ? `${amountNumber.toLocaleString("vi-VN")}₫` : value;
    },
  },
  {
    key: "action",
    title: "Hành động",
    align: "center",
    render: (record) => (
      <>
        <Button
          type="primary"
          onClick={() => handleDetail(record)}
          icon={<EditOutlined />}
        />
        <Button
          danger
          onClick={() => handleDelete(record.key)}
          icon={<DeleteOutlined />}
          style={{ marginLeft: 8, backgroundColor: "#C0392B", borderColor: "#C0392B", color: "white" }}
        />
      </>
    ),
  },
];

export default class Order extends Component<Props, State> {
  formRef = React.createRef<FormInstance>();

  constructor(props: Props) {
    super(props);
    const savedOrders = localStorage.getItem('orders');
    this.state = {
      showModal: false,
      showDetailModal: false,
      currentOrder: null,
      searchTerm: '',
      orders: savedOrders ? JSON.parse(savedOrders) : [],
    };
  }

  showModal = () => {
    this.setState({ showModal: true });
  };

  cancelModal = () => {
    this.setState({ showModal: false });
  };

  handleAddOrder = (values: DataType) => {
    this.setState(
      (prevState) => {
        const newOrder = { ...values, key: String(prevState.orders.length + 1) };
        const updatedOrders = [...prevState.orders, newOrder];
        localStorage.setItem('orders', JSON.stringify(updatedOrders));
        return {
          orders: updatedOrders,
          showModal: false,
        };
      },
      () => {
        message.success('Thêm thành công!');
        this.formRef.current?.resetFields();
      }
    );
  };

  handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchTerm: e.target.value });
  };

  handleDelete = (key: string) => {
    this.setState((prevState) => {
      const updatedOrders = prevState.orders.filter((order) => order.key !== key);
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      return { orders: updatedOrders };
    });
    message.success('Xóa thành công!');
  };

  handleDetail = (order: DataType) => {
    this.setState({
      currentOrder: order,
      showDetailModal: true,
    });
  };

  handleUpdateOrder = (values: DataType) => {
    this.setState((prevState) => {
      const updatedOrders = prevState.orders.map((order) =>
        order.key === values.key ? { ...order, ...values } : order
      );
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      return {
        orders: updatedOrders,
        showDetailModal: false,
        currentOrder: null,
      };
    });
    message.success('Cập nhật thành công!');
  };

  cancelDetailModal = () => {
    this.setState({
      showDetailModal: false,
      currentOrder: null,
    });
  };

  render() {
    const { searchTerm, orders, currentOrder, showModal, showDetailModal } = this.state;
    const filteredOrders = orders.filter(
      (order) =>
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div style={{ padding: "20px", background: "#f4f7f6", borderRadius: "10px", marginTop: "20px" }}>
        <div className='taskbar' style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{
            color: "#2C3E50",
            fontWeight: "bold",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
            fontSize: "25px",
          }}>
            Quản Lý Trạng Thái Đơn Hàng
          </h2>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Input
              placeholder="Tìm kiếm báo cáo..."
              size="large"
              prefix={<SearchOutlined />}
              onChange={this.handleSearchChange}
              style={{
                borderRadius: "10px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                marginRight: "15px",
                width: "300px",
              }}
            />
            <Button
              type="primary"
              shape="round"
              icon={<PlusOutlined />}
              onClick={this.showModal}
              style={{
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                borderRadius: "10px",
                padding: "18px 20px",
              }}
            ></Button>
          </div>
        </div>

        <Table
          dataSource={filteredOrders}
          columns={columns(this.handleDelete, this.handleDetail)}
          pagination={{ pageSize: 6 }}
          style={{
            backgroundColor: "#fff",
            borderRadius: "10px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            overflow: "hidden"
          }}
        />

        <Modal
          title="THÊM ĐƠN HÀNG MỚI"
          open={showModal}
          onCancel={this.cancelModal}
          footer={null}
          style={{ top: 10 }}
        >
          <Form
            ref={this.formRef}
            onFinish={this.handleAddOrder}
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item<FieldType>
              label="Tên khách hàng"
              name="customerName"
              rules={[{ required: true, message: "Vui lòng nhập tên khách hàng" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item<FieldType>
              label="Loại Sản Phẩm"
              name="productType"
              rules={[{ required: true, message: "Vui lòng chọn Loại Sản Phẩm" }]}
            >
              <Select>
                <Select.Option value="Giày">Giày</Select.Option>
                <Select.Option value="Dép">Dép</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item<FieldType>
              label="Tên sản phẩm"
              name="productName"
              rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item<FieldType>
              label="Trạng thái"
              name="status"
              rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
            >
              <Select>
                <Select.Option value="Đang xử lý">Đang xử lý</Select.Option>
                <Select.Option value="Đang giao">Đang giao</Select.Option>
                <Select.Option value="Đã giao">Đã giao</Select.Option>
                <Select.Option value="Đã hủy">Đã hủy</Select.Option>
                <Select.Option value="Hoàn trả">Hoàn trả</Select.Option>
                <Select.Option value="Chờ thanh toán">Chờ thanh toán</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item<FieldType>
              label="Ngày đặt hàng"
              name="orderDate"
              rules={[{ required: true, message: "Vui lòng chọn ngày đặt hàng" }]}
            >
              <Input type="date" />
            </Form.Item>

            <Form.Item<FieldType>
              label="Tổng tiền"
              name="totalAmount"
              rules={[{ required: true, message: "Vui lòng nhập tổng tiền" }]}
            >
              <Input type="number" min={0} placeholder="VNĐ" />
            </Form.Item>

            <Form.Item wrapperCol={{ span: 24 }}>
              <Button type="primary" htmlType="submit" size="large" style={{ width: "100%" }}>
                Thêm Đơn Hàng
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        {/* Modal chi tiết đơn hàng */}
        {currentOrder && (
          <Modal
            title="CHI TIẾT ĐƠN HÀNG"
            open={showDetailModal}
            onCancel={this.cancelDetailModal}
            footer={null}
            style={{ top: 10 }}
          >
            <Form
              ref={this.formRef}
              initialValues={currentOrder}
              onFinish={this.handleUpdateOrder}
              autoComplete="off"
              layout="vertical"
            >
              <Form.Item<FieldType>
                label="Mã"
                name="key"
                hidden
              >
                <Input />
              </Form.Item>

              <Form.Item<FieldType>
                label="Tên khách hàng"
                name="customerName"
                rules={[{ required: true, message: "Vui lòng nhập tên khách hàng" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item<FieldType>
                label="Loại Sản Phẩm"
                name="productType"
                rules={[{ required: true, message: "Vui lòng chọn Loại Sản Phẩm" }]}
              >
                <Select>
                  <Select.Option value="Giày">Giày</Select.Option>
                  <Select.Option value="Dép">Dép</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item<FieldType>
                label="Tên sản phẩm"
                name="productName"
                rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item<FieldType>
                label="Trạng thái"
                name="status"
                rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
              >
                <Select>
                  <Select.Option value="Đang xử lý">Đang xử lý</Select.Option>
                  <Select.Option value="Đang giao">Đang giao</Select.Option>
                  <Select.Option value="Đã giao">Đã giao</Select.Option>
                  <Select.Option value="Đã hủy">Đã hủy</Select.Option>
                  <Select.Option value="Hoàn trả">Hoàn trả</Select.Option>
                  <Select.Option value="Chờ thanh toán">Chờ thanh toán</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item<FieldType>
                label="Ngày đặt hàng"
                name="orderDate"
                rules={[{ required: true, message: "Vui lòng chọn ngày đặt hàng" }]}
              >
                <Input type="date" />
              </Form.Item>

              <Form.Item<FieldType>
                label="Tổng tiền"
                name="totalAmount"
                rules={[{ required: true, message: "Vui lòng nhập tổng tiền" }]}
              >
                <Input type="number" min={0} placeholder="VNĐ" />
              </Form.Item>

              <Form.Item wrapperCol={{ span: 24 }}>
                <Button type="primary" htmlType="submit" size="large" style={{ width: "100%" }}>
                  Cập Nhật Đơn Hàng
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        )}
      </div>
    );
  }
}