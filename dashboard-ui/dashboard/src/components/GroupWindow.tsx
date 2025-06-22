import Box from '@mui/material/Box';
// import * as React from 'react';
// import { styled } from '@mui/material/styles';
// import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

//import {useAppSelector} from '../hooks'
// import { type sessions } from '../interfaces/session';
import {useSessionSelector } from '../hooks';
//import TabCard from './TabCard';

function GroupWindow(){
    const tabs = useSessionSelector((state) => {
        if (state.sessions.length === 0){
            return null
        }
        else{ 
            return Object.keys(state.sessions[0].userData.tabGroups)
            //console.log(typeof tabGroupEntires)
            //console.log(tabGroupEntires)
            
        }
    })
    
    console.log(tabs)
    return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 12, sm: 12, md: 12 }}>
        {tabs?.map((groupIndex) => <Grid key = {groupIndex} size={{ xs: 2, sm: 4, md: 4 }}>
            <p>{groupIndex}</p>
          </Grid>)}
      </Grid>
    </Box>
)

}

export default GroupWindow;