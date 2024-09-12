import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {ThemeProvider, createTheme} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App.tsx'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

createRoot(document.getElementById('root')!).render(
    <ThemeProvider theme={darkTheme}>
        <App />
    </ThemeProvider>
)
