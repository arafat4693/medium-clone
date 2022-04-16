import Image from "next/image";
import Link from "next/link";

export default function Header() {
    return (
        <header className="flex justify-between p-5">
            <div className="flex items-center space-x-5">
                <Link href="/" passHref>
                    <div className="relative h-16 w-44">
                        <Image src="/images/Medium_logo.png" alt="logo" layout="fill" objectPosition="left" objectFit="contain" />
                    </div>
                </Link>
                <div className="hidden md:inline-flex items-center space-x-5">
                    <h3>About</h3>
                    <h3>Contact</h3>
                    <h3 className="text-white bg-green-600 py-1 px-4 rounded-full cursor-pointer">Follow</h3>
                </div>
            </div>
            <div className="flex items-center space-x-5 text-green-600">
                <h3>Sign In</h3>
                <h3 className="py-1 px-4 border border-green-600 rounded-full">Get Started</h3>
            </div>
        </header>
    )
}
