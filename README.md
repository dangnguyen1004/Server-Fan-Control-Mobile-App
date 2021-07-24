# IOT Fan Control App: https://github.com/dangnguyen1004/Fan-Control-Mobile-App
## Introduce
This application is used to control electrical equipment such as fans and air conditioners in buildings of Bach Khoa University
Besides, a server will receive the data from the sensor about the temperature and humidity and save the data to the server. This data is displayed in the user's app and if the temperature is too high or the humidity is too much, the server will automatically turn on the fan and air conditioner in the room at a reasonable time
This application is used for my University's multidisciplinary project internship subject

## 4 main components of the system:
### This mobile app
This app is deployed with Expo - An environment for building react native app. 
2 main threads of the app:

**For users:** the account created in the sign in page is the user account with the main functions:
* Request a room for controling deivces in that room
* View activities logs
* Account operations

**For admin:** only one account "admin@gmail.com" when logging into the app will be directed to the admin interface. Admin account can:
* Create/delete/modify rooms
* Change mode of a room: Auto mode (turn on/off devices based on temperature and humidity) or Manual mode
* Create/delete/modify devices in a room
* Manage feeds of the sensors and feeds of the deivces
* Grant and revoke users control rights
* View activites logs

### Firebase 
Use firebase to store user data as well as room data and devices, sensors

### Server
The server has 2 main modules which are:
**Notification module**: when the user sends a request for room access permission to the admin, the system will send a notification to the admin's account, and when the admin grants/deny/revokes room accessible, the system also sends notify to the respective user accounts.
**IOT communication**: This module connects to adafruit server to send/receive device control signals/data from sensors.

### MQTT server: We used Adafruit server to simulate real devices

## Review
* Use "Expo go" application in IOS/Android and scan the QR below for testing app
[FanControlApplicatioon In Expo](https://expo.io/@nguyen_dang/FanControl)
<img src="https://user-images.githubusercontent.com/67234142/124096208-92e5bd00-da84-11eb-94c5-e38a3be70933.png" alt="..." width="250" />
* App for admin
<img src="https://user-images.githubusercontent.com/67234142/124093595-3386ad80-da82-11eb-8978-ebe1ef7326f4.jpg" alt="..." width="250" />
<img src="https://user-images.githubusercontent.com/67234142/124093621-397c8e80-da82-11eb-9229-6623836ef7f6.jpg" alt="..." width="250" />
<img src="https://user-images.githubusercontent.com/67234142/124093628-3bdee880-da82-11eb-9ce3-6f33e3100c13.jpg" alt="..." width="250" />
* App for user
<img src="https://user-images.githubusercontent.com/67234142/124093640-3ed9d900-da82-11eb-9170-456c9ded84ac.jpg" alt="..." width="250" />

