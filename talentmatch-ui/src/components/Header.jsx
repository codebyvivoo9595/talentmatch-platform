import { AppBar, Toolbar, Typography, Button, Box, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";

const Header = () => {
  const { isLoggedIn, userEmail, logout } = useAuth();
  const navigate = useNavigate();

  // Guest email stored in sessionStorage by LoginPage
  const guestEmail = sessionStorage.getItem("guestEmail");
  const isGuest = !isLoggedIn && Boolean(guestEmail);

  const handleLogout = () => {
    logout();
    sessionStorage.removeItem("guestEmail");
    navigate("/login");
  };

  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, cursor: "pointer", fontWeight: 700 }}
          onClick={() => navigate("/")}
        >
          TalentMatch
        </Typography>

        {isLoggedIn ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="body2" color="inherit" sx={{ opacity: 0.9 }}>
              {userEmail}
            </Typography>
            <Button color="inherit" onClick={handleLogout} sx={{ textTransform: "none" }}>
              Logout
            </Button>
          </Box>
        ) : isGuest ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Chip
              icon={<EmailOutlinedIcon />}
              label={guestEmail}
              size="small"
              sx={{ color: "#fff", borderColor: "rgba(255,255,255,0.6)", "& .MuiChip-icon": { color: "#fff" } }}
              variant="outlined"
            />
            <Button
              color="inherit"
              size="small"
              sx={{ textTransform: "none" }}
              onClick={() => navigate("/login")}
            >
              Sign Up
            </Button>
            <Button
              color="inherit"
              size="small"
              sx={{ textTransform: "none" }}
              onClick={() => {
                sessionStorage.removeItem("guestEmail");
                navigate("/login");
              }}
            >
              Exit Guest
            </Button>
          </Box>
        ) : (
          <Button
            color="inherit"
            sx={{ textTransform: "none" }}
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
