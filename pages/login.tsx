import Head from "next/head";
import { parseCookies } from "nookies";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import { colors } from "@mui/material";
import { Card } from "@nextui-org/react";

// Get token from cookies
// This function is used to get the token from cookies and pass it as a prop to the Login component.
// It is a Next.js server-side function used for server-side rendering (SSR).
export async function getServerSideProps(context) {
  const { token } = parseCookies(context);

  // If token is not found, return empty string
  if (!token) {
    return {
      props: {
        token: ''
      }
    };
  } else {
    return {
      props: {
        token: token
      }
    };
  }
}

// Define a custom theme for MUI components
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Replace with your desired primary color
    },
  },
});

// Login component
// This is the main component responsible for the login page UI.
export default function Login({ token }) {
  return (
    <>
      <Head>
        <title>Sign in</title>
      </Head>
  
      <div className="Login">
      <Container sx={{width:"600px", marginTop:"40px",}}>
          <Typography variant="h4" align="center" sx={{fontSize:"50px", fontWeight:"bold"}}>
            General Inventory
          </Typography>
          <Typography variant="h4" align="center" sx={{fontSize:"50px", fontWeight:"bold"}}>
           Management System
          </Typography>
        </Container>

        <Container sx={{marginTop:"40px"}}>
          <Typography variant="h4" align="center" sx={{fontSize:"35px",fontStyle:""}}>
           Sign into your account
          </Typography>
        </Container>
      
      <Container sx={{ marginTop: '30px', backgroundColor:"white", width:"450px", height:"300px", borderRadius:"30px"}}>
        <form action="/api/login" method="post">
          {/* Email input field */}
          <TextField
            label="Email"
            type="email"
            name="email"
            fullWidth
            margin="normal"
            variant="outlined"
            required
          />
          {/* Password input field */}
          <TextField
            label="Password"
            type="password"
            name="password"
            fullWidth
            margin="normal"
            variant="outlined"
            required
          />
          {/* Hidden input field to pass the token to the login API */}
          <input type="hidden" name="token" value={token} />
          {/* Login button */}
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            fullWidth
            size="large"
            sx={{ mt: 2, mb: 2 }}
          >
            Sign in
          </Button>
        </form>
        {/* Sign up link */}
        <Typography variant="body1" align="center" color={"black"}>
          Don&apos;t Have an Account?{" "}
          <Link href="/signup" color="primary">
            Create an account
          </Link>
        </Typography>
      </Container>
      </div>
      </>
  );
}