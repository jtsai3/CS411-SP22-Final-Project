import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

function Header() {
  return (
    <Box style={{
      padding: "10px 50px",
      background: "linear-gradient(30deg, #032642, #14446b)"
    }}>
      <Typography variant="h2" color="white">
        Explore Field of Interest
      </Typography>
    </Box>
  );
}

export default Header;