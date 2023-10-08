"use client";

import React, { useState, useEffect } from "react";
import api from "@/utils/api";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { RiPenNibFill, RiBook2Fill } from "react-icons/ri";
import useFlashMessage from "@/hooks/useFlashMessage";
import { Spinner } from "@/components/Spinner";
import Link from "next/link";
import styles from "./style.module.css";

interface ITag {
	_id: string;
	tagName: string;
	definition: string;
	image: string;
}

interface IHentai {
	_id: string;
	title: string;
	description: string;
	mangaka: string;
	format: string;
	image: string;
	tags: string[];
}

function TagDetails() {
	const { id } = useParams();
	const [tag, setTag] = useState<ITag | null>(null);
	const [hentais, setHentais] = useState<IHentai[]>([]); // Inicialize hentais como um array vazio
	const { setFlashMessage } = useFlashMessage();
	const [token] = useState(localStorage.getItem("token") || "");
	const [isLoading, setIsLoading] = useState(true);

	const router = useRouter();

	useEffect(() => {
		if (!token) {
			router.push("/login");
			return;
		}

		api.get(`/tags/${id}`).then((response) => {
			setTag(response.data.tag);
		});

		api.get(`/hentais`).then((response) => {
			setHentais(response.data.hentais);
			setIsLoading(false);
		});
	}, [id, token, router]);

	if (
		isLoading ||
		!tag ||
		!Object.keys(tag).length ||
		hentais.length === 0 // Verifique se hentais é um array vazio
	) {
		return (
			<section className="min-h-screen flex flex-col justify-center items-center mt-4 mb-16">
				<h1>
					<Spinner />
				</h1>
			</section>
		);
	}

	return (
		<section className="min-h-screen">
			<main className="grid grid-cols-10 gap-4 bg-pink-700">
				<div className="col-start-2 col-span-8 flex flex-row mt-8">
					<Image
						className="w-64 h-96 rounded-lg mb-8 shadow-lg"
						src={`${process.env.NEXT_PUBLIC_API}/images/tags/${tag.image}`}
						alt={tag.tagName}
						width={64}
						height={96}
						unoptimized
						priority
					/>
					<div className="flex flex-col ml-8 mr-8">
						<h1 className="text-white text-center text-2xl mt-4 mb-2">
							{tag.tagName}
						</h1>

						<hr className="w-full h-px bg-gray-200 border-0" />

						<p className="text-white mt-2 mb-3">
							<strong>Definição:</strong> {tag.definition}
						</p>
					</div>
				</div>
			</main>

			<article className="grid grid-cols-10 mt-6 mb-10">
				<div className="col-start-2 col-span-8 py-4 rounded-lg bg-pink-700 shadow-lg">
					<h1 className="text-white text-center text-2xl">
						Hentais com Tag {tag.tagName}
					</h1>
				</div>

				<div className="col-start-2 col-span-8 flex flex-row justify-center mt-6 mb-6 gap-8">
					{hentais.map((hentai: IHentai) => {
						if (hentai.tags.includes(tag.tagName)) {
							return (
								<div className="flex flex-col" key={hentai._id}>
									<div className="mb-2">
										<Image
											className="w-64 h-96 rounded-lg mb-2 shadow-lg"
											src={`${process.env.NEXT_PUBLIC_API}/images/hentais/${hentai.image}`}
											alt={hentai.title}
											width={64}
											height={96}
											unoptimized
											priority
										/>
										<h3 className="mb-2 flex flex-row items-center gap-4">
											<RiBook2Fill size={20} />
											<p className="titleOverflow">
												{hentai.title}
											</p>
										</h3>
										<h2 className="flex flex-row items-center gap-4 text-ellipsis overflow-hidden">
											<RiPenNibFill size={20} />
											{hentai.mangaka}
										</h2>
									</div>
									<Link
										className="bg-blue-800 hover-bg-blue-600 transition-all ease-in duration-200 text-white p-2 rounded px-14 w-64 shadow-lg"
										href={
											hentai.format === "Manga"
												? `/mangas/${hentai._id}`
												: `/doujinshis/${hentai._id}`
										}>
										Página do Hentai
									</Link>
								</div>
							);
						}
						return null;
					})}
				</div>
			</article>
		</section>
	);
}

export default TagDetails;
