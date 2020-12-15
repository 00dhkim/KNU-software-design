/*
로그인 인증 -> /auth/new 가입 (post) : /auth/login 토큰 발급, 토큰 유효성 검사
*/
import express from 'express'
import firebase from 'firebase'
import jwt from 'jsonwebtoken'

const firebaseConfig = {
    apiKey: "AIzaSyAC4qNnwDvcKrYLlMAPVznEAHxOO7Q7Z6Y",
    authDomain: "kickboard-d56cf.firebaseapp.com",
    projectId: "kickboard-d56cf",
    storageBucket: "kickboard-d56cf.appspot.com",
    messagingSenderId: "1015178912192",
    appId: "1:1015178912192:web:854b2178ca465e911f6825",
    measurementId: "G-J0NQK7PC45"
}
firebase.initializeApp(firebaseConfig)

const router = express.Router()
const database = firebase.database()

//사용자 선호도 가중치. 0 ~ 1 사이의 값이 들어오는 것으로 가정하고 그 보다 큰 값이 들어오면 1로 치환
class taste {
    constructor(kickboard_time, price, walk_time) {
        this.kickboard_time = Math.min(1, kickboard_time)
        this.price = Math.min(1, price)
        this.walk_time = Math.min(1, walk_time)
    }
}

class user {
    constructor(id, password, taste) {
        this.id = id
        this.password = password
        this.taste = taste
    }
}

//회원가입 : 정보로 id(name), password, taste값을 받음.
//이미 있는 사용자의 경우 가입 거절 : code 400
router.get('/new', (req, res) => {
    database.ref("user").once("value").then((snapshot) => {
        if(snapshot.val().hasOwnProperty(req.query.id)) {
            res.status(400).send({code: 400, message: "이미 존재하는 사용자입니다."})
        }
        else {
            const usr = new user(req.query.id, req.query.password, new taste(req.query.kickboard_time, req.query.price, req.query.walk_time))
            database.ref("user/"+req.query.id).set(usr)
            res.status(200).send(usr)
            console.log("사용자 추가")
            console.log(usr)
        }
    })
})

//로그인(토큰 발급) : id, password 입력받아서 검사하고 올바른 사용자면 토큰 발급
router.get('/login', (req, res) => {
    database.ref("user").once("value").then((snapshot) => {
        if(snapshot.val().hasOwnProperty(req.query.id)) {
            if(snapshot.child(req.query.id).val().password === req.query.password) {
                const token = jwt.sign({
                    id: req.query.id
                }, global.JWT_SECRET, {
                    expiresIn: '60m',
                    issuer: 'user'
                })
                res.status(200).send(token)
            }
            else {
                res.status(404).send({code: 404, message: "잘못된 비밀번호입니다."})
            }
        }
        else {
            res.status(404).send({code: 404, message: "잘못된 id입니다."})
        }
    })
})


export default router