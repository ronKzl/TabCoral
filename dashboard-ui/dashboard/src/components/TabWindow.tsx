import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import {  type sessions } from '../interfaces/session';
import { useSelector } from 'react-redux';
import TabCard from './TabCard';
import { type PopUpState } from '../App';
import { useAppSelector } from '../hooks';

interface TabWindowProps {
    setPopUpOpen: React.Dispatch<React.SetStateAction<PopUpState>>;
}

function TabWindow({setPopUpOpen}: TabWindowProps) {   
    
    //data retrieveal is happening from the redux store! ()
    const sessions = useSelector((state: sessions) => state.sessions)
    const selectedIndex = useAppSelector((state) => state.profile.selectedIndex)
    console.log("TabWindow mount");
    console.log("sesh index")
    console.log(selectedIndex)
    if (selectedIndex < 0 || selectedIndex >= sessions.length ) return <div>No profile selected.</div> //TODO: style here

    const cur_session_id = sessions[selectedIndex].id
    const tabs = sessions[selectedIndex].userData.orderedEntries
    console.log("Data on sessions,cur_sesh_id,tabs")
    console.log(sessions)
    console.log(cur_session_id)
    console.log(tabs)
    // const groupInfo = sessions[selectedIndex].userData.groupInfo
    return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
        {tabs?.map((tab) => <Grid key = {tab.index} size={{ xs: 2, sm: 4, md: 4 }}>
            <TabCard id = {tab.id} favicon= {tab.favicon}  url={tab.url} title={tab.title} index={tab.index} setPopUpOpen ={setPopUpOpen} ></TabCard>
          </Grid>)}
      </Grid>
    </Box>
    )
}

export default TabWindow