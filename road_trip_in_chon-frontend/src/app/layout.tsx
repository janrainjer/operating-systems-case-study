import './globals.css'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false
import type { Metadata } from 'next'
import { Preahvihear,Karla,Kanit } from 'next/font/google'
import ReduxProvider from "../providers/redux-provider"
import AuthProvider from '../providers/nextauth-provider'
import Navbar from '../components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Roadtrip in CHON',
}

const preahvihear = Preahvihear({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-preahvihear",
  weight: "400",
});

const karla = Karla({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-karla",
  weight: "400",
});

const karnit = Kanit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-karnit',
  weight : "400"
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${preahvihear.variable} ${karla.variable} ${karnit.variable} scroll-smooth`}>
      <body>
      <ReduxProvider>
        <AuthProvider>
          <Navbar/>
          {children}
          <Footer/>
        </AuthProvider>
      </ReduxProvider>
      </body>
    </html>
  );
}
