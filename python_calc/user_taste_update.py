'''
사용자가 킥보드를 선택하면, 선택에 따라 user_taste 값을 업데이트함

필요한 정보
- 선택한 킥보드에 대한 (price, kickboard_time, walk_time)
- user_taste

price, kickboard_time, walk_time 에 대한 각 최댓값
5000, 500, 100

learning_rate(alpha): 0.01

'''

import sys

def main_(argv):
    price = argv[0]
    kickboard_time = argv[1]
    walk_time = argv[2]
    user_taste = argv[3]

    total = price / 5000 + kickboard_time / 500 + walk_time / 100

    d_price = price / 5000 / total - user_taste[0]
    d_kickboard_time = kickboard_time / 500 / total - user_taste[1]
    d_walk_time = walk_time / 100 / total - user_taste[2]

    user_taste[0] += d_price * 0.01
    user_taste[1] += d_kickboard_time * 0.01
    user_taste[2] += d_walk_time * 0.01

    print(user_taste[0], user_taste[1], user_taste[2])

if __name__ == '__main__':
    print("user_taste_update executed")
    # print(sys.argv)
    # price, kickboard_time, walk_time, user_taste
    argv = [750, 74, 5, [0.3, 0.2, 0.5]]
    main_(argv)
    
