import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import { useSessionSelector } from "../../hooks";
import { type session } from "../../interfaces/session";
import ProfileListItem from "./ProfileListItem";
import { type PopUpState } from "../../App";

interface ProfileListProps {
  setPopUpOpen: React.Dispatch<React.SetStateAction<PopUpState>>;
}

export default function ProfilesList({ setPopUpOpen }: ProfileListProps) {
  const sessions = useSessionSelector((state) => state.sessions ?? []);

  return (
    <List
      sx={{ width: "100%", maxWidth: 360 }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader
          sx={{ fontSize: "1rem", bgcolor: "inherit", color: "inherit" }}
          component="div"
          id="nested-list-subheader"
        >
          Your Profiles:
        </ListSubheader>
      }
    >
      {sessions.map((entry: session, index: number) => (
        <ProfileListItem
          session_name={entry.name}
          session_id={entry.id}
          session_index={index}
          setPopUpOpen={setPopUpOpen}
        />
      ))}
    </List>
  );
}
