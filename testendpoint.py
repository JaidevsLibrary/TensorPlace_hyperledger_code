import requests
import time
url = 'http://localhost:3000'

#create seller
r = requests.post(url + '/create', json={'action': 'createSeller', 'id': 'SELLER1', 'name': 'Tri', 'email': 'tri@gmail.com', 'reputation': 5, 'balance': 100})
print('Create seller',r.status_code)

time.sleep(3)
# create buyer
r = requests.post(url + '/create', json={'action': 'createBuyer', 'id': 'BUYER1', 'name': 'Jaidev', 'email': 'jaidev@gmail.com', 'balance': 500})
print('Create buyer', r.status_code)

time.sleep(3)
#create product
r = requests.post(url + '/create', json={'action': 'createProduct', 'id': 'PRODUCT1', 'sellerId': 'SELLER1', 'name': 'Machine learning 1', 'description': 'This code is amazing. buy it', 'url': 'https://github.com', 'price': 15, 'ratings': 0})
print('Create product', r.status_code)
time.sleep(3)

#query seller
r = requests.get(url + '/query?id=SELLER1&action=querySeller')
print(r.json())
time.sleep(3)

#query buyer
r = requests.get(url + '/query?id=BUYER1&action=queryBuyer')
print(r.json())
time.sleep(3)

#query product
r = requests.get(url + '/query?id=PRODUCT1&action=queryProduct')
print(r.json())

# crete transaction
r = requests.post(url + '/create', json={'action': 'createTransaction', 'id': 'TRANSACTION1', 'productId': 'PRODUCT1', 'buyerId': 'BUYER1'})
print('Create Transaction', r.status_code)

#submit review
r = requests.post(url + '/create', json={'action': 'createReview', 'id': 'REVIEW1', 'buyerId': 'BUYER1', 'productId': 'PRODUCT1', 'review': 'this code is indeed great', 'extraQuestion': 'I use it to make some money', 'ratingDoc': 5, 'ratingReadability': 4, 'ratingDevResponse': 3})
print('Submit review', r.status_code)

#query product again to see review
r = requests.get(url + '/query?id=PRODUCT1&action=queryProduct')
print(r.json())

#query buyer to check new balance after buy the product
r = requests.get(url + '/query?id=BUYER1&action=queryBuyer')
print(r.json())

#create new token and add to buyer balance
r = requests.post(url + '/create', json={'action': 'createToken', 'id': 'BUYER1', 'amount': 30})
print('add new token', r.status_code)

#query buyer to check new balance after add new token
r = requests.get(url + '/query?id=BUYER1&action=queryBuyer')
print(r.json())