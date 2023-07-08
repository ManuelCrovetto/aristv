import { Button, Card, Container, Grid, Image, Row, Spacer, Text } from "@nextui-org/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { getDateString } from "../utils/Utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faDisplay, faHeart } from "@fortawesome/free-solid-svg-icons";

import css from "styled-jsx/css";
import { HeartIcon } from "./icons/icons";


interface Props {
    article: any
}

const ArticleCard: NextPage<Props> = (props) => {
    const { article } = props;
    const likes = article.likes?.length ?? 0
    const router = useRouter();

    function getDate() {
        return getDateString(article.inserted_at)
    }

    const textStyles = {
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: 2, // Specify the number of lines to display
        overflow: 'hidden'
      }
    
      const handleHeartColor = () => {
        if (likes == 0) {
            return "#D8DBDF"
        } else {
            return "#E33122"
        }
      }
    

    return (
        <Card
            isPressable
            css={{
                mb: "$10"
            }}
            onPress={() => router.push("/article?id=" + article.id)}
        >
            <Card.Body css={{padding: 24}}>
                <Grid.Container justify="space-between">
                    <Grid>
                        <Text h3  >{article.title}</Text>
                        <Text b>posted on {getDate()}</Text>
                        <Text b> By {article.user_email.toLowerCase()}</Text>
                        <Spacer y={.5}/>
                    </Grid>
                    <Grid css={{mt: '0 auto', display: 'flex'}} alignItems="center">
                        <Button disabled={true} auto flat bordered iconRight={HeartIcon(handleHeartColor())}>
                           {article.likes_count}
                        </Button>
                    </Grid>
                </Grid.Container>
                

                
            </Card.Body>
        </Card>
    )
}

export default ArticleCard;