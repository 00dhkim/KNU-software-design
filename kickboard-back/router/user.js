/*
최적 킥보드 계산(로그인 요구) -> 외부 프로그램 사용 -> /user/calc_opt_kickboard (get)
도현이랑 의논해볼것?
*/

import express from 'express'
import firebase from 'firebase'
import verifyToken from '../middleware/token.js'
import { PythonShell } from 'python-shell'
import { getKickboard } from './kickboard.js'

const router = express.Router()
const database = firebase.database()

// 최적 킥보드를 계산 후 리턴 and DB에는 유저 선호도 값 update
router.get("/optimal", verifyToken, async (req, res) => {
    let snapshot = await database.ref("user/"+req.decode.id+"/taste").once("value")
    let kickboard = await getKickboard(Number(req.query.usr_lat), Number(req.query.usr_lon), 1000)
    const option = {
        mode: 'text',
        pythonPath: '',
        pythonOptions: ['-u'],
        scriptPath: '',
        args: [JSON.stringify([Number(req.query.usr_lat), Number(req.query.usr_lon)]), JSON.stringify([Number(req.query.arrival_lat), Number(req.query.arrival_lon)]), JSON.stringify(kickboard), JSON.stringify([snapshot.val().price, snapshot.val().kickboard_time, snapshot.val().walk_time]) ]
    }
    
    // 파이썬 연결
    PythonShell.run('router/test.py', option, (err, results) => {
        res.send(JSON.parse(results[0]));
        console.log(results[0]);
    })
})

router.get("/usekickboard", verifyToken, async (req, res) => {
    let snapshot = await database.ref("user/"+req.decode.id+"/taste").once("value")
    const option = {
        mode: 'text',
        pythonPath: '',
        pythonOptions: ['-u'],
        scriptPath: '',
        args: [req.query.price, req.query.kickboard_time, req.query.walk_time, JSON.stringify([snapshot.val().price, snapshot.val().kickboard_time, snapshot.val().walk_time])]
    }

    PythonShell.run('../python_calc/user_taste_update.py', option, (err, results) => {
        res.send(JSON.parse(results[0]))
        console.log(results[0])
    })
})

router.get("/info", verifyToken, async (req, res) => {
    console.log(req.decode)
    let snapshot = await database.ref("user/"+req.decode.id).once("value")
    res.send(snapshot.val())
})

export default router
