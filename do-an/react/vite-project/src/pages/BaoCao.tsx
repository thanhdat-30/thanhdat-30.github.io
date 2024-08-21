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
import { Props, State, ReportType, FieldType } from "../interface/ITFBaoCao";
import "../styles/line.css";

const getStatusColor = (status: string) => {
  switch (status) {
    case "Đang xử lý":
      return "#FFA500";
    case "Hoàn thành":
      return "#32CD32";
    case "Hủy bỏ":
      return "#FF0000";
    default:
      return "#000000";
  }
};

const columns = (
  handleDelete: (key: string) => void,
  handleDetail: (record: ReportType) => void
): TableColumnsType<ReportType> => [
  {
    key: "code",
    title: "ID",
    render: (_text, _record, index) => `R${index + 1}`,
    align: "center",
  },
  {
    key: "name",
    title: "Tên báo cáo",
    dataIndex: "name",
  },
  {
    key: "creator",
    title: "Người tạo",
    dataIndex: "creator",
  },
  {
    key: "status",
    title: "Trạng thái",
    dataIndex: "status",
    filters: [
      { text: "Đang xử lý", value: "Đang xử lý" },
      { text: "Hoàn thành", value: "Hoàn thành" },
      { text: "Hủy bỏ", value: "Hủy bỏ" },
    ],
    align: "center",
    onFilter: (value, record) => record.status === value,
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
    key: "date",
    title: "Ngày tạo",
    dataIndex: "date",
    align: "right",
    sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    render: (date) => new Date(date).toLocaleDateString("vi-VN"),
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

export default class ReportManager extends Component<Props, State> {
  formRef = React.createRef<FormInstance>();

  constructor(props: Props) {
    super(props);
    const savedReports = localStorage.getItem('reports');
    this.state = {
      showModal: false,
      showDetailModal: false,
      currentReport: null,
      name: "",
      creator: "",
      status: "",
      date: "",
      searchTerm: '',
      reports: savedReports ? JSON.parse(savedReports) : [],
    };
  }

  showModal = () => this.setState({ showModal: true });

  cancelModal = () => this.setState({ showModal: false });

  handleAddReport = (values: ReportType) => {
    this.setState(
      (prevState) => {
        const newReport = { ...values, key: String(prevState.reports.length + 1) };
        const updatedReports = [...prevState.reports, newReport];
        localStorage.setItem('reports', JSON.stringify(updatedReports));
        return {
          reports: updatedReports,
          showModal: false,
        };
      },
      () => {
        message.success('Thêm báo cáo thành công!');
        this.formRef.current?.resetFields();
      }
    );
  };

  handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchTerm: e.target.value });
  };

  handleDelete = (key: string) => {
    this.setState((prevState) => {
      const updatedReports = prevState.reports.filter((report) => report.key !== key);
      localStorage.setItem('reports', JSON.stringify(updatedReports));
      return { reports: updatedReports };
    });
    message.success('Xóa báo cáo thành công!');
  };

  handleDetail = (report: ReportType) => {
    this.setState({
      currentReport: report,
      showDetailModal: true,
    });
  };

  handleUpdateReport = (values: ReportType) => {
    this.setState((prevState) => {
      const updatedReports = prevState.reports.map((report) =>
        report.key === values.key ? { ...report, ...values } : report
      );
      localStorage.setItem('reports', JSON.stringify(updatedReports));
      return {
        reports: updatedReports,
        showDetailModal: false,
        currentReport: null,
      };
    });
    message.success('Cập nhật báo cáo thành công!');
  };

  cancelDetailModal = () => {
    this.setState({
      showDetailModal: false,
      currentReport: null,
    });
  };

  render() {
    const { searchTerm, reports, currentReport } = this.state;
    const filteredReports = reports.filter(
      (report) =>
        report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.creator.toLowerCase().includes(searchTerm.toLowerCase())
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
            Quản Lý Báo Cáo - Phân Tích
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
          dataSource={filteredReports}
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
          title="THÊM BÁO CÁO MỚI"
          open={this.state.showModal}
          onCancel={this.cancelModal}
          footer={null}
          style={{ top: 10 }}
        >
          <Form
            ref={this.formRef}
            onFinish={this.handleAddReport}
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item<FieldType>
              label="Tên báo cáo"
              name="name"
              rules={[{ required: true, message: "Vui lòng nhập tên báo cáo" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item<FieldType>
              label="Người tạo"
              name="creator"
              rules={[{ required: true, message: "Vui lòng nhập người tạo báo cáo" }]}
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
                <Select.Option value="Hoàn thành">Hoàn thành</Select.Option>
                <Select.Option value="Hủy bỏ">Hủy bỏ</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item<FieldType>
              label="Ngày tạo"
              name="date"
              rules={[{ required: true, message: "Vui lòng chọn ngày tạo" }]}
            >
              <Input type="date" />
            </Form.Item>
            

            <Form.Item>
              <Button type="primary" htmlType="submit" size="large" style={{ width: "100%" }}>
                Thêm báo cáo
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        {currentReport && (
          <Modal
            title="CHI TIẾT BÁO CÁO"
            open={this.state.showDetailModal}
            onCancel={this.cancelDetailModal}
            footer={null}
            style={{ top: 20 }}
          >
            <Form
              ref={this.formRef}
              onFinish={this.handleUpdateReport}
              autoComplete="off"
              layout="vertical"
              initialValues={currentReport}
            >
              <Form.Item<FieldType>
                label="Tên báo cáo"
                name="name"
                rules={[{ required: true, message: "Vui lòng nhập tên báo cáo" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item<FieldType>
                label="Người tạo"
                name="creator"
                rules={[{ required: true, message: "Vui lòng nhập người tạo báo cáo" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item<FieldType>
                label="Trạng thái"
                name="status"
                rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
              >
                <Select>
                  <Select.Option value="processing">Đang xử lý</Select.Option>
                  <Select.Option value="completed">Hoàn thành</Select.Option>
                  <Select.Option value="canceled">Hủy bỏ</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item<FieldType>
                label="Ngày tạo"
                name="date"
                rules={[{ required: true, message: "Vui lòng chọn ngày tạo" }]}
              >
                <Input type="date" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" size="large" style={{ width: "100%" }}>
                  Cập Nhật Báo Cáo
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        )}
      </div>
    );
  }
}
