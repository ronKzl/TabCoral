import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { type sessions } from "../interfaces/session";
import { useSelector } from "react-redux";
import TabCard from "./TabCard";
import { type PopUpState } from "../App";
import { useAppSelector } from "../hooks";
import EmptyWindow from "./Skeletons/EmptyWindow";
import EmptyProfilePrompt from "./Skeletons/EmptyProfile";
import TablePagination from "@mui/material/TablePagination";
import { useState } from "react";
interface TabWindowProps {
  setPopUpOpen: React.Dispatch<React.SetStateAction<PopUpState>>;
}
const DEFAULT_ITEMS_PER_PAGE = 12;
const SELECT_OPTIONS = [9, 12, 36 ,48, 72, 96, 144];

function TabWindow({ setPopUpOpen }: TabWindowProps) {
  const sessions = useSelector((state: sessions) => state.sessions);
  const selectedIndex = useAppSelector((state) => state.profile.selectedIndex);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);

  const handleChangePage = (
    _: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (selectedIndex < 0 || selectedIndex >= sessions.length)
    return <EmptyWindow setPopUpOpen={setPopUpOpen} />;

  const tabs = sessions[selectedIndex].userData.orderedEntries ?? [];
  if (tabs.length < 1) return <EmptyProfilePrompt />;

  return (
    <>
      <TablePagination
        sx={{
          color: "white",
          display: "flex",
          justifyContent: "center",
          "& .MuiIconButton-root": { color: "white" },
          "& .MuiSelect-icon": { color: "white" },
        }}
        component="div"
        count={tabs?.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={SELECT_OPTIONS}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Tabs per page:"
      />
      <Box sx={{ flexGrow: 1 }}>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 2, sm: 4, md: 8, lg: 12, xl: 12 }}
        >
          {tabs
            ?.slice(page * rowsPerPage, (page * rowsPerPage) + rowsPerPage)
            .map((tab) => (
              <Grid
                key={tab.index}
                size={{ xs: 2, sm: 4, md: 4, lg: 4, xl: 4 }}
              >
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
      <TablePagination
        sx={{ color: "white",
          display: "flex",
          justifyContent: "center",
          "& .MuiIconButton-root": { color: "white" },
        "& .MuiSelect-icon": { color: "white" }, }}
        component="div"
        count={tabs?.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={SELECT_OPTIONS}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Tabs per page:"
      />
    </>
  );
}

export default TabWindow;
