import jwt from "jsonwebtoken";
import axios from "axios";
class Prediction {
  constructor() {
    this.API = axios.create({
      baseURL: "https://rais.dista.uninsubria.it/algorithm",
      timeout: 60 * 1000 * 30
    });
  }

  async getPredictEM(payload) {
    return await this.API.post("/EM/predict", payload)
      .then(({ data }) => {
        if (data.status === "success") return data.yPredict;
        console.log(payload);
        return;
      })
      .catch(console.error);
  }

  async getPredictSVM(payload) {
    return await this.API.post("/SVM/LinearSVC/predict", payload)
      .then(({ data }) => {
        if (data.status === "success") return data.yPredict;
        console.log(payload);
        return;
      })
      .catch(console.error);
  }

  async getPredictGradientBoostingClassifier(payload) {
    return await this.API.post("/ML/GradientBoostingClassifier", payload)
      .then(({ data }) => {
        if (data.status === "success") return data.yPredict;
        console.log(payload);
        return;
      })
      .catch(console.error);
  }

  async getPredictAdaBoostClassifier(payload) {
    return await this.API.post("/ML/AdaBoostClassifier", payload)
      .then(({ data }) => {
        if (data.status === "success") return data.yPredict;
        console.log(payload);
        return;
      })
      .catch(console.error);
  }
  async getPredictGradientBoostingRegressor(payload) {
    return await this.API.post("/ML/GradientBoostingRegressor", payload)
      .then(({ data }) => {
        if (data.status === "success") return data.yPredict;
        console.log(payload);
        return;
      })
      .catch(console.error);
  }
}

export default Prediction;
