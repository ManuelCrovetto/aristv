import { NextPage } from "next";
import {useSupabaseClient} from "@supabase/auth-helpers-react";
import {useEffect, useState} from "react";
import {getPagination} from "../../utils/Utils";
import {Container, Loading, Pagination, Spacer, Text} from "@nextui-org/react";
import ArticleCard from "../../components/ArticleCard";
import {routes} from "../../navigation/routes";
import {dbConstants} from "../../db/dbConstants";
import ModeratorArticle from "../moderatorArticle";
import ModeratorCard from "../../components/ModeratorCard";
import {useRouter} from "next/navigation";

const Moderator: NextPage = () => {
    const supabaseClient = useSupabaseClient();
    const [articles, setArticles] = useState<string[]>([]);
    const maxResultsPerPage = 10
    const [numberOfPages, setNumberOfPages] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const [isUserAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
        isAdmin().then(r => {})
    }, [])

    const isAdmin = async () => {
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
                router.push(routes.mainFeed)
                return
            } else {
                if (!data.isadmin) {
                    setIsAdmin(false)
                    router.push(routes.mainFeed)
                    return
                } else {
                    setIsAdmin(true)
                    getArticlesSize().then(() => {})
                    loadFirstArticlesPage().then(() => {})
                }
            }

        } catch (e: any) {
            alert(e.message)
            router.push(routes.mainFeed)
        }
    }

    const getArticlesSize = async () => {
        try {
            const {data, error } = await supabaseClient
                .from(dbConstants.articles)
                .select(dbConstants.all)

            if (error) {
                alert(error.message)
            } else {
                if (data != null) {
                    const numberOfPagesRoundedUp = Math.ceil(data.length / maxResultsPerPage)
                    setNumberOfPages(numberOfPagesRoundedUp)
                }
            }
        } catch (error: any) {
            alert(error.message)
        }
    }

    const loadFirstArticlesPage = async () => {
        setIsLoading(true)
        try {
            const {data, error} = await supabaseClient
                .from(dbConstants.articles)
                .select("*")
                .filter("moderated", "eq", false)
                .range(0, 9)
            if (error) {
                alert(error.message)
            }
            if (data != null) {
                setArticles(data)
            }
            setIsLoading(false)
        } catch(error: any) {
            alert(error.message)
            setIsLoading(false)
        }
    }

    const handlePagination = async (page: number) => {
        setIsLoading(true)
        const { from, to } = getPagination(page, maxResultsPerPage);
        console.log(`from: ${from}, to: ${to}, page: ${page}`)
        const { data } = await supabaseClient
            .from("articles")
            .select("*")
            .eq("moderated", "false")
            .range(from, to);

        if (data != null) {
            setArticles(data)
        }
        setIsLoading(false)
    }

    return (
        <>
            { isUserAdmin ?
                <>
                    <Text h2>Unmoderated Proposals</Text>
                    <Text size="$lg" css={{my: "$8"}}>Make sure they don't troll us too much 😂</Text>
                    {
                        articles.map((article) => {
                            return(
                                <>
                                    <ModeratorCard article={article} />
                                </>
                            )
                        })
                    }
                    {
                        isLoading ?
                            <>
                                <Spacer y={2} />
                                <Loading type="points" color="primary" css={{display: "flex", margin: "0 auto"}}/>
                            </>
                            :
                            null
                    }
                    <Spacer y={4} />
                    <Container justify="center" css={{ display: 'flex', margin: '0 auto'}}>
                        <Pagination noMargin shadow total={numberOfPages} initialPage={1} onChange={handlePagination} />
                    </Container>
                </>
                :

                null
            }
        </>

    )
}

export default Moderator;