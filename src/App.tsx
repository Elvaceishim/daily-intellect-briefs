import { ThemeProvider, CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import theme from './theme';
import HomePage from './pages/Home';
import AllBriefs from './pages/AllBriefs';
import SignupPage from './pages/Signup';
import Dashboard from './pages/Dashboard';
import BriefsPage from './pages/AllBriefs';

const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/all-briefs" element={<AllBriefs />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/dashboard" element={<Dashboard userId={"exampleUserId"} />} />
              <Route path="/briefs" element={<BriefsPage />} />
            </Routes>
          </BrowserRouter>
        </div>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;