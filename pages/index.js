import Image from "next/image";
import Link from "next/link";
import { Logo } from "../components/Logo";
import HeroImage from '../public/hero.webp'

export default function Home() {
  return <div className="w-screen h-screen flex justify-center items-center relative">
    <Image src={HeroImage} alt="Hero" fill className="absolute"/>
    <div className="relative z-10 text-white px-10 py-4 text-center max-w-screen-sm bg-slate-900/90 rounded-md backdrop-blur-sm">
      <Logo />
      <p>The AI-powered application rapidly generates high-quality blog posts, saving you time and effort. It utilizes advanced algorithms and language models to produce informative and engaging content, simplifying the content creation process. With this app, you can focus on other tasks while still delivering top-quality content for your blogs.</p>
      <Link href='/post/new' className="btn">Begin</Link>
    </div>
  </div>
  ;
}
