import * as React from 'react';
import {  type tab } from '../interfaces/session';
import TabCard from './TabCard';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
// import { Grid } from '@mui/material';
import { Box } from '@mui/material';
//import Divider from '@mui/material/Divider';
interface GroupCardProps { id: string; tabs: Array<tab> }

//TODO: probably delete this
function GroupCard( {id, tabs} : GroupCardProps){
    //color: 'text.secondary',
const card = (
  <React.Fragment>
    <CardContent sx = {{maxHeight: 150}}>
      <Typography gutterBottom sx={{ color: 'yellowgreen' ,  fontSize: 14 }}>
        {id}
      </Typography> 
      <Typography noWrap variant="h5" component="div">
        {tabs?.map((tab) => <Box sx={{color: "green"}}  key = {tab.index}>
            <TabCard {...tab} ></TabCard> <p>here?</p>
          </Box>)}
      </Typography>
    
    </CardContent>

    <CardActions>
      <Button size="small" sx={{color: 'red'}}>Delete</Button>
    </CardActions>
  </React.Fragment>
);
    console.log(id)
    console.log(tabs)
    return (
        <>{card}</>
        
    )
}

export default GroupCard;