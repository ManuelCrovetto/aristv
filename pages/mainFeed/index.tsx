import { Text, Pagination, Container, Spacer } from "@nextui-org/react";
import { NextPage } from "next";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import ArticleCard from "../../components/ArticleCard";
import { getPagination } from "../../utils/Utils";
import { faL } from "@fortawesome/free-solid-svg-icons";

interface Article {
    id: number,
    user_id: string,
    title: string,
    content: string,
    user_email: string
    inserted_at: string
}

const MainFeed: NextPage = () => {
    const supabaseClient = useSupabaseClient();
    const [articles, setArticles] = useState<string[]>([]);
    const maxResultsPerPage = 10
    const [numberOfPages, setNumberOfPages] = useState(0)

    useEffect(() => {
        getArticlesSize()
        loadFirstArticlesPage()
    }, [])

    const getArticlesSize = async () => {
        try {
            const { data, count } = await supabaseClient
                .from("articles")
                .select('*', { count: 'exact' })
            
            if (count != null) {
                const numberOfPagesRoundedUp = Math.ceil(count / maxResultsPerPage)
                setNumberOfPages(numberOfPagesRoundedUp)
            }
        } catch (error: any) {
            alert(error.message)
        }
    }

    const loadFirstArticlesPage = async () => {
        try {
            const {data, error} = await supabaseClient
                .from("articles")
                .select("*", { count: "exact" })
                .order("likes_count", { ascending: false })
                .range(0, 9)

            if (data != null) {
                setArticles(data)
            }
        } catch(error: any) {
            alert(error.message)
        }
    }

    const handlePagination = async (page: number) => {
        const { from, to } = getPagination(page, maxResultsPerPage);
        console.log(`from: ${from}, to: ${to}, page: ${page}`)
        const { data, count } = await supabaseClient
            .from("articles")
            .select("*", { count: "exact" })
            .order("likes_count", { ascending: false })
            .range(from, to);

        if (data != null) {
            setArticles(data)
        }
        
    }

    return (
        <>
            <Text h2>Main Feed</Text>
            <Text size="$lg" css={{my: "$8"}}>Check out the latests topics</Text>
            
            {
            articles.map((article) => {
                return(
                    <>
                        <ArticleCard article={article} />
                    </>
                )
            })
            }
            <Spacer y={4} />
            <Container justify="center" css={{ display: 'flex', margin: '0 auto'}}>
                <Pagination noMargin shadow total={numberOfPages} initialPage={1} onChange={handlePagination} />
            </Container>
        </>
    )
}

export default MainFeed;