import React, { MouseEvent, Dispatch, SetStateAction, FunctionComponent } from 'react'
import { Card, Grid, Typography } from '@mui/material'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css'

import ImageToggleButton from 'components/ImageToggleButton/ImageToggleButton'

const layouts = [1, 2, 3, 4, 5, 6, 7]

interface Props {
    value: number
    setValue: Dispatch<SetStateAction<number>>
}

const LayoutSelect: FunctionComponent<Props> = ({ value, setValue }) => {
    const handleLayout = (event: MouseEvent<HTMLElement>, newLayout: number) => {
        if (newLayout === null) {
            return
        }
        setValue(newLayout)
    }
    return (
        <Grid container direction="column" alignItems="center" justifyContent="center">
            <Grid item textAlign="center">
                <Typography variant="subtitle1">Tema:</Typography>
            </Grid>
            <Swiper
                slidesPerView={3}
                spaceBetween={10}
                pagination={{
                    clickable: true,
                }}
                modules={[Pagination]}
                className="mySwiper"
            >
                {layouts.map((layout, i) => {
                    return (
                        <SwiperSlide>
                            <ImageToggleButton
                                key={i}
                                selected={value === layout}
                                value={layout}
                                color="primary"
                                size="small"
                                sx={{
                                    padding: 0,
                                }}
                                onChange={(event, value) => {
                                    handleLayout(event, value)
                                }}
                            >
                                <Card
                                    sx={{
                                        width: 250,
                                        height: 125,
                                        borderRadius: value === layout ? 0 : null,
                                    }}
                                    elevation={5}
                                >
                                    <img
                                        src={`/storage/layout/layout${layout}.png`}
                                        alt={`Layout ${layout}`}
                                        width="100%"
                                        height="100%"
                                    />
                                </Card>
                            </ImageToggleButton>
                        </SwiperSlide>
                    )
                })}
            </Swiper>
        </Grid>
    )
}

export default React.memo(LayoutSelect)
