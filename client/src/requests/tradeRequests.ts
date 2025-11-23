import { $axios } from '../services/axios'
import { CreateTradeBody, RespondToTradeBody, DeleteTradeBody } from '../Types'

export const createTrade = async (body: CreateTradeBody): Promise<{ message: string; trade: any }> => {
    const { data } = await $axios.post('/trades/create', body)
    return data
}

export const getOneTrade = async (tradeId: string): Promise<any> => {
    const { data } = await $axios.get(`/trades/${tradeId}`)
    return data
}

export const getAllTrades = async (userId: string, filter?: 'sent' | 'received' | 'all'): Promise<any[]> => {
    let url = `/trades/user/${userId}`
    
    if (filter) {
        url += `?filter=${filter}`
    }
    
    const { data } = await $axios.get(url)
    return data
}

export const deleteTrade = async (tradeId: string, body: DeleteTradeBody): Promise<{ message: string }> => {
    const { data } = await $axios.delete(`/trades/${tradeId}`, { data: body })
    return data
}

export const respondToTrade = async (tradeId: string, body: RespondToTradeBody): Promise<{ message: string; trade: any }> => {
    const { data } = await $axios.post(`/trades/${tradeId}/respond`, body)
    return data
}
