import type { AppProps } from 'next/app'
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { useState } from "react";
import { NextUIProvider } from "@nextui-org/react";
import { Box } from "../components/Box";
import Navbar from '../components/NavBarComponent';
import Footer from '../components/Footer';

function MyApp({ Component, pageProps }: AppProps) {
  const [supabaseClient] = useState(() => createPagesBrowserClient());

  return  (
    <SessionContextProvider
      supabaseClient={supabaseClient}
    >
      <NextUIProvider>
        <Navbar />
        <Box css={{ px: "$12", py: "$15", mt: "$12", "@xsMax": {px: "$10"}, maxWidth: "800px", margin: "0 auto" }}>
          <Component {...pageProps} />
        </Box>
        <Footer />
      </NextUIProvider>
    </SessionContextProvider>
  )
}

export default MyApp