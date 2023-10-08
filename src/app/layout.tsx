"use client";

import "./globals.css";
import { ThemeProvider, useTheme } from "next-themes";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import { Toaster } from "react-hot-toast";

// Components
import { Navbar } from "../components/Navbar";
import { Footer } from "@/components/Footer";

// Context
import { UserProvider } from "@/context/UserContext";

const poppins = Poppins({ subsets: ["latin"], weight: "400" });

// export const metadata: Metadata = {
// 	title: "Create Next App",
// 	description: "Generated by create next app",
// };

interface IPropsChildren {
	children: React.ReactNode;
}

export default function RootLayout({ children }: IPropsChildren) {
	return (
		<html lang="pt-BR">
			<head>
				<link
					href="https://cdn.jsdelivr.net/npm/daisyui@3.7.7/dist/full.css"
					rel="stylesheet"
					type="text/css"
				/>
			</head>
			<body className={poppins.className}>
				<ThemeProvider enableSystem={true} attribute="class">
					<UserProvider>
						<Navbar />
						<Toaster
							position="bottom-center"
							reverseOrder={false}
							toastOptions={{ duration: 2000 }}
						/>
						{children}
						<Footer />
					</UserProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}