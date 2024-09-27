// components/PieChart.js
import { Pie } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"

ChartJS.register(ArcElement, Tooltip, Legend)

const dataSource = {
  labels: [
    "Equipo de diseño",
    "Equipo de desarrollo",
    "Equipo de finanzas",
    "Publicidad",
  ],
  datasets: [
    {
      label: "Roles de empleados",
      data: [600, 800, 500, 500],
      backgroundColor: [
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 99, 132, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(255, 205, 86, 0.2)",
      ],
      borderColor: [
        "rgba(54, 162, 235, 1)",
        "rgba(255, 99, 132, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(255, 205, 86, 1)",
      ],
      borderWidth: 1,
    },
  ],
}

interface PieChartProps {
  data?: any
}

const PieChart: React.FC<PieChartProps> = ({ data = dataSource }) => {
  return <Pie data={data} />
}

export default PieChart
