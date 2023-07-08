import { Button, Spacer, Text, User } from "@nextui-org/react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { HeartIcon } from "../../components/icons/icons";
import confetti from 'canvas-confetti';
import sleep from "../../utils/sleep";


const Artcile: NextPage = () => {
    const supabaseClient = useSupabaseClient();
    const router = useRouter();
    const user = useUser();
    const { id } = router.query;
    const [article, setArticle] = useState<any>({});
    let [heartColor, setHeartColor] = useState<string>();
    let [isArticleLikedByCurrentUser, setArticleLikedByCurrentUser] = useState<boolean>();


    useEffect(() => {
        async function getArticleWithUseEffect() {
            const { data, error } = await supabaseClient
                .from("articles")
                .select("*")
                .filter("id", "eq", id)
                .single()

                if (error) {
                    console.log(error)
                } else {
                    await sleep(1000)
                    const arrayOfUsersLikes: string[] = data.likes ?? [];
                    let isLikedByCurrentUser = false;
                    console.log("rendering");
                    const userId = user?.id;
                    console.log(`userid: ${userId}`);
                    arrayOfUsersLikes.filter( (user_id: string) => {
                        console.log(`iterating... userId: ${userId}`);
                            if (userId == user_id) {
                                console.log("userId found into iteration");
                                isLikedByCurrentUser = true
                            }
                        }
                    );
                    console.log(data);
                    if(isLikedByCurrentUser) {
                        console.log("liked")
                        setHeartColor("#E33122");
                    }
                    setArticleLikedByCurrentUser(isLikedByCurrentUser);
                    setArticle(data);
                }

        }
        
        if (typeof id !== "undefined") {
            getArticleWithUseEffect();
        }
    }, [id, heartColor])

    const getArticle = async () => {
        const { data, error } = await supabaseClient
                .from("articles")
                .select("*")
                .filter("id", "eq", id)
                .single()

                if (error) {
                    console.log(error)
                } else {
                    const arrayOfUsersLikes = data.likes
                    let isLikedByCurrentUser = false

                    arrayOfUsersLikes?.filter( (user_id: string) => {
                            if (user?.id === user_id) {
                                setHeartColor("#E33122");
                                isLikedByCurrentUser = true
                            }
                        }
                    )
                    setArticleLikedByCurrentUser(isLikedByCurrentUser);
                    console.log(data)
                    setArticle(data)
                }
    }


    const deleteArticle = async () => {
        try {
            const { data, error} = await supabaseClient
            .from("articles")
            .delete()
            .eq("id", id)
            if (error) throw error
            router.push("/mainFeed")
        } catch (error: any) {
            alert(error.message)
        }
    }

    const handleLike = async () => {
        if (!isArticleLikedByCurrentUser) {
            let arrayOfUsersLikes: string[] = article.likes ?? []
            arrayOfUsersLikes.push(user?.id ?? "")
            const likesQty = arrayOfUsersLikes.length
            try {
                const {data, error} = await supabaseClient
                    .from("articles")
                    .update([
                        {
                            likes: arrayOfUsersLikes,
                            likes_count: likesQty
                        }
                    ])
                    .eq("id", id)
                    if(error) throw error

                    getArticle();
                    setHeartColor("#E33122");
                    handleConfetti();
            } catch (error: any) {  
                alert(error.message)
            }
        }
        if(isArticleLikedByCurrentUser) {
            let arrayOfUsersLikes: string[] = article.likes ?? [];
            const index = arrayOfUsersLikes.indexOf(user?.id ?? "");
            arrayOfUsersLikes.splice(index, 1);
            let likesQty = arrayOfUsersLikes.length;
            try {
                const {data, error} = await supabaseClient
                    .from("articles")
                    .update([
                        {
                            likes: arrayOfUsersLikes,
                            likes_count: likesQty
                        }
                    ])
                    .eq("id", id)
                    if(error) throw error
                    getArticle();

                    setHeartColor("#D8DBDF");

            } catch (error: any) {  
                alert(error.message)
            }
        }
    }

    var duration = 5 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
    }

    const handleConfetti = () => {
        let interval: NodeJS.Timer = setInterval(function () {
        var timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        var particleCount = 50 * (timeLeft / duration);
        // since particles fall down, start a bit higher than random
        confetti(
            Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
            })
        );
        confetti(
            Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
            })
        );
        }, 250);
    };
 
    return (
        <>
            <Text h2>{article.title}</Text>
            <Spacer y={.5}/>
            <User 
                src="https://i.ytimg.com/vi/U812TsXhZmQ/maxresdefault.jpg"
                name={article.user_email?.toLowerCase()}
                size="md"
            />
            <Spacer y={.5}/>

            <Text size={"$lg"}>{article.content}</Text>
            { user ?
                <>
                    <Spacer y={.5}/>
                    <Button size={"sm"} auto shadow color="primary" iconRight={HeartIcon(heartColor ?? "#D8DBDF")} onPress={handleLike}>
                        {article.likes_count}
                    </Button>
                </>
            : null
            }
            {user && article.user_id === user.id ?
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

    )
}

export default Artcile;