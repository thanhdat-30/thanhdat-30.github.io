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
import { Props, State, DataType, FieldType } from "../interface/ITFNhanVien";
import "../styles/line.css";

const getStatusColor = (status: string) => {
  switch (status) {
    case "Đang thử việc":
      return "#FFA500";
    case "Đang làm việc":
      return "#32CD32";
    case "Đã nghỉ việc":
      return "#FF0000";
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
    key: "employeeName",
    title: "Tên Nhân Viên",
    dataIndex: "employeeName",
  },
  {
    key: "position",
    title: "Chức Vụ",
    dataIndex: "position",
  },
  {
    key: "department",
    title: "Phòng Ban",
    dataIndex: "department",
    align: "center",
  },
  {
    key: "status",
    title: "Trạng Thái",
    dataIndex: "status",
    align: "center",
    filters: [
      { text: "Đang làm việc", value: "Đang làm việc" },
      { text: "Đang thử việc", value: "Đang thử việc" },
      { text: "Đã nghỉ việc", value: "Đã nghỉ việc" },
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
    key: "dateOfJoining",
    title: "Ngày Vào Làm",
    dataIndex: "dateOfJoining",
    align: "right",
    render(value) {
      return new Date(value).toLocaleDateString("vi-VN");
    },
  },
  {
    key: "action",
    title: "Hành Động",
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

export default class NhanVien extends Component<Props, State> {
  formRef = React.createRef<FormInstance>();

  constructor(props: Props) {
    super(props);
    const savedEmployees = localStorage.getItem('employees');
    this.state = {
      showModal: false,
      showDetailModal: false,
      currentEmployee: null,
      searchTerm: '',
      employees: savedEmployees ? JSON.parse(savedEmployees) : [],
    };
  }

  showModal = () => {
    this.setState({ showModal: true });
  };

  cancelModal = () => {
    this.setState({ showModal: false });
  };

  handleAddEmployee = (values: DataType) => {
    this.setState(
      (prevState) => {
        const newEmployee = { ...values, key: String(prevState.employees.length + 1) };
        const updatedEmployees = [...prevState.employees, newEmployee];
        localStorage.setItem('employees', JSON.stringify(updatedEmployees));
        return {
          employees: updatedEmployees,
          showModal: false,
        };
      },
      () => {
        message.success('Thêm nhân viên thành công!');
        this.formRef.current?.resetFields();
      }
    );
  };

  handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchTerm: e.target.value });
  };

  handleDelete = (key: string) => {
    this.setState((prevState) => {
      const updatedEmployees = prevState.employees.filter((employee) => employee.key !== key);
      localStorage.setItem('employees', JSON.stringify(updatedEmployees));
      return { employees: updatedEmployees };
    });
    message.success('Xóa nhân viên thành công!');
  };

  handleDetail = (employee: DataType) => {
    this.setState({
      currentEmployee: employee,
      showDetailModal: true,
    });
  };

  handleUpdateEmployee = (values: DataType) => {
    this.setState((prevState) => {
      const updatedEmployees = prevState.employees.map((employee) =>
        employee.key === values.key ? { ...employee, ...values } : employee
      );
      localStorage.setItem('employees', JSON.stringify(updatedEmployees));
      return {
        employees: updatedEmployees,
        showDetailModal: false,
        currentEmployee: null,
      };
    });
    message.success('Cập nhật thông tin nhân viên thành công!');
  };

  cancelDetailModal = () => {
    this.setState({
      showDetailModal: false,
      currentEmployee: null,
    });
  };

  render() {
    const { searchTerm, employees, currentEmployee, showModal, showDetailModal } = this.state;
    const filteredEmployees = employees.filter(
      (employee) =>
        employee.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.status.toLowerCase().includes(searchTerm.toLowerCase())
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
            Quản Lý Nhân Viên
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
          dataSource={filteredEmployees}
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
          title="THÊM NHÂN VIÊN MỚI"
          open={showModal}
          onCancel={this.cancelModal}
          footer={null}
          style={{ top: 10 }}
        >
          <Form
            ref={this.formRef}
            onFinish={this.handleAddEmployee}
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item<FieldType>
              label="Tên Nhân Viên"
              name="employeeName"
              rules={[{ required: true, message: "Vui lòng nhập tên nhân viên" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item<FieldType>
              label="Chức Vụ"
              name="position"
              rules={[{ required: true, message: "Vui lòng chọn chức vụ" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item<FieldType>
              label="Phòng Ban"
              name="department"
              rules={[{ required: true, message: "Vui lòng nhập phòng ban" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item<FieldType>
              label="Trạng Thái"
              name="status"
              rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
            >
              <Select>
                <Select.Option value="Đang làm việc">Đang làm việc</Select.Option>
                <Select.Option value="Đang thử việc">Đang thử việc</Select.Option>
                <Select.Option value="Đã nghỉ việc">Đã nghỉ việc</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item<FieldType>
              label="Ngày Vào Làm"
              name="dateOfJoining"
              rules={[{ required: true, message: "Vui lòng chọn ngày vào làm" }]}
            >
              <Input type="date" />
            </Form.Item>

            <Form.Item wrapperCol={{ span: 24 }}>
              <Button type="primary" htmlType="submit" size="large" style={{ width: "100%" }}>
                Thêm Nhân Viên
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        {/* Modal chi tiết nhân viên */}
        {currentEmployee && (
          <Modal
            title="CHI TIẾT NHÂN VIÊN"
            open={showDetailModal}
            onCancel={this.cancelDetailModal}
            footer={null}
            style={{ top: 10 }}
          >
            <Form
              ref={this.formRef}
              initialValues={currentEmployee}
              onFinish={this.handleUpdateEmployee}
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
                label="Tên Nhân Viên"
                name="employeeName"
                rules={[{ required: true, message: "Vui lòng nhập tên nhân viên" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item<FieldType>
                label="Chức Vụ"
                name="position"
                rules={[{ required: true, message: "Vui lòng chọn chức vụ" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item<FieldType>
                label="Phòng Ban"
                name="department"
                rules={[{ required: true, message: "Vui lòng nhập phòng ban" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item<FieldType>
                label="Trạng Thái"
                name="status"
                rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
              >
                <Select>
                  <Select.Option value="Đang làm việc">Đang làm việc</Select.Option>
                  <Select.Option value="Đang thử việc">Đang thử việc</Select.Option>
                  <Select.Option value="Đã nghỉ việc">Đã nghỉ việc</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item<FieldType>
                label="Ngày Vào Làm"
                name="dateOfJoining"
                rules={[{ required: true, message: "Vui lòng chọn ngày vào làm" }]}
              >
                <Input type="date" />
              </Form.Item>

              <Form.Item wrapperCol={{ span: 24 }}>
                <Button type="primary" htmlType="submit" size="large" style={{ width: "100%" }}>
                  Cập Nhật
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        )}
      </div>
    );
  }
}
