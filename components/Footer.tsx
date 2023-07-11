import {Avatar, Button, Grid, Link, Row, Spacer, Text, User} from "@nextui-org/react";
import { NextPage } from "next";
import React from "react";
import useWindowDimensions from "../utils/Utils";
import {GithubIcon} from "./icons/GithubIcon";



const Footer: NextPage = () => {
    const {width, height} = useWindowDimensions()
    const getWidth = () => {
        if (typeof width === "undefined") {
            return 0
        } else {
            return width
        }
    }

    const isXs =() => {
        return getWidth() < 650
    }
    const isSm = () => {
        return getWidth() >= 650 && getWidth() < 960
    }
    const isMd = () => {
        return getWidth() >= 960
    }
    if (isXs()) {
        return (
            <Grid.Container alignItems={"center"} alignContent={"center"} direction={"column"} justify={"space-between"} css={{background: "#D9DBDF", padding: 16, borderTopLeftRadius: 8, borderTopRightRadius: 8, margin: "auto", position: "absolute", textAlignment: "center"}}>
                <Grid>
                    <Text b >Made with ❤️ by MacroSystems LLC for AristiDevs</Text>
                </Grid>
            </Grid.Container>
        )
    } else if (isSm()) {
        return (
            <Grid.Container alignItems={"center"} alignContent={"center"} direction={"column"} justify={"space-between"} css={{background: "#D9DBDF", padding: 16, borderTopLeftRadius: 8, borderTopRightRadius: 8, margin: "auto", position: "absolute", textAlignment: "center"}}>
                <Grid>
                    <Text b css={{textGradient: "45deg, #7954F6 -20%, #DA545E 100%"}}>
                        ArisTV 🍌
                    </Text>
                </Grid>
                <Spacer />
                <Grid>
                    <Text b >Made with ❤️ by MacroSystems LLC for AristiDevs</Text>
                </Grid>
                <Spacer />
                <Grid justify={"center"}>
                    <Link
                        target={"_blank"}
                        href={"https://github.com/ManuelCrovetto/aristv"}
                        css={{minWidth: "100%", minHeight: "100%", margin: "auto 0", display: "flex"}}
                    >
                        <GithubIcon />
                    </Link>
                </Grid >
            </Grid.Container>
        )
    }
    if (isMd()) {
        return (
            <Grid.Container alignItems={"center"} alignContent={"center"} direction={"row"} justify={"space-between"} css={{background: "#D9DBDF", padding: 16, borderTopLeftRadius: 8, borderTopRightRadius: 8, margin: "auto", position: "absolute", textAlignment: "center"}}>
                <Spacer />
                <Grid>
                    <Text b css={{textGradient: "45deg, #7954F6 -20%, #DA545E 100%"}}>
                        ArisTV 🍌
                    </Text>
                </Grid>
                <Spacer />
                <Grid>
                    <Text b >Made with ❤️ by MacroSystems LLC for AristiDevs</Text>
                </Grid>
                <Spacer />
                <Grid direction={"row"}>
                    <Link
                        target={"_blank"}
                        href={"https://github.com/ManuelCrovetto/aristv"}
                        css={{minWidth: "100%", minHeight: "100%", margin: "auto 0", display: "flex"}}
                    >
                        <GithubIcon />
                    </Link>


                </Grid >
                <Spacer />
            </Grid.Container>
        )
    }
}

export default Footer;