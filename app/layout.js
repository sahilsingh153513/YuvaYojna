import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// import "./accessibility.css"; // Add this import for accessibility styles
import Provider from "./sessionProvider";
import Navbar from "@/components/Navbar";
import GovernmentFooter from "@/components/Footer";
import { TranslationProvider } from "@/context/TranslationContext";
import AutoTranslatePage from "@/components/AutoTranslatePage";
import VoiceControlProvider from "@/context/VoiceControlContext";
import VoiceControlButton from "@/components/VoiceControlButton";
// import { AccessibilityProvider } from "@/context/AccessibilityContext"; // Add this import
// import AccessibilityPanel from "@/components/AccessibilityPanel"; // Add this import
import Script from "next/script";
import { DaisyThemeProvider } from "@/context/DaisyThemeContext";
import FloatingThemeSelector from '@/components/FloatingThemeSelector'; // Updated import

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Yuva Yojna",
  description: "Empowering Youth, Transforming India",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider>
        <DaisyThemeProvider>
          <TranslationProvider>
            <VoiceControlProvider>
              {/* Wrap with AccessibilityProvider */}
                                
                <Navbar />
                
                <AutoTranslatePage>
                  <main id="main-content"> {/* Add id for skip link */}
                    {children}
                    
                    <Script
  id="chatbase-init"
  strategy="afterInteractive"
  dangerouslySetInnerHTML={{
    __html: `
      (function(){
        if(!window.chatbase||window.chatbase("getState")!=="initialized"){
          window.chatbase=(...arguments)=>{
            if(!window.chatbase.q){window.chatbase.q=[]}
            window.chatbase.q.push(arguments)
          };
          window.chatbase=new Proxy(window.chatbase,{
            get(target,prop){
              if(prop==="q"){return target.q}
              return(...args)=>target(prop,...args)
            }
          })
        }
        const onLoad=function(){
          const script=document.createElement("script");
          script.src="https://www.chatbase.co/embed.min.js";
          script.id="oV3L8YIXhEZR2x6OM3Tya";
          script.setAttribute('data-chatbot-id', 'oV3L8YIXhEZR2x6OM3Tya');
          script.setAttribute('data-domain', 'www.chatbase.co');
          document.body.appendChild(script)
        };
        if(document.readyState==="complete"){
          onLoad()
        } else {
          window.addEventListener("load",onLoad)
        }
      })();
    `
  }}
/>
                  </main>
                </AutoTranslatePage>
                
                {/* Voice Control Button - Always visible */}
                <VoiceControlButton />
                
                {/* Floating Theme Selector - Always visible */}
                <FloatingThemeSelector />
                
                {/* Accessibility Panel - Always available */}
                {/* <AccessibilityPanel /> */}
                
              
            </VoiceControlProvider>
          </TranslationProvider>
          </DaisyThemeProvider>
          <GovernmentFooter />
        </Provider>
      </body>
    </html>
  );
}