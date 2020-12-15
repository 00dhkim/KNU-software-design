# overall

모든 API는 에러 상황이나 메시지를 출력해야 할 때 code와 message를 반환함

정상 종료 시 html 응답 코드 200

# user

## /user/optimal

method : get

parameter : {

    usr_lat : 사용자 위도,

    usr_lon : 사용자 경도,

    arrival_lat : 도착 위도,

    arrival_lon : 도착 경도

}

return : 최적 킥보드 배열 (company 정보가 같이 포함됨)

# kickboard

## /kickboard/:company/location

:company : 회사 이름

method : get

parameter : {

    lat: 위도,

    lon: 경도,

    dist: 거리(meter)

}

return : dist 거리 안에 있는 킥보드 배열 (company 정보는 포함되지 않음)

## /kickboard/:company/:kickboardid/info

:company : 회사 이름

:kickboardid : 킥보드 id

method : get

parameter : null

return : 킥보드 id에 맞는 킥보드 정보

# auth

## /auth/new

method : post

parameter : {

    id: 사용자 id,

    password: 사용자 비밀번호,

    phonenumber: 사용자 전화번호,

    kickboard_time: taste 중 킥보드 시간,

    price: taste 중 가격,

    walk_time: taste 중 걷는 시간

}

return: {

    code 400: 이미 존재하는 사용자

    code 200: 사용자 성공적으로 DB에 추가 완료

}

## /auth/login

method: get

parameter: {

    id: 사용자 id,

    password: 사용자 비밀번호

}

return: {

    code 404: id 혹은 비밀번호 틀림

    code 200: 로그인 토큰

}