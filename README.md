# ceng-407-408-2023-2024-FOODMAX-WASTEMIN-Food-loss-waste-prevention-and-Donation-Platform

FOODMAX - WASTEMIN: Food loss/waste prevention and Donation Platform

## Project Website

https://foodmaxwastemin.wordpress.com/

## Running the app

### Prerequisites

- Git
- node.js and npm
- Android Studio and Android SDK

### Setup

1. Clone this repository to your local computer

```
git clone https://github.com/CankayaUniversity/ceng-407-408-2023-2024-FOODMAX-WASTEMIN-Food-loss-waste-prevention-and-Donation-Platform.git
```

2. Navigate into the project directory.

```
cd ceng-407-408-2023-2024-FOODMAX-WASTEMIN-Food-loss-waste-prevention-and-Donation-Platform
```

3. Install all the necessary dependencies using npm.

```
npm install
```

4. To run the app run this command and then when it is started press 'a' for run the android emulator

```
npm start
```

5. Copy the .env.default file in your local environment and rename it to .env. Then, replace the API keys within this file with your own keys.

## Running the Flask Server

Follow these steps to get your Flask server up and running on your local machine.

### Prerequisites

- Python 3.x
- pip (Python package installer)

### Setup

1. Change directory to flask server and install the dependencies

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

```
pip3 install -r requirements.txt
```

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
