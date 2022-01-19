import { useEffect, useState } from "react";
import { shuffle } from "lodash";
import { useRecoilState, useRecoilValue } from "recoil";
import { currentPlaylistState, currentPlaylistIdState, playlistState } from "../atoms/playlistAtom";
import useSpotify from "../hooks/useSpotify";
import Songs from "./Songs";
import ProfileButton from "./ProfileButton";

const colors = [
    "from-indigo-500",
    "from-red-500",
    "from-blue-500",
    "from-green-500",
    "from-purple-500",
    "from-yellow-500",
    "from-orange-500",
    "from-pink-500",
];

function PlaylistView() {

    const spotifyApi = useSpotify();    
    const [color, setColor] = useState(null);
    const currentPlaylistId = useRecoilValue(currentPlaylistIdState);
    const [currentPlaylist, setCurrentPlaylist] = useRecoilState(currentPlaylistState);

    useEffect(() => {
        setColor(shuffle(colors).pop())
    }, [currentPlaylistId])

    useEffect(() => {
        spotifyApi
        .getPlaylist(currentPlaylistId)
        .then((data) => {
            setCurrentPlaylist(data.body)
        })
        .catch((err) => console.log('Something went wrong when fetching playlist!', err));
    }, [spotifyApi, currentPlaylistId])


    return (
        <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
            <ProfileButton/>

            <section className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-8`}>
                <img className="h-44 w-44 shadow-2xl" src={currentPlaylist?.images?.[0]?.url} alt=""/>
                <div>
                    <p>PLAYLIST</p>
                    <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold">{currentPlaylist?.name}</h1>
                </div>
            </section>
            <div>
                <Songs/>
            </div>
        </div>
    )
}

export default PlaylistView
