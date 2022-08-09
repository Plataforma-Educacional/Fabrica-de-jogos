import React, { Dispatch, SetStateAction, FunctionComponent } from 'react'
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import { useGetUserInfoQuery } from 'services/portal'

interface Props {
    value: string
    setValue: Dispatch<SetStateAction<string>>
}

const DisciplineSelect: FunctionComponent<Props> = ({ value, setValue }) => {
    const { token, origin } = useSelector((state: RootState) => state.user)
    const { data } = useGetUserInfoQuery({ token, origin })

    const disciplineChange = (event: SelectChangeEvent): void => {
        const newValue = event.target.value
        if (newValue !== null && newValue !== value) {
            setValue(newValue)
        }
    }

    if (!data) return <></>

    return (
        <FormControl sx={{ minWidth: 140, maxWidth: { sm: 290, xs: 260 } }}>
            <InputLabel>Componente</InputLabel>
            <Select
                required
                value={value}
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
                    )
                })}
            </Select>
        </FormControl>
    )
}

export default DisciplineSelect
