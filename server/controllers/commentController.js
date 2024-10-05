const commentService = require('../services/commentService');

const createComment = async(req, res) => {
    try {
        const { text, author, post_id } = req.body;
        const comment = await commentService.createComment(text, author, post_id);
        res.status(200).send(comment);
    } catch(e) {
        res.status(500).send(e.message);
    }


}

const getComment = async(req, res) => {
    try {
        const { id } = req.params;
        const comment = await commentService.getComment(id);
        res.status(200).send(comment);
    } catch(e) {
        res.status(500).send(e.message);
    }


}


module.exports = {
    createComment,
    getComment
}