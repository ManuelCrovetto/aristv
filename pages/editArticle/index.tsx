import type { GetServerSidePropsContext, NextPage } from "next";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";

import { useRouter } from "next/router";
import { Text, Textarea, Grid, Button, Loading, Modal, useInput, Row, Container } from "@nextui-org/react";
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import { useState } from "react";
import confetti from 'canvas-confetti';
import sleep from "../utils/sleep";
import { Box } from "../../components/Box";
import { count } from "console";
import { useEffect } from "react";

const EditArticle: NextPage = () => {
  
    const supabaseClient = useSupabaseClient()
    const user = useUser()
    const router = useRouter()

    const [isLoading, setLoading] = useState(false)

    const {id} = router.query

    const minimalTitleLetters = 10
    const maximalTitleLetters = 50
    const minimalBodyLetter = 10
    const maximalBodyLetters = 1000

    const { value: titleValue, setValue: setTitleValue, reset: resetTitle, bindings: titleBindings } = useInput("");
    const { value: bodyValue, setValue: setBodyValue, reset: resetBody, bindings: bodyBindings } = useInput("");

    useEffect(() => {
        async function getArticle() {
            const { data, error } = await supabaseClient
                .from("articles")
                .select("*")
                .filter("id", "eq", id)
                .single()

                if (error) {
                    console.log(error)
                } else {
                    setTitleValue(data.title)
                    setBodyValue(data.content)
                }

        }
        if (typeof id !== "undefined") {
            getArticle()
        }
    }, [id])

    const onSubmit = async (event: any) => {
      setLoading(true)
      if (titleValue.length < minimalTitleLetters || titleValue.length > maximalTitleLetters) {
        setLoading(false)
        return
      }
      if (bodyValue.length < minimalBodyLetter || bodyValue.length > maximalBodyLetters) {
        setLoading(false)
        return
      }
      try {
        const {data, error} = await supabaseClient
          .from("articles")
          .update([
            {
              title: titleValue,
              content: bodyValue
            }
          ])
          .eq("id", id)
          if (error) throw error;
          setLoading(false)
          router.push("/article?id=" + id)
      } catch(error: any) {
          alert(error.message)
          setLoading(false)
      }
    }

   function titleCounterColor() : string {
      if (titleValue.length < minimalTitleLetters || titleValue.length > maximalTitleLetters) {
        return "#E33122"
      } else {
        return "#387F47"
      }
    }

    function bodyCounterColor(): string {
      if (titleValue.length < minimalBodyLetter || titleValue.length > maximalBodyLetters) {
        return "#E33122"
      } else {
        return "#387F47"
      }
    }

    function shouldMarkBoldTitleCounter() : boolean {
      if (titleValue.length < minimalBodyLetter || titleValue.length > maximalBodyLetters) {
        return true
      } else {
        return false
      }
    }

    function shouldMarkBoldBodyCounter() : boolean {
      if (bodyValue.length < minimalBodyLetter || bodyValue.length > maximalBodyLetters) {
        return true
      } else {
        return false
      }
    }

    return (
      <>
        <Grid.Container gap={1}>
            <Text h3>Title</Text>
            <Grid xs={12} direction="column">
                <Textarea 
                    name="title" 
                    aria-label="title" 
                    placeholder="Article title"
                    fullWidth={true}
                    rows={1}
                    size="xl"
                    {...titleBindings}
                    />
                 <Text 
                  weight={shouldMarkBoldTitleCounter() ? "bold" : "normal"}
                  color={titleCounterColor()} 
                  size={"$md"} 
                  css={
                    {
                      display: "flex",
                      justifyContent: "end", 
                      marginRight: "$10"
                    }
                  }>
                    {titleValue.length}/{maximalTitleLetters}
                    </Text>
            </Grid>
            <Text h3>Body</Text>
            <Grid xs={12} direction="column">
                <Textarea 
                    name="body" 
                    aria-label="body" 
                    placeholder="Article body"
                    fullWidth={true}
                    rows={10}
                    size="xl"
                    {...bodyBindings}
                    />
                <Text 
                  weight={shouldMarkBoldBodyCounter() ? "bold" : "normal"}
                  color={bodyCounterColor()} 
                  size={"$md"} 
                  css={
                    {
                      display: "flex", 
                      justifyContent: "end",
                       marginRight: "$10"
                    }
                  }>
                    {bodyValue.length}/{maximalBodyLetters}
                </Text>
            </Grid>
            <Grid xs={12} justify='flex-end' css={{marginRight: 16}}>
                <Text color="#7C7C7C">Posting as {user?.email}</Text>
            </Grid>
            <Button isDisabled={isLoading} shadow css={{margin: '0 auto', display: "flex", marginTop: 16}} onPress={onSubmit}>
              {isLoading ?
                <>
                <Loading type="points" color="currentColor" size="sm"/>
                </>
              :
                <>
                Update article ⬆️
                </>
              }
              </Button>
        </Grid.Container>
      </>
        
    )

}

export default EditArticle;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const supabase = createPagesServerClient(ctx)
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session)
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      }
    }

    return {
        props: {
          initialSession: session,
          user: session.user,
        },
      }
}