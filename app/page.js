'use client'
import Image from "next/image";
import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import {
  AppBar,
  Box,
  Button,
  Container,
  Grid,
  Toolbar,
  Typography,
} from "@mui/material";
import Head from "next/head";

export default function Home() {

  const handleSubmit = async () => {
    const checkoutSession = await fetch(`/api/checkoutsessions`, {
      method: 'POST',
      headers: {
        'origin': 'http://localhost:3000',
      },
    })

    const checkoutSessionJson = await checkoutSession.json()
    if (checkoutSession.statusCode === 500) {
      console.error('Error creating checkout session:', checkoutSessionJson.message)
      return
  } 

  const stripe = await getStripe()
  const {error} = await stripe.redirectToCheckout({
    sessionId: checkoutSessionJson.id,
  })
  if (error) {
    console.warn('Error redirecting to checkout:', error.message)
    return
  }
}
  return (
    <Container maxWidth="100vw">
      <Head>
        <title>Flashcards SaaS</title>
        <meta name="description" content="Create flashcards from your text" />
      </Head>

      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Flashcards SaaS
          </Typography>
          <SignedOut>
            <Button color="inherit" href="/sign-in">
             {' '}
              Login
            </Button>
            <Button color="inherit" href="/sign-up">
              Sign up
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          textAlign: "center",
          my: 4,
        }}
      >
        <Typography variant="h2" gutterBottom>
          Welcome to Flashcards SaaS!
        </Typography>
        <Typography variant="h5" gutterBottom>
          {' '}
          Transform Text to Flashcards in a Flash: The Smartest Way to Study!
        </Typography>
        <Button variant="contained" color="primary" sx={{ mt: 2 }}>
          Get Started
        </Button>
      </Box>
      <Box sx={{ my: 6 }}>
        <Typography variant="h4" gutterBottom>
          Features
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6">Easy Text Input</Typography>
            <Typography>
              {" "}
              Simply input your text and watch the magic happen! Creating
              flashcards has never been this seamless and intuitive.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Smart Flashcards
            </Typography>
            <Typography>
              {" "}
              Watch our AI transform your text into bite-sized, study-ready
              flashcards in seconds!
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Accessible Anywhere
            </Typography>
            <Typography>
              {" "}
              Study smarter, not harder! Your flashcards are at your fingertips
              24/7, on any device. Learning on the go has never been this easy.
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ my: 6, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Pricing
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 3,
                border: "1px solid",
                borderRadius: 2,
                borderColor: "grey.300",
              }}
            >
              <Typography variant="h5" gutterBottom> 
                Basic Plan
              </Typography>
              <Typography variant="h6" gutterBottom>
                $5/month
              </Typography>
              <Typography>
                {" "}
                Access to basic flashcard features and limited storage.
              </Typography>
              <Button variant="contained" color="primary" sx={{mt: 2}}>
                Choose Basic
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 3,
                border: "1px solid",
                borderRadius: 2,
                borderColor: "grey.300",
              }}
            >
              <Typography variant="h5" gutterBottom>
                Pro
              </Typography>
              <Typography variant="h6" gutterBottom>
                 $10/month
              </Typography>
              <Typography>
                {" "}
                Unlimited flashcards and storage, with priority support
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                sx={{mt: 2}} 
                onClick={handleSubmit}
              >
                Choose Pro
              </Button>
            </Box>
          </Grid>
          {/* <Grid item xs={12} md={4}>
            <Box
              sx={{
                p: 3,
                border: "1px solid",
                borderRadius: 2,
                borderColor: "grey.300",
              }}
            >
              <Typography variant="h5" gutterBottom>
                Pro
              </Typography>
              <Typography variant="h5" gutterBottom>
                $10 / month
              </Typography>
              <Typography>
                {" "}
                Unlimited flashcards and storage, with priority support
              </Typography>
              <Button variant="contained" color="primary" sx={{mt: 2}}>
                Choose Pro
              </Button>
            </Box>
          </Grid> */}
        </Grid>
      </Box>
    </Container>
  );
}