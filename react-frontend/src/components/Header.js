import React from 'react';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import HouseIcon from '@mui/icons-material/House';

const Header = () => {
    return (
        <AppBar>
            <Toolbar>
                {/* <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                >
                    <MenuIcon />
                </IconButton> */}
                <HouseIcon sx={{ mr: 2 }}/>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Housing Price Prediction
                </Typography>
            </Toolbar>
        </AppBar>
    );
};

export default Header;