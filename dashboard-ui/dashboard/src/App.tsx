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

import { setProfileIndex } from "./profileSlice";

export interface PopUpState {
  open: boolean;
  message: string;
  status: "success" | "info" | "warning" | "error";
  variant: "standard" | "filled" | "outlined";
  duration: number;
}

function App() {
  const label = {
    inputProps: { "aria-label": "switch between group and tab view" },
  };
  const [isChecked, setIsChecked] = useState(true);

  const [popUp, setPopUpOpen] = useState<PopUpState>({
    open: false,
    duration: 0,
    message: "",
    status: "info",
    variant: "outlined",
  });

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

  // async function handleCreatingNewProfile() {
  //   let res = await chrome.runtime.sendMessage({ type: "CREATE_NEW_PROFILE" });

  //   if (res.success) {
  //     setPopUpOpen({
  //       open: true,
  //       duration: 3000,
  //       message: "New Profile Created!",
  //       status: "success",
  //       variant: "filled",
  //     });
  //   } else {
  //     setPopUpOpen({
  //       open: true,
  //       duration: 8000,
  //       message: "Error: profile limit reached or data error in transit.",
  //       status: "error",
  //       variant: "filled",
  //     });
  //   }
  // }

  const handleViewChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
  };
  const dispatch = useDispatch();

  useEffect(() => {
    chrome.storage.local.get("sessions").then((store) => {
      dispatch(setSessions(store.sessions || []));
    });

    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === "local" && changes.sessions) {
        chrome.storage.local.get("sessions").then((store) => {
          dispatch(setSessions(store.sessions || []));
        });
      }
    });

    chrome.storage.local.get("currentSessionIndex").then((res) => {
      const index = res.currentSessionIndex;
      if (typeof index === "number" && index >= 0) {
        dispatch(setProfileIndex(index));
      } else {
        dispatch(setProfileIndex(-1));
      }
    });
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid size={3}>
          <ProfilesList setPopUpOpen={setPopUpOpen} />
        </Grid>
        <Grid size={7}>
          {isChecked && <GroupWindow setPopUpOpen={setPopUpOpen} />}
          {!isChecked && <TabWindow setPopUpOpen={setPopUpOpen} />}
          {popup_card}
        </Grid>
        <Grid size={2} sx={{ pr: 2 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Typography>Tab View</Typography>
            <Switch
              {...label}
              checked={isChecked}
              color="default"
              onChange={handleViewChange}
            />
            <Typography>Group View</Typography>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}

export default App;
