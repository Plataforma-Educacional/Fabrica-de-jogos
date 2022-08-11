import React, { MouseEvent, Dispatch, SetStateAction, FunctionComponent } from 'react'
import { Box, Card, Grid, Typography } from '@mui/material'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import 'swiper/css'

import ImageToggleButton from 'components/ImageToggleButton/ImageToggleButton'
import { Navigation, Pagination } from 'swiper'

const images = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]

type Props = {
    value: number
    setValue: Dispatch<SetStateAction<number>>
}

const PaintSelect: FunctionComponent<Props> = ({ value, setValue }) => {
    const handleImage = (event: MouseEvent<HTMLElement>, newImage: number) => {
        if (newImage === null) {
            return
        }
        setValue(newImage)
    }
    return (
        <Grid container alignItems="center" justifyContent="center">
            <Grid item xs={12}>
                <Typography fontSize={18} variant="subtitle2" color="primary">
                    Imagem:
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
                        769: { slidesPerView: 2, centeredSlides: false },
                        1025: { slidesPerView: 3 },
                        1367: { slidesPerView: 4, centeredSlides: false },
                    }}
                    modules={[Navigation, Pagination]}
                    className="mySwiper"
                >
                    {images.map((image, i) => {
                        return (
                            <SwiperSlide>
                                <Box
                                    sx={{
                                        width: { xs: 180, sm: 280 },
                                        height: 300,
                                    }}
                                    key={i}
                                >
                                    <ImageToggleButton
                                        selected={value === image}
                                        value={image}
                                        color="primary"
                                        size="small"
                                        sx={{
                                            padding: 0,
                                        }}
                                        onChange={(event, value) => {
                                            handleImage(event, value)
                                        }}
                                    >
                                        <Card
                                            sx={{
                                                width: 280,
                                                height: 289,
                                                borderRadius: value === image ? 0 : null,
                                            }}
                                            elevation={5}
                                        >
                                            <img
                                                src={`/storage/paint/${image}.png`}
                                                alt={`Imagem ${image}`}
                                                width="100%"
                                                height="100%"
                                            />
                                        </Card>
                                    </ImageToggleButton>
                                </Box>
                            </SwiperSlide>
                        )
                    })}
                </Swiper>
            </Grid>
        </Grid>
    )
}

export default React.memo(PaintSelect)
