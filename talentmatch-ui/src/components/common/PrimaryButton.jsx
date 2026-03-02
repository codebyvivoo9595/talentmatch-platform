import { Button } from "@mui/material";
import { motion } from "framer-motion";

const MotionButton = motion(Button);

const PrimaryButton = ({ children, ...props }) => {
  return (
    <MotionButton
      whileHover={{
        scale: 1.06,
        boxShadow: "0 12px 30px rgba(33,150,243,0.45)",
      }}
      whileTap={{ scale: 0.96 }}
      variant="contained"
      sx={{
        px: 5,
        py: 1.5,
        fontSize: "1rem",
        fontWeight: 600,
        background: "linear-gradient(135deg, #1976d2, #42a5f5)",
        borderRadius: "12px",
        textTransform: "none",
      }}
      {...props}
    >
      {children}
    </MotionButton>
  );
};

export default PrimaryButton;