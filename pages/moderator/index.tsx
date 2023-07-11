import { NextPage } from "next";
import {useSupabaseClient} from "@supabase/auth-helpers-react";
import {useEffect, useState} from "react";
import {getPagination} from "../../utils/Utils";
import {Container, Loading, Pagination, Spacer, Text} from "@nextui-org/react";
import {routes} from "../../navigation/routes";
import {dbConstants} from "../../db/dbConstants";
import ModeratorCard from "../../components/ModeratorCard";
import {useRouter} from "next/navigation";

const Moderator: NextPage = () => {
    const supabaseClient = useSupabaseClient();
    const [articles, setArticles] = useState<string[]>([]);
    const maxResultsPerPage = 10
    const [numberOfPages, setNumberOfPages] = useState(0)
    const [isPageLoading, setIsPageLoading] = useState(true)
    const [areArticlesLoading, setArticlesLoading] = useState(false)
    const router = useRouter()
    const [isUserAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
        setIsPageLoading(true)
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
                setIsPageLoading(false)
                setIsAdmin(false)
                return
            } else {
                if (!data.isadmin) {
                    setIsPageLoading(false)
                    setIsAdmin(false)
                    return
                } else {
                    setIsPageLoading(false)
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
            const { count } = await supabaseClient
                .from(dbConstants.articles)
                .select(dbConstants.all, { count: "exact" })
                .eq("moderated", "false")
            if (count != null) {
                const numberOfPagesRoundedUp = Math.ceil(count / maxResultsPerPage)
                setNumberOfPages(numberOfPagesRoundedUp)
            }
        } catch (error: any) {
            alert(error.message)
        }
    }

    const loadFirstArticlesPage = async () => {
        setArticlesLoading(true)
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
            setArticlesLoading(false)
        } catch(error: any) {
            alert(error.message)
            setArticlesLoading(false)
        }
    }

    const handlePagination = async (page: number) => {
        setArticlesLoading(true)
        const { from, to } = getPagination(page, maxResultsPerPage);
        console.log(`from: ${from}, to: ${to}, page: ${page}`)
        const { data } = await supabaseClient
            .from(dbConstants.articles)
            .select(dbConstants.all)
            .eq("moderated", "false")
            .range(from, to);

        if (data != null) {
            setArticles(data)
        }
        setArticlesLoading(false)
    }
    if (isPageLoading) {
        return (
            <>
                <Spacer y={2} />
                <Loading type="points" color="primary" css={{display: "flex", margin: "0 auto"}}/>
            </>
        )
    } else {
        if (isUserAdmin) {
            return (
                <>
                    <Text h2>Unmoderated Proposals</Text>
                    <Text size="$lg" css={{my: "$8"}}>Make sure they do not troll us too much 😂</Text>
                    {
                        areArticlesLoading ?
                            <>
                                <Spacer y={2} />
                                <Loading type="points" color="primary" css={{display: "flex", margin: "0 auto"}}/>
                            </>
                            :
                            <>
                                {
                                    articles.map((article) => {
                                        return(
                                            <>
                                                <ModeratorCard article={article} />
                                            </>
                                        )
                                    })
                                }
                            </>
                    }
                    <Spacer y={4} />
                    <Container justify="center" css={{ display: 'flex', margin: '0 auto'}}>
                        <Pagination noMargin shadow total={numberOfPages} initialPage={1} onChange={handlePagination} />
                    </Container>
                </>
            )
        } else {
            return (
                <Text h2 b>Quieres puños flutter y java para dejarte en la mierda? Fuera de aquí.</Text>
            )
        }
    }
}

export default Moderator;