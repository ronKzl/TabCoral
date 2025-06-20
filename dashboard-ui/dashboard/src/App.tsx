import { useEffect } from 'react'
import './App.css'
import { useDispatch } from 'react-redux';
import { setWorkflows } from './workflowSlice';
import Box from '@mui/material/Box';
import WorkflowSlider from './components/WorkflowSlider';
import WorkflowWindow from './components/WorkflowWindow';

function App() {

  const dispatch = useDispatch();
  useEffect(() => {
    //mount array [each entry is 1 workflow that can be reconstructed]
    //workflow collectyion of (ordered tabs, group metadata, tab metadata)
    chrome.storage.local.get('workflows').then((store) => {
      console.log("first time")
      dispatch(setWorkflows(store.workflows || []));
    });

    chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.workflows) {
      chrome.storage.local.get('workflows').then((store) => {
        console.log("Updated workflows:", store.workflows); 
        dispatch(setWorkflows(store.workflows || []));
      });
    }
  });
  }, []);

  

  return (
    <>
      <Box component="section" sx={{ p: 2, border: '1px dashed grey' }}>
          This Box renders as an HTML section element.
          <WorkflowSlider />
          <WorkflowWindow />
    </Box>
    </>
  )
}

export default App
