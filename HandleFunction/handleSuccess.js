function handleSuccess(data) {
    if (data) return {
        message: "Success",
        doc: data
    }
}

function handleSuccessToken(data , token) {
    if (data , token) return {
        message: "Success",
        doc: data + token
    }
}

module.exports=handleSuccess , handleSuccessToken;