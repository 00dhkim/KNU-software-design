'''
2020-2 소프트웨어설계 프로젝트
20.12.12. 김도현 (2019112920)

백엔드로부터 각종 데이터를 받은 후, 각 킥보드에 대한 사용자 선호도를 계산하여 반환
내가 DB와의 통신을 하는 경우는 없음, 전부 인자로 받아서 처리

TODO:
- 판단에 쓰이는 3가지 값 normalize 하기
- user_taste 업데이트 하기

단위
- 가격: 원 (1000 ~ 5000)
- 거리: meter (10 ~ 100, 걷기), (100 ~ 3000, 타기)
- 시간: second (100 ~ 500)
- 속도: meter / second (1 ~ 6)

'''

import sys
import json

class Kickboard:
    def __init__(self):
        self.id_ = -1
        self.battery = 0
        self.kickboard_pos = [0, 0]
        self.max_kickboard_distence = 0
        self.company = "NULL"
        self.isAvailable = False


def calc_price(company, kickboard_time):
    kickboard_time = kickboard_time // 60 + 1 # 이 함수 내에서만 분 단위로 계산
    if company == 'Gbike':
        return 450 + 150 * kickboard_time
    elif company == 'XingXing':
        return min(1000, 500 + 100 * kickboard_time)
    elif company == 'Beam':
        return 600 + 180 * kickboard_time

def latitude_to_meter(latitude): # 위도, x
    return latitude * 109.958489129649955 * 1000

def longitude_to_meter(longitude): # 경도, y
    return longitude * 99.74 * 1000 

def calc_distence(user_pos, kickboard_pos, arrival_pos):
    walk_distence = ((latitude_to_meter(user_pos[0] - kickboard_pos[0]))**2 + \
                     (longitude_to_meter(user_pos[1] - kickboard_pos[1])) ** 2) ** 0.5
    kickboard_distence = ((latitude_to_meter(kickboard_pos[0] - arrival_pos[0])) ** 2 + \
                          (longitude_to_meter(kickboard_pos[1] - arrival_pos[1])) ** 2) ** 0.5

    return walk_distence, kickboard_distence


def get_kickboard_speed(company):
    if company == 'Gbike':
        return 20 * 1000 / 3600
    elif company == 'XingXing':
        return 25 * 1000 / 3600 # TODO:
    elif company == 'Beam':
        return 25 * 1000 / 3600 # TODO:


# 킥보드 하나에 대한 연산을 수행하고 리턴
def main_kickboard_procedure(kickboard, user_pos, arrival_pos, user_taste):
    walk_distence, kickboard_distence = \
            calc_distence(user_pos, kickboard.kickboard_pos, arrival_pos)

    if kickboard_distence > kickboard.max_kickboard_distence:
        return -1 # 배터리 부족해서 못 가는 상황

    walk_time = walk_distence / (4 * 1000 / 3600) # 4 km/s
    kickboard_speed = get_kickboard_speed(kickboard.company)
    kickboard_time = kickboard_distence / kickboard_speed
    price = calc_price(kickboard.company, kickboard_time)

    # 가격, 킥보드시간, 걷기시간 모두 작을수록 좋기에 앞에 마이너스 붙음
    # 5000, 500, 100은 각 값들의 이론상 최댓값이라고 생각하면 됨. 정규화.
    preference = price * user_taste[0] / 5000 + kickboard_time * user_taste[1] / 500 + walk_time * user_taste[2] / 100
    preference *= -1
    
    return preference, price, kickboard_time, walk_time


def main_(argv):
    
    ### step 1. get arguments from backend
    ### step 2. get kickboard list
    '''
    # 백엔드에서 파이썬 파일로 아래 정보 넘겨주기
    user_pos
    arrival_pos
    user_taste
    킥보드 정보들
    '''
    
    user_pos = json.loads(argv[1])
    arrival_pos = json.loads(argv[2])
    kickboards_dicts = json.loads(argv[3])

    kickboard_list = []
    for kickboard_raw in kickboards_dicts:
        kb = Kickboard()
        kb.battery = kickboard_raw['battery']
        kb.kickboard_pos = [kickboard_raw['kickboard_pos_lat'],\
                            kickboard_raw['kickboard_pos_lon']]
        kb.max_kickboard_distence = kickboard_raw['max_kickboard_distance'] * 1000
        kb.company = kickboard_raw['company']
        kb.isAvailable = kickboard_raw['isAvailable']

        kickboard_list.append(kb)

    user_taste = [0.3, 0.2, 0.5] # TEST:

    ### step 3, 4. calculate preference about a kickboard
    ###            and generate result list
    # (kickboard, preference, price, kickboard_time, walk_time)
    '''
    모든 킥보드에 대하여 main_kickboard_procedure()를 실행
    인자로 킥보드 클래스를 포함
    
    그리고 킥보드와 결과 쌍의 리스트를 생성
    '''

    results = []
    for kickboard in kickboard_list:
        ret = main_kickboard_procedure(kickboard, user_pos, arrival_pos, user_taste)
        if ret == -1: # 배터리가 없어서 멀리 못가는 상황
            continue
        (preference, price, kickboard_time, walk_time) = ret
        results.append((preference, kickboard, price, kickboard_time, walk_time))
    
    results.sort(reverse=True) # preference 큰 순으로 정렬
    
    ### step 5. update user_taste and return all
    '''
    반환해야할 값들
    각 킥보드당 preference, price, kickboard_time, walk_time
    '''

    # TODO: 리턴 형식 맞추기 (json)
    print(" company|id|  preference   |     price      | kickboard_time |   walk_time")
    for result in results:
        kickboard_id = result[1].id_
        company = result[1].company
        preference = result[0]
        price = result[2]
        kickboard_time = result[3]
        walk_time = result[4]

        print("%8s|%2d|%+3.12lf|%3.12lf|%+3.12lf|%+3.12lf|%+3.12lf|%+3.12lf"%(company, kickboard_id, preference, price, kickboard_time, walk_time, result[1].kickboard_pos[0], result[1].kickboard_pos[1]))



if __name__ == '__main__':
    print("python program executed")
    argv = ['router/test.py', '[37.43241,127.65321]', '[37.43,127.65]', '[{\"battery\":100,\"isAvailable\":true,\"kickboard_pos_lat\":37.43523,\"kickboard_pos_lon\":127.53225,\"max_kickboard_distance\":20,\"company\":\"Beam\"},{\"battery\":78,\"isAvailable\":true,\"kickboard_pos_lat\":37.87643,\"kickboard_pos_lon\":127.53213,\"max_kickboard_distance\":21,\"company\":\"XingXing\"},{\"battery\":90,\"isAvailable\":true,\"kickboard_pos_lat\":37.43241,\"kickboard_pos_lon\":127.65321,\"max_kickboard_distance\":32,\"company\":\"Gbike\"}]']
    print(sys.argv)
    main_(argv)

