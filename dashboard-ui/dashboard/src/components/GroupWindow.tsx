import Box from "@mui/material/Box";
import { useSessionSelector } from "../hooks";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TabCard from "./TabCard";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import { type group } from "../interfaces/session";



function GroupWindow() {
  const tabs = useSessionSelector(
    (state) => state.sessions[0]?.userData.tabGroups ?? {}
  );
  const groupInfo = useSessionSelector(
    (state) => state.sessions[0]?.userData.groupInfo ?? {}
  ) as Record<string, group>;
  console.log(groupInfo)

  const tabColorMap: Record<string, string> = {
  'grey': "#5f6368",
  'blue': "#1a73e8",
  'red': "#d93025",
  'yellow': "#f9ab00",
  'green': "#188038",
  'pink': "#d01884",
  'purple': "#a142f4",
  'cyan': "#007b83",
  'orange': "#fa903e",
};

  return (
    <Box sx={{ flexGrow: 1 }}>
      {Object.entries(tabs).map(([id, tabs]) => ( 
        
        <Accordion key={id} sx={{ width: "100%"}}>
          <AccordionSummary  sx={{  '& .MuiAccordionSummary-content': { alignItems: 'center' } }} expandIcon={<ExpandMoreIcon />}>
            
              <Box> {groupInfo[id]?.title ?? 'Ungrouped'} ({tabs.length})</Box>
               <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
                {/* action buttons */}
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation(); /* delete group */
                  }}
                >
                  <DeleteIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation(); /* more menu */
                  }}
                >
                  <MoreVertIcon />
                </IconButton>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx ={{background: `${tabColorMap[groupInfo[id]?.color] ?? 'white'}`}}>
            {tabs?.map((tab) => (
              <Box key={tab.index}>
                <TabCard {...tab}></TabCard>
              </Box>
            ))}
          </AccordionDetails>
        </Accordion> 
      ))}
    </Box>
  );
}

export default GroupWindow;
