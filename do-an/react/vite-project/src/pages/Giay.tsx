import {
  Button,
  Form,
  FormInstance,
  Image,
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
import { Props, State, DataType, FieldType } from "../interface/ITFGiay";
import "../styles/line.css";

const columns = (
  handleDelete: (key: string) => void,
  handleDetail: (record: DataType) => void
): TableColumnsType<DataType> => [
  {
    key: "code",
    title: "ID",
    render: (_text, _record, index) => "G"+index,
    align: "center",
  },  
  {
    key: "thumbnail",
    title: "Hình ảnh",
    dataIndex: "thumbnail",
    render(value) {
      return <Image src={value} width={56}/>;
    },
    align: "center",

  },
  {
    key: "name",
    title: "Tên sản phẩm",
    dataIndex: "name",
  },
  {
    key: "brand",
    title: "Thương hiệu",
    dataIndex: "brand",
    filters: [
      { text: "Adidas", value: "Adidas" },
      { text: "Nike", value: "Nike" },
      { text: "MLB", value: "MLB" },
      { text: "Puma", value: "Puma" },
      { text: "New Balance", value: "New Balance" },
      { text: "Converse", value: "Converse" },
      { text: "Vans", value: "Vans" },
    ],
    onFilter(value, record) {
      return record.brand.includes(value as string);
    },
  },
  {
    key: "price",
    title: "Đơn giá",
    dataIndex: "price",
    align: "right",
    sorter: {
      compare: (a, b) => a.price - b.price,
    },
    render(value) {
      const priceNumber = Number(value);
      if (!isNaN(priceNumber)) {
        return `${priceNumber.toLocaleString("vi-VN")}₫`;
      }
      return value;
    },
  },
  {
    key: "stock",
    title: "Số lượng",
    dataIndex: "stock",
    align: "right",
    sorter: {
      compare: (a, b) => a.stock - b.stock,
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

export default class Giay extends Component<Props, State> {
  formRef = React.createRef<FormInstance>();
  constructor(props: Props) {
    super(props);
    const savedProducts = localStorage.getItem('products');
    this.state = {
      showModal: false,
      showDetailModal: false,
      currentProduct: null,
      name: "",
      brand: "",
      price: 0,
      stock: 0,
      thumbnail: "",
      searchTerm: '',
      products: savedProducts ? JSON.parse(savedProducts) : [],
    };
  }

  showModal = () => {
    this.setState({
      showModal: true,
    });
  };

  cancelModal = () => {
    this.setState({
      showModal: false,
    });
  };

  handleAddProduct = (values: DataType) => {
    this.setState(
      (prevState) => {
        const newProduct = { ...values, key: String(prevState.products.length + 1) };
        const updatedProducts = [...prevState.products, newProduct];
        localStorage.setItem('products', JSON.stringify(updatedProducts));
        return {
          products: updatedProducts,
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
      const updatedProducts = prevState.products.filter(
        (product) => product.key !== key
      );
      localStorage.setItem('products', JSON.stringify(updatedProducts));
      return { products: updatedProducts };
    });
    message.success('Xóa thành công!');
  };  

  handleDetail = (product: DataType) => {
    this.setState({
      currentProduct: product,
      showDetailModal: true,
    });
  };

  handleUpdateProduct = (values: DataType) => {
    this.setState((prevState) => {
      const updatedProducts = prevState.products.map((product) =>
        product.key === values.key ? { ...product, ...values } : product
      );
      localStorage.setItem('products', JSON.stringify(updatedProducts));
      return {
        products: updatedProducts,
        showDetailModal: false,
        currentProduct: null,
      };
    });
    message.success('Cập nhật thành công!');
  };  

  cancelDetailModal = () => {
    this.setState({
      showDetailModal: false,
      currentProduct: null,
    });
  };

  render() {
    const { searchTerm, products, currentProduct } = this.state;
    const filteredProducts = products.filter(
      (product: { name: string; brand: string }) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase())
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
            Quản Lý Giày
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
          dataSource={filteredProducts}
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
          title="THÊM MẪU GIÀY MỚI"
          open={this.state.showModal}
          onCancel={this.cancelModal}
          footer={null}
          style={{ top: 10 }}
        >
          <Form
            ref={this.formRef}
            onFinish={this.handleAddProduct}
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item<FieldType>
              label="Tên sản phẩm"
              name={"name"}
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập tên sản phẩm",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item<FieldType>
              label="Đơn giá"
              name={"price"}
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập đơn giá",
                },
              ]}
            >
              <Input  type="number" min={1000} placeholder="VNĐ" />
            </Form.Item>

            <Form.Item<FieldType>
              label="Số lượng"
              name={"stock"}
              rules={[
                {
                  required: true,
                  message: "Vui lòng số lượng sản phẩm",
                },
              ]}
            >
              <Input type="number" min={0} />
            </Form.Item>

            <Form.Item<FieldType>
              label="Thương hiệu"
              name={"brand"}
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn thương hiệu",
                },
              ]}
            >
              <Select>
                <Select.Option value="Adidas">Adidas</Select.Option>
                <Select.Option value="Nike">Nike</Select.Option>
                <Select.Option value="MLB">MLB</Select.Option>
                <Select.Option value="Puma">Puma</Select.Option>
                <Select.Option value="New Balance">New Balance</Select.Option>
                <Select.Option value="Converse">Converse</Select.Option>
                <Select.Option value="Vans">Vans</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item<FieldType>
              label="Hình ảnh"
              name={"thumbnail"}
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn hình ảnh",
                },
              ]}
            >
              <Input placeholder="https://...." />
            </Form.Item>

            <Form.Item wrapperCol={{ span: 24 }}>
              <Button type="primary" htmlType="submit" size="large" style={{ width: "100%" }}>
                Thêm Sản Phẩm
              </Button>
            </Form.Item>
          </Form>
        </Modal>
        
        {/* Modal chi tiết sản phẩm */}
        {currentProduct && (
          <Modal
            title="CHI TIẾT SẢN PHẨM"
            open={this.state.showDetailModal}
            onCancel={this.cancelDetailModal}
            footer={null}
            style={{ top: 10 }}
          >
            <Form
              ref={this.formRef}
              initialValues={currentProduct}
              onFinish={this.handleUpdateProduct}
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
                label="Tên sản phẩm"
                name={"name"}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên sản phẩm",
                  },
                ]}
              >
                <Input/>
              </Form.Item>

              <Form.Item<FieldType>
                label="Đơn giá"
                name={"price"}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập đơn giá",
                  },
                ]}
              >
                <Input type="number" min={1000} placeholder="VNĐ" />
              </Form.Item>

              <Form.Item<FieldType>
                label="Số lượng"
                name={"stock"}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng số lượng sản phẩm",
                  },
                ]}
              >
                <Input type="number" min={0} />
              </Form.Item>

              <Form.Item<FieldType>
                label="Thương hiệu"
                name={"brand"}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn thương hiệu",
                  },
                ]}
              >
                <Select>
                  <Select.Option value="Adidas">Adidas</Select.Option>
                  <Select.Option value="Nike">Nike</Select.Option>
                  <Select.Option value="MLB">MLB</Select.Option>
                  <Select.Option value="Puma">Puma</Select.Option>
                  <Select.Option value="New Balance">New Balance</Select.Option>
                  <Select.Option value="Converse">Converse</Select.Option>
                  <Select.Option value="Vans">Vans</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item<FieldType>
                label="Hình ảnh"
                name={"thumbnail"}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn hình ảnh",
                  },
                ]}
              >
                <Input placeholder="https://...." />
              </Form.Item>

              <Form.Item wrapperCol={{ span: 24 }}>
                <Button type="primary" htmlType="submit" size="large" style={{ width: "100%" }}>
                  Cập Nhật Sản Phẩm
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        )}
      </div>
    );
  }
}
