import { NextPage } from "next";
import { Button, Card, Grid, Spacer, Text } from "@nextui-org/react";
import { useRouter } from "next/router";
import { getDateString } from "../utils/Utils";
interface Props {
    article: any
}
const ModeratorCard: NextPage<Props> = (props) => {
    const { article } = props;
    const router = useRouter();

    function getDate() {
        return getDateString(article.inserted_at)
    }

    return (
        <Card
            isPressable
            css={{
                mb: "$10"
            }}
            onPress={() => router.push("/moderatorArticle?id=" + article.id)}
        >
            <Card.Body css={{padding: 24}}>
                <Grid.Container justify="space-between">
                    <Grid>
                        <Text h3  >{article.title}</Text>
                        <Text b>posted on {getDate()}</Text>
                        <Text b> by {article.user_id.substring(0,5)}</Text>
                        <Spacer y={.5}/>
                    </Grid>
                </Grid.Container>



            </Card.Body>
        </Card>
    )
}

export default ModeratorCard;