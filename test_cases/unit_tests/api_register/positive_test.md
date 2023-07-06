Register user via API test case

# It should do register user:

## Before

1. Set base URL to 'https://api.realworld.io/api'

### Register new user

2. Send a request with **POST** method 
3. The payload to API endpoint should be 
```
{
  "user": {
    "username": "string",
    "email": "string",
    "password": "string"
  }
}
```
4. Received status should be **200**

## Check new user is registered

5. Received answer should include `body`:
```
{
  "user": {
    "email": "string",
    "token": "string",
    "username": "string",
    "bio": "string",
    "image": "string"
  }
}
```
## After

6. Set base URL back to 'https://demo.realworld.io/'