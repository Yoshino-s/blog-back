import datetime
import requests
def test():
    d = datetime.datetime.now()
    print(d.strftime('client time: %Y-%m-%d %H:%M:%S'))
    print('server time: ' + requests.get('http://172.20.224.1:88/').text)
    print(d.strftime('client time: %Y-%m-%d %H:%M:%S'))

if __name__ == '__main__':
    test()