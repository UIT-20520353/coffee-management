import { Column } from "@ant-design/plots";

const data = [
  { type: "Tháng 1", value: 1000000 },
  { type: "Tháng 2", value: 6900000 },
  { type: "Tháng 3", value: 5000000 },
  { type: "Tháng 4", value: 10000000 },
  { type: "Tháng 5", value: 3450000 },
  { type: "Tháng 6", value: 2400000 },
  { type: "Tháng 7", value: 6100000 },
  { type: "Tháng 8", value: 8700000 },
];

const Dashboard = () => {
  const config = {
    data,
    xField: "type",
    yField: "value",
    label: {
      text: (originData) => {
        const val = parseFloat(originData.value);
        if (val < 500) {
          return (val * 100).toFixed(1) + "%";
        }
        return "";
      },
      offset: 10,
    },
    legend: false,
    height: 400,
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div>
        <Column {...config} />
      </div>
      <p className="text-lg font-medium text-brown-1">Thống kê doanh thu</p>
    </div>
  );
};

export default Dashboard;
