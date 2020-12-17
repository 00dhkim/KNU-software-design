'''
사용자가 킥보드를 선택하면, 선택에 따라 user_taste 값을 업데이트함

필요한 정보
- 선택한 킥보드에 대한 (price, kickboard_time, walk_time)
- user_taste

price, kickboard_time, walk_time 에 대한 각 최댓값
5000, 500, 100

learning_rate(alpha): 0.01

'''

import json
import sys

def main_(argv):
    price = int(argv[1])
    kickboard_time = int(argv[2])
    walk_time = int(argv[3])
    user_taste = json.loads(argv[4])

    total = price / 5000 + kickboard_time / 500 + walk_time / 100

    d_price = price / 5000 / total - user_taste[0]
    d_kickboard_time = kickboard_time / 500 / total - user_taste[1]
    d_walk_time = walk_time / 100 / total - user_taste[2]

    user_taste[0] += d_price * 0.01
    user_taste[1] += d_kickboard_time * 0.01
    user_taste[2] += d_walk_time * 0.01

    print('[',end='')
    print(user_taste[0],',', user_taste[1],',', user_taste[2],end='')
    print(']')

if __name__ == '__main__':
    # price, kickboard_time, walk_time, user_taste
    # argv = ['python_calc/user_taste_update.py', '600', '59', '179', '[0.2857142857142857,0.42857142857142855,0.2857142857142857]']
    # main_(sys.argv)
    main_(sys.argv)
    
