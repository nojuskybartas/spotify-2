import { atom } from 'recoil'



export const playlistState = atom({
    key: 'playlistState',
    default: [],
});

export const currentPlaylistState = atom({
    key: 'currentPlaylistState',
    default: null,
});

export const currentPlaylistIdState = atom({
    key: 'currentPlaylistIdState',
    default: '62bReXvmroQzQfEUuTNe3Y',
});