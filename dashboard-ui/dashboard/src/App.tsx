import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useDispatch } from 'react-redux';
import { setWorkflows } from './workflowSlice';
function App() {
  const [count, setCount] = useState(0)
  const dispatch = useDispatch();

  useEffect(() => {
    //mount array [each entry is 1 workflow that can be reconstructed]
    //workflow collectyion of (ordered tabs, group metadata, tab metadata)
    chrome.storage.local.get('workflows').then((store) => {
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
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to blah blah
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
