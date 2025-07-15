import { useEffect, useState } from "react";
import "./App.css";
import { useDispatch } from "react-redux";
import { setSessions } from "./sessionSlice";
import Box from "@mui/material/Box";
import TabWindow from "./components/TabWindow";
import GroupWindow from "./components/GroupWindow";
import Switch from "@mui/material/Switch";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PopUpBar from "./components/Actions/PopUpBar";
import ProfilesList from "./components/Lists/ProfilesList";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
export interface PopUpState {
  open: boolean;
  message: string;
  status: "success" | "info" | "warning" | "error";
  variant: "standard" | "filled" | "outlined";
  duration: number;
}

function App() {
  const label = { inputProps: { "aria-label": "switch between group and tab view" } };
  const [isChecked, setIsChecked] = useState(false);
  
  const [popUp, setPopUpOpen] = useState<PopUpState>({
    open: false,
    duration: 0,
    message: "",
    status: "info",
    variant: "outlined",
  });

  async function createNewProfile(){
    let res = await chrome.runtime.sendMessage({type: "CREATE_NEW_PROFILE"});
    console.log(res)

  }

  const popup_card = (
    <PopUpBar
      key={popUp.message + popUp.status}
      duration={popUp.duration}
      message={popUp.message}
      statusColor={popUp.status}
      style={popUp.variant}
      isOpen={popUp.open}
      handleClick={() => setPopUpOpen({ ...popUp, open: false })}
    />
  );

  const handleViewChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
  };
  const dispatch = useDispatch();
  
  useEffect(() => {
    //mount array [each entry is 1 session that can be reconstructed]
    //sessions collection of session that consists of -> (ordered tabs, group metadata, tab metadata)
    chrome.storage.local.get("sessions").then((store) => {
      console.log("first time");
      dispatch(setSessions(store.sessions || []));
    });

    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === "local" && changes.sessions) {
        chrome.storage.local.get("sessions").then(console.log);
        chrome.storage.local.get("sessions").then((store) => {
          console.log("Updated sessions:", store.sessions);
          dispatch(setSessions(store.sessions || []));
        });
      }
    });
  }, []);


  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid size={2}>
          <Button onClick={() => createNewProfile()} sx={{backgroundColor:"green"}} variant="contained">New Profile</Button>
          <ProfilesList />
        </Grid>
        <Grid size={8}>
          <Box component="section" sx={{ p: 2 }}>
            {isChecked && <GroupWindow setPopUpOpen={setPopUpOpen} />}
            {!isChecked && <TabWindow setPopUpOpen={setPopUpOpen} />}
            {popup_card}
          </Box>
        </Grid>
        <Grid size={2}>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Typography>Tab View</Typography>
            <Switch {...label} color="default" onChange={handleViewChange} />
            <Typography>Group View</Typography>
          </Stack>
        </Grid>
      </Grid>
      {/* <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <Typography>Tab View</Typography>
        <Switch {...label} color="default" onChange={handleViewChange}/>
        <Typography>Group View</Typography>
      </Stack>
    <ProfilesList />
    <Box component="section" sx={{ p: 2 }}>
          {isChecked &&  <GroupWindow setPopUpOpen={setPopUpOpen}/> }
          {!isChecked && <TabWindow setPopUpOpen={setPopUpOpen}/>}
          {popup_card}
    </Box> */}
    </Box>
  );
}

export default App;
