import jwt from "jsonwebtoken";
import axios from "axios";
class Prediction {
  constructor() {
    this.API = axios.create({
      baseURL: "http://localhost:5000",
      timeout: 20000
    });
  }

  async getPredictEM(payload) {
    return await this.API.post("/EM/predict", payload).then(({data}) => {
      if(data.status === "success") return data.yPredict[0][0]
      console.log(payload)
      return 
    }).catch(console.error);
  }
}

export default Prediction;
