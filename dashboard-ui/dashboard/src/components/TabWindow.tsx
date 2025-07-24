import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { type sessions } from "../interfaces/session";
import { useSelector } from "react-redux";
import TabCard from "./TabCard";
import { type PopUpState } from "../App";
import { useAppSelector } from "../hooks";

interface TabWindowProps {
  setPopUpOpen: React.Dispatch<React.SetStateAction<PopUpState>>;
}

function TabWindow({ setPopUpOpen }: TabWindowProps) {
  const sessions = useSelector((state: sessions) => state.sessions);
  const selectedIndex = useAppSelector((state) => state.profile.selectedIndex);

  if (selectedIndex < 0 || selectedIndex >= sessions.length)
    return <div>No profile selected.</div>; //TODO: style here

  const tabs = sessions[selectedIndex].userData.orderedEntries;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        {tabs?.map((tab) => (
          <Grid key={tab.index} size={{ xs: 2, sm: 4, md: 4 }}>
            <TabCard
              id={tab.id}
              favicon={tab.favicon}
              url={tab.url}
              title={tab.title}
              setPopUpOpen={setPopUpOpen}
            ></TabCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default TabWindow;
