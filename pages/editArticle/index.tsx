import type { GetServerSidePropsContext, NextPage } from "next";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";

import { useRouter } from "next/router";
import {Text, Textarea, Grid, Button, Loading, useInput, Modal} from "@nextui-org/react";
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import { useState } from "react";
import { useEffect } from "react";
import sleep from "../../utils/sleep";
import {colors} from "../../colors/colorConstants";

const EditArticle: NextPage = () => {
  
    const supabaseClient = useSupabaseClient()
    const user = useUser()
    const router = useRouter()
    const [isSuccessModalVisible, setSuccessModalVisible] = useState(false)

    const [isLoading, setLoading] = useState(false)

    const {id} = router.query

    const minimalTitleLetters = 10
    const maximalTitleLetters = 50
    const minimalBodyLetter = 10
    const maximalBodyLetters = 1000

    const { value: titleValue, setValue: setTitleValue, bindings: titleBindings } = useInput("");
    const { value: bodyValue, setValue: setBodyValue, bindings: bodyBindings } = useInput("");

    const successModalVisibilityHandler = async () => {
        setSuccessModalVisible(true)
    }

    const closeSuccessModalHandler = () => {
        setSuccessModalVisible(false)
    }

    const closeAndNavigateToMainFeed = () => {
        setSuccessModalVisible(false)
        router.push("/mainFeed");
    }

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

    const onSubmit = async () => {
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
        const {error} = await supabaseClient
          .from("articles")
          .update([
            {
                title: titleValue,
                content: bodyValue,
                moderated: false,
                approved: false
            }
          ])
          .eq("id", id)
          if (error) {
              alert(error.message)
          }
          setLoading(false)
          await successModalVisibilityHandler()
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
      return titleValue.length < minimalBodyLetter || titleValue.length > maximalBodyLetters;
    }

    function shouldMarkBoldBodyCounter() : boolean {
      return bodyValue.length < minimalBodyLetter || bodyValue.length > maximalBodyLetters;
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
                <Text color="#7C7C7C">Editing as <Text b  color="#7c7c7c" css={{marginRight:6}}>{user?.id?.substring(0,5)}</Text>🥷🏻🔒</Text>
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
          <Modal
              closeButton
              blur
              aria-labelledby="success-saved-article-modal"
              open={isSuccessModalVisible}
              onClose={closeSuccessModalHandler}
          >
              <Modal.Header>
                  <Text id="success-modal-title" size={18}>
                      Proposal edit under <Text b color={colors.primary}>review</Text>.
                  </Text>
              </Modal.Header>
              <Modal.Body>
                  <Text>
                      Your proposal edit is under review and will be published shortly! ⏱️
                  </Text>
              </Modal.Body>
              <Modal.Footer justify="center">
                  <Button auto flat color={"success"} onPress={closeAndNavigateToMainFeed}>
                      Go to Main Feed
                  </Button>
                  <Button auto flat color={"primary"} onPress={closeSuccessModalHandler}>
                      Keep editing 📝
                  </Button>

              </Modal.Footer>
          </Modal>
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