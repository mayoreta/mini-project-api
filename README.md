# mini-project-api
Aplikasi rest API menggunakan ExpressJs

# Database
- MongoDb
- Redis

# Feature
- SignIn
- SignUp
- Refresh Token
- Create User
- Update User
- Delete User
- Read User

### ---------
Data user akan disimpan di database menggunakan MongoDb.
Ketika user login akan mendapatkan 2 token, pertama token access dan refresh token,
token access digunakan untuk mengakses end point yang terdaftar, refresh token akan disimpan kedalam redis
sebagai validasi token sudah digunakan.