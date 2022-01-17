import { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Backdrop from '@mui/material/Backdrop';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70%',
    maxHeight: '90%',
    bgcolor: '#000',
    color: 'white',
    border: '4px solid #18D860',
    overflowY: 'scroll',
  };

export default function Tour() {
  
    const [visible, setVisible] = useState(false);
    const open = () => setVisible(true);
    const close = () => setVisible(false);

    useEffect(() => {
        const visitedBefore = JSON.parse(localStorage.getItem("visited_before"))
        localStorage.setItem("visited_before", JSON.stringify(true))
        setVisible(visitedBefore ? false : true)
    }, [])
  
    return (
      <div>
        <Button onClick={open}>Info</Button>
        <Modal
            open={visible}
            onClose={close}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                appear: true,
                timeout: 1000,
            }}
        >
            <Fade in={visible}>
                <Box className="scrollbar-hide shadow-[0_35px_60px_-15px_rgba(100,100,100,0.3)] p-4" sx={style}>
                    <Typography id="modal-modal-title" className="tour-text-title">
                    This app is a copy of the Spotify UI (api integrated)
                    </Typography>
                    <Typography id="modal-modal-description" className="tour-text" sx={{ mt: 4 }}>
                    To actually play a song using the spotify api, you must login with a premium account (spotify api rules 🤷). 
                    </Typography>
                    <Typography id="modal-modal-description" className="tour-text" sx={{ mt: 1 }}>
                    When you click on the login button below, you will be asked to allow access to your account data. Please note that none of it is stored anywhere by this app.
                    Also, this app does not collect any passwords, all login is done through Spotify itself. The app does, however, store the access, and refresh, tokens so that the user does&apos;t need to login multiple times.
                    </Typography>
                    <Typography id="modal-modal-description" className="tour-text" sx={{ mt: 2 }}>
                    Other build features: 
                    </Typography>
                    <Typography id="modal-modal-description" className="tour-text" sx={{ mt: 1 }}>
                    - Next.js 12 middleware (beta version)
                    </Typography>
                    <Typography id="modal-modal-description" className="tour-text">
                    - NextAuth
                    </Typography>
                    <Typography id="modal-modal-description" className="tour-text">
                    - oauth + JWT
                    </Typography>
                    <Typography id="modal-modal-description" className="tour-text">
                    - Tailwind CSS
                    </Typography>
                    <Typography id="modal-modal-description" className="tour-text">
                    - Debounced api calls
                    </Typography>
                    <Typography id="modal-modal-description" className="tour-text">
                    - Built in React
                    </Typography>
                </Box>
            </Fade>
        </Modal>
      </div>
    );
  }