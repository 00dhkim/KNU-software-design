/*
최적 킥보드 계산(로그인 요구) -> 외부 프로그램 사용 -> /user/calc_opt_kickboard (get)
도현이랑 의논해볼것?
*/

import express from 'express'
import firebase from 'firebase'
import verifyToken from '../middleware/token.js'
import { PythonShell } from 'python-shell'

const router = express.Router()
const database = firebase.database()

// 최적 킥보드를 계산 후 리턴 and DB에는 유저 선호도 값 update
router.get("/optimal", verifyToken, (req, res) => {
    database.ref("user/"+req.decode.id)
    const option = {
        mode: 'text',
        pythonPath: '',
        pythonOptions: ['-u'],
        scriptPath: '',
        args: [req.query.usr_lat + "|" + req.query.usr_lon, req.query.arrival_lat + "|" + req.query.arrival_lon, ]
    }
    // 파이썬 연결
    PythonShell.run('router/test.py', option, (err, results) => {
        res.send(results)
        console.log(err)
    })
    // res.send(req.decoded)
})

export default router