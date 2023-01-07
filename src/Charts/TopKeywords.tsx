import * as echarts from "echarts";
import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import { instance as axios } from "../utils/request";

function TopKeywords() {
  const [loading, setLoading] = useState<boolean>(false);
  const [xData, setXData] = useState<string[]>([]);
  const [yData, setYData] = useState<number[]>([]);
  const [chart, setChart] = useState<echarts.ECharts>();

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const res = await axios.get<{ _id: string; pub_cnt: number }[]>("mongo/mostPopularKeyword");
      setXData(res.data.map((item) => item._id));
      setYData(res.data.map((item) => item.pub_cnt));
      setLoading(false);
    };

    const element = document.getElementById("chart-top-keywords");
    let newChart: echarts.ECharts | undefined;

    if (element) {
      newChart = echarts.init(element);
      setChart(newChart);
    }

    getData();

    return () => {
      newChart && newChart.dispose();
    }
  }, []);

  useEffect(() => {
    if (chart) {
      loading ? chart.showLoading() : chart.hideLoading();
    }
  }, [chart, loading]);

  useEffect(() => {
    if (chart) {
      chart.setOption({
        xAxis: {
          type: 'category',
          data: xData,
          axisLabel: {
            rotate: 30,
          }
        },
        yAxis: {
          type: 'value'
        },
        tooltip: {
          show: true,
        },
        series: [
          {
            data: yData,
            type: 'bar',
          }
        ]
      });
    }
  }, [chart, xData, yData])

  window.addEventListener("resize", () => { chart && chart.resize(); });

  return (
    <Card>
      <CardHeader title="Top 10 Most Popular Keywords" />
      <CardContent style={{ height: 500, padding: "20px 10px" }}>
        <div id="chart-top-keywords" style={{ height: "100%", width: "100%" }} />
      </CardContent>
    </Card>
  );
}

export default TopKeywords;