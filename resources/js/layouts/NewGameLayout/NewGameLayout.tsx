import React, { ChangeEvent, useState } from 'react';
import { Outlet } from 'react-router-dom';
import BackFAButton from '../../components/BackFAButton/BackFAButton';
import { Box, SelectChangeEvent } from '@mui/material';
import SuccessModal from '../../components/SuccessModal/SuccessModal';

const NewGameLayout = () => {
    const [open, setOpen] = useState(false);
    const [alert, setAlert] = useState('');
    const [name, setName] = useState<string>('');
    const [layout, setLayout] = useState<number>(1);
    const [serie, setSerie] = useState<string[]>([]);
    const seriesChange = (event: SelectChangeEvent<string[]>) => {
        const value = event.target.value;
        if (value !== null) {
            setSerie(typeof value === 'string' ? value.split(',') : value);
        }
    };

    const handleClose = () => {
        setLayout(1);
        setName('');
        setOpen(false);
    };
    const handleLayout = (event: ChangeEvent<HTMLInputElement>, newLayout: number) => {
        if (newLayout === null) {
            return;
        }
        setLayout(newLayout);
    };
    return (
        <>
            <BackFAButton />
            <SuccessModal open={open} handleClose={handleClose} />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'row',
                }}
            >
                <Outlet />
            </Box>
        </>
    );
};

export default NewGameLayout;
