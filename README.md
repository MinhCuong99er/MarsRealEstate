## Deploy your own

cấu hình trong file .env

# Link web, !!important, thay đổi trước khi build

# lấy đường dẫn cdn css,images....

BASE_URL=''

# Link api

API_URL=''

# Link favicon

APP_FAVICON=$BASE_URL/favicon.ico

# Default og image

ảnh mặc định
APP_IMAGE='https://mbbankplus.mpoint.vn/images/logo-mpoint.png'

# Facebook

hiện tại chưa dùng
FACEBOOK_APP_ID=""
FACEBOOK_PAGE_ID=""

## How to use

````build
yarn build
```run
yarn start
````

## Note

Thay đổi port ở trong package.json
"start": "next start -p 3006"
