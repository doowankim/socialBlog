const express = require('express');
const router = express.Router();
const postModel = require('../../model/posting');
const profileModel = require('../../model/profile');
const passport = require('passport');
const authCheck = passport.authenticate('jwt', { session: false });
const multer = require('multer'); //attachedfile 매니지먼트 (이미지만 들어가야 함)
const uploads = multer({ dest: 'uploads/' });
const validatePostInput = require('../../validation/post');


// @route POST localhost:3300/posts
// @desc Tests posts route
// @access Private
router.post('/', authCheck, (req, res) => {
    const {errors, isValid} = validatePostInput(req.body);
    if(!isValid){
        return res.json(errors);
    }
    const newPost = new postModel({
        text: req.body.text,
        name: req.user.name,
        avatar: req.user.avatar,
        user: req.user.id
    });
    newPost
            .save()
            .then(post => res.json(post))
            .catch(err => res.json(err));
});

// @route GET localhost:3200/posts/total
// @desc get posts
// @access Private & Public
router.get('/total', (req, res) => {
    postModel
        .find()
        .sort({ date: -1 }) //날짜에 맞춰서 최신순이 위로 게시된다
        .then(posts => {
            res.json({
                count: posts.length,
                posts: posts
            });
        })
        .catch(err => res.json(err));
});

// @route GET localhost:3200/posts/:postId
// @desc get detail posts
// @access Private
router.get('/:postId', authCheck, (req, res) => {
    const id = req.params.postId;
    postModel
        .findById({_id: id})
        .then(post => {
            if(!post){
                return res.json({
                    msg: 'There is no posts for this user'
                });
            } else{
                res.json(post);
            }
        })
        .catch(err => res.json(err));
});

// @route POST localhost:3200/posts/like/:postId
// @desc like post
// @access Private
router.post('/like/:postId', authCheck, (req, res) =>{
    profileModel
        .findOne({ user: req.user.id }) //profileModel의 누구인지 체크
        .then(profile => {
            postModel
                .findById(req.params.postId)
                .then(post => {
                    if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0 ) {
                        return res.status(400).json({
                            msg: 'User already liked this post'
                        });
                    }
                    post.likes.unshift({ user: req.user.id });
                    post
                        .save()
                        .then(post => res.json(post));
                })
                .catch(err => res.json(err));
        });
});


// @route POST localhost:3200/posts/unlike/:postId
// @desc unlike post
// @access Private
router.post('/unlike/:postId', authCheck, (req, res) => {
    profileModel
    .findOne({ user: req.user.id })
    .then(profile => {
        postModel
            .findById(req.params.postId)
            .then(post => {
            // 좋아요를 하지 않은 경우
                if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0 ) {
                    return res.status(400).json({
                        msg: 'You have not liked this post'
                    });
                }
                const removeIndex = post.likes
                    .map(item => item.user.toString()) //user가 객체이기 때문에 string타입으로 바꿔줌
                    .indexOf(req.user.id);
                    //없애준것
                    post.likes.splice(removeIndex, 1);
                    //저장
                    post
                        .save()
                        .then(post => res.json(post));
            })
            .catch(err=> res.json(err));
    })
});

// @route POST localhost:3200/posts/comment/:postId
// @desc add comment to post
// @access Private
router.post('/comment/:postId', authCheck, (req, res) => {
    const {errors, isValid} = validatePostInput(req.body);
    if(!isValid){
        return res.json(errors);
    }
    postModel
        .findById(req.params.postId)
        .then(post => {
            if(!post){
                return res.json({msg: 'no post'});
            }
            //사용자 입력값 상수화
            const newComment = {
                text: req.body.text,
                name: req.user.name,
                avatar: req.user.avatar,
                user: req.user.id
            };
            post.comments.unshift(newComment);
            post
                .save()
                .then(post => res.json(post));
        })
        .catch(err => res.json(err));
});

// @route DELETE localhost:3200/posts/comment/:postId/:commentId
// @desc delete comment from post
// @access Private
router.delete('/comment/:postId/:commentId', authCheck, (req, res) => {
    postModel
        .findById(req.params.postId)
        .then(post => {
            if(post.comments.filter(comment => comment._id.toString() === req.params.commentId).length === 0) {
                return res.status(400).json({ msg: 'Comment does not exist' });
            }
            //삭제(배열)
            const removeIndex = post.comments
                .map(item => item._id.toString()) //_id를 toString으로 바꿔줌
                .indexOf(req.params.commentId)
                //잘라내기
            post.comments.splice(removeIndex, 1);
            post
                .save()
                .then(post => {
                    res.json(post)
                });
        });
});

// @route DELETE localhost:3200/posts/:postId
// @desc delete post
// @access Private
router.delete('/:postId', authCheck, (req, res) => {
    profileModel
        .findOne({ user: req.user.id })
        .then(profile => {
            postModel
                .findById(req.params.postId)
                .then(post => {
                    //req.user.id(token의 userid랑 post에 있는 아이디와 매칭)
                    if(post.user.toString() !== req.user.id) {
                        return res.json({msg: 'User not authorized'});
                    }
                    post
                        .remove()
                        .then(() => res.json({msg: 'Successful delete post'}));
                })
                .catch(err => res.json(err));
        });
});



module.exports = router;