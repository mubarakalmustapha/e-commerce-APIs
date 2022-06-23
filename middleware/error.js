module.exports = function (err, req, res, next) {
    console.log(err.message, err);

    return res.status(500).json("Something failed");
}