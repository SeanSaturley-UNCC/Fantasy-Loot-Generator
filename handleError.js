
export const handleError = async (err, res) => {
    console.log(err)
    const error = {
        errCode: err.statusCode? err.statusCode : 500,
        message: err.message
    }

    res.status(error.errCode).json({ message: error.message })
}
