
import React from 'react'
import { BookingCTX } from '@/contexts/BookingContext'
import axiosInstance from '@/api'
import { customError } from '@/lib/utils'

export const useLogistics = () => {
    const { setLoading } = React.useContext(BookingCTX)

    const getLogisticsCost = (onSuccess) => {
        setLoading(true);
        axiosInstance
            .get("/price/get")
            .then((res) => {
                if (res.status === 200) {
                    const resData = res.data.prices.map((item) => ({ [item.trip_name]: item.cost }));
                    const result = Object.assign({}, ...resData);
                    onSuccess(result.logistics);
                }
            }).catch((error) => {
                customError(error, "Error occurred while getting quote.");
            }).finally(() => setLoading(false))
    }

    return { getLogisticsCost }
}
