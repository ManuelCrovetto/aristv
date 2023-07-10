import { Avatar, Grid, Row, Text, User } from "@nextui-org/react";
import { NextPage } from "next";


const Footer: NextPage = () => {

    return (
        <Grid.Container justify="center" css={{background: "#D9DBDF", padding: 16, borderTopLeftRadius: 8, borderTopRightRadius: 8}}>
            <Grid>
                <Text h5>Made with ❤️ by MacroSystems LLC for AristiDevs</Text>
            </Grid>
            
        </Grid.Container>
    )
}

export default Footer;