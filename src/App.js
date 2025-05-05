import logo from './logo.svg';
import './App.css';
import React, { useState, useMemo } from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Switch,
  Box,
  Grid,
  TextField,
  Paper,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";

const currencies = ["USD", "EUR", "INR"];

function LoanCalculator() {
  const [amount, setAmount] = useState(100000);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(5);
  const [emi, setEmi] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [currency, setCurrency] = useState("USD");

  const handleCalculate = () => {
    const P = parseFloat(amount);
    const annualRate = parseFloat(rate);
    const N = parseInt(years) * 12;
    const R = annualRate / 12 / 100;
    if (P > 0 && annualRate > 0 && N > 0) {
      const emiValue = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
      setEmi(emiValue.toFixed(2));
      // Generate amortization schedule
      let balance = P;
      let scheduleArr = [];
      for (let i = 1; i <= N; i++) {
        const interest = balance * R;
        const principal = emiValue - interest;
        balance -= principal;
        scheduleArr.push({
          month: i,
          principal: principal > 0 ? principal : 0,
          interest: interest > 0 ? interest : 0,
          balance: balance > 0 ? balance : 0,
        });
      }
      setSchedule(scheduleArr);
    } else {
      setEmi(null);
      setSchedule([]);
    }
  };

  const handleReset = () => {
    setSchedule([]);
    setEmi(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h3" gutterBottom>
        Loan Calculator Dashboard
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={3}>
          <TextField
            label="Loan Amount"
            fullWidth
            value={amount}
            onChange={e => setAmount(e.target.value)}
            type="number"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            label="Interest Rate (%)"
            fullWidth
            value={rate}
            onChange={e => setRate(e.target.value)}
            type="number"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            label="Term (Years)"
            fullWidth
            value={years}
            onChange={e => setYears(e.target.value)}
            type="number"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <Button variant="contained" color="primary" fullWidth onClick={handleCalculate}>
            CALCULATE
          </Button>
        </Grid>
      </Grid>

      {emi && (
        <>
          <Typography variant="h5" sx={{ mt: 4 }}>
            Monthly EMI: {currency} {emi}
          </Typography>
          <Box sx={{ mt: 2, mb: 2 }}>
            <TextField
              select
              label="Currency"
              value={currency}
              onChange={e => setCurrency(e.target.value)}
              sx={{ width: 120 }}
            >
              {currencies.map((cur) => (
                <MenuItem key={cur} value={cur}>{cur}</MenuItem>
              ))}
            </TextField>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button variant="outlined" color="secondary" onClick={handleReset}>
              RESET TABLE
            </Button>
          </Box>
          <TableContainer component={Paper} sx={{ mt: 2, maxHeight: 400 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Month</TableCell>
                  <TableCell>Principal</TableCell>
                  <TableCell>Interest</TableCell>
                  <TableCell>Remaining Balance</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {schedule.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row.month}</TableCell>
                    <TableCell>{row.principal.toFixed(2)} {currency}</TableCell>
                    <TableCell>{row.interest.toFixed(2)} {currency}</TableCell>
                    <TableCell>{row.balance.toFixed(2)} {currency}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [page, setPage] = useState("loan");

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
          primary: { main: "#1976d2" },
        },
        typography: {
          fontFamily: "Roboto, Arial",
        },
      }),
    [darkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, cursor: "pointer" }}
            onClick={() => setPage("loan")}
          >
            Loan Calculator
          </Typography>
          <Button color="inherit" onClick={() => setPage("loan")}>HOME</Button>
          <Button color="inherit" onClick={() => setPage("exchange")}>EXCHANGE RATES (LIVE)</Button>
          <Button color="inherit" onClick={() => setPage("about")}>ABOUT</Button>
          <Button color="inherit" onClick={() => setPage("error")}>ERROR PAGE</Button>
          <Switch
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
            color="default"
          />
        </Toolbar>
      </AppBar>
      {page === "loan" && <LoanCalculator />}
      {page === "exchange" && <div style={{ padding: 32 }}>Exchange Rates Page (to be implemented)</div>}
      {page === "about" && (
        <Box sx={{ p: { xs: 2, md: 8 }, maxWidth: 1200, mx: "auto" }}>
          <Typography variant="h3" gutterBottom>About This App</Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            This Loan Calculator App is a modern, single-page web application built using <b>React JS</b> and <b>Material UI</b>. It allows users to calculate loan EMIs (Equated Monthly Installments), view a detailed amortization schedule, and see real-time currency conversions of their EMI using live exchange rates.
          </Typography>
          <Box sx={{ my: 3 }}>
            <hr />
          </Box>
          <Typography variant="h4" gutterBottom>
            <span role="img" aria-label="instructions">📝</span> Instructions for Candidates
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Please follow these instructions to complete and submit your project:
          </Typography>
          <ul>
            <li>Push the entire project to a public <b>GitHub repository</b>.</li>
            <li>Make sure to <b>commit regularly</b> with clear messages after completing each feature.</li>
            <li>Use the provided EMI formula to perform calculations.</li>
            <li>Use <b>Context API</b> for global state management (e.g. theme, currency).</li>
            <li>Create <b>custom React hooks</b> for reusable logic (e.g. EMI calculation, fetching exchange rates).</li>
            <li>Integrate the <b>ExchangeRate API</b> for live currency conversion.</li>
            <li>Ensure the app is fully <b>responsive</b> on all screen sizes.</li>
            <li>Implement both <b>light and dark modes</b> using Material UI's theming system.</li>
            <li>Add a <b>404 Not Found</b> page for unmatched routes.</li>
            <li>Handle runtime errors gracefully by showing an <b>Error Page</b>.</li>
            <li>Once deployed, add the live deployment <b>link in the About section</b> of your GitHub repo.</li>
            <li>Deploy the project on any platform (e.g. Vercel, Netlify, GitHub Pages).</li>
          </ul>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <span role="img" aria-label="check">✅</span>
            <Typography variant="body2" sx={{ ml: 1 }}>
              Your final GitHub repository should include a live demo link, and your code should be readable, modular, and well-structured.
            </Typography>
          </Box>
          <Box sx={{ my: 3 }}>
            <hr />
          </Box>
          <Typography variant="h4" gutterBottom>
            <span role="img" aria-label="features">🛠️</span> Features
          </Typography>
          <ul>
            <li>Calculate EMI and amortization schedule for any loan amount, interest rate, and term.</li>
            <li>Switch between light and dark mode for comfortable viewing.</li>
            <li>View real-time currency conversion of EMI using live exchange rates.</li>
            <li>Responsive design for all devices.</li>
            <li>Error handling and 404 page for unmatched routes.</li>
          </ul>
        </Box>
      )}
      {page === "error" && <div style={{ padding: 32 }}>Error Page (to be implemented)</div>}
    </ThemeProvider>
  );
}

export default App;
