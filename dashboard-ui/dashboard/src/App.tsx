import { useEffect } from 'react'
import './App.css'
import { useDispatch } from 'react-redux';
import { setSessions } from './sessionSlice';
import Box from '@mui/material/Box';
import WorkflowSlider from './components/WorkflowSlider';
import TabWindow from './components/TabWindow';
import GroupWindow from './components/GroupWindow';

function App() {

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
      chrome.storage.local.get('sessions').then((store) => {
        console.log("Updated sessions:", store.sessions); 
        dispatch(setSessions(store.sessions || []));
      });
    }
  });
  }, []);

  

  return (
    <>
      <Box component="section" sx={{ p: 2, border: '1px dashed grey' }}>
          This Box renders as an HTML section element.
          <WorkflowSlider />
          <GroupWindow />
          <TabWindow />
    </Box>
    </>
  )
}

export default App
