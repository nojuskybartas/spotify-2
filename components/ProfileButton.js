import { ChevronDownIcon } from "@heroicons/react/outline";
import { signOut, useSession } from "next-auth/react";

function ProfileButton() {

    const { data: session } = useSession();

    return (
        <header className="absolute top-5 right-8">
            <div className="flex items-center bg-black text-white space-x-3 opacity-90 hover:opacity-70 cursor-pointer rounded-full p-1 pr-2" onClick={signOut}>
                <img 
                className="rounded-full w-10 h-10"
                src={session?.user.image} alt="">
                </img>
                <h2>{session?.user.name}</h2>
                <ChevronDownIcon className="w-5 h-5"/>
            </div>
        </header>
    )
}

export default ProfileButton
