import {Navbar, Button, Text, Link, Badge} from "@nextui-org/react";
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
    const [modNumber, setModNumber] = useState<string | undefined>()

    function signOutUser() {
        supabaseClient.auth.signOut();
        router.push(routes.home)
    }

    useEffect(() => {
        async function isUserAdmin() {
            const {data: {user}} = await supabaseClient.auth.getUser()
            try {
                const {data, error} = await supabaseClient
                    .from(dbConstants.users)
                    .select(dbConstants.all)
                    .filter(dbConstants.user_id, "eq", user?.id)
                    .single()
                if (error) {
                    setIsAdmin(false)
                } else {
                    const anyData = data as any;

                    const admin = anyData.isadmin
                    setIsAdmin(admin)
                }
                const { count } = await supabaseClient
                    .from(dbConstants.articles)
                    .select(dbConstants.all, {count: "exact"})
                    .eq(dbConstants.moderated, "false")

                if (count) {
                    if (count >= 1) {
                        if (count >= 10) {
                            setModNumber("+9")
                        } else {
                            setModNumber(count.toString())
                        }
                    }
                } else {
                    setModNumber(undefined)
                }

            } catch (e: any) {
                alert(e.message)
            }
        }
        if (typeof supaUser !== "undefined") {
            isUserAdmin()
        }
    }, [supaUser, supabaseClient])


    

    return (
        <Layout>
            <Navbar isBordered variant="floating">
                <Navbar.Toggle showIn="sm" />
                <Navbar.Brand
                as={Link}
                href={routes.home}
                >
                
                <Text b css={{textGradient: "45deg, #7954F6 -20%, #DA545E 100%"}}>
                    ArisTV 🍌
                </Text>
                </Navbar.Brand>
                <Navbar.Content
                hideIn="sm"
                variant="highlight-rounded"
                >
                <Navbar.Link href={routes.mainFeed} isActive={router.pathname === routes.mainFeed}>Main Feed</Navbar.Link>
                <Navbar.Link href={routes.createArticle} isActive={router.pathname === routes.createArticle}>
                    Create Proposal
                </Navbar.Link>
                    { isAdmin &&
                        <>
                            { modNumber ?
                                <Badge color={"error"} content={modNumber} enableShadow disableOutline>
                                    <Navbar.Link color={"error"}  href={routes.moderator} isActive={router.pathname === routes.moderator}>
                                        Moderator
                                    </Navbar.Link>
                                </Badge>
                                :
                                <Navbar.Link color={"error"}  href={routes.moderator} isActive={router.pathname === routes.moderator}>
                                    Moderator
                                </Navbar.Link>
                            }
                        </>
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