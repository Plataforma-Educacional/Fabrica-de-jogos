import React, { MouseEvent, Dispatch, SetStateAction, FunctionComponent } from 'react'
import { Card, Grid, Typography } from '@mui/material'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
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
        <Grid container alignItems="center" justifyContent="center">
            <Grid item xs={12}>
                <Typography fontSize={18} variant="subtitle2" color="primary">
                    Tema:
                </Typography>
            </Grid>
            <Grid item xs={10}>
                <Swiper
                    slidesPerView={1}
                    spaceBetween={10}
                    loop={true}
                    navigation={true}
                    pagination={{
                        clickable: true,
                    }}
                    initialSlide={value - 1}
                    centeredSlides={true}
                    breakpoints={{
                        641: { slidesPerView: 2, centeredSlides: false },
                        769: { slidesPerView: 3 },
                        1025: { slidesPerView: 4, centeredSlides: false },
                    }}
                    modules={[Navigation, Pagination]}
                    className="mySwiper"
                >
                    {layouts.map((layout, i) => {
                        return (
                            <SwiperSlide key={i}>
                                <ImageToggleButton
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
        </Grid>
    )
}

export default React.memo(LayoutSelect)
