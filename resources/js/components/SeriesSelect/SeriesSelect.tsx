import React, { Dispatch, SetStateAction } from 'react';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useGetUserInfoQuery } from 'services/portal';
import { useSelector } from 'react-redux';
import { RootState } from 'store';

type Props = {
    value: string[];
    setValue: Dispatch<SetStateAction<string[]>>;
};

export default function SeriesSelect({ value, setValue }: Props) {
    const { token, origin } = useSelector((state: RootState) => state.user);
    const { data } = useGetUserInfoQuery({ token, origin });

    const seriesChange = (event: SelectChangeEvent<string[]>) => {
        const newValue = event.target.value;
        if (newValue !== null) {
            setValue(typeof newValue === 'string' ? newValue.split(',') : newValue);
        }
    };

    if (!data) return <></>;

    return (
        <>
            <FormControl sx={{ minWidth: 140, maxWidth: { sm: 290, xs: 260 } }}>
                <InputLabel>Etapa Letiva</InputLabel>
                <Select
                    required
                    multiple
                    value={value}
                    onChange={seriesChange}
                    label="Ano/Série"
                    sx={{
                        minWidth: 140,
                    }}
                >
                    {Object.keys(data.data.series).map((key: string) => {
                        return (
                            <MenuItem key={key} value={key}>
                                <>{data.data.series[key]}</>
                            </MenuItem>
                        );
                    })}
                </Select>
            </FormControl>
        </>
    );
}
