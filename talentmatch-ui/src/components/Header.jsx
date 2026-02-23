import { AppBar, Toolbar, Typography, Button } from "@mui/material";

const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          TalentMatch
        </Typography>

        <Button color="inherit">Login</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;