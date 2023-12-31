import type { GetServerSidePropsContext, NextPage } from "next";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import {Text, Textarea, Grid, Button, Loading, Modal, useInput, Spacer} from "@nextui-org/react";
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import { useState } from "react";
import confetti from 'canvas-confetti';
import sleep from "../../utils/sleep";
import {colors} from "../../colors/colorConstants";

const Login: NextPage = () => {
  
    const supabaseClient = useSupabaseClient()
    const user = useUser()
    const router = useRouter()

    const [isLoading, setLoading] = useState(false)

    const [isSuccessModalVisible, setSuccessModalVisible] = useState(false)

    const minimalTitleLetters = 10
    const maximalTitleLetters = 50
    const minimalBodyLetter = 10
    const maximalBodyLetters = 1000

    const successModalVisibilityHandler = async () => {
      confetti({});
      await sleep(1000)
      setSuccessModalVisible(true)
    }

    const closeSuccessModalHandler = () => {
      setSuccessModalVisible(false)
    }

    const closeAndNavigateToMainFeed = () => {
      setSuccessModalVisible(false)
      router.push("/mainFeed");
    }

    const { value: titleValue, reset: resetTitle, bindings: titleBindings } = useInput("");
    const { value: bodyValue, reset: resetBody, bindings: bodyBindings } = useInput("");

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
          .insert([
            {
              title: titleValue,
              content: bodyValue,
              user_email: user?.email?.toLowerCase(),
              user_id: user?.id
            }
          ])
          .single()
          if (error) {
              alert(error.message)
          }
          resetTitle();
          resetBody();
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

    // @ts-ignore
    return (
      <>
        <Grid.Container gap={1}>
            <Text h3>Title</Text>
            <Grid xs={12} direction="column">
                <Textarea 
                    name="title" 
                    aria-label="title" 
                    placeholder="Proposal title"
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
                    placeholder="Proposal body"
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
                <Text color="#7C7C7C">Posting as <Text b  color="#7c7c7c" css={{marginRight:6}}>{user?.id?.substring(0,5)}</Text>🥷🏻🔒</Text>
            </Grid>
            <Button isDisabled={isLoading} shadow css={{margin: '0 auto', display: "flex", marginTop: 16}} onPress={onSubmit}>
              {isLoading ?
                <>
                <Loading type="points" color="currentColor" size="sm"/>
                </>
              :
                <>
                Create proposal ✅
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
              Proposal under <Text b color={colors.primary}>review</Text>.
            </Text>
          </Modal.Header>
            <Modal.Body>
                <Text>
                    Your proposal is under review and will be published shortly! ⏱️
                </Text>
            </Modal.Body>
          <Modal.Footer justify="center">
            <Button auto flat color={"success"} onPress={closeAndNavigateToMainFeed}>
              Go to Main Feed
            </Button>
            <Button auto flat color={"primary"} onPress={closeSuccessModalHandler}>
              Write a new article 📝
            </Button>
            
          </Modal.Footer>
        </Modal>
      </>
        
    )

}

export default Login;

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