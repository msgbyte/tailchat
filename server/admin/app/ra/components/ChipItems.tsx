import React from 'react';
import { Chip, Grid } from '@mui/material';

export const ChipItems: React.FC<{
  items: string[];
}> = React.memo((props) => {
  return (
    <Grid container spacing={1}>
      {props.items.map((item) => (
        <Grid key={item} item>
          <Chip label={item} />
        </Grid>
      ))}
    </Grid>
  );
});
ChipItems.displayName = 'ChipItems';
