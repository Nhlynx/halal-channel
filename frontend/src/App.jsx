import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                borderRadius: '12px',
                fontWeight: '600',
                fontSize: '14px',
              },
              success: {
                style: {
                  background: '#14231e',
                  color: '#dec684',
                  border: '1px solid #223831',
                },
                iconTheme: {
                  primary: '#dec684',
                  secondary: '#14231e',
                },
              },
              error: {
                style: {
                  background: '#1e1414',
                  color: '#fca5a5',
                  border: '1px solid #3b1515',
                },
              },
            }}
          />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
