import { useState } from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '60%',
    bgcolor: '#000',
    color: 'white',
    border: '4px solid #18D860',
    boxShadow: 'red',
    p: 8,
  };

export default function Tour() {
    const [visible, setVisible] = useState(true);
    const open = () => setVisible(true);
    const close = () => setVisible(false);
  
    return (
      <div className="h-24">
        <Button onClick={open}>Info</Button>
        <Modal
          open={visible}
          onClose={close}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h4" component="h2">
              This app is a copy of the Spotify UI (api integrated)
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 4 }}>
              To actually play a song using the spotify api, you must have an instance of the original spotify app open on any device, and login with a premium account. 
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 1 }}>
              When you click on the login button below, you will be asked to allow access to your account data. Please note that none of it is stored anywhere by this app.
              Also, this app does not collect any passwords, all login is done through Spotify itself. The app does, however, store the access, and refresh, tokens so that the user doesn't need to login multiple times.
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Other build features: 
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 1 }}>
              - Next.js 12 middleware (beta version)
            </Typography>
            <Typography id="modal-modal-description">
              - NextAuth
            </Typography>
            <Typography id="modal-modal-description">
              - oauth + JWT
            </Typography>
            <Typography id="modal-modal-description">
              - Tailwind CSS
            </Typography>
            <Typography id="modal-modal-description">
              - Debounced api calls
            </Typography>
            <Typography id="modal-modal-description">
              - Oh, and it's built in React
            </Typography>
          </Box>
        </Modal>
      </div>
    );
  }