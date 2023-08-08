import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Head from "next/head";
import { parseCookies } from "nookies";

// Get token from cookies
export async function getServerSideProps(context) {
  const { token } = parseCookies(context);

  // If token is not found, return empty string
  if (!token) {
    return {
      props: {
        token: ''
      }
    }
  } else { 
    return {
      props: {
        token: token
      }
    }
  }
}

export default function Signup({ token }) {
  return (
    <>
      <Head>
        <title>Sign up</title>
      </Head>
        <div className="signup">
        <Container sx={{width:"600px", marginTop:"40px",}}>
          <Typography variant="h4" align="center" sx={{fontSize:"50px", fontWeight:"bold"}}>
            General Inventory
          </Typography>
          <Typography variant="h4" align="center" sx={{fontSize:"50px", fontWeight:"bold"}}>
           Management System
          </Typography>
        </Container>

        <Container sx={{marginTop:"40px"}}>
          <Typography variant="h4" align="center" sx={{fontSize:"35px"}}>
           Create account
          </Typography>
        </Container>

        <Container  sx={{ marginTop: '30px', backgroundColor:"white", width:"450px", height:"300px", borderRadius:"30px"}}>
            <form action="/api/signup" method="post">

            <TextField
              label="Email"
              type="email"
              name="email"
              fullWidth
              margin="normal"
              variant="outlined"
              required
            />

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
              Sign up
            </Button>

            </form>

            <Typography variant="body1" align="center" color={"black"}>
                Already have an account?{" "}
                <Link href="/login" color="primary">
                Sign in
              </Link>
            </Typography>

        </Container>
      </div>
    </>
  );
}