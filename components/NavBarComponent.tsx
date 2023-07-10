import { Navbar, Button, Text, Link } from "@nextui-org/react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import React, {useEffect, useState} from "react";
import { Layout } from "./Layout";
import {routes} from "../navigation/routes";
import {dbConstants} from "../db/dbConstants";

const NavBarComponent = () => {
    const supabaseClient = useSupabaseClient()
    const supaUser = useUser()
    const router = useRouter()
    const [isAdmin, setIsAdmin] = useState(false)

    function signOutUser() {
        supabaseClient.auth.signOut();
        router.push(routes.home)
    }

    useEffect(() => {
        async function isUserAdmin(): boolean {
            const {data: {user}} = await supabaseClient.auth.getUser()
            try {
                const {data, error} = await supabaseClient
                    .from(dbConstants.users)
                    .select("*")
                    .filter("user_id", "eq", user?.id)
                    .single()
                if (error) {
                    console.log(`Error while fetching isAdmin property. Error: ${error.message}`);
                    setIsAdmin(false)
                } else {
                    setIsAdmin(data.isadmin)
                }

            } catch (e: any) {
                alert(e.message)
                return false
            }
        }
        if (typeof supaUser !== "undefined") {
            isUserAdmin()
        }
    }, [supaUser, supabaseClient])


    

    return (
        <Layout>
            <Navbar isBordered variant="floating">
                <Navbar.Toggle showIn="xs" />
                <Navbar.Brand
                as={Link}
                href={routes.home}
                >
                
                <Text b css={{textGradient: "45deg, #7954F6 -20%, #DA545E 100%"}}>
                    ArisTV 🍌
                </Text>
                </Navbar.Brand>
                <Navbar.Content
                hideIn="xs"
                variant="highlight-rounded"
                >
                <Navbar.Link href={routes.mainFeed} isActive={router.pathname === routes.mainFeed}>Main Feed</Navbar.Link>
                <Navbar.Link href={routes.createArticle} isActive={router.pathname === routes.createArticle}>
                    Create Proposal
                </Navbar.Link>
                    { isAdmin ?
                        <>
                            <Navbar.Link color={"error"}  href={routes.moderator} isActive={router.pathname === routes.moderator}>Moderator</Navbar.Link>
                        </>
                        :
                        null
                    }
                </Navbar.Content>
                <Navbar.Content>
                {!supaUser ?  /*User doesnt exist*/
                    <>
                        <Navbar.Link href={routes.login}>
                            <Button auto flat>
                                Login
                            </Button>
                        </Navbar.Link>
                    </>
                :         /* User does exist */
                    <>
                        <Navbar.Item hideIn={"xs"}>
                            <Text>Hey, {supaUser?.email}</Text>
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
                        key={routes.mainFeed}
                        activeColor="primary"
                        isActive={router.pathname === routes.mainFeed}
                    >
                        <Link
                            color="inherit"
                            href={routes.mainFeed}
                            css={{minWidth: "100%",}}
                        >
                            {"Main Feed"}
                        </Link>
                    </Navbar.CollapseItem>
                    <Navbar.CollapseItem
                        key={routes.createArticle}
                        activeColor="primary"
                        isActive={router.pathname === routes.createArticle}
                    >
                        <Link
                            color="inherit"
                            href={routes.createArticle}
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