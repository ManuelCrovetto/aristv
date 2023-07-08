import { Navbar, Button, Text, Link } from "@nextui-org/react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";

import { useRouter } from "next/router";
import React from "react";
import { Layout } from "./Layout";


const NavBarComponent = () => {
    const [variant, setVariant] = React.useState("default");
    const [activeColor, setActiveColor] = React.useState("primary")
    const supabaseClient = useSupabaseClient()
    const user = useUser()
    const router = useRouter()

    function signOutUser() {
        supabaseClient.auth.signOut();
        router.push("/")
    }

    const collapseItems = [
       "Main Feed",
       "Create Article"
      ];
    

    return (
        <Layout>
            <Navbar isBordered variant="floating">
                <Navbar.Toggle showIn="xs" />
                <Navbar.Brand
                as={Link}
                href={"/"}
                >
                
                <Text b css={{textGradient: "45deg, #7954F6 -20%, #DA545E 100%"}}>
                    ArisTV 🍌
                </Text>
                </Navbar.Brand>
                <Navbar.Content
                hideIn="xs"
                variant="highlight-rounded"
                >
                <Navbar.Link href="/mainFeed" isActive={router.pathname === "/mainFeed"}>Main Feed</Navbar.Link>
                <Navbar.Link href="/createArticle" isActive={router.pathname === "/createArticle"}>
                    Create Proposal
                </Navbar.Link>
                </Navbar.Content>
                <Navbar.Content>
                {!user ?  /*User doesnt exist*/
                    <>
                        <Navbar.Link href="/login">
                            <Button auto flat>
                                Login
                            </Button>
                        </Navbar.Link>
                    </>
                :         /* User does exist */
                    <>
                        <Navbar.Item hideIn={"xs"}>
                            <Text>Hey, {user?.email}</Text>
                        </Navbar.Item>
                        <Navbar.Item>
                            <Button auto flat onPress={() => signOutUser()}>
                                Sign Out
                            </Button>
                        </Navbar.Item>
                    </>
                }  
            </Navbar.Content>
                <Navbar.Collapse>
                    <Navbar.CollapseItem
                        key={"/mainFeed"}
                        activeColor="primary"
                        isActive={router.pathname === "/mainFeed"}
                    >
                        <Link
                            color="inherit"
                            href={"/mainFeed"}
                            css={{minWidth: "100%",}}
                        >
                            {"Main Feed"}
                        </Link>
                    </Navbar.CollapseItem>
                    <Navbar.CollapseItem
                        key={"/createArticle"}
                        activeColor="primary"
                        isActive={router.pathname === "/createArticle"}
                    >
                        <Link
                            color="inherit"
                            href={"/createArticle"}
                            css={{minWidth: "100%",}}
                        >
                            {"Create Proposal"}
                        </Link>
                    </Navbar.CollapseItem>
                
                </Navbar.Collapse>
            </Navbar>
         </Layout>
    )
}

export default NavBarComponent;