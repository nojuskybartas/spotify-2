import { ChevronDownIcon } from "@heroicons/react/outline"
import Playlists from "./Playlists"
import ProfileButton from "./ProfileButton"

function LibraryView() {
    return (
        <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide ">
            <ProfileButton/>

            <section className={`flex items-end space-x-7 bg-gradient-to-b to-black from-gray-800 h-80 text-white p-8`}>

                {/* <img className="h-44 w-44 shadow-2xl" src={playlist?.images?.[0]?.url} alt=""/> */}
                <div>
                    <p>YOUR PLAYLISTS</p>
                    
                    {/* <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold">{playlist?.name}</h1> */}
                </div>
            </section>
            <Playlists/>
            
        </div>
    )
}

export default LibraryView
