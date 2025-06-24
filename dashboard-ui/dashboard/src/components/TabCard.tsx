import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CardMedia from '@mui/material/CardMedia';
import {type tab} from "../interfaces/session"


function TabCard( {favicon, url, title, index} : tab){
      

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log("here tab is opening up")
    chrome.tabs.create({active: true, index: index, url: url})
    event.stopPropagation();
  };

const card = (
  
  <React.Fragment>
    <CardContent sx = {{maxHeight: 150}}>
      <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
        <CardMedia
        component="img"
        alt={title}
        height="16"
        image={favicon}
        sx={{ maxWidth: 16 ,
          backgroundColor: 'grey', // light gray background #f0f0f0
          borderRadius: '4px',
          padding: '2px',
          border: '2px solid #ccc' }}
      />
      </Typography>
      <Typography noWrap variant="h5" component="div">
        <a href={url}>{title}</a>
      </Typography>
    </CardContent>
    <CardActions>
      <Button size="small" sx={{color: 'green'}} onClick={handleClick}>Open Tab</Button>
      <Button size="small" sx={{color: 'red'}}>Remove From Session</Button>
    </CardActions>
  </React.Fragment>
);


    return (
    <Box sx={{ minWidth: 275 }}>
      <Card variant="outlined">{card}</Card>
      <br />
    </Box>
  )
}

export default TabCard;