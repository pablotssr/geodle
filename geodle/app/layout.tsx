import type { Metadata } from "next";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import { CityDataProvider } from "./context/CityDataContext";

export const metadata: Metadata = {
    title: {
        template: "%s | Geodle",
        default: "Geodle | City Game",
    },
    description: "Geodle | The City Game.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <div className="flex flex-col min-h-screen">
                    <main className="flex-1 flex flex-col">
                        <Header />
                        <CityDataProvider>{children}</CityDataProvider>
                        <ToastContainer
                            position="bottom-right"
                            autoClose={5000}
                            hideProgressBar={false}
                            newestOnTop
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                            theme="colored"
                        />
                    </main>
                    <Footer />
                </div>
            </body>
        </html>
    );
}
