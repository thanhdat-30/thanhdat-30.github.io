import {
  Button,
  Form,
  FormInstance,
  Input,
  message,
  Modal,
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
import { Props, State, DataType, FieldType } from "../interface/ITFLichSuBanHang";
import "../styles/line.css";

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
    key: "diachi",
    title: "Địa chỉ",
    dataIndex: "diachi",
  },
  {
    key: "sdt",
    title: "Số Điện Thoại",
    dataIndex: "sdt",
    align: "right",
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

export default class LichSuBanHang extends Component<Props, State> {
  formRef = React.createRef<FormInstance>();

  constructor(props: Props) {
    super(props);
    const savedLichsu = localStorage.getItem('lichsubanhang');
    this.state = {
      showModal: false,
      showDetailModal: false,
      currentLichsu: null,
      searchTerm: '',
      lichsubanhang: savedLichsu ? JSON.parse(savedLichsu) : [],
    };
  }

  showModal = () => {
    this.setState({ showModal: true });
  };

  cancelModal = () => {
    this.setState({ showModal: false });
  };

  handleAddLichsu = (values: DataType) => {
    this.setState(
      (prevState) => {
        const newLichsu = { ...values, key: String(prevState.lichsubanhang.length + 1) };
        const updatedLichsu = [...prevState.lichsubanhang, newLichsu];
        localStorage.setItem('lichsubanhang', JSON.stringify(updatedLichsu));
        return {
          lichsubanhang: updatedLichsu,
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
      const updatedLichsu = prevState.lichsubanhang.filter((lichsubanhang) => lichsubanhang.key !== key);
      localStorage.setItem('lichsubanhang', JSON.stringify(updatedLichsu));
      return { lichsubanhang: updatedLichsu };
    });
    message.success('Xóa thành công!');
  };

  handleDetail = (lichsubanhang: DataType) => {
    this.setState({
      currentLichsu: lichsubanhang,
      showDetailModal: true,
    });
  };

  handleUpdateLichsu = (values: DataType) => {
    this.setState((prevState) => {
      const updatedLichsu = prevState.lichsubanhang.map((lichsubanhang) =>
        lichsubanhang.key === values.key ? { ...lichsubanhang, ...values } : lichsubanhang
      );
      localStorage.setItem('lichsubanhang', JSON.stringify(updatedLichsu));
      return {
        lichsubanhang: updatedLichsu,
        showDetailModal: false,
        currentLichsu: null,
      };
    });
    message.success('Cập nhật thành công!');
  };

  cancelDetailModal = () => {
    this.setState({
      showDetailModal: false,
      currentLichsu: null,
    });
  };

  render() {
    const { searchTerm, lichsubanhang, currentLichsu, showModal, showDetailModal } = this.state;
    const filteredLichsu = lichsubanhang.filter(
      (lichsubanhang) =>
        lichsubanhang.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lichsubanhang.productName.toLowerCase().includes(searchTerm.toLowerCase())
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
            Quản Lý Lịch Sử Bán Hàng
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
          dataSource={filteredLichsu}
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
          title="THÊM ĐƠN HÀNG ĐÃ BÁN"
          open={showModal}
          onCancel={this.cancelModal}
          footer={null}
          style={{ top: 10 }}
        >
          <Form
            ref={this.formRef}
            onFinish={this.handleAddLichsu}
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
              label="Tên sản phẩm"
              name="productName"
              rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item<FieldType>
              label="Địa chỉ"
              name="diachi"
              rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item<FieldType>
              label="Số điện thoại"
              name="sdt"
              rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
            >
              <Input />
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
        {currentLichsu && (
          <Modal
            title="CHI TIẾT ĐƠN HÀNG ĐÃ BÁN"
            open={showDetailModal}
            onCancel={this.cancelDetailModal}
            footer={null}
            style={{ top: 10 }}
          >
            <Form
              ref={this.formRef}
              initialValues={currentLichsu}
              onFinish={this.handleUpdateLichsu}
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
                label="Tên sản phẩm"
                name="productName"
                rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item<FieldType>
                label="Địa chỉ"
                name="diachi"
                rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item<FieldType>
                label="Số điện thoại"
                name="sdt"
                rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
              >
                <Input />
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