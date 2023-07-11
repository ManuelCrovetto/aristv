import { NextPage } from "next";
import {useSupabaseClient, useUser} from "@supabase/auth-helpers-react";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {Button, Grid, Loading, Spacer, Text, User} from "@nextui-org/react";
import {dbConstants} from "../../db/dbConstants";
import {routes} from "../../navigation/routes";
const ModeratorArticle: NextPage = () => {
    const supabaseClient = useSupabaseClient();
    const router = useRouter();
    const supaUser = useUser();
    const [isLoading, setIsLoading] = useState(true)
    const {id} = router.query;
    const [article, setArticle] = useState<any>({});
    const [isAdmin, setIsAdmin] = useState(false)


    useEffect(() => {
        setIsLoading(true)
        async function getArticleWithUseEffect() {
            try {
                const {data, error} = await supabaseClient
                    .from("articles")
                    .select("*")
                    .filter("id", "eq", id)
                    .single()
                if (error) {
                    console.log(error)
                    setIsLoading(false)
                } else {
                    setArticle(data);
                }
                setIsLoading(false)
            } catch (error: any) {
                alert(error.message)
                setIsLoading(false)
            }
        }

        async function checkModerator() {
            try {
                const {data, error} = await supabaseClient
                    .from(dbConstants.users)
                    .select("*")
                    .filter(dbConstants.user_id, "eq", supaUser?.id)
                    .single()
                if (error) {
                    console.log(error)
                    setIsLoading(false)
                    setIsAdmin(false)
                    return
                } else {
                    if (!data.isadmin) {
                        setIsAdmin(false)
                        return
                    } else {
                        setIsAdmin(true)
                        if (typeof id !== "undefined") {
                            getArticleWithUseEffect().then(() => {});
                        }
                    }

                }
            } catch (error: any) {
                alert(error.message)
                setIsAdmin(false)
                await router.push(routes.mainFeed)
            }
        }

        if (typeof supaUser !== "undefined") {
            checkModerator().then(() => {});
        }

    }, [id, supaUser])

    const evaluateApproval = async (isApproved: boolean) => {
        if (isAdmin) {
            try {
                const {error: errorSettingApproval} = await supabaseClient
                    .from(dbConstants.articles)
                    .update([
                        {
                            approved: isApproved
                        }
                    ])
                    .eq("id", id)

                const {error: errorSettingModeration} = await supabaseClient
                    .from(dbConstants.articles)
                    .update([
                        {
                            moderated: true
                        }
                    ])
                    .eq("id", id)
                if (errorSettingApproval || errorSettingModeration) {
                    alert("Error during moderation, please contact Macro.")
                } else {
                    await router.push(routes.mainFeed)
                }
            } catch (error: any) {
                alert(error.message)
            }
        }
    }

    if (isLoading) {
        return (
            <Loading type="points" color="primary" css={{display: "flex", margin: "0 auto"}}/>
        )
    } else {
        if (isAdmin) {
            return (
                <>
                    <Text h2>{article.title}</Text>
                    <Spacer y={.5}/>
                    <User
                        src="https://i.ytimg.com/vi/U812TsXhZmQ/maxresdefault.jpg"
                        name={article.user_id?.substring(0,5)}
                        size="md"
                    />
                    <Spacer y={.5}/>
                    <Text size={"$lg"}>{article.content}</Text>
                    <Spacer y={2} />
                    <Grid.Container justify={"space-between"}>
                        <Spacer />
                        <Grid>
                            <Button color={"success"} shadow onPress={() => evaluateApproval(true)}>Approve ✅</Button>
                        </Grid>
                        <Grid>
                            <Button color={"error"} flat shadow onPress={() => evaluateApproval(false)}>Disapprove 🚫🚨</Button>
                        </Grid>
                        <Spacer />
                    </Grid.Container>
                    <Spacer y={.5} />
                </>
            )
        } else  {
            return (
                <Text h2 b>...is it you Afala? 🙄</Text>
            )
        }
    }
}

export default ModeratorArticle;