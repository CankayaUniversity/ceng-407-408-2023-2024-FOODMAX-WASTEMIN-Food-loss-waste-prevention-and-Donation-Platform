# ceng-407-408-2023-2024-FOODMAX-WASTEMIN-Food-loss-waste-prevention-and-Donation-Platform
FOODMAX - WASTEMIN: Food loss/waste prevention and Donation Platform

PROJECT WEBSITE: https://foodmaxwastemin.wordpress.com/

## Running the Flask Server
Follow these steps to get your Flask server up and running on your local machine.

### Prerequisites
* Python 3.x
* pip (Python package installer)

### Setup
1. Change directory to flask server

```
cd flask-server
```

2. Create and Activate Virtual Environment (macOS/Linux)
```
python3 -m venv venv
```

```
source venv/bin/activate
```

3. Install Dependencies
4. Run the Server

```
python3 server.py
```

## Changing emulator port (Android)
Do this if necessary
1. List your emulator devices
```
adb devices
```
2. Change emulators port to 5000
```
adb -s emulator-5554 reverse tcp:5000 tcp:5000
```


