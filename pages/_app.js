import '../styles/globals.css'
import { UserProvider } from '@auth0/nextjs-auth0/client'
import {DM_Sans, DM_Serif_Display} from '@next/font/google'

//config font from google fonts
const dmSans = DM_Sans({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: "--font-dm-sans"
})

const dmSerif = DM_Serif_Display({
  weight: ['400'],
  subsets: ['latin'],
  variable: "--font-dm-serif"
})

function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page)=> page)
  return <UserProvider>
  {/* app must be wrapped in tag **main** with className of object.variable */}
  <main className={`${dmSans.variable} ${dmSerif.variable} font-body`}>
    {getLayout(<Component {...pageProps} />, pageProps)}
  </main>
  </UserProvider>
}

export default MyApp
