import type { Metadata } from "next";
import { Poppins} from "next/font/google";
import "./globals.css";
import NavBar from "./components/nav/NavBar";
import Footer from "./components/footer/Footer";
import CartProvider from "@/providers/cartProvider";
import { Toaster } from "react-hot-toast";


const poppins = Poppins({ subsets: ["latin"], weight:['400', '700'] }); //  This initializes the Inter font with the specified configuration. 
//It seems to specify that only the Latin subset of the font should be used.

//this metadata can be used for SEO (Search Engine Optimization) purposes.
export const metadata: Metadata = {
  title: "E-shop", //titulli i tabit ku hapet app
  description: "E-commerce app",
}; // nese e hap me inspect krijon nje tag meta me title dhe dscription


// app fillon te rootlayout which is a server side component
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode; // children = diffrent pages of application
}>) {
 
  //div NavBar Footer will be passed as children to CartProvider
  return (
    <html lang="en">
      <body className={`${poppins.className} text-slate-700`}>
        <Toaster toastOptions={{
          style:{background:'rgb(51 65 85)', color:'#fff'}
        }}/>
        <CartProvider> 
        <div className="flex flex-col min-h-screen">
        <NavBar/>
        <main className="flex-grow">{children}</main>
        <Footer/>
        </div>
       </CartProvider>
        </body>
    </html>
  );
}
