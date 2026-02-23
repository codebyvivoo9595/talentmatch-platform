import { Box } from "@mui/material";
import Header from "../components/Header";
import Footer from "../components/Footer";

const MainLayout = ({ children }) => {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Header />
      <Box component="main" flexGrow={1}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

export default MainLayout;