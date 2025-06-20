import { ThemeProvider, CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { theme } from './theme';
import Index from './pages/Index';
import ShareBrief from './pages/ShareBrief';

const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/share/:token" element={<ShareBrief />} />
            </Routes>
          </BrowserRouter>
        </div>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;