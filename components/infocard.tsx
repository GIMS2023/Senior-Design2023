import type { NextPage } from "next";
import { Card, Text, Row, Col, Button } from "@nextui-org/react";

interface Props{
    title: string;
    imageURL: string;
}

const Infocard: NextPage<Props> = (props) => {
    const {title, imageURL} = props;
    return(

        <Card css={{backgroundColor:"YellowGreen", borderRadius:"55px"}}>
            <Card.Header css={{position:"absolute", top:0, zIndex:1,
                bgBlur: "#ffffff66"}}>
                <Col>
                    <Text color="#000" size={35} weight= "bold" css={{textAlign:"center"}}>
                        {title}
                    </Text>
                </Col>
            </Card.Header>
            <Card.Image src={imageURL} objectFit="cover" width="100%" height="100%" css={{marginTop:"$15"}}/>
        </Card>
    )

}

export default Infocard;
