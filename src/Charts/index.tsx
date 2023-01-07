import Grid from "@mui/material/Grid";
import AddKeyword from "./AddKeyword";
import KeywordComposition from "./KeywordComposition";
import NumFaculty from "./NumFaculty";
import NumPublications from "./NumPublications";
import RelevantProfs from "./RelevantProfs";
import RemoveKeyword from "./RemoveKeyword";
import TopKeywords from "./TopKeywords";

function Charts() {
  return (
    <Grid container spacing={6} style={{ padding: "35px 50px" }}>
      <Grid item xs={4}><TopKeywords /></Grid>
      <Grid item xs={8}><NumPublications /></Grid>
      <Grid item xs={6}><RelevantProfs /></Grid>
      <Grid item xs={6}><KeywordComposition /></Grid>
      <Grid item xs={4}><NumFaculty /></Grid>
      <Grid item xs={4}><AddKeyword /></Grid>
      <Grid item xs={4}><RemoveKeyword /></Grid>
    </Grid>
  );
}

export default Charts;