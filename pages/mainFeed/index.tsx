import {Text, Pagination, Container, Spacer, Loading} from "@nextui-org/react";
import { NextPage } from "next";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import ArticleCard from "../../components/ArticleCard";
import { getPagination } from "../../utils/Utils";
import {dbConstants} from "../../db/dbConstants";


const MainFeed: NextPage = () => {
    const supabaseClient = useSupabaseClient();
    const [articles, setArticles] = useState<string[]>([]);
    const maxResultsPerPage = 10
    const [numberOfPages, setNumberOfPages] = useState(0)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        getArticlesSize().then(() => {})
        loadFirstArticlesPage().then(() => {})
    }, [])

    const getArticlesSize = async () => {
        try {
            const {count } = await supabaseClient
                .from(dbConstants.articles)
                .select(dbConstants.all, { count: 'exact' })
                .eq(dbConstants.approved, "true")
            
            if (count != null) {
                const numberOfPagesRoundedUp = Math.ceil(count / maxResultsPerPage)
                setNumberOfPages(numberOfPagesRoundedUp)
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
                .select(dbConstants.all, { count: "exact" })
                .order(dbConstants.likesCount, { ascending: false })
                .eq(dbConstants.approved, true)
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
        const { data, count } = await supabaseClient
            .from(dbConstants.articles)
            .select(dbConstants.all, { count: "exact" })
            .order(dbConstants.likesCount, { ascending: false })
            .eq(dbConstants.approved, true)
            .range(from, to);

        if (data != null) {
            setArticles(data)
        }
        setIsLoading(false)
    }

    return (
        <>
            <Text h2>Main Proposals</Text>
            <Text size="$lg" css={{my: "$8"}}>Check out the latest proposals</Text>
            {
            articles.map((article) => {
                return(
                    <>
                        <ArticleCard article={article} />
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
    )
}

export default MainFeed;