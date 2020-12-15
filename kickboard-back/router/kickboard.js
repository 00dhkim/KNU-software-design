/*
반경 x m 이내 킥보드 정보 -> /kickbaord : get
파이어베이스에서 데이터 가라로 있다고 가정 -> 각 회사의 db가 있다고 가정
킥보드 정보 얻어오기 -> /kickboard/{company}/{kickboardid}/info 가라 db에 있는 데이터 얻어옴
킥보드 대여 -> /kickboard/{company}/{kickboardid}/rental isRental 상태 업데이트
킥보드 반납 -> /kickboard/{company}/{kickboardid}/return 위치 정보 업데이트 필요: 가라 db에 업데이트
*/

import express from 'express'
import firebase from 'firebase'

const router = express.Router()
const database = firebase.database()

function distance(lat1, lon1, lat2, lon2, unit) {
         
    let theta = lon1 - lon2;
    let dist = Math.sin(deg2rad(lat1)) * Math.sin(deg2rad(lat2)) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.cos(deg2rad(theta));
     
    dist = Math.acos(dist);
    dist = rad2deg(dist);
    dist = dist * 60 * 1.1515;
     
    if (unit === "kilometer") {
        dist = dist * 1.609344;
    } else if(unit === "meter"){
        dist = dist * 1609.344;
    }

    return (dist);
}

function deg2rad(deg) {
    return (deg * Math.PI / 180.0);
}

function rad2deg(rad) {
    return (rad * 180 / Math.PI);
}

const company = ["Beam", "XingXing", "Gbike"]

async function getKickboard(usr_lat, usr_lon, dist) {
    let arr = []
    for(let j=0;j<company.length;++j) {
        let snapshot = await database.ref(company[j]+"/").once("value")
        const data = snapshot.val()
        for(const i in data) {
            if(distance(data[i].kickboard_pos_lat, data[i].kickboard_pos_lon, usr_lat, usr_lon, "meter") <= Number(dist)) {
                data[i].company = company[j]
                data[i].id = i
                arr.push(data[i])
                // console.log(arr)
            }
        }
    }
    console.log(arr)
    return arr
}

//현재 위치 (위도, 경도)와 거리를 받아서 거리 안에 있는 전동 킥보드 배열 리턴
//lat: 위도, lon: 경도, dist: 거리(meter)
router.get('/location', (req, res) => {
    res.send(getKickboard(req.query.lat, req.query.lon, req.query.dist))
})

//회사와 킥보드 id를 받아서 정보 리턴
router.get('/:company/:kickboardid/info', (req, res) => {
    database.ref(req.params.company+'/'+req.params.kickboardid).once("value").then((snapshot) => {
        console.log(snapshot.toJSON())
        res.send(snapshot.toJSON())
    })
})

router.post('/:company/:kickboardid/rental', (req, res) => {

})

router.post('/:company/:kickboardid/return', (req, res) => {

})

export default router
export { getKickboard }