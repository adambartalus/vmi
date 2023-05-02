import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';

const ResponsiveGridContainer = ({ children, ...props }) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} m={{ xs: 2, md: 3 }} {...props}>
        {children}
      </Grid>
    </Box>
  );
};

export default ResponsiveGridContainer;
