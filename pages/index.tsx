import Head from "next/head"
import Image from "next/image";
import { Container, Navbar, Text, Button, Grid, Col, Row, Card } from '@nextui-org/react';
import Infocard from "@/components/infocard";



export default function LandingPage() {
  return (
  <>
    <Head>
      <title>General Inventory Management</title> 
    </Head>
    <div className="background">
      <div>
      <Navbar isCompact variant={"floating"} css={{position:"fixed"}}>
            <Navbar.Brand>
              <Text b size={25}>
                GIMS
              </Text>
            </Navbar.Brand>
            <Navbar.Content>
              <Navbar.Link href="/login">
                <Text size={25}>
                  Login
                </Text>
              </Navbar.Link>
              <Navbar.Link href="/signup">
                <Text size={25}>
                  Sign Up
                </Text>
              </Navbar.Link>
            </Navbar.Content>
          </Navbar>
        <Container css={{backgroundColor:""}}>
          

          <Grid.Container justify="center" css={{height: "500px"}}>
            <Grid xs={12} sm={10} alignItems="center" css={{display:"flex"}}>
              <Col css={{width: "100%"}}>
                <Text weight={"bold"} size={75} css={{"textAlign": "center"}}>General Inventory</Text>
                <Text weight={"bold"} size={75} css={{ "textAlign": "center"}}> Management System</Text>
              </Col>
            </Grid>
          </Grid.Container>

          <Grid.Container gap={4}>
            <Grid xs={12} sm={4} css={{height:"450px"}}>
              <Infocard 
              title={"Track inventory"} 
              imageURL="./track.jpg"
              />
            </Grid>

            <Grid xs={12} sm={4} css={{height:"450px"}}>
              <Infocard 
              title={"Generate reports"} 
              imageURL="./report.jpg"
              />
            </Grid>

            <Grid xs={12} sm={4} css={{height:"450px"}}>
              <Infocard 
              title={"Upload images"} 
              imageURL="./image.png"
              />
            </Grid>

          </Grid.Container>

        </Container>
      </div>
    </div>
  </>
  )
}