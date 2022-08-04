import React, { useState } from 'react';
import { FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useGetUserInfoQuery } from '../../services/portal';

export default function DisciplineSelect() {
    const { token, origin } = useSelector((state: RootState) => state.user);
    const { data } = useGetUserInfoQuery({ token, origin });
    const [discipline, setDiscipline] = useState<string>('');

    if (!data) return <></>;

    const disciplineChange = (event: SelectChangeEvent): void => {
        const value = event.target.value;
        if (value !== null && value !== discipline) {
            setDiscipline(value);
        }
    };

    return (
        <>
            <FormControl sx={{ minWidth: 140, maxWidth: { sm: 290, xs: 260 } }}>
                <InputLabel>Componente</InputLabel>
                <Select
                    required
                    value={discipline}
                    onChange={disciplineChange}
                    autoWidth
                    label="Componente"
                    sx={{
                        minWidth: 140,
                    }}
                >
                    {Object.keys(data.data.disciplinas).map((key: string) => {
                        return (
                            <MenuItem key={key} value={key}>
                                <>{data.data.disciplinas[key]}</>
                            </MenuItem>
                        );
                    })}
                </Select>
            </FormControl>
        </>
    );
}
