#  (Group 45) 城市辭典 
##### 成員：B07902012 江宗翰(組長)、B07705004 許芸嘉、B07902019 江浩瑋


### 此服務內容
參考 Urban Dictionary，製作一個中文版的城市辭典。未登入的使用者可以檢視 / 搜尋由其他網友創建的字卡。登入後，可以按讚 / 倒讚，也可以創建並管理自己的字卡。

### Demo 影片連結

https://drive.google.com/file/d/1vMKYtWIXapy5wm05vC111ZVwoXRyOJRQ/view

### Deployed 連結

https://citydictionary.ddns.net/

### 前端操作方式


**未登入**

- 左上角 Logo：點選可以 random 首頁的字卡。
- 右上角 Google 登入按鈕：點選可選擇 Google 帳戶登入。
- 字卡連結：每個字卡都可以點詞語看該詞語的所有定義；也可以點作者，看該作者定義的所有字卡。
- 上方搜尋欄：可以 key in 想搜尋的詞語，也可以透過鍵盤操作 (上、下、Enter)。
    - 若在搜尋欄搜尋目前沒有被定義的詞語，頁面會呈現找不到。可以點「回首頁」，或點選「來去定義 "字詞"」，會跳到請登入的頁面。使用 Google 帳號登入後，1. 若已經取過筆名，新增字卡頁面的詞語欄位，會自動帶入剛才搜尋的字詞。 2. 若還沒有取過筆名，點選「新增筆名」，就能為自己取一個筆名。
- 下拉後右下角三角形：回到上方按鈕，點選後會回到畫面頂端。


**已登入**

包含上述所有未登入的功能，另可按讚 / 倒讚、定義詞語、管理自己的字卡及筆名。
- 登入後會於本地記得登入過，因此重新整理畫面仍然會保留登入狀態。
- 右上角登出按鈕：點選後即可登出。
- 按讚 / 倒讚：每張字卡都可以去按讚或倒讚，系統會根據 (讚數 - 倒讚數) 進行排序呈現字卡。
    1. 如果原本按讚 / 倒讚，然後點選倒讚 / 讚，原本的讚 / 倒讚會自動取消。
    2. 如果原本按讚 / 倒讚，再按讚 / 倒讚一次，即可收回。
- 定義詞語：點右上角「我要定義詞語」，就能進入該頁面。
    1. 若尚未定義過筆名，點選「新增筆名」，會跳到帳號管理頁。
    2. 若已定義過筆名，則填入表單中三格的資料就能送出。若有任一格為空，會跳出警示。若成功定義，會跳入成功頁面，可以點「回首頁」，或點選「再來一個」，就能再定義詞語。
    3. 將想連結的詞語以「[[[]]]」框住，發布後即可連結被框住的詞語。
- 帳號管理：點選右上角自己的姓名頭貼，就能進入該頁面。
    1. 若尚未定義過筆名，點選新增筆名就能定義。
    2. 若已經定義過筆名，除了可以更改筆名，還可以查看所有自己定義過的字卡。可以點「修改內容」，也能點隱藏或發佈，更改字卡狀態，若隱藏則其他人無法看到或搜尋到該字卡。

**Exception**
- 根據權限重新導向：
    - 在未登入情況下嘗試連結 https://citydictionary.ddns.net/#/user (或本地端 http://localhost:3000/#/user) ，會被重新導向至 https://citydictionary.ddns.net/#/user/notLogin  (http://localhost:3000/#/user/notLogin)。
    - 在未登入情況下嘗試連結 https://citydictionary.ddns.net/#/add (或本地端 http://localhost:3000/#/add) ，會被重新導向至 https://citydictionary.ddns.net/#/add/notLogin  (http://localhost:3000/#/add/notLogin)。
    - 在未登入情況下嘗試修改字卡連結 (如 http://localhost:3000/#/user/60d8cd95acf5f5107cd81a57) 會被導回首頁。
    - 在登入情況下嘗試非該帳號所屬的字卡的修改連結 (如 http://localhost:3000/#/user/60d8cd95acf5f5107cd81a57) 會被導回首頁。

### 後端操作方式
以下條列所有API 功能，詳細操作說明[在這](https://docs.google.com/document/d/1lYtDs9Kacavc3QcyNg4xKjY5rYqx5FDX_bUt-043AdE/edit?usp=sharing)。

**Query**
1. 搜尋詞語：根據詞語搜尋，回傳所有已發佈的字卡內容。
2. 搜尋作者：根據作者筆名搜尋，回傳所有已發佈字卡內容。
3. 單一字卡：根據字卡 ID 搜尋，回傳該字卡內容。
4. 我的字卡：根據使用者 email 搜尋，回傳所有字卡內容 (包含隱藏)。
5. 隨機五篇：隨機回傳五篇已發佈的字卡內容。
6. 搜尋選項：回傳所有可搜尋的詞語選項。
   
**Mutation**
1. 登入：拿到使用者的 Google 帳號名稱及 email，若初次登入則寫入 DB，回傳名稱、email、筆名等資訊。
2. 更改筆名：搜尋筆名是否與其他使用者重複，重複則回傳失敗訊息；沒重複則更改 DB 並回傳成功訊息。
3. 新增字卡：檢查資料非空，寫入資料庫，回傳該字卡資訊。
4. 修改字卡：檢查資料非空，修改資料庫，回傳成功。
5. 隱藏貼文：拿到字卡 ID ，修改發佈屬性，回傳成功訊息。
6. 發佈貼文：拿到字卡 ID ，修改發佈屬性，回傳成功訊息。
7. 按讚：拿到字卡 ID 及按讚者 email，更改 DB 資料，回傳成功訊息，以及更新後的讚跟倒讚的資料。
8. 按倒讚：拿到字卡 ID 及按讚者 email，更改 DB 資料，回傳成功訊息，以及更新後的讚跟倒讚的資料。
9. 刪除字卡資料(後端管理功能)：根據詞語刪除字卡資料，回傳成功訊息。

**Subscription**
1. 訂閱字卡：根據字卡 ID 訂閱該字卡，確保有人按讚 / 倒讚時，可以即時更新讚數。
2. 訂閱詞語選項：每當有人新增字卡、或隱藏 / 發佈字卡，就要更新選項資料，以確保搜尋欄下方提供的選項正確。

### **local 安裝、執行步驟：**

1. `cd frontend` 至前端資料夾，`yarn` 安裝套件。
2. `cd backend` 至後端資料夾，`yarn` 安裝套件。
3. 在`backend`資料夾新增`.env` 檔案，可參考`.env.defaults` 檔，傳入`MONGO_URL` 參數。
4. 回到外層資料夾（根目錄），確定port 8000無其他應用程式使用，`yarn server` 跑後端程式碼，印出 "Mongo database connected!" 訊息，則表示成功，可開啟 http://localhost:8000/ 使用。
5. 開另一個 command line，確定port 3000無其他應用程式使用，在根目錄下`yarn start` 跑前端程式，會在 http://localhost:3000/ 開啟程式。


### local 測試說明：
同上述[前端操作方式](#前端操作方式)以及[後端操作方式](#後端操作方式)。

### 使用之模組、第三方套件、框架、程式碼
- **前端：** React, react-router-dom, react-google-login, Graphql, Apollo, HTML+CSS, material-ui, antd
- **後端：** Express, Babel, Graphql-yoga, NodeJs, Mongoose
- **資料庫：** MongoDB
- **部屬：** DigitalOcean, noip, pm2, nginx, certbot


### 專題製作心得

B07705004 資管三 許芸嘉
作業寫過一次 graphql 之後，這次使用 graphql 開發後端 API 還蠻順利的，寫起來也快很多。開發的同時，我也把後端 API 寫成文件，前端在使用的時候就方便許多。一開始在設計 css 排版時，花了蠻多時間，才知道一個網頁要長得好看、使用起來順手，其實要考量很多東西，我們也反覆修改了很多次。還蠻喜歡這次的專案經驗，跟組員一起開發、討論的過程中，釐清了一些之前沒弄清楚的觀念。一起開發前端的過程中，大家也會不停抓 bug 修 bug，或加上自己喜歡的功能、改善使用者體驗，常常 git pull 之後就會有開箱的感覺。

B07902012 資工三 江宗翰
第一次參與這種大型的專案，還是用這學期剛學到的東西。看到把一開始想的東西做出來有種感動的感覺。一開始就決定串google api而不自己管理帳號密碼的原因是一來覺得很麻煩，二來覺得這樣要讓人註冊會被嫌麻煩。一開始嘗試的時候看官方文件試了一陣子，結果後來發現npm上有人寫好給react用的，省了很多麻煩。後面遇到的問題最大應該是在部屬上面，試了很多平台服務功能最後才終於成功。透過這次專案把這學期學到的東西弄得更加清楚，像是什麼時候可以呼叫hook，而很多平常作業沒試過但聽過的功能如rounter、context都在這次實作中派上用場。最後感謝組員許芸嘉在我還在期末地獄時就把後端api寫好，才讓我們可以專心在前端上面。

B07902019 資工三 江浩瑋
一開始想project題目時遇到了一些困難，但後來不知道為什麼就想到了要做一個中文版的 Urban Dictionary 。我負責的部分主要是前端，剛開始就在以 Graphql 連結時遇到困難，後來把 hook 搞清楚一點才完成。再來是因為我們前端做的是 SPA 的結構，雖然使用了 React Router 但在某些時候不太確定為什麼 Redirect 等等沒有辦法 work ，後來用查了一些資料用 history 的方式才成功。最後則是在做詞語之間的連結時遇到了 innerHtml 在使用 React 和 JSX 的問題，後來用比較土法煉鋼的方式才成功。我曾經試著要用 Heroku deploy ， 但後來一敗塗地，幸好組員很罩，解決了deploy。這次的project非常謝謝兩位組員，我處理不來的部分組員都完成的很棒。


### 各組員之負責項目

許芸嘉：後端API、新增頁面、按讚功能、css設計、保留登入狀態功能

江宗翰：google登入功能、使用者頁面、修改頁面及功能、隱藏發布功能、部屬

江浩瑋：主頁面、LOGO設計、作者/字詞檢索功能、再來一個字詞帶入功能、詞卡顯示畫面、返回頂端功能、連結到其他詞卡



### 參考資料、第三方程式碼：
[Google 登入功能](https://zoejoyuliao.medium.com/add-google-sign-in-and-sign-out-to-your-react-app-and-get-the-accesstoken-2ee16bfd8297)

[DigitalOcean 部署](https://dev.to/zeeshanhshaheen/how-to-deploy-react-js-and-nodejs-app-on-a-single-digitalocean-droplet-using-nginx-1pcl)

[Scroll Up Button](https://www.geeksforgeeks.org/how-to-create-a-scroll-to-top-button-in-react-js/)
