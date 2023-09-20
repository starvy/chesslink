import redis from "@/redis/client";
import UsernameInput from "@/components/inputs/usernameInput";
import { textGradient } from "@/utils/gradient";

export default async function Page({ params }: { params: { slug: string } }) {
	const link = (await redis.exists(params.slug)) ? params.slug : null;

	if (!link) {
		return <p>Link not found</p>;
	}

	return (
		<main className="w-[100vw] h-[100vh] flex flex-col bg-black">
			<h1 className="text-center font-bold text-8xl text-[#9B9B9B] mt-16">
				{/* {link.creator === ""
					? "You've been invited"
					: `${link.creator} has invited you`} TODO */}
				{"You've been invited"}
			</h1>
			<h1 className="text-8xl font-bold text-center mt-8 text-[#D4D4D4]">
				To play
			</h1>
			<h1
				className="text-center font-bold text-8xl text-transparent mt-32"
				style={textGradient(
					"linear-gradient(90deg, #DBB9EB 0%, #3E5EED 100%)",
				)}
			>
				chessl.ink/{link}
			</h1>
			<div className="mx-auto mt-24 flex">
				<UsernameInput link={link} />
			</div>
		</main>
	);
}
