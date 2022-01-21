import { ChevronDownIcon } from "@heroicons/react/outline"
import { useState } from "react"
import { useRecoilState } from "recoil"
import { libraryViewState } from "../atoms/libraryAtom"
import LibraryItems from "./LibraryItems"
import ProfileButton from "./ProfileButton"

function LibraryView() {

    // const [item, setItem] = useState('playlist')
    const [libraryView, setlibraryView] = useRecoilState(libraryViewState)

    const show = (items) => {
        setlibraryView(items)
        console.log(libraryView)
    }

    return (
        <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide ">
            <ProfileButton/>

            <section className={`flex items-center bg-gradient-to-b to-black from-gray-800 h-80 text-white p-8`}>
                <div className="flex justify-around w-full">
                    <p className={`text-4xl font-bold hover:scale-110 ${libraryView==='userPlaylists' && 'text-purple-300'}`} onClick={() => show('userPlaylists')}>YOUR PLAYLISTS</p>
                    <p className={`text-4xl font-bold hover:scale-110 ${libraryView==='userAlbums' && 'text-purple-300'}`} onClick={() => show('userAlbums')}>YOUR ALBUMS</p>
                </div>
            </section>

            <LibraryItems/>
            
        </div>
    )
}

export default LibraryView
