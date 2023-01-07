import * as echarts from "echarts";
import { useCallback, useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { instance as axios } from "../utils/request";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

function NumPublications() {
  const [loading, setLoading] = useState<boolean>(false);
  const [xData, setXData] = useState<number[]>([]);
  const [yData, setYData] = useState<number[]>([]);
  const [chart, setChart] = useState<echarts.ECharts>();
  const [keyword, setKeyword] = useState<string>("algorithms");

  const getData = useCallback(async (keywordName: string) => {
    setLoading(true);
    const res = await axios.request<{ _id: number; pub_cnt: number }[]>({
      url: "mongo/publicationTrend",
      method: "get",
      params: {
        keywordName
      }
    });
    setXData(res.data.map((item) => item._id));
    setYData(res.data.map((item) => item.pub_cnt));
    setLoading(false);
  }, []);

  useEffect(() => {
    const element = document.getElementById("chart-num-publications");
    let newChart: echarts.ECharts | undefined;

    if (element) {
      newChart = echarts.init(element);
      setChart(newChart);
    }

    getData("algorithms");

    return () => {
      newChart && newChart.dispose();
    }
  }, [getData]);

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
        },
        yAxis: {
          type: 'value',
        },
        tooltip: {
          show: true,
        },
        series: [
          {
            data: yData,
            type: 'line'
          }
        ]
      });
    }
  }, [chart, xData, yData]);

  window.addEventListener("resize", () => { chart && chart.resize(); });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value);
  };

  return (
    <Card>
      <CardHeader title="Publication Trend" />
      <CardContent style={{ display: "flex", flexDirection: "column", height: 500 }}>
        <Box style={{ display: "flex", alignItems: "center", margin: "10px 20px 0 20px" }}>
          <Box><Typography>Show number of publications relevant to keyword: </Typography></Box>
          <Box style={{ flex: "1 1 0%", margin: "0 10px", maxWidth: 200 }}>
            <TextField
              label="Keyword"
              fullWidth
              size="small"
              value={keyword}
              onChange={handleChange}
            />
          </Box>
          <Button variant="contained" onClick={getData.bind(null, keyword)}>Search</Button>
        </Box>
        <div id="chart-num-publications" style={{ height: "100%", width: "100%" }} />
      </CardContent>
    </Card>
  );
}

export default NumPublications;