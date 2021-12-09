import jwt from "jsonwebtoken";
import axios from "axios";

// rq({
//   method: "PUT",
//   uri:
//     "https://ttv.microworkers.com/api/v2/slots/60dd39e60c46f21eb46abb4e/submitProof",
//   // https://ttv.microworkers.com/api/v2/slots/60dc968fd13d20554a08e6bd/submitProof
//   headers: {
//     MicroworkersApiKey:
//       "0b699dd430dfdea18466d2ea36967022652f9bcb6114c5977066518e1ecd5314"
//   },
//   form: "{}"
// })
//   .then(function(data) {
//     console.log(data);
//     Models.User.update(
//       {
//         _id: "60dcaaf088dee169d90059dd"
//       },
//       {
//         isPaid: true
//       }
//     );
//   })
//   .catch(function(err) {
//     console.log(err);
//   });

const API = axios.create({
  baseURL: "https://ttv.microworkers.com/api/v2",
  timeout: 60 * 1000 * 30,
  headers: {
    MicroworkersApiKey:
      "0b699dd430dfdea18466d2ea36967022652f9bcb6114c5977066518e1ecd5314"
  }
});

async function getSlotsByCampaignId(campaignId) {
  const result = await API.get(
    `/basic-campaigns/${campaignId}/slots?pageSize=1000`
  );
  return result.data.items;
}

export default {
  getSlotsByCampaignId
};
