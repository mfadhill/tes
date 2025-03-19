export const successResponse = (message: string, data: any = null) => {
    return {
        status: 'success',
        message,
        data
    };
};

export const errorResponse = (message: string, statusCode: number = 400) => {
    return {
        status: 'error',
        message,
        code: statusCode
    };
};
