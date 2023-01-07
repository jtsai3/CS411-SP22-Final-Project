import * as echarts from "echarts";
import { useCallback, useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { instance as axios } from "../utils/request";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

function NumFaculty() {
  const [loading, setLoading] = useState<boolean>(false);
  const [aData, setAData] = useState<{ max: number; name: string }[]>([]);
  const [rData, setRData] = useState<number[]>([]);
  const [universityData, setUniversityData] = useState<string[]>([]);
  const [chart, setChart] = useState<echarts.ECharts>();
  const [university, setUniversity] = useState<string>("College of William Mary");

  const getData = useCallback(async (universityName: string) => {
    try {
      setLoading(true);
      const res = await axios.request<{ keyword: string, count: number }[]>({
        url: "mysql/facultyRelated",
        method: "get",
        params: {
          universityName
        }
      });

      let max = 1;
      const newRData = res.data.map((item) => {
        max = Math.max(max, item.count);

        return item.count;
      })
      const newAData = res.data.map((item) => ({
        name: item.keyword,
        max,
      }));

      setRData(newRData);
      setAData(newAData);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  }, []);

  useEffect(() => {
    const getUniversityData = async () => {
      const res = await axios.get<{ id: number, name: string }[]>("mysql/university");
      setUniversityData(Array.from(new Set(res.data.map((item) => item.name))));
    }

    const element = document.getElementById("chart-num-faculty");
    let newChart: echarts.ECharts | undefined;

    if (element) {
      newChart = echarts.init(element);
      setChart(newChart);
    }

    getUniversityData();
    getData("College of William Mary");

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
    if (chart && rData.length && aData.length) {
      chart.setOption(
        {
          radar: {
            // shape: 'circle',
            indicator: aData,
          },
          tooltip: {
            show: true,
          },
          series: [
            {
              name: '# faculty related',
              type: 'radar',
              data: [
                {
                  value: rData,
                  name: 'Allocated Budget'
                },
              ]
            }
          ]
        });
    }
  }, [aData, chart, rData])

  window.addEventListener("resize", () => { chart && chart.resize(); });

  const handleChange = (_: React.SyntheticEvent<Element, Event>, newValue: string | null) => {
    setUniversity(newValue ?? "");
  }

  return (
    <Card>
      <CardHeader title="Number of Faculty Related" />
      <CardContent style={{ display: "flex", flexDirection: "column", height: 500, padding: "20px 10px" }}>
        <Box style={{ display: "flex", alignItems: "center", margin: "10px 20px 0 20px" }}>
          <Box><Typography>Show # faculty relevant to Top 10 keywords in univeristy: </Typography></Box>
          <Box style={{ flex: "1 1 0%", margin: "0 10px", maxWidth: 200 }}>
            <Autocomplete
              disablePortal
              fullWidth
              options={universityData}
              value={university}
              size="small"
              renderInput={(params) => <TextField {...params} label="University" />}
              onChange={handleChange}
            />
          </Box>
          <Button variant="contained" onClick={getData.bind(null, university)}>Search</Button>
        </Box>
        <div id="chart-num-faculty" style={{ height: "100%", width: "100%" }} />
      </CardContent>
    </Card>
  );
}

export default NumFaculty;