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

def main_(price, kickboard_time, walk_time, user_taste):
    total = price / 5000 + kickboard_time / 500 + walk_time / 100

    d_price = price / total - user_taste[0]
    d_kickboard_time = kickboard_time / total - user_taste[1]
    d_walk_time = walk_time / total - user_taste[2]

    user_taste[0] += d_price * 0.01
    user_taste[1] += d_kickboard_time * 0.01
    user_taste[2] += d_walk_time * 0.01


if __name__ == '__main__':
    print("user_taste_update executed")
    print(sys.argv)
    
    

