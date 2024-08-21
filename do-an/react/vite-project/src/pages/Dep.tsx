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
import { Props, State, DataType, FieldType } from "../interface/ITFDep";
import "../styles/line.css";

const columns = (
  handleDelete: (key: string) => void,
  handleDetail: (record: DataType) => void
): TableColumnsType<DataType> => [
  {
    key: "code",
    title: "ID",
    render: (_text, _record, index) => "D"+index ,
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
      { text: "Crocs", value: "Crocs" },
      { text: "Birkenstock", value: "Birkenstock" },
      { text: "Havaianas", value: "Havaianas" },
      { text: "Flip Flop", value: "Flip Flop" },
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

export default class Dep extends Component<Props, State> {
  formRef = React.createRef<FormInstance>();
  constructor(props: Props) {
    super(props);
    const savedDep = localStorage.getItem('Dep');
    this.state = {
      showModal: false,
      showDetailModal: false,
      currentDep: null,
      name: "",
      brand: "",
      price: 0,
      stock: 0,
      thumbnail: "",
      searchTerm: '',
      dep: savedDep ? JSON.parse(savedDep) : [],
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
        const newProduct = { ...values, key: String(prevState.dep.length + 1) };
        const updatedDep = [...prevState.dep, newProduct];
        localStorage.setItem('Dep', JSON.stringify(updatedDep));
        return {
          dep: updatedDep,
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
      const updatedDep = prevState.dep.filter(
        (product) => product.key !== key
      );
      localStorage.setItem('Dep', JSON.stringify(updatedDep));
      return { dep: updatedDep };
    });
    message.success('Xóa thành công!');
  };  

  handleDetail = (product: DataType) => {
    this.setState({
      currentDep: product,
      showDetailModal: true,
    });
  };

  handleUpdateProduct = (values: DataType) => {
    this.setState((prevState) => {
      const updatedDep = prevState.dep.map((product) =>
        product.key === values.key ? { ...product, ...values } : product
      );
      localStorage.setItem('Dep', JSON.stringify(updatedDep));
      return {
        dep: updatedDep,
        showDetailModal: false,
        currentDep: null,
      };
    });
    message.success('Cập nhật thành công!');
  };  

  cancelDetailModal = () => {
    this.setState({
      showDetailModal: false,
      currentDep: null,
    });
  };

  render() {
    const { searchTerm, dep, currentDep } = this.state;
    const filteredDep = dep.filter(
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
            Quản Lý Dép
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
          dataSource={filteredDep}
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
          title="THÊM MẪU DÉP MỚI"
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
                <Select.Option value="Crocs">Crocs</Select.Option>
                <Select.Option value="Birkenstock">Birkenstock</Select.Option>
                <Select.Option value="Havaianas">Havaianas</Select.Option>
                <Select.Option value="Flip Flop">Flip Flop</Select.Option>
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
        {currentDep && (
          <Modal
            title="CHI TIẾT SẢN PHẨM"
            open={this.state.showDetailModal}
            onCancel={this.cancelDetailModal}
            footer={null}
            style={{ top: 10 }}
          >
            <Form
              ref={this.formRef}
              initialValues={currentDep}
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
                  <Select.Option value="Crocs">Crocs</Select.Option>
                  <Select.Option value="Birkenstock">Birkenstock</Select.Option>
                  <Select.Option value="Havaianas">Havaianas</Select.Option>
                  <Select.Option value="Flip Flop">Flip Flop</Select.Option>
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