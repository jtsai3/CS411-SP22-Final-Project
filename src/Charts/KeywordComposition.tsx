import * as echarts from "echarts";
import { useCallback, useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { instance as axios } from "../utils/request";
import Button from "@mui/material/Button";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

function KeywordComposition() {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<{ value: number; name: string }[]>([]);
  const [profData, setProfData] = useState<string[]>([]);
  const [chart, setChart] = useState<echarts.ECharts>();
  const [professor, setProfessor] = useState<string>("Agouris,Peggy");

  const getData = useCallback(async (profName: string) => {
    setLoading(true);
    const res = await axios.request<[faculty: string, krc: number][]>({
      url: "neo4j/keywordsRelated/",
      method: "get",
      params: {
        profName
      }
    });
    const slicedData = res.data.map((item) => ({
      name: item[0],
      value: item[1],
    })).slice(Math.min(res.data.length, 10))
    setData(slicedData);
    setLoading(false);
  }, []);

  useEffect(() => {
    const getProfData = async () => {
      const res = await axios.get<{ id: number, name: string }[]>("mysql/faculty");
      setProfData(Array.from(new Set(res.data.map((item) => item.name))));
    }

    const element = document.getElementById("chart-keyword-composition");
    let newChart: echarts.ECharts | undefined;

    if (element) {
      newChart = echarts.init(element);
      setChart(newChart);
    }

    getProfData();
    getData("Agouris,Peggy");

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
        legend: {
          top: 'bottom'
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        tooltip: {
          show: true,
        },
        series: [
          {
            type: 'pie',
            radius: [20, 150],
            center: ['50%', '50%'],
            roseType: 'area',
            itemStyle: {
              borderRadius: 8
            },
            data,
          }
        ]
      });
    }
  }, [chart, data]);

  window.addEventListener("resize", () => { chart && chart.resize(); });

  const handleChange = (_: React.SyntheticEvent<Element, Event>, newValue: string | null) => {
    setProfessor(newValue ?? "");
  }

  return (
    <Card>
      <CardHeader title="All Keywords Related" />
      <CardContent style={{ display: "flex", flexDirection: "column", height: 500, padding: "20px 10px" }}>
        <Box style={{ display: "flex", alignItems: "center", margin: "10px 20px 0 20px" }}>
          <Box><Typography>Show keyword composition of professor (based on KRC): </Typography></Box>
          <Box style={{ flex: "1 1 0%", margin: "0 10px", maxWidth: 200 }}>
            <Autocomplete
              disablePortal
              fullWidth
              options={profData}
              value={professor}
              size="small"
              renderInput={(params) => <TextField {...params} label="Professor" />}
              onChange={handleChange}
            />
          </Box>
          <Button variant="contained" onClick={getData.bind(null, professor)}>Search</Button>
        </Box>
        <div id="chart-keyword-composition" style={{ height: "100%", width: "100%" }} />
      </CardContent>
    </Card>
  );
}

export default KeywordComposition;