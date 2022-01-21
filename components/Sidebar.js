import { HomeIcon, SearchIcon, LibraryIcon, PlusCircleIcon, HeartIcon, RssIcon, MenuIcon, MenuAlt2Icon } from '@heroicons/react/outline';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { albumState } from '../atoms/albumAtom';
import { centerDisplayAtom } from '../atoms/centerDisplayAtom';
import { currentPlaylistIdState, playlistState } from '../atoms/playlistAtom';
import useSpotify from '../hooks/useSpotify';
import LibraryView from './LibraryView';
import PlaylistView from './PlaylistView';

function Sidebar() {

    const spotifyApi = useSpotify();
    const { data: session, status } = useSession();
    const [playlists, setPlaylists] = useRecoilState(playlistState);
    const [albums, setAlbums] = useRecoilState(albumState)
    const [playlistId, setPlaylistId] = useRecoilState(currentPlaylistIdState);
    const [extraClassname, setExtraClassname] = useState('hidden');
    const [hidden, setHidden] = useState(true)

    const [view, setView] = useRecoilState(centerDisplayAtom)

    useEffect(() => {
        if (spotifyApi.getAccessToken()) {
            spotifyApi.getUserPlaylists().then((data) => {
                setPlaylists(data.body.items);
            })
            spotifyApi.getMySavedAlbums().then((data) => {
                setAlbums(data.body.items);
            })
        }
    }, [session, spotifyApi])

    const hideSidebar = () => {
        setHidden(true)
        setExtraClassname('hidden')
    }

    const showSidebar = () => {
        setHidden(false)
        setExtraClassname('inline-flex')
    }

    const handleSidebarShow = () => {
        hidden ? showSidebar() : hideSidebar()
    }


    return (
        <div className='flex flex-col' >
            <header className={hidden ? "absolute top-5 left-7 text-black md:hidden" : "relative top-5 left-7 mb-4 text-white md:hidden"} onClick={handleSidebarShow}>
                {hidden ? <MenuIcon className="w-12 h-12"/> : <MenuAlt2Icon className="w-12 h-12"/>}
            </header>
            <div className={`text-gray-500 p-5 text-xs lg:text-sm border-r border-gray-900 overflow-y-scroll scrollbar-hide h-screen w-[10rem] md:w-full sm:max-w-[12rem] lg:max-w-[15rem] md:inline-flex pb-36 ${extraClassname}`}>
            <div className='space-y-4'>
                <button className='flex items-center space-x-2 hover:text-white'>
                    <HomeIcon className='h-5 w-5'/>
                    <p>Home</p>
                </button>
                <button className='flex items-center space-x-2 hover:text-white'>
                    <SearchIcon className='h-5 w-5'/>
                    <p>Search</p>
                </button>
                <button className='flex items-center space-x-2 hover:text-white' onClick={() => setView(<LibraryView/>)}>
                    <LibraryIcon className='h-5 w-5'/>
                    <p>Your Library</p>
                </button>
                <hr className='border-t-[0.1px] border-gray-900'/>

                <button className='flex items-center space-x-2 hover:text-white'>
                    <PlusCircleIcon className='h-5 w-5'/>
                    <p>Create Playlist</p>
                </button>
                <button className='flex items-center space-x-2 hover:text-white'>
                    <HeartIcon className='h-5 w-5'/>
                    <p>Liked Songs</p>
                </button>
                <button className='flex items-center space-x-2 hover:text-white'>
                    <RssIcon className='h-5 w-5'/>
                    <p>Your Episodes</p>
                </button>
                <hr className='border-t-[0.1px] border-gray-900'/>

                {playlists?.map((playlist) => (
                    <p key={playlist.id} className='cursor-pointer hover:text-white' onClick={() => {setPlaylistId(playlist.id); setView(<PlaylistView/>)}}>{playlist.name}</p>
                ))}
            </div>
            </div>
        </div>
        
    )
}

export default Sidebar
