import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

const getRatingInStars = (rating) => {
  return '*'.repeat(rating)
}
const getPriceRangeInDollars = (priceRange) => {
  return '$'.repeat(priceRange)
}
export default function BasicCard({data}) {
  return (
    <Card sx={{  width: '0%'}}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
          Restaurant Info
        </Typography>

        <Typography variant="body1">
          Phone Number : {data.tel}
        </Typography>

        <Typography variant="body1">
          Food Type : {data.genres}
        </Typography>

        <Typography variant="body1">
          Rating : {getRatingInStars(data.rating)}
        </Typography>

        <Typography variant="body1">
        Price Range : {getPriceRangeInDollars(data.price_range)}
      </Typography>

      </CardContent>

    </Card>
  );
}