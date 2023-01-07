import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import TextField from "@mui/material/TextField";
import AddIcon from '@mui/icons-material/Add';
import { useState } from "react";
import { instance as axios } from "../utils/request";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";

function AddKeyword() {
  const [keyword, setKeyword] = useState<string>("");
  const [status, setStatus] = useState<"success" | "error" | null>(null);
  const [error, setError] = useState<string>("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value);
  };

  const handleAdd = async (keywordName: string) => {
    try {
      setStatus(null);
      await axios.request<{ keyword: string, count: number }[]>({
        url: "mysql/addKeyword/",
        method: "post",
        data: {
          keywordName,
        }
      });
      setStatus("success");
    } catch (e: any) {
      const message = e?.response?.data?.message ?? e.message;

      setStatus("error");
      setError(message);
    }
  }

  return (
    <Card>
      <CardHeader title="Add Keyword" />
      <CardContent style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center", height: 500 }}>
        <Box style={{ position: "absolute", top: 0, left: "50%", transform: "translate(-50%, 50%)" }}>
          {status === "success" && <Alert>New keyword added!</Alert>}
          {status === "error" && <Alert severity="error">{error}</Alert>}
        </Box>
        <TextField label="New Keyword"
          value={keyword}
          onChange={handleChange}
        />
        <Button variant="contained" startIcon={<AddIcon />} size="large" color="success" style={{ marginLeft: 10 }} onClick={handleAdd.bind(null, keyword)}>Add</Button>
      </CardContent>
    </Card>
  );
}

export default AddKeyword;