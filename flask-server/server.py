from flask import Flask

app = Flask(__name__)

@app.route("/recommendations")
def recommendations():
    return {"recommendations" : ["recommendation1", "recommendation2", "recommendation3"]}

if __name__ == "__main__":
    app.run(debug=True)
