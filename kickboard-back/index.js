/*
API
로그인 인증 -> /auth/new 가입 : /auth/login 토큰 발급, 토큰 유효성 검사
킥보드 정보 얻어오기 -> /kickboard/{kickboardname}/info
킥보드 대여 -> /kickboard/{kickboardname}/rental
최적 킥보드 계산 -> 외부 프로그램 사용 -> /user/calc_opt_kickboard (get)
사용자 선호도 입력 -> /user/preference (post)

내부 처리
사용자 선호도 업데이트 (파이썬 프로그램 return 값)
*/
import express from 'express'
import authRouter from './router/auth.js'
import userRouter from './router/user.js'
import kickboardRouter from './router/kickboard.js'
import cors from 'cors'
import firebase from 'firebase'

global.JWT_SECRET = "SoftwareDesign1Team"

const app = express()

app.use(cors())
app.use(express.json())
app.use('/auth', authRouter)
app.use('/kickboard', kickboardRouter)
app.use('/user', userRouter)

const server = app.listen(80, () => {
    console.log('start')
})
