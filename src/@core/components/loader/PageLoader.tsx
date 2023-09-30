import { Box,CircularProgress,Typography } from "@mui/material";

const PageLoader =()=>{
    return(
        <Box
        sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            height: "100%",
        }}
    >
        <CircularProgress sx={{ mb: 4 }} />
        <Typography>Loading...</Typography>
    </Box>
    )
};
export default PageLoader;