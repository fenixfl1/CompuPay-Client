"use client"

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { Line } from "react-chartjs-2"
import { useEffect, useState } from "react"
import { CustomCard } from "@/components/custom"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const LineChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Sample Data",
        data: [],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
      },
    ],
  })

  useEffect(() => {
    // Simulate fetching data
    const fetchData = () => {
      const labels = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
      ] as any
      const data = [65, 59, 80, 81, 56, 55, 40] as any
      setChartData({
        labels,
        datasets: [
          {
            ...chartData.datasets[0],
            data,
          },
        ],
      })
    }

    fetchData()
  }, [])

  return (
    <CustomCard>
      <Line data={chartData} />
    </CustomCard>
  )
}

export default LineChart
