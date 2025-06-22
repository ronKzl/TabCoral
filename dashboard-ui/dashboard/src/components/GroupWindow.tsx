import Box from "@mui/material/Box";
import { useSessionSelector } from "../hooks";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TabCard from "./TabCard";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";


function GroupWindow() {
  const tabs = useSessionSelector(
    (state) => state.sessions[0]?.userData.tabGroups ?? {}
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      {Object.entries(tabs).map(([id, tabs]) => (
        <Accordion key={id} sx={{ width: "100%" }}>
          <AccordionSummary  sx={{ '& .MuiAccordionSummary-content': { alignItems: 'center' } }} expandIcon={<ExpandMoreIcon />}>
            
              <Box> Group {id} ({tabs.length})</Box>
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
          <AccordionDetails>
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
