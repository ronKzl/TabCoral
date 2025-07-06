import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import {  type sessions } from '../interfaces/session';
import { useSelector } from 'react-redux';
import TabCard from './TabCard';

function TabWindow() {   
    //data retrieveal is happening from the redux store! ()
    const Alldata = useSelector((state: sessions) => state.sessions)
    //when array is not here cant read props of undefined
    const cur_session = useSelector((state: sessions) => {
        if (state.sessions.length === 0){
            return "None - start saving now!"
        }
        else{
            console.log("I am here doing sessions[0].id should work??")
            console.log(state.sessions[0].id)
            return state.sessions[0].id
        }
    })
    const tabs = useSelector((state:sessions) => {
        if (state.sessions.length === 0){
            return null
        }
        else{
            return state.sessions[0].userData.orderedEntries
        }
    })

    console.log(Alldata)
    console.log(cur_session)
    console.log(tabs)
    return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
        {tabs?.map((tab) => <Grid key = {tab.index} size={{ xs: 2, sm: 4, md: 4 }}>
            <TabCard {...tab} ></TabCard>
          </Grid>)}
      </Grid>
    </Box>
    )
}

export default TabWindow