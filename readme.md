# URL Shortener - Version 1
This URL shortener creates a unique shortened URL based on an ID that will be provided by auto incremented IDs form the database in the next version.
<br>
<br>
# Installation
Use `npm install` in the main directory to install the project and it's dependancies.
<br>
<br>
# API Access

## Creating a short URL.
#### [`POST http://localhost:3000/api/v1/urls`]

### Summary
By passing a URL to this address you will create a shortened URL.

### Parameters
  Name  |  Located In  |  Description
--------|--------------|-------------
   url  |     body     |  Pass in a url to be shortened.

### Sample Response
```
{
  "status": {
    "code": 201
  },
  "data": {
    "urlId": 5,
    "origURL": "http://www.google.com/testing",
    "shortURL": "/1lswlzapf"
  }
}
```
<br>
<br>
## Accessing All URLs.
#### [`GET http://localhost:3000/api/v1/urls`]

### Summary
Accessing this endpoint will return all of the shortened urls.

### Sample Response
```
{
  "status": {
    "code": 200
  },
  "data": [
    {
      "urlId": 123512,
      "origURL": "https://www.amazon.com/dp/B00X4WHP5E/ref=ods_gw_ha_d_blackandwhite?pf_rd_r=QREX1YK8J8EMC8C05PYZ&pf_rd_p=da93a4f0-0b0d-45e0-bc19-b68113bc6936",
      "shortURL": "/qtA"
    },
    {
      "urlId": 98325,
      "origURL": "https://play.google.com/music/m/T4ztvelxav2rehzomrwhpdpkxcu?t=Tones_Of_Home_-_Blind_Melon",
      "shortURL": "/wet"
    }
  ]
}
```
<br>
<br>
## Accessing URL by ID.
##### [`GET http://localhost:3000/api/v1/urls/:id`]

### Summary
By replacing `:id` in the GET url you can retrieve a url by it's ID.

### Sample Response
```
{
  "status": {
    "code": 200
  },
  "data": {
    "urlId": 1,
    "origURL": "https://www.amazon.com/dp/B00X4WHP5E/ref=ods_gw_ha_d_blackandwhite?pf_rd_r=QREX1YK8J8EMC8C05PYZ&pf_rd_p=da93a4f0-0b0d-45e0-bc19-b68113bc6936",
    "shortURL": "/1"
  }
}
```