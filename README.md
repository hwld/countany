# Countany

勉強がてらに作った複数作成可能なWebカウンター。  
Googleのアカウントで認証を行い、カウンターをDBに保存することができる。

## 主に使用したもの

next.js + next-auth + mongoose + vercel + mongoDB atlas  

作りはじめの頃はmongoDBではなくprisma + postgreSQLでやろうと思ったがherokuのpostgreSQLは無料枠でコネクション制限が20とキツかったので断念した・・・。
