import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
  Typography,
  Tabs,
  Tab,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import { useSnackbar } from "notistack";
import { useAuth } from "../../context/AuthContext";

const AuthModal = ({ open, onClose }) => {
  const [tab, setTab] = useState(0); // 0 = Login, 1 = Register
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const isLogin = tab === 0;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      enqueueSnackbar("Please fill in all fields.", { variant: "warning" });
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
        enqueueSnackbar("Logged in successfully!", { variant: "success" });
      } else {
        await register(email, password);
        enqueueSnackbar("Registered! Please log in.", { variant: "success" });
        setTab(0); // switch to login tab after register
      }
      // Reset fields
      setEmail("");
      setPassword("");
      onClose();
    } catch (err) {
      const message =
        err.response?.data || err.message || "Something went wrong.";
      enqueueSnackbar(String(message), { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (_, newValue) => {
    setTab(newValue);
    setEmail("");
    setPassword("");
  };

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="xs" fullWidth>
      <DialogTitle align="center">Welcome to TalentMatch</DialogTitle>

      <DialogContent>
        <Tabs value={tab} onChange={handleTabChange} centered sx={{ mb: 3 }}>
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
            inputProps={{ minLength: isLogin ? undefined : 6 }}
            helperText={!isLogin ? "Minimum 6 characters" : ""}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{ mt: 1 }}
          >
            {loading ? (
              <CircularProgress size={22} color="inherit" />
            ) : isLogin ? (
              "Login"
            ) : (
              "Create Account"
            )}
          </Button>

          <Typography variant="body2" color="text.secondary" align="center">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <Box
              component="span"
              sx={{ color: "primary.main", cursor: "pointer" }}
              onClick={() => handleTabChange(null, isLogin ? 1 : 0)}
            >
              {isLogin ? "Register" : "Login"}
            </Box>
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
