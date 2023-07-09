import { Text, Spacer, Button, Grid } from "@nextui-org/react"
import Image from "next/image"
import { useRouter } from "next/router"

export default function Home() {
  const router = useRouter()
  return (
    <>
    <Text h2>Best video proposals for Mr. Aris</Text>
    <Spacer y={1}/>
    <Text size="$1g">
      Cmon, sometimes we all want Aris to speak about a certain subject in the Android Development world.
      Or we just want to troll him.
      Any proposal is in your mind for him, publish it here and if it gets likes MAYBE he will do something about it, who knows!
    </Text>
      <Spacer y={.5}/>
    <Text b>Keep in mind your proposal will be anonymous 😉🥷🏻</Text>
    <Spacer y={10}/>
    <Grid.Container justify="center" gap={2}>
      <Grid>
      <Button onPress={() => router.push("/mainFeed")}>
        Latest proposals 🔍
      </Button>
      </Grid>
      
      <Grid>
      <Button onPress={() => router.push("/createArticle")}>
        Speak up! 📣
      </Button>
      </Grid>
    </Grid.Container>
    
  </>
  )
}
