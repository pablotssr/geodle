import type { Metadata } from "next";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import Header from "./components/Layout/header";
import Footer from "./components/Layout/footer";
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
        <Footer />
      </body>
    </html>
  );
}
