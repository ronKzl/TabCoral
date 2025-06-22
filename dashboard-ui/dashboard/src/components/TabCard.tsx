import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {  type sessions } from '../interfaces/session';
import { useSelector } from 'react-redux';
import CardMedia from '@mui/material/CardMedia';
type TabCardprops = {
  id: number
}


function TabCard({ id }: TabCardprops){
    console.log(id)
    const tab = useSelector((state:sessions) => {
      return state.sessions[0].userData.orderedEntries.find((t) => t.index == id)
    })
    console.log(tab)
    
const card = (
  <React.Fragment>
    <CardContent sx = {{maxHeight: 150}}>
      <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
        <CardMedia
        component="img"
        alt={tab?.title}
        height="16"
        image={tab?.favicon}
        sx={{ maxWidth: 16 ,
          backgroundColor: 'grey', // light gray background #f0f0f0
          borderRadius: '16px',
          padding: '2px',
          border: '2px solid #ccc' }}
      />
      </Typography>
      <Typography variant="h5" component="div">
        <a href={tab?.url}>{tab?.title}</a>
      </Typography>
    </CardContent>
    <CardActions>
      <Button size="small">Delete</Button>
      <Button size="small">Open</Button>
    </CardActions>
  </React.Fragment>
);


    return (
    <Box sx={{ minWidth: 275 }}>
      <Card variant="outlined">{card}</Card>
    </Box>
  )
}

export default TabCard;