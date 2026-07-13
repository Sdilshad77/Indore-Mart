export const errorHandler = async (err, req, res, next) => {
    const statusCode = res.statusCode <= 200 ? 500 : res.statusCode

    // Log full error to server console (visible in Render logs)
    console.error(`[ERROR] ${req.method} ${req.url} → ${statusCode}`)
    console.error(`[ERROR] Message: ${err.message}`)
    console.error(`[ERROR] Stack: ${err.stack}`)

    res.status(statusCode)
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === "development" ? err.stack : null
    })
}

