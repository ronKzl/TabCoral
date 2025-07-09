import { useEffect, useState } from 'react'
import './App.css'
import { useDispatch } from 'react-redux';
import { setSessions } from './sessionSlice';
import Box from '@mui/material/Box';
// import WorkflowSlider from './components/WorkflowSlider';
import TabWindow from './components/TabWindow';
import GroupWindow from './components/GroupWindow';
import Switch from '@mui/material/Switch';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import PopUpBar from "./components/Actions/PopUpBar";

export interface PopUpState {
  open: boolean;
  message: string;
  status: "success" | "info" | "warning" | "error";
  variant: "standard" | "filled" | "outlined";
  duration: number;
}

function App() {
  const label = { inputProps: { 'aria-label': 'Color switch demo' } };
  const [isChecked, setIsChecked] = useState(false)

  const [popUp, setPopUpOpen] = useState<PopUpState>({
      open: false,
      duration: 0,
      message: "",
      status: "info",
      variant: "outlined",
    });

    const popup_card = (<PopUpBar
            key={popUp.message + popUp.status}
            duration={popUp.duration}
            message={popUp.message}
            statusColor={popUp.status}
            style={popUp.variant}
            isOpen={popUp.open}
            handleClick={() => setPopUpOpen({ ...popUp, open: false })}
          />);
  
  const handleViewChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked)
  } 
  const dispatch = useDispatch();
  useEffect(() => {
    //mount array [each entry is 1 session that can be reconstructed]
    //sessions collection of session that consists of -> (ordered tabs, group metadata, tab metadata)
    chrome.storage.local.get('sessions').then((store) => {
      console.log("first time")
      dispatch(setSessions(store.sessions || []));
    });

    chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.sessions) {
      chrome.storage.local.get('sessions').then(console.log)
      chrome.storage.local.get('sessions').then((store) => {
        console.log("Updated sessions:", store.sessions); 
        dispatch(setSessions(store.sessions || []));
      });
    }
  });
  }, []);

  

  return (
    <>
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <Typography>Tab View</Typography>
        <Switch {...label} color="default" onChange={handleViewChange}/>
        <Typography>Group View</Typography>
      </Stack>
    <Box component="section" sx={{ p: 2 }}>
          {isChecked &&  <GroupWindow setPopUpOpen={setPopUpOpen}/> }
          {!isChecked && <TabWindow setPopUpOpen={setPopUpOpen}/>}
          {popup_card}
    </Box>
    </>
  )
}

export default App
