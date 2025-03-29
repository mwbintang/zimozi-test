export const offset = (page: number, limit: number) => {
    return (page - 1) * limit;
}

export const paginationData = (data:any, total: number, page: number, limit: number) => {
    return {
        data,
        meta: {
            total,
            page,
            limit,
            maxPage: Math.ceil(total / limit)
        }
    }
}
