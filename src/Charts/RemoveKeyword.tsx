import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import TextField from "@mui/material/TextField";
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from "react";
import { instance as axios } from "../utils/request";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";

function RemoveKeyword() {
  const [keyword, setKeyword] = useState<string>("");
  const [status, setStatus] = useState<"success" | "error" | null>(null);
  const [error, setError] = useState<string>("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value);
  };

  const handleRemove = async (keywordName: string) => {
    try {
      setStatus(null);
      await axios.request<{ keyword: string, count: number }[]>({
        url: "mysql/deleteKeyword/",
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
      <CardHeader title="Remove Keyword" />
      <CardContent style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center", height: 500 }}>
        <Box style={{ position: "absolute", top: 0, left: "50%", transform: "translate(-50%, 50%)" }}>
          {status === "success" && <Alert>Keyword removed!</Alert>}
          {status === "error" && <Alert severity="error">{error}</Alert>}
        </Box>
        <TextField label="Existing Keyword"
          value={keyword}
          onChange={handleChange}
        />
        <Button variant="contained" startIcon={<DeleteIcon />} size="large" color="error" style={{ marginLeft: 10 }} onClick={handleRemove.bind(null, keyword)}>Remove</Button>
      </CardContent>
    </Card>
  );
}

export default RemoveKeyword;