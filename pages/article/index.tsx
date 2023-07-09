import {Button, Loading, Spacer, Text, User} from "@nextui-org/react";
import {useSupabaseClient, useUser} from "@supabase/auth-helpers-react";
import {NextPage} from "next";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {HeartIcon} from "../../components/icons/icons";
import confetti from 'canvas-confetti';


const Article: NextPage = () => {
    const supabaseClient = useSupabaseClient();
    const router = useRouter();
    const supaUser = useUser();
    const [isLoading, setIsLoading] = useState(false)
    const {id} = router.query;
    const [article, setArticle] = useState<any>({});
    const [heartColor, setHeartColor] = useState<string>();
    const [isArticleLikedByCurrentUser, setArticleLikedByCurrentUser] = useState<boolean>();


    useEffect(() => {
        async function getArticleWithUseEffect() {
            setIsLoading(true)
            const {data: {user}} = await supabaseClient.auth.getUser()

            try {
                const {data, error} = await supabaseClient
                    .from("articles")
                    .select("*")
                    .filter("id", "eq", id)
                    .single()
                if (error) {
                    console.log(error)
                } else {
                    const arrayOfUsersLikes: string[] = data.likes ?? [];
                    let isLikedByCurrentUser = false;
                    const userId = user?.id;
                    arrayOfUsersLikes.filter((user_id: string) => {
                            if (userId == user_id) {
                                isLikedByCurrentUser = true
                            }
                        }
                    );
                    if (isLikedByCurrentUser) {
                        setHeartColor("#E33122");
                    }
                    setArticleLikedByCurrentUser(isLikedByCurrentUser);
                    setArticle(data);

                }
                setIsLoading(false)
            } catch (error: any) {
                alert(error.message)
                setIsLoading(false)
            }
        }

        if (typeof id !== "undefined") {
            getArticleWithUseEffect().then(() => {});
        }
    }, [id, supabaseClient])

    const getArticle = async () => {
        const {data, error} = await supabaseClient
            .from("articles")
            .select("*")
            .filter("id", "eq", id)
            .single()

        if (error) {
            console.log(error)
        } else {
            const arrayOfUsersLikes = data.likes
            let isLikedByCurrentUser = false

            arrayOfUsersLikes?.filter((user_id: string) => {
                    if (supaUser?.id === user_id) {
                        isLikedByCurrentUser = true
                    }
                }
            )
            if (isLikedByCurrentUser) {
                setHeartColor("#E33122");
            }
            setArticleLikedByCurrentUser(isLikedByCurrentUser);
            setArticle(data)
        }
    }


    const deleteArticle = async () => {
        try {
            const {error} = await supabaseClient
                .from("articles")
                .delete()
                .eq("id", id)
            if (error) {
                alert(error.message)
                await router.push("/mainFeed")
            }
            await router.push("/mainFeed")
        } catch (error: any) {
            alert(error.message)
        }
    }

    const handleLike = async () => {
        if (!isArticleLikedByCurrentUser) {
            let arrayOfUsersLikes: string[] = article.likes ?? []
            arrayOfUsersLikes.push(supaUser?.id ?? "")
            const likesQty = arrayOfUsersLikes.length
            try {
                const {error} = await supabaseClient
                    .from("articles")
                    .update([
                        {
                            likes: arrayOfUsersLikes,
                            likes_count: likesQty
                        }
                    ])
                    .eq("id", id)
                if (error) {
                    alert(error.message)
                }
                await getArticle();
                setHeartColor("#E33122");
                handleConfetti();
            } catch (error: any) {
                alert(error.message)
            }
        }
        if (isArticleLikedByCurrentUser) {
            let arrayOfUsersLikes: string[] = article.likes ?? [];
            const index = arrayOfUsersLikes.indexOf(supaUser?.id ?? "");
            arrayOfUsersLikes.splice(index, 1);
            let likesQty = arrayOfUsersLikes.length;
            try {
                const {error} = await supabaseClient
                    .from("articles")
                    .update([
                        {
                            likes: arrayOfUsersLikes,
                            likes_count: likesQty
                        }
                    ])
                    .eq("id", id)
                if (error) {
                    alert(error.message)
                }
                await getArticle();
                setHeartColor("#D8DBDF");

            } catch (error: any) {
                alert(error.message)
            }
        }
    }

    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = {startVelocity: 30, spread: 360, ticks: 60, zIndex: 0};

    function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
    }

    const handleConfetti = () => {
        let interval: NodeJS.Timer = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            // since particles fall down, start a bit higher than random
            confetti(
                Object.assign({}, defaults, {
                    particleCount,
                    origin: {x: randomInRange(0.1, 0.3), y: Math.random() - 0.2}
                })
            );
            confetti(
                Object.assign({}, defaults, {
                    particleCount,
                    origin: {x: randomInRange(0.7, 0.9), y: Math.random() - 0.2}
                })
            );
        }, 250);
    };

    return (
        <>
            {isLoading ?
                <>

                    <Loading type="points" color="primary" css={{display: "flex", margin: "0 auto"}}/>
                </>
                :

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
                    {supaUser ?
                        <>
                            <Spacer y={.5}/>
                            <Button
                                size={"sm"}
                                auto
                                shadow
                                color="primary"
                                iconRight={HeartIcon(heartColor ?? "#D8DBDF")} onPress={handleLike}>
                                {article.likes_count}
                            </Button>
                        </>
                        : null
                    }
                    {supaUser && article.user_id === supaUser.id ?
                        <>
                            <Spacer y={1}/>
                            <Button size={"sm"} onPress={() => router.push("/editArticle?id=" + id)}>Edit</Button>
                            <Spacer y={.5}/>
                            <Button
                                flat
                                size={"sm"}
                                color={"error"}
                                onPress={() => deleteArticle()}>
                                Delete
                            </Button>
                        </>
                        : null}
                </>
            }
        </>
    )
}

export default Article;